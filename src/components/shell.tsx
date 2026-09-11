import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Briefcase,
  Building2,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  Menu,
  MessageSquare,
  Mic,
  Network,
  Newspaper,
  ScanSearch,
  Users,
  BookOpen,
  Kanban,
  Landmark,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Wordmark } from "@/components/brand";
import { AuthSlot } from "@/components/auth-slot";
import { cn } from "@/lib/utils";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

type NavItem = { to: string; label: string; icon: typeof Briefcase };

const SEEKER: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/jobs", label: "Jobs", icon: Briefcase },
  { to: "/app/internships", label: "Internships", icon: GraduationCap },
  { to: "/app/tracker", label: "Tracker", icon: Kanban },
  { to: "/app/resume", label: "Resume studio", icon: ScanSearch },
  { to: "/app/interview", label: "Interview", icon: Mic },
  { to: "/app/learn", label: "Learn", icon: BookOpen },
  { to: "/app/network", label: "Network", icon: Network },
  { to: "/app/salary", label: "Intelligence", icon: LineChart },
  { to: "/app/profile", label: "Profile", icon: Users },
];

const HIRE: NavItem[] = [
  { to: "/hire", label: "Command", icon: LayoutDashboard },
  { to: "/hire/jobs", label: "Requisitions", icon: Briefcase },
  { to: "/hire/pipeline", label: "Pipeline", icon: Kanban },
  { to: "/hire/candidates", label: "Talent", icon: ScanSearch },
  { to: "/hire/people", label: "People OS", icon: Landmark },
];

const CAMPUS: NavItem[] = [
  { to: "/campus", label: "Campus", icon: GraduationCap },
];

const COMMUNITY: NavItem[] = [
  { to: "/community", label: "Feed", icon: Newspaper },
  { to: "/app/learn", label: "Learning OS", icon: BookOpen },
  { to: "/app/network", label: "Graph", icon: Network },
];

const PORTALS = [
  { id: "seeker", label: "Seeker", to: "/app" },
  { id: "hire", label: "Hire", to: "/hire" },
  { id: "campus", label: "Campus", to: "/campus" },
  { id: "community", label: "Community", to: "/community" },
] as const;

function navFor(pathname: string): NavItem[] {
  if (pathname.startsWith("/hire")) return HIRE;
  if (pathname.startsWith("/campus")) return CAMPUS;
  if (pathname.startsWith("/community")) return COMMUNITY;
  return SEEKER;
}

function portalId(pathname: string) {
  if (pathname.startsWith("/hire")) return "hire";
  if (pathname.startsWith("/campus")) return "campus";
  if (pathname.startsWith("/community")) return "community";
  return "seeker";
}

export function AppShell({ children }: { children?: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const items = navFor(pathname);
  const portal = portalId(pathname);

  if (isPending) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg text-muted">
        Loading workspace…
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-bg/90 px-4 backdrop-blur md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="grid size-11 place-items-center rounded-md border border-border md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-4" />
          </button>
          <Wordmark compact />
        </div>
        <nav className="hidden items-center gap-1 md:flex">
          {PORTALS.map((p) => (
            <Link
              key={p.id}
              to={p.to}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm",
                portal === p.id ? "bg-elevated text-fg" : "text-muted hover:text-fg",
              )}
            >
              {p.label}
            </Link>
          ))}
        </nav>
        <div className="shrink-0">
          <AuthSlot />
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto border-r border-border p-3 md:block">
          <NavList items={items} pathname={pathname} />
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8">{children ?? <Outlet />}</main>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-bg/70"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-border bg-surface p-4">
            <div className="mb-4 flex items-center justify-between">
              <Wordmark compact />
              <button type="button" className="size-11" onClick={() => setOpen(false)} aria-label="Close">
                <X className="size-4" />
              </button>
            </div>
            <div className="mb-4 flex flex-wrap gap-1">
              {PORTALS.map((p) => (
                <Link
                  key={p.id}
                  to={p.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm",
                    portal === p.id ? "bg-elevated text-fg" : "text-muted",
                  )}
                >
                  {p.label}
                </Link>
              ))}
            </div>
            <NavList items={items} pathname={pathname} onClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function NavList({
  items,
  pathname,
  onClick,
}: {
  items: NavItem[];
  pathname: string;
  onClick?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-0.5">
      {items.map((item) => {
        const active =
          item.to === "/app" || item.to === "/hire" || item.to === "/campus" || item.to === "/community"
            ? pathname === item.to
            : pathname === item.to || pathname.startsWith(item.to + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClick}
            className={cn(
              "flex h-11 items-center gap-2.5 rounded-md px-3 text-sm",
              active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/60 hover:text-fg",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
      <Link
        to="/app/network"
        className="mt-2 flex h-11 items-center gap-2.5 rounded-md px-3 text-sm text-muted hover:bg-elevated/60"
      >
        <MessageSquare className="size-4" />
        Inbox
      </Link>
      <p className="mt-6 px-3 text-[11px] uppercase tracking-wider text-subtle">Portals</p>
      <Link to="/hire" className="flex h-11 items-center gap-2.5 rounded-md px-3 text-sm text-muted hover:bg-elevated/60">
        <Building2 className="size-4" /> Recruiter ATS
      </Link>
    </nav>
  );
}
