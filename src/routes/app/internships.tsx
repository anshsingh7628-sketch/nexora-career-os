import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { JobCard } from "@/components/job-card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { listMatchedJobs, type JobView } from "@/lib/server/actions";

export const Route = createFileRoute("/app/internships")({ component: Internships });

function Internships() {
  const [q, setQ] = useState("");
  const [jobs, setJobs] = useState<JobView[] | null>(null);

  useEffect(() => {
    listMatchedJobs({ data: { internships: true, q } })
      .then(setJobs)
      .catch(() => setJobs([]));
  }, [q]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Internships</h1>
        <p className="mt-1 text-muted">Campus-ready roles with stipend, duration, and PPO tracks.</p>
      </header>
      <Input placeholder="Search internships" value={q} onChange={(e) => setQ(e.target.value)} />
      {!jobs ? (
        <Skeleton className="h-32" />
      ) : (
        <div className="space-y-3">
          {jobs.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </div>
      )}
    </div>
  );
}
