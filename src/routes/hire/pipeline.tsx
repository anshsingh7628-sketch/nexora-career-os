import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { hireOverview, movePipeline } from "@/lib/server/actions";

export const Route = createFileRoute("/hire/pipeline")({ component: Pipeline });

const STAGES = ["sourced", "applied", "screen", "interview", "offer", "hired"] as const;

function Pipeline() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof hireOverview>>["pipeline"]>([]);

  function load() {
    hireOverview().then((d) => setRows(d.pipeline));
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Pipeline</h1>
        <p className="text-muted">Drag-free kanban. Move stages from the card.</p>
      </header>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <section key={stage} className="w-64 shrink-0 rounded-xl border border-border bg-surface p-3">
            <header className="mb-3 flex justify-between text-sm capitalize">
              <span>{stage}</span>
              <span className="text-subtle">{rows.filter((r) => r.stage === stage).length}</span>
            </header>
            <div className="space-y-2">
              {rows
                .filter((r) => r.stage === stage)
                .map((r) => (
                  <article key={r.id} className="rounded-lg border border-border bg-bg p-3">
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted">
                      {r.role} · {r.location}
                    </p>
                    <p className="mt-1 text-xs text-accent">{r.score} score · {r.source}</p>
                    <select
                      className="mt-2 h-9 w-full rounded-sm border border-border bg-elevated px-2 text-xs"
                      value={r.stage}
                      onChange={async (e) => {
                        await movePipeline({ data: { id: r.id, stage: e.target.value } });
                        load();
                      }}
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
