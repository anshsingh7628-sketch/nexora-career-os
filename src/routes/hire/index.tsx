import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { hireOverview } from "@/lib/server/actions";

export const Route = createFileRoute("/hire/")({ component: HireHome });

function HireHome() {
  const [data, setData] = useState<Awaited<ReturnType<typeof hireOverview>> | null>(null);
  useEffect(() => {
    hireOverview()
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const pipeline = data?.pipeline ?? [];
  const stages = ["sourced", "applied", "screen", "interview", "offer", "hired"];
  const byStage = Object.fromEntries(stages.map((s) => [s, pipeline.filter((p) => p.stage === s).length]));

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-accent">Recruiter OS</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">Hiring command</h1>
        <p className="text-muted">CEIPAL pipeline. Eightfold scores. No spreadsheet.</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stages.map((s) => (
          <Card key={s} className="p-4">
            <p className="text-xs capitalize text-subtle">{s}</p>
            <p className="font-display text-2xl tabular-nums">{byStage[s] ?? 0}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="font-medium">Open requisitions</p>
          <p className="mt-1 font-display text-4xl">{data?.jobs.length ?? "—"}</p>
          <Link to="/hire/jobs" className="mt-3 inline-block text-sm text-muted hover:text-fg">
            Manage jobs →
          </Link>
        </Card>
        <Card>
          <p className="font-medium">Talent pool</p>
          <p className="mt-1 font-display text-4xl">{data?.talent.length ?? "—"}</p>
          <Link to="/hire/candidates" className="mt-3 inline-block text-sm text-muted hover:text-fg">
            Ranked candidates →
          </Link>
        </Card>
      </div>
      <Card>
        <p className="font-medium">People OS</p>
        <p className="mt-1 text-sm text-muted">
          Org, time off, bands — Workday-style after the offer is signed.
        </p>
        <Link to="/hire/people" className="mt-3 inline-block text-sm text-accent">
          Open People OS →
        </Link>
      </Card>
    </div>
  );
}
