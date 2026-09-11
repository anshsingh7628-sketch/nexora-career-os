import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { salaryBands } from "@/lib/server/actions";

export const Route = createFileRoute("/app/salary")({ component: Salary });

function Salary() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof salaryBands>>>([]);
  useEffect(() => {
    salaryBands().then(setRows);
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Career intelligence</h1>
        <p className="mt-1 text-muted">
          India tech compensation bands. Use them before you walk into an offer conversation.
        </p>
      </header>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wider text-subtle">
            <tr>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">P25</th>
              <th className="px-4 py-3 font-medium">Median</th>
              <th className="px-4 py-3 font-medium">P75</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.role + r.city} className="border-t border-border">
                <td className="px-4 py-3">{r.role}</td>
                <td className="px-4 py-3 text-muted">{r.city}</td>
                <td className="px-4 py-3 tabular-nums">₹{r.p25} LPA</td>
                <td className="px-4 py-3 tabular-nums text-accent">₹{r.p50} LPA</td>
                <td className="px-4 py-3 tabular-nums">₹{r.p75} LPA</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Card>
        <p className="font-medium">Weekly digest</p>
        <p className="mt-2 text-sm text-muted">
          SPM Bengaluru median ticked to ₹42 LPA. Two new 90%+ matches landed this week. Your ATS sits above
          industry average — close the skills gap on marketplace and SQL to cross 95.
        </p>
      </Card>
    </div>
  );
}
