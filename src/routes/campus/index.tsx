import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { campusOverview } from "@/lib/server/actions";

export const Route = createFileRoute("/campus/")({ component: Campus });

function Campus() {
  const [data, setData] = useState<Awaited<ReturnType<typeof campusOverview>> | null>(null);
  const [q, setQ] = useState("");
  useEffect(() => {
    campusOverview().then(setData);
  }, []);

  const students = (data?.students ?? []).filter((s) => {
    const hay = `${s.name} ${s.program} ${s.institution} ${s.seeking} ${s.skills.join(" ")}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-accent">Campus OS</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">Institution portal</h1>
        <p className="text-muted">
          List students for internships and fresher roles — real accounts, real exposure.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-subtle">Students</p>
          <p className="font-display text-3xl">{data?.students.length ?? 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-subtle">Drives</p>
          <p className="font-display text-3xl">{data?.drives.length ?? 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-subtle">Avg resume</p>
          <p className="font-display text-3xl">
            {data?.students.length
              ? Math.round(data.students.reduce((a, s) => a + s.resume_score, 0) / data.students.length)
              : 0}
          </p>
        </Card>
      </div>
      <section>
        <h2 className="mb-3 font-display text-xl">Placement drives</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {(data?.drives ?? []).map((d) => (
            <Card key={d.id} className="flex items-start justify-between">
              <div>
                <p className="font-medium">{d.title}</p>
                <p className="text-sm text-muted">
                  {d.company} · {d.drive_date}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {d.roles.map((r) => (
                    <Badge key={r}>{r}</Badge>
                  ))}
                </div>
              </div>
              <Badge tone={d.status === "upcoming" ? "accent" : "muted"}>{d.status}</Badge>
            </Card>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-3 font-display text-xl">Student talent</h2>
        <Input className="mb-4" placeholder="Search students" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="space-y-2">
          {students.map((s) => (
            <Card key={s.id} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-muted">
                  {s.program} Y{s.year} · {s.institution} · CGPA {s.cgpa}
                </p>
                <p className="text-xs text-subtle">
                  {s.seeking} · {s.skills.join(" · ")}
                </p>
              </div>
              <p className="font-display text-2xl text-accent">{s.resume_score}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
