import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { analyzeResumeAi, getResume, saveResume } from "@/lib/server/actions";

export const Route = createFileRoute("/app/resume")({ component: ResumeStudio });

function ResumeStudio() {
  const [content, setContent] = useState("");
  const [scores, setScores] = useState({
    overall: 0,
    keyword: 0,
    experience: 0,
    skills: 0,
    format: 0,
    gaps: [] as string[],
    narrative: "",
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getResume().then((r) => {
      if (!r) return;
      setContent(r.content);
      setScores({
        overall: r.ats_score,
        keyword: r.keyword_score,
        experience: r.experience_score,
        skills: r.skills_score,
        format: r.format_score,
        gaps: r.suggestions,
        narrative: "",
      });
    });
  }, []);

  async function run(ai: boolean) {
    setBusy(true);
    try {
      const ats = await saveResume({ data: { content, targetRole: "Senior Product Manager" } });
      if (ai) {
        const full = await analyzeResumeAi({
          data: { content, targetRole: "Senior Product Manager" },
        });
        setScores({ ...full, gaps: full.gaps, narrative: full.narrative });
      } else {
        setScores({ ...ats, gaps: ats.gaps, narrative: "" });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <h1 className="font-display text-3xl tracking-tight">Resume studio</h1>
        <p className="mt-1 text-muted">ATS-safe scoring. Keyword, experience, skills, format — then rewrite.</p>
        <Textarea
          className="mt-6 min-h-[480px] font-mono text-xs"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="mt-3 flex gap-2">
          <Button disabled={busy} onClick={() => run(false)}>
            Score ATS
          </Button>
          <Button variant="secondary" disabled={busy} onClick={() => run(true)}>
            {busy ? "Analyzing…" : "AI rewrite notes"}
          </Button>
        </div>
      </div>
      <Card>
        <p className="text-xs uppercase tracking-wider text-subtle">ATS score</p>
        <p className="font-display text-5xl text-accent">{scores.overall}</p>
        <p className="mt-1 text-sm text-muted">Industry average sits near 72. Aim for 95.</p>
        <div className="mt-6 space-y-3">
          {(
            [
              ["Keyword match", scores.keyword],
              ["Experience fit", scores.experience],
              ["Skills alignment", scores.skills],
              ["Format", scores.format],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <div className="mb-1 flex justify-between text-xs text-muted">
                <span>{k}</span>
                <span className="tabular-nums">{v}%</span>
              </div>
              <Progress value={v} />
            </div>
          ))}
        </div>
        <ul className="mt-6 space-y-2 text-sm text-muted">
          {scores.gaps.map((g) => (
            <li key={g}>· {g}</li>
          ))}
        </ul>
        {scores.narrative && (
          <p className="mt-4 whitespace-pre-wrap text-sm text-fg/90">{scores.narrative}</p>
        )}
      </Card>
    </div>
  );
}
