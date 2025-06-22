import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Globe,
  Package,
  TrendingUp,
} from "lucide-react";
import type { TradeStatisticsSummary } from "@/types/trade";

/**
 * 무역 통계 요약 프로퍼티 타입
 */
export type TradeOverviewSummaryProps = {
  /** 무역 통계 요약 데이터 */
  summary: TradeStatisticsSummary;
};

/**
 * 트렌드 아이콘 반환
 */
const getTrendIcon = (value: number) => {
  if (value > 0) {
    return <ArrowUpRight className="h-4 w-4 text-success-600" />;
  } else if (value < 0) {
    return <ArrowDownRight className="text-danger-600 h-4 w-4" />;
  }
  return <div className="h-4 w-4" />;
};

/**
 * 트렌드 색상 반환
 */
const getTrendColor = (value: number) => {
  if (value > 0) return "text-success-600";
  if (value < 0) return "text-danger-600";
  return "text-neutral-600";
};

/**
 * 무역 통계 요약 컴포넌트
 *
 * 전체 무역 통계를 4개 카드로 요약 표시
 * 수출액, 수입액, 무역수지, 무역규모와 각각의 성장률 포함
 */
export function TradeOverviewSummary({ summary }: TradeOverviewSummaryProps) {
  const overallTrade = summary.overallTrade;
  const growthRates = summary.growthRates;

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            총 수출액
          </CardTitle>
          <DollarSign className="h-4 w-4 text-primary-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            ${(overallTrade.totalExport / 1000000000).toFixed(0)}B
          </div>
          <div className="flex items-center text-xs">
            {getTrendIcon(growthRates.exportGrowth)}
            <span className={getTrendColor(growthRates.exportGrowth)}>
              {growthRates.exportGrowth > 0 ? "+" : ""}
              {growthRates.exportGrowth}% 전년 대비
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            총 수입액
          </CardTitle>
          <Package className="h-4 w-4 text-info-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            ${(overallTrade.totalImport / 1000000000).toFixed(0)}B
          </div>
          <div className="flex items-center text-xs">
            {getTrendIcon(growthRates.importGrowth)}
            <span className={getTrendColor(growthRates.importGrowth)}>
              {growthRates.importGrowth > 0 ? "+" : ""}
              {growthRates.importGrowth}% 전년 대비
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            무역수지
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-success-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            ${(overallTrade.tradeBalance / 1000000000).toFixed(0)}B
          </div>
          <p className="text-xs text-success-600">
            {overallTrade.tradeBalance > 0 ? "흑자" : "적자"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            무역규모
          </CardTitle>
          <Globe className="text-brand-600 h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            ${(overallTrade.tradeVolume / 1000000000000).toFixed(2)}T
          </div>
          <div className="flex items-center text-xs">
            {getTrendIcon(growthRates.volumeGrowth)}
            <span className={getTrendColor(growthRates.volumeGrowth)}>
              {growthRates.volumeGrowth > 0 ? "+" : ""}
              {growthRates.volumeGrowth}% 전년 대비
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
