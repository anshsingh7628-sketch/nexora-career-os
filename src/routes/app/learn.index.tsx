import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardMeta, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { enrollCourse, listCourses, myEnrollments } from "@/lib/server/actions";

export const Route = createFileRoute("/app/learn/")({ component: Learn });

function Learn() {
  const [courses, setCourses] = useState<Awaited<ReturnType<typeof listCourses>>>([]);
  const [enroll, setEnroll] = useState<Record<string, number>>({});

  useEffect(() => {
    listCourses().then(setCourses);
    myEnrollments()
      .then((rows) => {
        const m: Record<string, number> = {};
        for (const r of rows) m[r.course_id] = Number(r.progress);
        setEnroll(m);
      })
      .catch(() => {});
  }, []);

  async function start(id: string) {
    const next = Math.min(100, (enroll[id] ?? 0) + 20);
    await enrollCourse({ data: { courseId: id, progress: next || 12 } });
    setEnroll((e) => ({ ...e, [id]: next || 12 }));
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Learning OS</h1>
        <p className="mt-1 text-muted">Courses that close the gaps your matches keep flagging.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map((c) => (
          <Card key={c.id} className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <CardTitle>{c.title}</CardTitle>
              <Badge>{c.level}</Badge>
            </div>
            <CardMeta className="mt-1">
              {c.provider} · {c.hours}h · {Number(c.rating).toFixed(1)} ·{" "}
              {c.learners.toLocaleString("en-IN")} learners
            </CardMeta>
            <p className="mt-3 flex-1 text-sm text-muted">{c.description}</p>
            {enroll[c.id] != null && <Progress value={enroll[c.id]} className="mt-4" />}
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={() => start(c.id)}>
                {enroll[c.id] ? "Continue" : "Enroll"}
              </Button>
              <Link to="/app/learn/$courseId" params={{ courseId: c.id }} className="text-sm text-muted hover:text-fg">
                Syllabus
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
