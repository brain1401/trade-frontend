import { BarChart, type Color } from "@tremor/react";
import type { Top } from "@/lib/api/statistics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { httpClient } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

type TradeBalanceChartProps = {
  title: string;
  data: Top[];
  category: string;
  color: Color;
};

// 긴 텍스트 자르기
const truncateText = (text: string, maxLength: number = 10): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
};

// 번역 API 호출 함수
const fetchTranslation = async (text: string): Promise<string> => {
  if (!text || text.trim() === "") {
    return text;
  }
  try {
    const response = await httpClient.post<{ translatedText: string }>(
      "/translate",
      { text },
    );
    return response.translatedText;
  } catch (error) {
    console.error(`'${text}' 번역 요청 실패:`, error);
    return text;
  }
};

const CustomTooltip = ({ payload, active, category }: any) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  const categoryPayload = payload[0];
  const value = categoryPayload.value;
  const originalName = categoryPayload.payload.originalName;

  return (
    <div className="rounded-tremor-default border-tremor-border bg-tremor-background text-tremor-content-strong shadow-tremor-dropdown max-w-xs translate-x-15 -translate-y-15 transform border p-2 whitespace-normal">
      <p className="font-semibold">{originalName}</p>
      <p className="text-tremor-content">
        {category}: {`$${(value / 10).toFixed(1)}B`}
      </p>
    </div>
  );
};

export function TradeBalanceChart({
  title,
  data,
  category,
  color,
}: TradeBalanceChartProps) {
  const translationQueries = useQueries({
    queries: data.map((item) => ({
      queryKey: ["translation", item.itemName],
      queryFn: () => fetchTranslation(item.itemName),
      staleTime: Infinity,
      enabled: !!item.itemName,
    })),
  });

  const isTranslationsLoading = translationQueries.some(
    (result) => result.isLoading,
  );

  const chartData = data.map((item, index) => {
    const translationResult = translationQueries[index];
    const translatedName =
      translationResult.isSuccess && translationResult.data
        ? translationResult.data
        : item.itemName;

    return {
      name: truncateText(translatedName, 10), // y축 라벨용 축약 이름
      originalName: translatedName, // 툴팁용 전체 이름
      [category]: item.totalValue / 100_000_000,
    };
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary-600" />
          {title}
        </CardTitle>
        <CardDescription>총 금액 기준 상위 카테고리</CardDescription>
      </CardHeader>
      <CardContent>
        {isTranslationsLoading ? (
          <div className="mt-4 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-5/6" />
            <Skeleton className="h-8 w-4/6" />
          </div>
        ) : (
          <BarChart
            className="mt-4 h-80"
            data={chartData}
            index="name"
            categories={[category]}
            colors={[color]}
            valueFormatter={(value: number) => `${(value / 10).toFixed(1)}B`}
            yAxisWidth={120}
            allowDecimals={false}
            layout="vertical"
            customTooltip={(props) => (
              <CustomTooltip {...props} category={category} />
            )}
          />
        )}
      </CardContent>
    </Card>
  );
}
