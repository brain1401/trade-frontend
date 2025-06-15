import { createFileRoute } from "@tanstack/react-router";
import { StatisticCharts } from "@/components/trade/StatisticCharts";

export const Route = createFileRoute("/trade/statistics")({
  component: TradeStatisticsPage,
});

function TradeStatisticsPage() {
  return (
    <div className="container mx-auto py-6">
      <StatisticCharts />
    </div>
  );
}
