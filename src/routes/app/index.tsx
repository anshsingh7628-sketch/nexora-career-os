import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ProgressLine } from "@/components/progress-line";
import { JobCard } from "@/components/job-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardStats, type JobView, type Profile } from "@/lib/server/actions";

export const Route = createFileRoute("/app/")({ component: SeekerHome });

function SeekerHome() {
  const [data, setData] = useState<Awaited<ReturnType<typeof dashboardStats>> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    dashboardStats()
      .then(setData)
      .catch((e) => setErr(e instanceof Error ? e.message : "Could not load"));
  }, []);

  if (err) return <p className="text-danger">{err}</p>;
  if (!data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const { profile, counts, ats, top, profileComplete, interviewSessions, courses } = data;
  const current =
    counts.offer > 0 ? 4 : counts.interview > 0 ? 3 : counts.applied > 0 ? 2 : ats > 0 ? 1 : 0;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-accent">Seeker OS</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">
          {greeting()}, {first(profile)}
        </h1>
        <p className="mt-1 text-muted">
          Targeting {profile.target_role} · {profile.location}
        </p>
      </header>

      <Card className="p-6">
        <p className="mb-5 text-xs uppercase tracking-wider text-subtle">Visible progress line</p>
        <ProgressLine current={current} />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Applications sent" value={counts.applied + counts.screening + counts.interview + counts.offer} />
          <Stat label="In review" value={counts.screening} />
          <Stat label="Interviews" value={counts.interview} />
          <Stat label="Offers" value={counts.offer} />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs text-subtle">ATS score</p>
          <p className="mt-1 font-display text-4xl text-accent">{ats}</p>
          <Progress value={ats} className="mt-3" />
          <Link to="/app/resume" className="mt-3 inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
            Resume studio <ArrowRight className="size-3.5" />
          </Link>
        </Card>
        <Card>
          <p className="text-xs text-subtle">Profile</p>
          <p className="mt-1 font-display text-4xl">{profileComplete}%</p>
          <Progress value={profileComplete} className="mt-3" />
          <Link to="/app/profile" className="mt-3 inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
            Complete profile <ArrowRight className="size-3.5" />
          </Link>
        </Card>
        <Card>
          <p className="text-xs text-subtle">Practice</p>
          <p className="mt-1 font-display text-4xl">{interviewSessions}</p>
          <p className="mt-2 text-sm text-muted">
            {courses.n} courses · {courses.avg}% avg
          </p>
          <Link to="/app/interview" className="mt-3 inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
            Rehearse <ArrowRight className="size-3.5" />
          </Link>
        </Card>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl">Top matches</h2>
          <Link to="/app/jobs" className="text-sm text-muted hover:text-fg">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {top.map((j: JobView) => (
            <JobCard key={j.id} job={j} />
          ))}
        </div>
      </section>

      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">Offer & negotiation</p>
          <p className="text-sm text-muted">Salary bands for {profile.target_role} are ready.</p>
        </div>
        <Link to="/app/salary">
          <Button variant="secondary">Open intelligence</Button>
        </Link>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-elevated p-3">
      <p className="text-xs text-subtle">{label}</p>
      <p className="font-display text-2xl tabular-nums">{value}</p>
    </div>
  );
}

function first(p: Profile) {
  return p.display_name.split(" ")[0] || "there";
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
