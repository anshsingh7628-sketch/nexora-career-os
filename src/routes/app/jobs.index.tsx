import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { JobCard } from "@/components/job-card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { listMatchedJobs, type JobView } from "@/lib/server/actions";

export const Route = createFileRoute("/app/jobs/")({ component: JobsPage });

function JobsPage() {
  const [q, setQ] = useState("");
  const [jobs, setJobs] = useState<JobView[] | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      listMatchedJobs({ data: { q } })
        .then(setJobs)
        .catch(() => setJobs([]));
    }, 180);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Jobs ranked by fit</h1>
        <p className="mt-1 text-muted">Naukri-scale search. Eightfold scoring. Fresh India tech roles.</p>
      </header>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
        <Input
          className="pl-10"
          placeholder="Role, company, skill, city"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {!jobs ? (
        <div className="space-y-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
          {jobs.length === 0 && <p className="text-muted">No roles match that filter.</p>}
        </div>
      )}
    </div>
  );
}
