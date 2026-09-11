import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <rect width="32" height="32" rx="8" fill="currentColor" className="text-accent" />
      <path
        d="M8 24V8h4.2l7.6 11.4V8H24v16h-4.2L12.2 12.6V24H8z"
        fill="#042f2e"
      />
    </svg>
  );
}

export function Wordmark({ compact }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 text-fg">
      <LogoMark />
      <span className="font-display text-xl tracking-tight">Nexora</span>
      {!compact && (
        <span className="hidden text-xs tracking-wide text-subtle sm:inline">Career OS</span>
      )}
    </Link>
  );
}
