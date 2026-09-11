import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { addPost, listConnections, listMessages, listPosts, loadProfile } from "@/lib/server/actions";
import { initials } from "@/lib/utils";

export const Route = createFileRoute("/app/network")({ component: Network });

function Network() {
  const [posts, setPosts] = useState<Awaited<ReturnType<typeof listPosts>>>([]);
  const [people, setPeople] = useState<Awaited<ReturnType<typeof listConnections>>>([]);
  const [inbox, setInbox] = useState<Awaited<ReturnType<typeof listMessages>>>([]);
  const [body, setBody] = useState("");
  const [name, setName] = useState("Member");
  const [role, setRole] = useState("Product");

  function reload() {
    listPosts().then(setPosts);
    listConnections()
      .then(setPeople)
      .catch(() => setPeople([]));
    listMessages()
      .then(setInbox)
      .catch(() => setInbox([]));
  }

  useEffect(() => {
    reload();
    loadProfile()
      .then((p) => {
        setName(p.display_name);
        setRole(p.headline || p.target_role);
      })
      .catch(() => {});
  }, []);

  async function publish() {
    await addPost({ data: { body, name, role } });
    setBody("");
    reload();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <h1 className="font-display text-3xl tracking-tight">Graph & feed</h1>
        <Card className="space-y-3">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share a working note — not a humblebrag."
          />
          <Button onClick={publish} disabled={!body.trim()}>
            Publish
          </Button>
        </Card>
        {posts.map((p) => (
          <Card key={p.id} className="flex gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-elevated text-sm text-accent">
              {p.author_letter}
            </div>
            <div>
              <p className="text-sm font-medium">{p.author_name}</p>
              <p className="text-xs text-subtle">{p.author_role}</p>
              <p className="mt-2 text-sm leading-relaxed">{p.body}</p>
              <p className="mt-2 text-xs text-subtle">
                {p.likes} recommends · {p.comments} replies
              </p>
            </div>
          </Card>
        ))}
      </div>
      <aside className="space-y-6">
        <section>
          <p className="mb-3 text-xs uppercase tracking-wider text-subtle">Inbox</p>
          <div className="space-y-2">
            {inbox.map((m) => (
              <Card key={m.id} className="p-4">
                <p className="text-sm font-medium">{m.subject}</p>
                <p className="text-xs text-muted">
                  {m.from_name} · {m.from_role}
                </p>
                <p className="mt-2 text-sm text-muted">{m.body}</p>
              </Card>
            ))}
          </div>
        </section>
        <section>
          <p className="mb-3 text-xs uppercase tracking-wider text-subtle">Network</p>
          <div className="space-y-2">
            {people.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
                <span className="grid size-8 place-items-center rounded-full bg-elevated text-xs">
                  {initials(p.person_name)}
                </span>
                <div>
                  <p className="text-sm">{p.person_name}</p>
                  <p className="text-xs text-subtle">
                    {p.person_role} · {p.person_company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
