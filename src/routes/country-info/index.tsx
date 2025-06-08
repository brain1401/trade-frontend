import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/country-info/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/country-info/"!</div>;
}
