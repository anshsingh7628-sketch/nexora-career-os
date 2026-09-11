import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { enrollCourse, listCourses } from "@/lib/server/actions";

export const Route = createFileRoute("/app/learn/$courseId")({ component: Course });

function Course() {
  const { courseId } = Route.useParams();
  const [course, setCourse] = useState<Awaited<ReturnType<typeof listCourses>>[number] | null>(null);

  useEffect(() => {
    listCourses().then((all) => setCourse(all.find((c) => c.id === courseId) ?? null));
  }, [courseId]);

  if (!course) return <p className="text-muted">Loading course…</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <Link to="/app/learn" className="text-sm text-muted hover:text-fg">
        ← Learning OS
      </Link>
      <h1 className="font-display text-3xl tracking-tight">{course.title}</h1>
      <p className="text-muted">{course.description}</p>
      <ol className="space-y-2">
        {course.modules.map((m, i) => (
          <li key={m} className="flex gap-3 rounded-lg border border-border bg-surface px-4 py-3">
            <span className="text-subtle tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            {m}
          </li>
        ))}
      </ol>
      <Button onClick={() => enrollCourse({ data: { courseId, progress: 20 } })}>Enroll and start</Button>
    </div>
  );
}
