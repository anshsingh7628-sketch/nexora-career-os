import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { peopleOs } from "@/lib/server/actions";

export const Route = createFileRoute("/hire/people")({ component: People });

function People() {
  const [data, setData] = useState<Awaited<ReturnType<typeof peopleOs>> | null>(null);
  useEffect(() => {
    peopleOs().then(setData);
  }, []);
  const employees = data?.employees ?? [];
  const roots = employees.filter((e) => !e.manager_id);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl tracking-tight">People OS</h1>
        <p className="text-muted">Org, bands, and time off — the Workday layer after hire.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-subtle">Headcount</p>
          <p className="font-display text-3xl">{employees.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-subtle">Departments</p>
          <p className="font-display text-3xl">
            {new Set(employees.map((e) => e.department)).size}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-subtle">Open time-off</p>
          <p className="font-display text-3xl">{data?.timeOff.length ?? 0}</p>
        </Card>
      </div>
      <section>
        <h2 className="mb-3 font-display text-xl">Org</h2>
        <div className="space-y-2">
          {roots.map((r) => (
            <OrgNode key={r.id} person={r} all={employees} depth={0} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-3 font-display text-xl">Time off</h2>
        <div className="space-y-2">
          {(data?.timeOff ?? []).map((t) => {
            const emp = employees.find((e) => e.id === t.employee_id);
            return (
              <Card key={t.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{emp?.name}</p>
                  <p className="text-xs text-muted">
                    {t.kind} · {t.start_date} → {t.end_date} · {t.days}d
                  </p>
                </div>
                <Badge tone={t.status === "approved" ? "match" : "warn"}>{t.status}</Badge>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function OrgNode({
  person,
  all,
  depth,
}: {
  person: Awaited<ReturnType<typeof peopleOs>>["employees"][number];
  all: Awaited<ReturnType<typeof peopleOs>>["employees"];
  depth: number;
}) {
  const children = all.filter((e) => e.manager_id === person.id);
  return (
    <div style={{ marginLeft: depth * 16 }}>
      <div className="mb-2 flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2">
        <div>
          <p className="text-sm font-medium">{person.name}</p>
          <p className="text-xs text-muted">
            {person.title} · {person.department} · {person.location} · {person.band}
          </p>
        </div>
      </div>
      {children.map((c) => (
        <OrgNode key={c.id} person={c} all={all} depth={depth + 1} />
      ))}
    </div>
  );
}
