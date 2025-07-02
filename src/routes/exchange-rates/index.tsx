import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exchangeRatesQueries } from "@/lib/api/exchange-rates";
import { TrendingUp } from "lucide-react";

import ExchangeRateTable from "@/components/exchange-rates/ExchangeRateTable";
import { useQuery } from "@tanstack/react-query";

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
  // ✨ 새로운 편리한 API: undefined를 전달할 필요 없음!
  // 기본 사용: 전역 설정 적용
  // - retry: 3번 (오류 발생 시 자동 재시도)
  // - refetchOnMount: true (컴포넌트 마운트 시 자동 캐시 리벨리데이션)
  // - staleTime: 30초 (환율 특화 설정)
  const { data, isLoading, error } = useQuery(exchangeRatesQueries.list());

  // 📖 다양한 사용 예시:
  //
  // 1. 기본 사용 (파라미터도 옵션도 없음)
  // const { data } = useGetExchangeRates();
  //
  // 2. 특정 통화만 조회
  // const { data } = useGetExchangeRates({
  //   params: { currencies: "USD,EUR,JPY" }
  // });
  //
  // 3. 마운트 시 자동 refetch 비활성화 (캐시된 데이터만 사용)
  // const { data } = useGetExchangeRates({
  //   refetchOnMount: false
  // });
  //
  // 4. 특정 조건에서만 마운트 시 refetch
  // const { data } = useGetExchangeRates({
  //   refetchOnMount: (query) => {
  //     // 예: 캐시된 데이터가 1분 이상 오래된 경우에만 refetch
  //     return Date.now() - query.state.dataUpdatedAt > 60000;
  //   }
  // });
  //
  // 5. 실시간 모드 (매우 짧은 staleTime + 자동 refetch)
  // const { data } = useGetExchangeRates({
  //   staleTime: 5000, // 5초마다 데이터를 fresh로 간주
  //   refetchInterval: 10000 // 10초마다 자동 refetch
  // });
  //
  // 6. 복합 설정 (특정 통화 + 옵션들)
  // const { data } = useGetExchangeRates({
  //   params: { currencies: "USD,EUR", cache: true },
  //   refetchOnMount: false,
  //   staleTime: 30000,
  //   enabled: someCondition
  // });

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
