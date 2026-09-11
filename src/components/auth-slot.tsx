import { Link } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-8 w-24 animate-pulse rounded-full bg-elevated" />;
  }
  if (user) {
    return (
      <div className="max-w-[220px] truncate text-sm text-muted [&_button]:text-subtle [&_button]:hover:text-fg">
        <UserButton />
      </div>
    );
  }
  return (
    <Link
      to="/login"
      className="inline-flex h-11 items-center rounded-md border border-border px-4 text-sm font-medium text-fg hover:bg-elevated"
    >
      Sign in
    </Link>
  );
}
