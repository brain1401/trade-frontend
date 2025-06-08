import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/news/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>News</h1>
    </div>
  );
}
