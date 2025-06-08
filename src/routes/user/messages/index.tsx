import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/messages/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/user/messages/"!</div>;
}
