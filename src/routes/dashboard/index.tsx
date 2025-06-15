import { createFileRoute } from "@tanstack/react-router";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <DashboardOverview />
    </div>
  );
}
