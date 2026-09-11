import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatLpa } from "@/lib/utils";
import type { JobView } from "@/lib/server/actions";

export function JobCard({ job, login }: { job: JobView; login?: boolean }) {
  const inner = (
    <>
      <div className="grid size-11 shrink-0 place-items-center rounded-md bg-elevated font-display text-lg text-accent">
        {job.logo_letter}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-medium text-fg">{job.title}</p>
            <p className="truncate text-sm text-muted">{job.company}</p>
          </div>
          {job.fit != null && (
            <Badge tone={job.fit >= 85 ? "match" : job.fit >= 70 ? "accent" : "muted"}>
              {job.fit}% match
            </Badge>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtle">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" /> {job.location}
          </span>
          <span className="capitalize">{job.remote_type}</span>
          {job.is_internship ? (
            <span>
              ₹{((job.stipend ?? 0) / 1000).toFixed(0)}k / mo · {job.duration_months} mo
            </span>
          ) : (
            <span>{formatLpa(job.salary_min, job.salary_max)}</span>
          )}
        </div>
      </div>
    </>
  );

  const className =
    "group flex gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent/40 hover:bg-elevated";

  if (login) {
    return (
      <Link to="/login" className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <Link to="/app/jobs/$jobId" params={{ jobId: job.id }} className={className}>
      {inner}
    </Link>
  );
}
