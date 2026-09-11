import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureSeed } from "./bootstrap";
import { jobFitScore, atsFromResume } from "@/lib/match";
import { DEFAULT_RESUME, NETWORK, SALARY_BANDS } from "@/lib/seed";
import { parseJsonArray } from "@/lib/utils";

type Portal = "seeker" | "hire" | "campus" | "community";

export type Profile = {
  user_id: string;
  display_name: string;
  headline: string;
  bio: string;
  location: string;
  portal: Portal;
  target_role: string;
  experience_years: number;
  skills: string[];
  education: string;
  current_company: string;
  phone: string;
  institution_name: string;
  company_name: string;
};

type ProfileRow = Omit<Profile, "skills" | "portal"> & { skills: string; portal: string };

function mapProfile(row: ProfileRow): Profile {
  return {
    ...row,
    portal: (row.portal as Portal) || "seeker",
    skills: parseJsonArray(row.skills),
    experience_years: Number(row.experience_years),
  };
}

async function authName(sql: Awaited<ReturnType<typeof getSql>>, userId: string, fallback: string) {
  const rows = await sql<{ name: string }>`select name from "user" where id = ${userId}`;
  const n = rows[0]?.name?.trim();
  return n || fallback || "Member";
}

async function getOrCreateProfile(userId: string, displayName: string): Promise<Profile> {
  const sql = await ensureSeed();
  const name = await authName(sql, userId, displayName);
  const existing = await sql<ProfileRow>`select * from profiles where user_id = ${userId}`;
  if (existing[0]) {
    const mapped = mapProfile(existing[0]);
    if (mapped.display_name === "Member" && name !== "Member") {
      await sql`update profiles set display_name = ${name}, updated_at = now() where user_id = ${userId}`;
      mapped.display_name = name;
    }
    return mapped;
  }

  const skills = DEFAULT_RESUME.skills;
  await sql`insert into profiles (
    user_id, display_name, headline, bio, location, portal, target_role, experience_years, skills, education, current_company
  ) values (
    ${userId}, ${name || "Member"}, ${DEFAULT_RESUME.headline}, ${DEFAULT_RESUME.summary},
    ${"Bengaluru"}, ${"seeker"}, ${"Senior Product Manager"}, ${4}, ${JSON.stringify(skills)},
    ${DEFAULT_RESUME.education}, ${"PhonePe"}
  )`;

  const resumeContent = JSON.stringify({ ...DEFAULT_RESUME, name: displayName });
  const ats = atsFromResume(resumeContent, "Senior Product Manager");
  await sql`insert into resumes (user_id, title, content, ats_score, keyword_score, experience_score, skills_score, format_score, suggestions)
    values (${userId}, ${"Master resume"}, ${resumeContent}, ${ats.overall}, ${ats.keyword}, ${ats.experience}, ${ats.skills}, ${ats.format}, ${JSON.stringify(ats.gaps)})`;

  for (const n of NETWORK) {
    await sql`insert into connections (user_id, person_id, person_name, person_role, person_company, status)
      values (${userId}, ${n.person_id}, ${n.person_name}, ${n.person_role}, ${n.person_company}, ${"connected"})`;
  }

  await sql`insert into messages (user_id, from_name, from_role, subject, body)
    values (${userId}, ${"Kavya Pillai"}, ${"Recruiter · Swiggy"}, ${"Senior PM — Instamart"}, ${"Your profile scored 94 on our Instamart PM req. Are you free Thursday 4pm IST for a 20-min screen?"})`;
  await sql`insert into messages (user_id, from_name, from_role, subject, body)
    values (${userId}, ${"Nexora Intelligence"}, ${"Weekly digest"}, ${"Your market moved"}, ${"SPM Bengaluru median ticked to ₹42 LPA. Two new 90%+ matches landed this week — Swiggy and Flipkart."})`;

  const created = await sql<ProfileRow>`select * from profiles where user_id = ${userId}`;
  return mapProfile(created[0]);
}

export const loadProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const name = "Member";
    return getOrCreateProfile(context.userId, name);
  });

export const saveProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: Partial<Profile> & { display_name?: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const current = await getOrCreateProfile(context.userId, data.display_name ?? "Member");
    const next: Profile = {
      ...current,
      ...data,
      skills: data.skills ?? current.skills,
      user_id: context.userId,
    };
    await sql`update profiles set
      display_name = ${next.display_name},
      headline = ${next.headline},
      bio = ${next.bio},
      location = ${next.location},
      portal = ${next.portal},
      target_role = ${next.target_role},
      experience_years = ${next.experience_years},
      skills = ${JSON.stringify(next.skills)},
      education = ${next.education},
      current_company = ${next.current_company},
      phone = ${next.phone},
      institution_name = ${next.institution_name},
      company_name = ${next.company_name},
      updated_at = now()
      where user_id = ${context.userId}`;
    return next;
  });

export type JobView = {
  id: string;
  company_id: string;
  company: string;
  logo_letter: string;
  industry: string;
  title: string;
  location: string;
  remote_type: string;
  employment_type: string;
  seniority: string;
  salary_min: number;
  salary_max: number;
  skills: string[];
  description: string;
  requirements: string;
  posted_at: string;
  is_internship: boolean;
  stipend: number | null;
  duration_months: number | null;
  status: string;
  fit?: number;
};

type JobRow = {
  id: string;
  company_id: string;
  company: string;
  logo_letter: string;
  industry: string;
  title: string;
  location: string;
  remote_type: string;
  employment_type: string;
  seniority: string;
  salary_min: number;
  salary_max: number;
  skills: string;
  description: string;
  requirements: string;
  posted_at: string;
  is_internship: boolean | number;
  stipend: number | null;
  duration_months: number | null;
  status: string;
};

function mapJob(row: JobRow, profile?: Profile): JobView {
  const skills = parseJsonArray(row.skills);
  const fit = profile
    ? jobFitScore(profile.skills, skills, profile.experience_years, row.seniority).overall
    : undefined;
  return {
    ...row,
    salary_min: Number(row.salary_min),
    salary_max: Number(row.salary_max),
    stipend: row.stipend == null ? null : Number(row.stipend),
    duration_months: row.duration_months == null ? null : Number(row.duration_months),
    is_internship: Boolean(row.is_internship),
    skills,
    fit,
  };
}

const JOB_SELECT = `j.id, j.company_id, c.name as company, c.logo_letter, c.industry, j.title, j.location,
  j.remote_type, j.employment_type, j.seniority, j.salary_min, j.salary_max, j.skills, j.description,
  j.requirements, j.posted_at, j.is_internship, j.stipend, j.duration_months, j.status`;

export const listJobs = createServerFn({ method: "GET" })
  .validator((d: { internships?: boolean; q?: string } | undefined) => d ?? {})
  .handler(async ({ data }) => {
    const sql = await ensureSeed();
    const intern = Boolean(data.internships);
    const all = await sql.query<JobRow>(
      `select ${JOB_SELECT} from jobs j join companies c on c.id = j.company_id
       where j.status = 'open' and j.is_internship = $1
       order by j.posted_at desc`,
      [intern],
    );
    const q = (data.q ?? "").trim().toLowerCase();
    const filtered = q
      ? all.filter(
          (j) =>
            j.title.toLowerCase().includes(q) ||
            j.company.toLowerCase().includes(q) ||
            j.location.toLowerCase().includes(q) ||
            j.skills.toLowerCase().includes(q),
        )
      : all;
    return filtered.map((r) => mapJob(r));
  });

export const listMatchedJobs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { internships?: boolean; q?: string } | undefined) => d ?? {})
  .handler(async ({ context, data }) => {
    const sql = await ensureSeed();
    const profile = await getOrCreateProfile(context.userId, "Member");
    const intern = Boolean(data.internships);
    const all = await sql.query<JobRow>(
      `select ${JOB_SELECT} from jobs j join companies c on c.id = j.company_id
       where j.status = 'open' and j.is_internship = $1`,
      [intern],
    );
    const q = (data.q ?? "").trim().toLowerCase();
    const mapped = all
      .map((r) => mapJob(r, profile))
      .filter((j) => {
        if (!q) return true;
        return (
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => (b.fit ?? 0) - (a.fit ?? 0));
    return mapped;
  });

export const getJob = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const sql = await ensureSeed();
    const rows = await sql.query<JobRow>(
      `select ${JOB_SELECT} from jobs j join companies c on c.id = j.company_id where j.id = $1`,
      [id],
    );
    return rows[0] ? mapJob(rows[0]) : null;
  });

export const getJobMatched = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await ensureSeed();
    const profile = await getOrCreateProfile(context.userId, "Member");
    const rows = await sql.query<JobRow>(
      `select ${JOB_SELECT} from jobs j join companies c on c.id = j.company_id where j.id = $1`,
      [id],
    );
    const job = rows[0] ? mapJob(rows[0], profile) : null;
    const breakdown = job
      ? jobFitScore(profile.skills, job.skills, profile.experience_years, job.seniority)
      : null;
    const app = await sql<{ status: string }>`
      select status from applications where user_id = ${context.userId} and job_id = ${id}`;
    return { job, breakdown, applicationStatus: app[0]?.status ?? null, profile };
  });

export type ApplicationView = {
  id: number;
  job_id: string;
  status: string;
  fit_score: number;
  cover_note: string;
  created_at: string;
  updated_at: string;
  title: string;
  company: string;
  logo_letter: string;
  location: string;
  salary_min: number;
  salary_max: number;
  is_internship: boolean;
};

export const listApplications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await ensureSeed();
    await getOrCreateProfile(context.userId, "Member");
    const rows = await sql<ApplicationView>`
      select a.id, a.job_id, a.status, a.fit_score, a.cover_note, a.created_at, a.updated_at,
             j.title, c.name as company, c.logo_letter, j.location, j.salary_min, j.salary_max, j.is_internship
      from applications a
      join jobs j on j.id = a.job_id
      join companies c on c.id = j.company_id
      where a.user_id = ${context.userId}
      order by a.updated_at desc`;
    return rows.map((r) => ({
      ...r,
      id: Number(r.id),
      fit_score: Number(r.fit_score),
      salary_min: Number(r.salary_min),
      salary_max: Number(r.salary_max),
      is_internship: Boolean(r.is_internship),
    }));
  });

export const applyToJob = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { jobId: string; status?: string; note?: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await ensureSeed();
    const profile = await getOrCreateProfile(context.userId, "Member");
    const rows = await sql.query<JobRow>(
      `select ${JOB_SELECT} from jobs j join companies c on c.id = j.company_id where j.id = $1`,
      [data.jobId],
    );
    if (!rows[0]) throw new Error("Role not found");
    const job = mapJob(rows[0], profile);
    const status = data.status ?? "applied";
    const existing = await sql<{ id: number }>`
      select id from applications where user_id = ${context.userId} and job_id = ${data.jobId}`;
    if (existing[0]) {
      await sql`update applications set status = ${status}, cover_note = ${data.note ?? ""}, updated_at = now()
        where id = ${existing[0].id} and user_id = ${context.userId}`;
      await sql`insert into tracker_events (application_id, user_id, status, note)
        values (${existing[0].id}, ${context.userId}, ${status}, ${data.note ?? ""})`;
      return { id: Number(existing[0].id), status };
    }
    const inserted = await sql<{ id: number }>`
      insert into applications (user_id, job_id, status, cover_note, fit_score)
      values (${context.userId}, ${data.jobId}, ${status}, ${data.note ?? ""}, ${job.fit ?? 0})
      returning id`;
    await sql`insert into tracker_events (application_id, user_id, status, note)
      values (${inserted[0].id}, ${context.userId}, ${status}, ${data.note ?? "Added to tracker"})`;
    return { id: Number(inserted[0].id), status };
  });

export const moveApplication = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: number; status: string; note?: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`update applications set status = ${data.status}, updated_at = now()
      where id = ${data.id} and user_id = ${context.userId}`;
    await sql`insert into tracker_events (application_id, user_id, status, note)
      values (${data.id}, ${context.userId}, ${data.status}, ${data.note ?? ""})`;
    return { ok: true as const };
  });

export const dashboardStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await ensureSeed();
    const profile = await getOrCreateProfile(context.userId, "Member");
    const apps = await sql<{ status: string; n: number }>`
      select status, count(*)::int as n from applications where user_id = ${context.userId} group by status`;
    const counts: Record<string, number> = {};
    for (const a of apps) counts[a.status] = Number(a.n);
    const resume = await sql<{ ats_score: number }>`
      select ats_score from resumes where user_id = ${context.userId} order by id desc limit 1`;
    const interviews = await sql<{ n: number }>`
      select count(*)::int as n from interview_sessions where user_id = ${context.userId}`;
    const enroll = await sql<{ n: number; avg: number }>`
      select count(*)::int as n, coalesce(avg(progress),0)::int as avg from enrollments where user_id = ${context.userId}`;
    const matches = await sql.query<JobRow>(
      `select ${JOB_SELECT} from jobs j join companies c on c.id = j.company_id where j.status='open' and j.is_internship = false`,
    );
    const top = matches
      .map((r) => mapJob(r, profile))
      .sort((a, b) => (b.fit ?? 0) - (a.fit ?? 0))
      .slice(0, 5);

    const applied = counts.applied ?? 0;
    const screening = counts.screening ?? 0;
    const interview = counts.interview ?? 0;
    const offer = counts.offer ?? 0;
    const saved = counts.saved ?? 0;
    const profileComplete =
      (profile.display_name ? 20 : 0) +
      (profile.headline ? 15 : 0) +
      (profile.skills.length ? 25 : 0) +
      (profile.education ? 20 : 0) +
      (profile.bio.length > 40 ? 20 : 0);

    return {
      profile,
      counts: { applied, screening, interview, offer, saved },
      ats: resume[0]?.ats_score ?? 0,
      interviewSessions: Number(interviews[0]?.n ?? 0),
      courses: { n: Number(enroll[0]?.n ?? 0), avg: Number(enroll[0]?.avg ?? 0) },
      top,
      profileComplete,
    };
  });

export const getResume = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await ensureSeed();
    await getOrCreateProfile(context.userId, "Member");
    const rows = await sql<{
      id: number;
      title: string;
      content: string;
      ats_score: number;
      keyword_score: number;
      experience_score: number;
      skills_score: number;
      format_score: number;
      suggestions: string;
    }>`select * from resumes where user_id = ${context.userId} order by id desc limit 1`;
    const r = rows[0];
    if (!r) return null;
    return {
      ...r,
      id: Number(r.id),
      ats_score: Number(r.ats_score),
      keyword_score: Number(r.keyword_score),
      experience_score: Number(r.experience_score),
      skills_score: Number(r.skills_score),
      format_score: Number(r.format_score),
      suggestions: parseJsonArray(r.suggestions),
    };
  });

export const saveResume = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { content: string; title?: string; targetRole?: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const ats = atsFromResume(data.content, data.targetRole ?? "Product Manager");
    const existing = await sql<{ id: number }>`select id from resumes where user_id = ${context.userId} limit 1`;
    if (existing[0]) {
      await sql`update resumes set content = ${data.content}, title = ${data.title ?? "Master resume"},
        ats_score = ${ats.overall}, keyword_score = ${ats.keyword}, experience_score = ${ats.experience},
        skills_score = ${ats.skills}, format_score = ${ats.format}, suggestions = ${JSON.stringify(ats.gaps)},
        updated_at = now() where id = ${existing[0].id} and user_id = ${context.userId}`;
    } else {
      await sql`insert into resumes (user_id, title, content, ats_score, keyword_score, experience_score, skills_score, format_score, suggestions)
        values (${context.userId}, ${data.title ?? "Master resume"}, ${data.content}, ${ats.overall}, ${ats.keyword}, ${ats.experience}, ${ats.skills}, ${ats.format}, ${JSON.stringify(ats.gaps)})`;
    }
    return ats;
  });

export const listCourses = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await ensureSeed();
  const rows = await sql<{
    id: string;
    title: string;
    provider: string;
    category: string;
    level: string;
    hours: number;
    rating: number;
    learners: number;
    description: string;
    modules: string;
  }>`select * from courses order by learners desc`;
  return rows.map((c) => ({
    ...c,
    hours: Number(c.hours),
    rating: Number(c.rating),
    learners: Number(c.learners),
    modules: parseJsonArray(c.modules),
  }));
});

export const enrollCourse = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { courseId: string; progress?: number }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`insert into enrollments (user_id, course_id, progress)
      values (${context.userId}, ${data.courseId}, ${data.progress ?? 8})
      on conflict (user_id, course_id) do update set progress = excluded.progress`;
    return { ok: true as const };
  });

export const myEnrollments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{ course_id: string; progress: number }>`
      select course_id, progress from enrollments where user_id = ${context.userId}`;
  });

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await ensureSeed();
  const rows = await sql<{
    id: number;
    author_name: string;
    author_role: string;
    author_letter: string;
    body: string;
    likes: number;
    comments: number;
    created_at: string;
  }>`select id, author_name, author_role, author_letter, body, likes, comments, created_at from posts order by id desc`;
  return rows.map((p) => ({ ...p, id: Number(p.id), likes: Number(p.likes), comments: Number(p.comments) }));
});

export const addPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { body: string; name: string; role: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const body = data.body.trim();
    if (!body) return { ok: false as const };
    const letter = (data.name || "N").charAt(0).toUpperCase();
    await sql`insert into posts (author_name, author_role, author_letter, body, user_id)
      values (${data.name || "Member"}, ${data.role || "Nexora member"}, ${letter}, ${body}, ${context.userId})`;
    return { ok: true as const };
  });

export const listConnections = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await ensureSeed();
    await getOrCreateProfile(context.userId, "Member");
    const rows = await sql<{
      id: number;
      person_id: string;
      person_name: string;
      person_role: string;
      person_company: string;
      status: string;
    }>`select id, person_id, person_name, person_role, person_company, status from connections where user_id = ${context.userId}`;
    return rows.map((r) => ({ ...r, id: Number(r.id) }));
  });

export const listMessages = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await ensureSeed();
    await getOrCreateProfile(context.userId, "Member");
    const rows = await sql<{
      id: number;
      from_name: string;
      from_role: string;
      subject: string;
      body: string;
      read: boolean;
      created_at: string;
    }>`select id, from_name, from_role, subject, body, read, created_at from messages where user_id = ${context.userId} order by id desc`;
    return rows.map((m) => ({ ...m, id: Number(m.id), read: Boolean(m.read) }));
  });

export const listInterviews = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      role: string;
      company: string;
      mode: string;
      score: number | null;
      feedback: string;
      created_at: string;
    }>`select id, role, company, mode, score, feedback, created_at from interview_sessions where user_id = ${context.userId} order by id desc`;
    return rows.map((r) => ({ ...r, id: Number(r.id), score: r.score == null ? null : Number(r.score) }));
  });

export const runInterviewTurn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { role: string; company: string; mode: string; answer?: string; history?: { q: string; a: string }[] }) => d)
  .handler(async ({ context, data }) => {
    const apiKey = process.env.XAI_API_KEY;
    const history = data.history ?? [];
    const system = `You are a sharp ${data.mode} interviewer for ${data.role} at ${data.company || "a top Indian tech company"}. Ask one question at a time. After the candidate answers, give 2-sentence feedback then the next question. Keep it India-tech realistic. If this is the start, greet briefly and ask the first question.`;

    if (!apiKey) {
      const canned = [
        `Walk me through a product you owned end-to-end for ${data.role}. What was the metric, the constraint, and the trade-off you made?`,
        "A stakeholder wants to ship a feature that your data says will hurt retention. What do you do in the next 48 hours?",
        "How would you size the opportunity for Instamart in Tier-2 cities?",
      ];
      const q = canned[history.length % canned.length];
      const feedback = data.answer
        ? "Clear structure. Next time lead with the metric before the story."
        : "";
      if (history.length >= 3) {
        const score = 78 + Math.min(history.length, 4) * 3;
        await (await getSql())`insert into interview_sessions (user_id, role, company, mode, transcript, score, feedback)
          values (${context.userId}, ${data.role}, ${data.company}, ${data.mode}, ${JSON.stringify(history)}, ${score}, ${"Solid narrative. Tighten metric-first answers."})`;
        return { question: "That's the loop. Review the score on your sessions list.", feedback, done: true, score };
      }
      return { question: q, feedback, done: false, score: null };
    }

    const messages = [
      { role: "system" as const, content: system },
      ...history.flatMap((h) => [
        { role: "assistant" as const, content: h.q },
        { role: "user" as const, content: h.a },
      ]),
      data.answer
        ? { role: "user" as const, content: data.answer }
        : { role: "user" as const, content: "Start the interview." },
    ];

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "grok-4.5", messages, max_tokens: 400 }),
    });
    if (!res.ok) {
      return { question: "Let's start with a metric you moved in the last two quarters.", feedback: "", done: false, score: null };
    }
    const body = (await res.json()) as { choices: { message: { content: string } }[] };
    const text = body.choices[0]?.message.content ?? "Tell me about a time you said no.";
    if (history.length >= 4) {
      const score = 82;
      const sql = await getSql();
      await sql`insert into interview_sessions (user_id, role, company, mode, transcript, score, feedback)
        values (${context.userId}, ${data.role}, ${data.company}, ${data.mode}, ${JSON.stringify(history)}, ${score}, ${text.slice(0, 400)})`;
      return { question: text, feedback: "", done: true, score };
    }
    return { question: text, feedback: "", done: false, score: null };
  });

export const analyzeResumeAi = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { content: string; targetRole: string }) => d)
  .handler(async ({ data }) => {
    const base = atsFromResume(data.content, data.targetRole);
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ...base, narrative: "ATS scan complete. Sign-in AI is offline — scores are heuristic." };
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 280,
        messages: [
          {
            role: "user",
            content: `Score this resume for ${data.targetRole} in Indian tech. Give 3 specific rewrites. Resume:\n${data.content.slice(0, 4000)}`,
          },
        ],
      }),
    });
    if (!res.ok) return { ...base, narrative: "Heuristic ATS only." };
    const body = (await res.json()) as { choices: { message: { content: string } }[] };
    return { ...base, narrative: body.choices[0]?.message.content ?? "" };
  });

export const salaryBands = createServerFn({ method: "GET" }).handler(async () => SALARY_BANDS);

export const hireOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await ensureSeed();
    const jobs = await sql.query<JobRow>(
      `select ${JOB_SELECT} from jobs j join companies c on c.id = j.company_id where j.is_internship = false order by j.title`,
    );
    const pipeline = await sql<{
      id: number;
      job_id: string;
      talent_id: string;
      stage: string;
      note: string;
      name: string;
      role: string;
      location: string;
      score: number;
      source: string;
      experience_years: number;
    }>`select p.id, p.job_id, p.talent_id, p.stage, p.note, t.name, t.role, t.location, t.score, t.source, t.experience_years
       from pipeline p join talent t on t.id = p.talent_id`;
    const talent = await sql<{
      id: string;
      name: string;
      role: string;
      location: string;
      experience_years: number;
      skills: string;
      education: string;
      current_company: string;
      expected_ctc: number | null;
      notice_days: number | null;
      score: number;
      source: string;
    }>`select * from talent order by score desc`;
    return {
      jobs: jobs.map((j) => mapJob(j)),
      pipeline: pipeline.map((p) => ({
        ...p,
        id: Number(p.id),
        score: Number(p.score),
        experience_years: Number(p.experience_years),
      })),
      talent: talent.map((t) => ({
        ...t,
        experience_years: Number(t.experience_years),
        expected_ctc: t.expected_ctc == null ? null : Number(t.expected_ctc),
        notice_days: t.notice_days == null ? null : Number(t.notice_days),
        score: Number(t.score),
        skills: parseJsonArray(t.skills),
      })),
    };
  });

export const movePipeline = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: number; stage: string }) => d)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`update pipeline set stage = ${data.stage}, updated_at = now() where id = ${data.id}`;
    return { ok: true as const };
  });

export const postJob = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      title: string;
      companyId: string;
      location: string;
      seniority: string;
      salary_min: number;
      salary_max: number;
      skills: string;
      description: string;
    }) => d,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const id = `j-user-${Date.now()}`;
    const skills = data.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    await sql`insert into jobs (id, company_id, title, location, remote_type, employment_type, seniority, salary_min, salary_max, skills, description, requirements, posted_by)
      values (${id}, ${data.companyId}, ${data.title}, ${data.location}, ${"hybrid"}, ${"full-time"}, ${data.seniority}, ${data.salary_min}, ${data.salary_max}, ${JSON.stringify(skills)}, ${data.description}, ${"See description."}, ${context.userId})`;
    return { id };
  });

export const peopleOs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await ensureSeed();
    const employees = await sql<{
      id: string;
      name: string;
      title: string;
      department: string;
      manager_id: string | null;
      location: string;
      email: string;
      start_date: string;
      status: string;
      band: string;
    }>`select * from employees order by name`;
    const timeOff = await sql<{
      id: number;
      employee_id: string;
      kind: string;
      start_date: string;
      end_date: string;
      status: string;
      days: number;
    }>`select * from time_off order by start_date`;
    return {
      employees,
      timeOff: timeOff.map((t) => ({ ...t, id: Number(t.id), days: Number(t.days) })),
    };
  });

export const campusOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await ensureSeed();
    const students = await sql<{
      id: string;
      name: string;
      program: string;
      year: number;
      cgpa: number;
      skills: string;
      location: string;
      institution: string;
      seeking: string;
      resume_score: number;
    }>`select * from students order by resume_score desc`;
    const drives = await sql<{
      id: number;
      company_id: string;
      title: string;
      drive_date: string;
      roles: string;
      status: string;
      company: string;
      logo_letter: string;
    }>`select d.id, d.company_id, d.title, d.drive_date, d.roles, d.status, c.name as company, c.logo_letter
       from drives d join companies c on c.id = d.company_id order by d.drive_date`;
    return {
      students: students.map((s) => ({
        ...s,
        year: Number(s.year),
        cgpa: Number(s.cgpa),
        resume_score: Number(s.resume_score),
        skills: parseJsonArray(s.skills),
      })),
      drives: drives.map((d) => ({
        ...d,
        id: Number(d.id),
        roles: parseJsonArray(d.roles),
      })),
    };
  });

export const listCompanies = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await ensureSeed();
  return sql<{ id: string; name: string; logo_letter: string }>`select id, name, logo_letter from companies order by name`;
});
