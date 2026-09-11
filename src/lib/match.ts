import { clamp } from "./utils";

export type MatchBreakdown = {
  overall: number;
  keyword: number;
  experience: number;
  skills: number;
  format: number;
  why: string[];
  gaps: string[];
};

export function skillOverlap(profile: string[], required: string[]) {
  const p = new Set(profile.map((s) => s.toLowerCase()));
  const hits = required.filter((s) => p.has(s.toLowerCase()));
  const miss = required.filter((s) => !p.has(s.toLowerCase()));
  const ratio = required.length ? hits.length / required.length : 0.5;
  return { hits, miss, ratio };
}

export function jobFitScore(
  profileSkills: string[],
  jobSkills: string[],
  experienceYears: number,
  seniority: string,
): MatchBreakdown {
  const { hits, miss, ratio } = skillOverlap(profileSkills, jobSkills);
  const skills = Math.round(ratio * 100);
  const keyword = clamp(Math.round(ratio * 92 + hits.length * 2), 42, 99);
  const expected =
    seniority === "Lead" || seniority === "Senior"
      ? 6
      : seniority === "Mid"
        ? 3
        : 1;
  const experience = clamp(
    Math.round(100 - Math.abs(experienceYears - expected) * 8),
    48,
    98,
  );
  const format = 94;
  const overall = clamp(
    Math.round(keyword * 0.35 + experience * 0.25 + skills * 0.3 + format * 0.1),
    38,
    99,
  );
  const why = [
    hits.length
      ? `${hits.slice(0, 3).join(", ")} aligned with the JD`
      : "Broad functional overlap with the role",
    `${experienceYears}y experience vs ${expected}y typical for ${seniority}`,
  ];
  return { overall, keyword, experience, skills, format, why, gaps: miss.slice(0, 4) };
}

export function atsFromResume(text: string, targetRole: string): MatchBreakdown {
  const words = text.toLowerCase();
  const keywords = [
    "product",
    "roadmap",
    "stakeholder",
    "metrics",
    "sql",
    "experiment",
    "growth",
    "leadership",
    "design",
    "python",
    "react",
    "system",
  ];
  const hits = keywords.filter((k) => words.includes(k));
  const keyword = clamp(55 + hits.length * 4, 50, 96);
  const experience = words.includes("experience") || words.includes("led") ? 90 : 72;
  const skills = clamp(60 + (words.match(/,/g)?.length ?? 4), 58, 94);
  const format = text.length > 400 ? 95 : 78;
  const overall = Math.round(
    keyword * 0.35 + experience * 0.25 + skills * 0.2 + format * 0.2,
  );
  const suggestions = [
    `Add quantified impact bullets tailored to ${targetRole}`,
    "Front-load keywords from the target JD in the first 8 lines",
    "Keep a single-column ATS-safe layout — no tables or icons",
  ];
  return {
    overall,
    keyword,
    experience,
    skills,
    format,
    why: [`${hits.length} core keywords detected`, "Structure is parseable"],
    gaps: suggestions,
  };
}
