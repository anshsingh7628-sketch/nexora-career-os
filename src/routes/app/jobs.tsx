import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/jobs")({ component: JobsLayout });

function JobsLayout() {
  return <Outlet />;
}
