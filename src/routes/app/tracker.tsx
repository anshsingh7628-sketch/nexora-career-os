import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  listApplications,
  moveApplication,
  type ApplicationView,
} from "@/lib/server/actions";
import { formatLpa } from "@/lib/utils";

export const Route = createFileRoute("/app/tracker")({ component: Tracker });

const COLUMNS = [
  { id: "saved", label: "Saved" },
  { id: "applied", label: "Applied" },
  { id: "screening", label: "Screen" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "rejected", label: "Closed" },
] as const;

function Tracker() {
  const [apps, setApps] = useState<ApplicationView[] | null>(null);

  function load() {
    listApplications()
      .then(setApps)
      .catch(() => setApps([]));
  }

  useEffect(() => {
    load();
  }, []);

  async function move(id: number, status: string) {
    await moveApplication({ data: { id, status } });
    load();
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Application tracker</h1>
        <p className="mt-1 text-muted">Careerflow-style kanban from saved to offer, with status history.</p>
      </header>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const items = (apps ?? []).filter((a) => a.status === col.id);
          return (
            <section
              key={col.id}
              className="w-64 shrink-0 rounded-xl border border-border bg-surface p-3"
            >
              <header className="mb-3 flex items-center justify-between text-sm">
                <span>{col.label}</span>
                <span className="tabular-nums text-subtle">{items.length}</span>
              </header>
              <div className="space-y-2">
                {items.map((a) => (
                  <article key={a.id} className="rounded-lg border border-border bg-bg p-3">
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted">
                      {a.company} · {formatLpa(a.salary_min, a.salary_max)}
                    </p>
                    <p className="mt-1 text-xs text-accent">{a.fit_score}% fit</p>
                    <select
                      className="mt-2 h-9 w-full rounded-sm border border-border bg-elevated px-2 text-xs"
                      value={a.status}
                      onChange={(e) => move(a.id, e.target.value)}
                    >
                      {COLUMNS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      {apps && apps.length === 0 && (
        <p className="text-muted">Save or apply to a role and it lands here.</p>
      )}
    </div>
  );
}
