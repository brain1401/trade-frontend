import { BarChart, type Color, type CustomTooltipProps } from "@tremor/react";
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
import CustomTooltip from "./CustomToolTip";
import { useCallback } from "react";

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

// TODO: 유저 경험을 위해 서버에서 애초에 번역해서 데이터 보내주는 식으로 변경 필요
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

  const customTooltipRenderer = useCallback(
    (...props: [CustomTooltipProps]) => (
      <CustomTooltip
        payload={{
          payload: undefined,
          active: undefined,
          label: undefined,
        }}
        active={false}
        {...props}
        category={category}
      />
    ),
    [category],
  );

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
            customTooltip={customTooltipRenderer}
          />
        )}
      </CardContent>
    </Card>
  );
}
