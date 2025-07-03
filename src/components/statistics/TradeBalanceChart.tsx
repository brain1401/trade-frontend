import { BarChart } from "@tremor/react";
import type { Top } from "@/lib/api/statistics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

type TradeBalanceChartProps = {
  data: Top[];
};

/**
 * 월별 무역수지 차트 컴포넌트
 */
export function TradeBalanceChart({ data }: TradeBalanceChartProps) {
  const chartData = data.map((item) => ({
    name: item.itemName,
    "수출액(억 달러)": item.totalValue / 100_000_000,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary-600" />
          주요 수출 카테고리
        </CardTitle>
        <CardDescription>총 수출액 기준 상위 카테고리</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          className="mt-4 h-80"
          data={chartData}
          index="name"
          categories={["수출액(억 달러)"]}
          colors={["blue"]}
          valueFormatter={(value: number) => `${(value / 10).toFixed(1)}B`}
          yAxisWidth={48}
        />
      </CardContent>
    </Card>
  );
}
