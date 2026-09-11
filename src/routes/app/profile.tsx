import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { loadProfile, saveProfile, type Profile } from "@/lib/server/actions";

export const Route = createFileRoute("/app/profile")({ component: ProfilePage });

function ProfilePage() {
  const [p, setP] = useState<Profile | null>(null);
  const [skills, setSkills] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadProfile().then((row) => {
      setP(row);
      setSkills(row.skills.join(", "));
    });
  }, []);

  if (!p) return <p className="text-muted">Loading profile…</p>;

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const next = await saveProfile({
      data: {
        ...p,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      },
    });
    setP(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  return (
    <form className="max-w-xl space-y-4" onSubmit={onSave}>
      <h1 className="font-display text-3xl tracking-tight">Profile</h1>
      <p className="text-muted">This is what matching, ATS, and recruiters read.</p>
      <Field label="Name">
        <Input value={p.display_name} onChange={(e) => setP({ ...p, display_name: e.target.value })} />
      </Field>
      <Field label="Headline">
        <Input value={p.headline} onChange={(e) => setP({ ...p, headline: e.target.value })} />
      </Field>
      <Field label="Target role">
        <Input value={p.target_role} onChange={(e) => setP({ ...p, target_role: e.target.value })} />
      </Field>
      <Field label="Location">
        <Input value={p.location} onChange={(e) => setP({ ...p, location: e.target.value })} />
      </Field>
      <Field label="Current company">
        <Input value={p.current_company} onChange={(e) => setP({ ...p, current_company: e.target.value })} />
      </Field>
      <Field label="Years of experience">
        <Input
          type="number"
          min={0}
          value={p.experience_years}
          onChange={(e) => setP({ ...p, experience_years: Number(e.target.value) })}
        />
      </Field>
      <Field label="Skills (comma separated)">
        <Input value={skills} onChange={(e) => setSkills(e.target.value)} />
      </Field>
      <Field label="Education">
        <Input value={p.education} onChange={(e) => setP({ ...p, education: e.target.value })} />
      </Field>
      <Field label="Bio">
        <Textarea value={p.bio} onChange={(e) => setP({ ...p, bio: e.target.value })} />
      </Field>
      <Button type="submit">Save profile</Button>
      {saved && <span className="ml-3 text-sm text-accent">Saved</span>}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
