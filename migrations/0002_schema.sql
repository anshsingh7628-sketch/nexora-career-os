-- Nexora career OS schema

create table if not exists profiles (
  user_id text primary key,
  display_name text not null default '',
  headline text not null default '',
  bio text not null default '',
  location text not null default 'Bengaluru',
  portal text not null default 'seeker',
  target_role text not null default 'Product Manager',
  experience_years integer not null default 3,
  skills text not null default '[]',
  education text not null default '',
  current_company text not null default '',
  phone text not null default '',
  institution_name text not null default '',
  company_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists companies (
  id text primary key,
  name text not null,
  slug text not null unique,
  industry text not null,
  size_band text not null,
  hq text not null,
  about text not null,
  rating numeric not null default 4.2,
  founded integer not null default 2010,
  logo_letter text not null
);

create table if not exists jobs (
  id text primary key,
  company_id text not null references companies(id),
  title text not null,
  location text not null,
  remote_type text not null,
  employment_type text not null,
  seniority text not null,
  salary_min integer not null,
  salary_max integer not null,
  currency text not null default 'INR',
  skills text not null,
  description text not null,
  requirements text not null,
  posted_at timestamptz not null default now(),
  is_internship boolean not null default false,
  stipend integer,
  duration_months integer,
  posted_by text,
  status text not null default 'open'
);

create index if not exists jobs_company_idx on jobs (company_id);
create index if not exists jobs_intern_idx on jobs (is_internship);

create table if not exists applications (
  id serial primary key,
  user_id text not null,
  job_id text not null,
  status text not null default 'applied',
  cover_note text not null default '',
  fit_score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, job_id)
);
create index if not exists applications_user_idx on applications (user_id);

create table if not exists tracker_events (
  id serial primary key,
  application_id integer not null,
  user_id text not null,
  status text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists resumes (
  id serial primary key,
  user_id text not null,
  title text not null default 'Master resume',
  content text not null default '',
  ats_score integer not null default 0,
  keyword_score integer not null default 0,
  experience_score integer not null default 0,
  skills_score integer not null default 0,
  format_score integer not null default 0,
  suggestions text not null default '[]',
  updated_at timestamptz not null default now()
);
create index if not exists resumes_user_idx on resumes (user_id);

create table if not exists courses (
  id text primary key,
  title text not null,
  provider text not null,
  category text not null,
  level text not null,
  hours integer not null,
  rating numeric not null,
  learners integer not null,
  description text not null,
  modules text not null
);

create table if not exists enrollments (
  id serial primary key,
  user_id text not null,
  course_id text not null,
  progress integer not null default 0,
  enrolled_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table if not exists posts (
  id serial primary key,
  author_name text not null,
  author_role text not null,
  author_letter text not null,
  body text not null,
  likes integer not null default 0,
  comments integer not null default 0,
  created_at timestamptz not null default now(),
  user_id text
);

create table if not exists connections (
  id serial primary key,
  user_id text not null,
  person_id text not null,
  person_name text not null,
  person_role text not null,
  person_company text not null,
  status text not null default 'connected',
  created_at timestamptz not null default now()
);

create table if not exists interview_sessions (
  id serial primary key,
  user_id text not null,
  role text not null,
  company text not null default '',
  mode text not null default 'behavioral',
  transcript text not null default '[]',
  score integer,
  feedback text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists talent (
  id text primary key,
  name text not null,
  role text not null,
  location text not null,
  experience_years integer not null,
  skills text not null,
  education text not null,
  current_company text not null,
  expected_ctc integer,
  notice_days integer,
  score integer not null default 70,
  source text not null default 'inbound',
  institution text not null default ''
);

create table if not exists pipeline (
  id serial primary key,
  job_id text not null,
  talent_id text not null,
  stage text not null default 'applied',
  note text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists employees (
  id text primary key,
  name text not null,
  title text not null,
  department text not null,
  manager_id text,
  location text not null,
  email text not null,
  start_date date not null,
  status text not null default 'active',
  band text not null
);

create table if not exists time_off (
  id serial primary key,
  employee_id text not null,
  kind text not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'pending',
  days numeric not null
);

create table if not exists students (
  id text primary key,
  name text not null,
  program text not null,
  year integer not null,
  cgpa numeric not null,
  skills text not null,
  location text not null,
  institution text not null,
  seeking text not null,
  resume_score integer not null default 70
);

create table if not exists drives (
  id serial primary key,
  company_id text not null,
  title text not null,
  drive_date date not null,
  roles text not null,
  status text not null default 'upcoming'
);

create table if not exists messages (
  id serial primary key,
  user_id text not null,
  from_name text not null,
  from_role text not null,
  subject text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
