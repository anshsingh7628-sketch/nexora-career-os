import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { addPost, listPosts, loadProfile } from "@/lib/server/actions";

export const Route = createFileRoute("/community/")({ component: Community });

function Community() {
  const [posts, setPosts] = useState<Awaited<ReturnType<typeof listPosts>>>([]);
  const [body, setBody] = useState("");
  const [name, setName] = useState("Member");
  const [role, setRole] = useState("Community");

  function reload() {
    listPosts().then(setPosts);
  }
  useEffect(() => {
    reload();
    loadProfile()
      .then((p) => {
        setName(p.display_name);
        setRole(p.headline || "Nexora member");
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-accent">Community</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">Feed + Learning OS</h1>
        <p className="text-muted">Not sure yet? Use the feed and courses, then pick Seeker or Hire when you’re ready.</p>
      </header>
      <Card className="space-y-3">
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write to the floor." />
        <Button
          onClick={async () => {
            await addPost({ data: { body, name, role } });
            setBody("");
            reload();
          }}
          disabled={!body.trim()}
        >
          Post
        </Button>
      </Card>
      {posts.map((p) => (
        <Card key={p.id} className="flex gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-elevated text-accent">
            {p.author_letter}
          </div>
          <div>
            <p className="text-sm font-medium">{p.author_name}</p>
            <p className="text-xs text-subtle">{p.author_role}</p>
            <p className="mt-2 leading-relaxed">{p.body}</p>
          </div>
        </Card>
      ))}
      <Link to="/app/learn" className="inline-block text-sm text-accent">
        Open Learning OS →
      </Link>
    </div>
  );
}
