import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetExchangeRates } from "@/lib/api/exchange-rates";
import { TrendingUp } from "lucide-react";

import ExchangeRateTable from "@/components/exchange-rates/ExchangeRateTable";

/**
 * 환율 정보 라우트 정의
 */
export const Route = createFileRoute("/exchange-rates/")({
  component: ExchangeRatesPage,
});

/**
 * 환율 정보 페이지 컴포넌트
 */
function ExchangeRatesPage() {
  const { data, isLoading, error } = useGetExchangeRates();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center text-neutral-700">
        환율 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-danger-600 container mx-auto p-6 text-center">
        오류: {error.message}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
        >
          새로고침
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">실시간 환율</h1>
          <p className="text-neutral-600">주요 통화의 현재 환율을 확인하세요</p>
        </div>
      </div>

      <ExchangeRateTable data={data ?? []} />

      {/* 환율 정보 안내 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            환율 정보 안내
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 text-sm text-neutral-700">
            <div className="flex items-start gap-2">
              <span className="font-medium">• 기준 통화:</span>
              <span>원화(KRW) 기준 외국환 매매기준율</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">• 업데이트:</span>
              <span>매일 자정 업데이트되며, 영업일 기준으로 제공됩니다</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">• 활용:</span>
              <span>무역 거래 시 참고용으로 활용하시기 바랍니다</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
