import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Lightbulb } from "lucide-react";
import { getTradeStatisticsSummary } from "@/data/mock/trade-statistics";

/**
 * 예측 통계 위젯 컴포넌트
 *
 * AI 기반 무역 예측 분석 결과를 표시하는 위젯
 * 다음 분기 수출 예측, 리스크 지수, 추천 신뢰도 등의 정보를 제공
 */
export function PredictiveAnalytics() {
  const tradeStats = getTradeStatisticsSummary();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="text-brand-600 h-5 w-5" />
          AI 무역 예측 분석
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 예측 지표 */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <div className="text-sm text-neutral-600">다음 분기 수출 예측</div>
            <div className="text-2xl font-bold text-success-600">
              +{tradeStats.growthRates.exportGrowth + 2.3}%
            </div>
            <div className="text-xs text-neutral-500">현재 대비 상승 예상</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-neutral-600">리스크 지수</div>
            <div className="text-2xl font-bold text-warning-600">Medium</div>
            <div className="text-xs text-neutral-500">환율 변동 영향</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-neutral-600">추천 신뢰도</div>
            <div className="text-2xl font-bold text-info-600">87%</div>
            <div className="text-xs text-neutral-500">AI 모델 정확도</div>
          </div>
        </div>

        {/* AI 추천사항 */}
        <div className="space-y-3">
          <h4 className="font-medium text-neutral-800">AI 추천사항</h4>
          <div className="space-y-2">
            {[
              "전자제품 수출 확대 시점: 2월 중순 이후",
              "중국 시장 진출 리스크 관리 필요",
              "환율 헤지 상품 검토 권장",
            ].map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2">
                <Lightbulb className="text-brand-600 mt-0.5 h-4 w-4 flex-shrink-0" />
                <span className="text-sm text-neutral-700">
                  {recommendation}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
