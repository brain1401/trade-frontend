import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/qna/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/qna/"!</div>;
}
