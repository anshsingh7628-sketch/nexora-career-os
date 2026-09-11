import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { listInterviews, runInterviewTurn } from "@/lib/server/actions";

export const Route = createFileRoute("/app/interview")({ component: Interview });

const MODES = ["behavioral", "technical", "hr", "case", "system"] as const;

function Interview() {
  const [mode, setMode] = useState<(typeof MODES)[number]>("behavioral");
  const [role, setRole] = useState("Senior Product Manager");
  const [company, setCompany] = useState("Swiggy");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<{ q: string; a: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [past, setPast] = useState<Awaited<ReturnType<typeof listInterviews>>>([]);

  useEffect(() => {
    listInterviews().then(setPast).catch(() => setPast([]));
  }, [score]);

  async function start() {
    setBusy(true);
    setHistory([]);
    setScore(null);
    try {
      const r = await runInterviewTurn({ data: { role, company, mode, history: [] } });
      setQuestion(r.question);
    } finally {
      setBusy(false);
    }
  }

  async function send() {
    if (!answer.trim()) return;
    setBusy(true);
    const nextHist = [...history, { q: question, a: answer }];
    try {
      const r = await runInterviewTurn({
        data: { role, company, mode, answer, history: nextHist },
      });
      setHistory(nextHist);
      setQuestion(r.question);
      setAnswer("");
      if (r.done) setScore(r.score);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <h1 className="font-display text-3xl tracking-tight">AI interviewer</h1>
        <p className="text-muted">Five modes. One mind. Feedback after every answer.</p>
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full px-3 py-1.5 text-sm capitalize ${mode === m ? "bg-accent text-accent-fg" : "bg-elevated text-muted"}`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Target role" />
          <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" />
        </div>
        {!question ? (
          <Button disabled={busy} onClick={start}>
            Start session
          </Button>
        ) : (
          <Card className="space-y-4">
            <p className="text-xs uppercase tracking-wider text-subtle">Interviewer</p>
            <p className="text-lg leading-relaxed">{question}</p>
            {score != null && (
              <p className="font-display text-3xl text-accent">Score {score}</p>
            )}
            {score == null && (
              <>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Speak in writing. Metric first."
                />
                <Button disabled={busy} onClick={send}>
                  {busy ? "Listening…" : "Submit answer"}
                </Button>
              </>
            )}
          </Card>
        )}
        {history.length > 0 && (
          <div className="space-y-3">
            {history.map((h, i) => (
              <div key={i} className="rounded-lg border border-border p-3 text-sm">
                <p className="text-muted">{h.q}</p>
                <p className="mt-2">{h.a}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <aside className="space-y-3">
        <p className="text-xs uppercase tracking-wider text-subtle">Past sessions</p>
        {past.map((s) => (
          <Card key={s.id} className="p-4">
            <p className="text-sm font-medium">{s.role}</p>
            <p className="text-xs text-muted">
              {s.company} · {s.mode}
            </p>
            {s.score != null && <p className="mt-1 text-accent">{s.score}</p>}
          </Card>
        ))}
      </aside>
    </div>
  );
}
