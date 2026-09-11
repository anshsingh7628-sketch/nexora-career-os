import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const STAGES = [
  { id: "profile", label: "Profile" },
  { id: "resume", label: "Resume" },
  { id: "apply", label: "Apply" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
] as const;

export function ProgressLine({
  current,
  done,
}: {
  current: number;
  done?: number[];
}) {
  return (
    <ol className="flex w-full min-w-0 items-center gap-0">
      {STAGES.map((s, i) => {
        const complete = (done ?? []).includes(i) || i < current;
        const active = i === current;
        return (
          <li key={s.id} className="flex min-w-0 flex-1 items-center">
            <div className="flex min-w-0 flex-col items-center gap-2">
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full border text-xs font-medium",
                  complete && "border-accent bg-accent text-accent-fg",
                  active && !complete && "border-accent bg-elevated text-accent",
                  !complete && !active && "border-border bg-surface text-subtle",
                )}
              >
                {complete ? <Check className="size-3.5" strokeWidth={2.5} /> : i + 1}
              </span>
              <span
                className={cn(
                  "max-w-[4.2rem] truncate text-center text-[10px] tracking-wide sm:text-[11px]",
                  active || complete ? "text-fg" : "text-subtle",
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div
                className={cn(
                  "mb-6 h-px min-w-4 flex-1",
                  i < current ? "bg-accent" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
