import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, TrendingUp } from "lucide-react";

/**
 * 무역 통계 요약 프로퍼티 타입
 */
export type TradeOverviewSummaryProps = {
  exportValue: number;
  importValue: number;
};

/**
 * 무역 통계 요약 컴포넌트
 *
 * 전체 무역 통계를 2개 카드로 요약 표시
 * 수출액, 수입액, 무역수지를 포함
 */
export function TradeOverviewSummary({
  exportValue,
  importValue,
}: TradeOverviewSummaryProps) {
  const tradeBalance = exportValue - importValue;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            총 수출액
          </CardTitle>
          <DollarSign className="h-4 w-4 text-primary-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            ${(exportValue / 1000000000).toFixed(1)}B
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
            ${(importValue / 1000000000).toFixed(1)}B
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
          <div
            className={`text-2xl font-bold ${
              tradeBalance >= 0 ? "text-success-600" : "text-danger-600"
            }`}
          >
            ${(tradeBalance / 1000000000).toFixed(1)}B
          </div>
          <p
            className={`text-xs ${
              tradeBalance >= 0 ? "text-success-600" : "text-danger-600"
            }`}
          >
            {tradeBalance >= 0 ? "흑자" : "적자"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
