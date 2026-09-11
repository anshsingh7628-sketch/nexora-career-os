import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { hireOverview } from "@/lib/server/actions";

export const Route = createFileRoute("/hire/candidates")({ component: Candidates });

function Candidates() {
  const [q, setQ] = useState("");
  const [talent, setTalent] = useState<Awaited<ReturnType<typeof hireOverview>>["talent"]>([]);
  useEffect(() => {
    hireOverview().then((d) => setTalent(d.talent));
  }, []);

  const filtered = talent.filter((t) => {
    const hay = `${t.name} ${t.role} ${t.location} ${t.skills.join(" ")}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Talent intelligence</h1>
        <p className="text-muted">Ranked profiles. Skills graph. Notice period and expected CTC in one row.</p>
      </header>
      <Input placeholder="Search talent" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="space-y-3">
        {filtered.map((t) => (
          <Card key={t.id} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-medium">{t.name}</p>
              <p className="text-sm text-muted">
                {t.role} · {t.current_company} · {t.location} · {t.experience_years}y
              </p>
              <p className="mt-1 text-xs text-subtle">{t.education}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {t.skills.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </div>
            <div className="text-sm">
              <p className="font-display text-2xl text-accent">{t.score}</p>
              <p className="text-muted">
                {t.expected_ctc ? `₹${t.expected_ctc} LPA` : "CTC —"} · {t.notice_days ?? 0}d notice
              </p>
              <p className="text-xs capitalize text-subtle">{t.source}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
