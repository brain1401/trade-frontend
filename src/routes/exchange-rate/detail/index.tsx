import { createFileRoute } from "@tanstack/react-router";
import ContentCard from "@/components/common/ContentCard";
import {
  ExchangeCalculator,
  ExchangeRateNewsCard,
  ExchangeRateTable,
} from "@/components/exchange-rate";
import { mockGlobalExchangeRates } from "@/data/mockData";

export const Route = createFileRoute("/exchange-rate/detail/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full space-y-6">
      {/* 메인 환율 테이블 - 전체 너비 활용 */}
      <ExchangeRateTable />

      {/* 보조 기능들 - 그리드 레이아웃 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 환율 계산기 */}
        <ExchangeCalculator />

        {/* 환율 뉴스 */}
        <ExchangeRateNewsCard />

        {/* 환율 정보 카드 */}
        <ContentCard title="환율 정보">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">데이터 제공</span>
              <span className="text-neutral-800">관세청 API</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">업데이트 주기</span>
              <span className="text-neutral-800">실시간</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">기준 시간</span>
              <span className="text-neutral-800">KST</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">지원 통화</span>
              <span className="text-neutral-800">
                {mockGlobalExchangeRates.length}개
              </span>
            </div>
          </div>
          <div className="mt-4 border-t border-neutral-100 pt-3">
            <p className="text-xs leading-relaxed text-neutral-500">
              환율 정보는 관세청에서 제공하는 관세환율을 기준으로 하며, 실제
              금융기관의 환전 환율과는 차이가 있을 수 있습니다.
            </p>
          </div>
        </ContentCard>
      </div>
    </div>
  );
}
