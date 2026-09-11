import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/learn")({ component: LearnLayout });

function LearnLayout() {
  return <Outlet />;
}
