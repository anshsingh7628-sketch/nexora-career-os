import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { applyToJob, getJobMatched } from "@/lib/server/actions";
import { formatLpa } from "@/lib/utils";

export const Route = createFileRoute("/app/jobs/$jobId")({ component: JobDetail });

function JobDetail() {
  const { jobId } = Route.useParams();
  const [data, setData] = useState<Awaited<ReturnType<typeof getJobMatched>> | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    getJobMatched({ data: jobId }).then((d) => {
      setData(d);
      setStatus(d.applicationStatus);
    });
  }, [jobId]);

  if (!data?.job) return <p className="text-muted">Loading role…</p>;
  const { job, breakdown } = data;

  async function act(next: string) {
    setBusy(true);
    try {
      await applyToJob({ data: { jobId, status: next, note } });
      setStatus(next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <p className="text-sm text-muted">
          <Link to="/app/jobs" className="hover:text-fg">
            Jobs
          </Link>{" "}
          / {job.company}
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight">{job.title}</h1>
        <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted">
          <span>{job.company}</span>
          <span>{job.location}</span>
          <span className="capitalize">{job.remote_type}</span>
          <span>{formatLpa(job.salary_min, job.salary_max)}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.skills.map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>
        <p className="mt-6 text-fg/90">{job.description}</p>
        <h2 className="mt-8 font-display text-xl">Requirements</h2>
        <p className="mt-2 text-muted">{job.requirements}</p>
        <div className="mt-8 space-y-2">
          <Textarea
            placeholder="Optional note to the hiring team"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button disabled={busy} onClick={() => act("applied")}>
              {status === "applied" || status === "screening" || status === "interview" || status === "offer"
                ? "Applied"
                : "Apply"}
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => act("saved")}>
              Save to tracker
            </Button>
          </div>
          {status && (
            <p className="text-sm text-accent">On your tracker as {status}.</p>
          )}
        </div>
      </div>
      {breakdown && (
        <Card>
          <p className="text-xs uppercase tracking-wider text-subtle">Why this match</p>
          <p className="mt-2 font-display text-4xl text-accent">{breakdown.overall}%</p>
          <div className="mt-4 space-y-3">
            {[
              ["Keyword", breakdown.keyword],
              ["Experience", breakdown.experience],
              ["Skills", breakdown.skills],
              ["Format", breakdown.format],
            ].map(([k, v]) => (
              <div key={String(k)}>
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>{k}</span>
                  <span className="tabular-nums">{v}%</span>
                </div>
                <Progress value={Number(v)} />
              </div>
            ))}
          </div>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {breakdown.why.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          {breakdown.gaps.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-subtle">Gaps to close</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {breakdown.gaps.map((g) => (
                  <Badge key={g} tone="warn">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
