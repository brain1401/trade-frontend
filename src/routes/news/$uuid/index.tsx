import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/news/$uuid/")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const uuid = params.uuid;

  return <div>Hello "/news/$uuid/"! {uuid}</div>;
}
