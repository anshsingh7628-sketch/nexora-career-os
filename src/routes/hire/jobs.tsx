import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { hireOverview, listCompanies, postJob } from "@/lib/server/actions";
import { formatLpa } from "@/lib/utils";

export const Route = createFileRoute("/hire/jobs")({ component: HireJobs });

function HireJobs() {
  const [jobs, setJobs] = useState<Awaited<ReturnType<typeof hireOverview>>["jobs"]>([]);
  const [companies, setCompanies] = useState<Awaited<ReturnType<typeof listCompanies>>>([]);
  const [title, setTitle] = useState("");
  const [companyId, setCompanyId] = useState("swiggy");
  const [location, setLocation] = useState("Bengaluru");
  const [seniority, setSeniority] = useState("Mid");
  const [min, setMin] = useState(20);
  const [max, setMax] = useState(32);
  const [skills, setSkills] = useState("SQL, Roadmap, Stakeholder Mgmt");
  const [description, setDescription] = useState("");

  function load() {
    hireOverview().then((d) => setJobs(d.jobs));
    listCompanies().then(setCompanies);
  }
  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await postJob({
      data: {
        title,
        companyId,
        location,
        seniority,
        salary_min: min,
        salary_max: max,
        skills,
        description,
      },
    });
    setTitle("");
    setDescription("");
    load();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div>
        <h1 className="font-display text-3xl tracking-tight">Requisitions</h1>
        <div className="mt-6 space-y-3">
          {jobs.map((j) => (
            <Card key={j.id} className="flex items-start justify-between gap-3 p-4">
              <div>
                <p className="font-medium">{j.title}</p>
                <p className="text-sm text-muted">
                  {j.company} · {j.location} · {formatLpa(j.salary_min, j.salary_max)}
                </p>
              </div>
              <span className="text-xs text-subtle">{j.seniority}</span>
            </Card>
          ))}
        </div>
      </div>
      <form className="space-y-3 rounded-xl border border-border bg-surface p-5" onSubmit={submit}>
        <p className="font-medium">Post a role</p>
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Company</Label>
          <select
            className="h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Location</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label>Min LPA</Label>
            <Input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} />
          </div>
          <div className="space-y-1.5">
            <Label>Max LPA</Label>
            <Input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Skills</Label>
          <Input value={skills} onChange={(e) => setSkills(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <Button type="submit" className="w-full">
          Publish
        </Button>
      </form>
    </div>
  );
}
