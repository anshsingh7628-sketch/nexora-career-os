import { getSql, type Sql } from "@/lib/db";
import {
  COMPANIES,
  JOBS,
  COURSES,
  TALENT,
  STUDENTS,
  EMPLOYEES,
  POSTS,
} from "@/lib/seed";

let seeded = false;

export async function ensureSeed(sql?: Sql) {
  const db = sql ?? (await getSql());
  if (seeded) return db;
  const rows = await db<{ n: number }>`select count(*)::int as n from companies`;
  if ((rows[0]?.n ?? 0) > 0) {
    seeded = true;
    return db;
  }

  for (const c of COMPANIES) {
    await db`insert into companies (id, name, slug, industry, size_band, hq, about, rating, founded, logo_letter)
      values (${c.id}, ${c.name}, ${c.slug}, ${c.industry}, ${c.size_band}, ${c.hq}, ${c.about}, ${c.rating}, ${c.founded}, ${c.logo_letter})
      on conflict (id) do nothing`;
  }

  for (const j of JOBS) {
    const intern = "intern" in j && j.intern;
    await db`insert into jobs (
      id, company_id, title, location, remote_type, employment_type, seniority,
      salary_min, salary_max, skills, description, requirements, is_internship, stipend, duration_months
    ) values (
      ${j.id}, ${j.company_id}, ${j.title}, ${j.location}, ${j.remote_type}, ${j.employment_type}, ${j.seniority},
      ${j.salary_min}, ${j.salary_max}, ${JSON.stringify(j.skills)}, ${j.description}, ${j.requirements},
      ${intern}, ${"stipend" in j ? j.stipend : null}, ${"duration_months" in j ? j.duration_months : null}
    ) on conflict (id) do nothing`;
  }

  for (const c of COURSES) {
    await db`insert into courses (id, title, provider, category, level, hours, rating, learners, description, modules)
      values (${c.id}, ${c.title}, ${c.provider}, ${c.category}, ${c.level}, ${c.hours}, ${c.rating}, ${c.learners}, ${c.description}, ${JSON.stringify(c.modules)})
      on conflict (id) do nothing`;
  }

  for (const t of TALENT) {
    await db`insert into talent (id, name, role, location, experience_years, skills, education, current_company, expected_ctc, notice_days, score, source, institution)
      values (${t.id}, ${t.name}, ${t.role}, ${t.location}, ${t.experience_years}, ${JSON.stringify(t.skills)}, ${t.education}, ${t.current_company}, ${t.expected_ctc}, ${t.notice_days}, ${t.score}, ${t.source}, ${t.institution})
      on conflict (id) do nothing`;
  }

  const pipelineSeed: Array<[string, string, string]> = [
    ["j-swiggy-pm", "t1", "interview"],
    ["j-swiggy-pm", "t2", "screen"],
    ["j-swiggy-pm", "t7", "applied"],
    ["j-meesho-pmg", "t2", "offer"],
    ["j-meesho-pmg", "t10", "interview"],
    ["j-razorpay-apm", "t7", "screen"],
    ["j-google-swe", "t3", "sourced"],
    ["j-atlas-em", "t8", "interview"],
    ["j-cred-ios", "t9", "applied"],
    ["j-phonepe-ds", "t4", "offer"],
    ["j-zoho-fe", "t5", "screen"],
    ["j-fresh-pl", "t6", "sourced"],
  ];
  for (const [jobId, talentId, stage] of pipelineSeed) {
    await db`insert into pipeline (job_id, talent_id, stage) values (${jobId}, ${talentId}, ${stage})`;
  }

  for (const s of STUDENTS) {
    await db`insert into students (id, name, program, year, cgpa, skills, location, institution, seeking, resume_score)
      values (${s.id}, ${s.name}, ${s.program}, ${s.year}, ${s.cgpa}, ${JSON.stringify(s.skills)}, ${s.location}, ${s.institution}, ${s.seeking}, ${s.resume_score})
      on conflict (id) do nothing`;
  }

  await db`insert into drives (company_id, title, drive_date, roles, status)
    values ('swiggy', 'Swiggy Instamart campus', '2026-09-22', ${JSON.stringify(["SDE intern", "PM intern"])}, 'upcoming')`;
  await db`insert into drives (company_id, title, drive_date, roles, status)
    values ('razorpay', 'Razorpay PPO sprint', '2026-10-04', ${JSON.stringify(["Software intern"])}, 'upcoming')`;
  await db`insert into drives (company_id, title, drive_date, roles, status)
    values ('google', 'Google STEP', '2026-08-30', ${JSON.stringify(["STEP intern"])}, 'closed')`;

  for (const e of EMPLOYEES) {
    await db`insert into employees (id, name, title, department, manager_id, location, email, start_date, status, band)
      values (${e.id}, ${e.name}, ${e.title}, ${e.department}, ${e.manager_id}, ${e.location}, ${e.email}, ${e.start_date}, ${e.status}, ${e.band})
      on conflict (id) do nothing`;
  }

  await db`insert into time_off (employee_id, kind, start_date, end_date, status, days)
    values ('e-ic2', 'Annual', '2026-09-18', '2026-09-22', 'approved', 3)`;
  await db`insert into time_off (employee_id, kind, start_date, end_date, status, days)
    values ('e-ic1', 'Annual', '2026-10-02', '2026-10-06', 'pending', 3)`;
  await db`insert into time_off (employee_id, kind, start_date, end_date, status, days)
    values ('e-des', 'Sick', '2026-09-08', '2026-09-09', 'approved', 2)`;

  for (const p of POSTS) {
    await db`insert into posts (author_name, author_role, author_letter, body, likes, comments)
      values (${p.author_name}, ${p.author_role}, ${p.author_letter}, ${p.body}, ${12 + Math.floor(Math.random() * 40)}, ${2 + Math.floor(Math.random() * 10)})`;
  }

  seeded = true;
  return db;
}
