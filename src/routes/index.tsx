import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Building2,
  GraduationCap,
  Newspaper,
  ScanSearch,
  LineChart,
  Mic,
} from "lucide-react";
import { Wordmark } from "@/components/brand";
import { AuthSlot } from "@/components/auth-slot";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressLine } from "@/components/progress-line";
import { JobCard } from "@/components/job-card";
import type { JobView } from "@/lib/server/actions";

export const Route = createFileRoute("/")({ component: Home });

const PREVIEW_JOBS: JobView[] = [
  {
    id: "j-swiggy-pm",
    company_id: "swiggy",
    company: "Swiggy",
    logo_letter: "S",
    industry: "Consumer",
    title: "Senior Product Manager",
    location: "Bengaluru",
    remote_type: "hybrid",
    employment_type: "full-time",
    seniority: "Senior",
    salary_min: 28,
    salary_max: 40,
    skills: ["Roadmap"],
    description: "",
    requirements: "",
    posted_at: new Date().toISOString(),
    is_internship: false,
    stipend: null,
    duration_months: null,
    status: "open",
    fit: 94,
  },
  {
    id: "j-meesho-pmg",
    company_id: "meesho",
    company: "Meesho",
    logo_letter: "M",
    industry: "E-commerce",
    title: "Product Manager — Growth",
    location: "Bengaluru",
    remote_type: "hybrid",
    employment_type: "full-time",
    seniority: "Mid",
    salary_min: 22,
    salary_max: 35,
    skills: ["Growth"],
    description: "",
    requirements: "",
    posted_at: new Date().toISOString(),
    is_internship: false,
    stipend: null,
    duration_months: null,
    status: "open",
    fit: 91,
  },
  {
    id: "j-flipkart-pm",
    company_id: "flipkart",
    company: "Flipkart",
    logo_letter: "F",
    industry: "E-commerce",
    title: "PM — Consumer Experience",
    location: "Bengaluru",
    remote_type: "onsite",
    employment_type: "full-time",
    seniority: "Senior",
    salary_min: 25,
    salary_max: 38,
    skills: ["UX"],
    description: "",
    requirements: "",
    posted_at: new Date().toISOString(),
    is_internship: false,
    stipend: null,
    duration_months: null,
    status: "open",
    fit: 88,
  },
];

const PORTALS = [
  {
    icon: Briefcase,
    title: "Job Seeker",
    body: "Your full career dashboard — resume, jobs, interviews, and salary data in one place.",
    to: "/app",
  },
  {
    icon: Building2,
    title: "Recruiter",
    body: "Post roles, screen candidates with AI, and manage your hiring pipeline — no spreadsheets.",
    to: "/hire",
  },
  {
    icon: Newspaper,
    title: "Community",
    body: "Join as a member — use the Learning OS and the feed, then pick your role when you’re ready.",
    to: "/community",
  },
  {
    icon: GraduationCap,
    title: "Institution",
    body: "List students so recruiters can discover them for internships and fresher roles — real exposure.",
    to: "/campus",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-bg/90 px-4 backdrop-blur md:px-8">
        <Wordmark />
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <a href="#portals" className="hover:text-fg">
            Portals
          </a>
          <a href="#matching" className="hover:text-fg">
            Matching
          </a>
          <a href="#stack" className="hover:text-fg">
            Stack
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <AuthSlot />
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:items-center md:px-8 md:py-24">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Employment OS</p>
          <h1 className="mt-4 font-display text-4xl leading-[1.1] tracking-tight md:text-6xl">
            Watch your career actually move.
          </h1>
          <p className="mt-5 max-w-md text-muted">
            A visible progress line for every career action. Intelligent matching. ATS analysis.
            Interview rehearsal. One workspace instead of eight tabs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login">
              <Button size="lg">
                Enter portal <ArrowRight className="size-4" />
              </Button>
            </Link>
            <a href="#portals">
              <Button size="lg" variant="secondary">
                See the four portals
              </Button>
            </a>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-subtle">Applications</dt>
              <dd className="font-display text-2xl">12 sent</dd>
            </div>
            <div>
              <dt className="text-subtle">In review</dt>
              <dd className="font-display text-2xl">3</dd>
            </div>
            <div>
              <dt className="text-subtle">Interviews</dt>
              <dd className="font-display text-2xl">2</dd>
            </div>
          </dl>
        </div>
        <div className="min-w-0 rounded-2xl border border-border bg-surface p-4 sm:p-6">
          <p className="mb-6 text-xs uppercase tracking-wider text-subtle">This week’s line</p>
          <ProgressLine current={3} />
          <div className="mt-8 space-y-3">
            {PREVIEW_JOBS.map((j) => (
              <JobCard key={j.id} job={j} login />
            ))}
          </div>
        </div>
      </section>

      <section id="portals" className="border-t border-border bg-surface/40 py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <h2 className="font-display text-3xl tracking-tight">Four portals. One kernel.</h2>
          <p className="mt-2 max-w-xl text-muted">
            Seekers, recruiters, campuses, and the community share talent intelligence — they don’t share a cluttered inbox.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {PORTALS.map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.title}
                  to={p.to}
                  className="group flex gap-4 rounded-xl border border-border bg-bg p-5 hover:border-accent/40"
                >
                  <div className="grid size-11 place-items-center rounded-md bg-elevated text-accent">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {p.title}{" "}
                      <span className="text-subtle group-hover:text-accent">Enter portal →</span>
                    </p>
                    <p className="mt-1 text-sm text-muted">{p.body}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="matching" className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
        <div>
          <h2 className="font-display text-3xl tracking-tight">Intelligent matching</h2>
          <p className="mt-3 text-muted">
            Roles ranked by actual fit against your profile — not date, not random, not ad spend. Transparent keyword,
            experience, skills, and format scores, Eightfold-style.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-muted">
            <li className="flex gap-2">
              <ScanSearch className="mt-0.5 size-4 text-accent" /> ATS 87 · 3 improvements to 95+
            </li>
            <li className="flex gap-2">
              <Mic className="mt-0.5 size-4 text-accent" /> AI interviewer with structured feedback
            </li>
            <li className="flex gap-2">
              <LineChart className="mt-0.5 size-4 text-accent" /> Salary bands, weekly digest, offer-ready
            </li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Keyword match", "88%"],
            ["Experience fit", "92%"],
            ["Skills alignment", "76%"],
            ["Format score", "95%"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs text-subtle">{k}</p>
              <p className="mt-2 font-display text-3xl text-accent">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="stack" className="border-t border-border py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <h2 className="font-display text-3xl tracking-tight">The stack, unified</h2>
          <p className="mt-2 max-w-2xl text-muted">
            One product instead of Naukri + LinkedIn + CEIPAL + Workday + Coursera + Internshala + Eightfold + Careerflow.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              "Job board",
              "Professional graph",
              "ATS pipeline",
              "People OS",
              "Learning OS",
              "Internships",
              "Talent intelligence",
              "Application tracker",
            ].map((s) => (
              <Badge key={s} tone="muted" className="px-3 py-1.5 text-sm">
                {s}
              </Badge>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/login">
              <Button size="lg">
                Start the progress line <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-4 py-8 text-sm text-subtle md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>Nexora · Watch your career actually move.</p>
          <p>Seeker · Hire · Campus · Community</p>
        </div>
      </footer>
    </div>
  );
}
