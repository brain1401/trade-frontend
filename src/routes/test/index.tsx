import { createFileRoute } from "@tanstack/react-router";

function RouteComponent() {
  return <div>Hello "/test/"!</div>;
}

export const Route = createFileRoute("/test/")({
  component: RouteComponent,
});
