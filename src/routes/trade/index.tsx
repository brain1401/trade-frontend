import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trade/")({
  component: TradeInfoHubPage,
});

function TradeInfoHubPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="border-l-4 border-primary-600 pl-4">
          <h1 className="text-2xl font-bold text-neutral-800">
            무역 정보 허브
          </h1>
          <p className="mt-2 text-neutral-600">
            무역 관련 모든 정보를 한 곳에서 확인하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-neutral-800">
              규제 정보
            </h3>
            <p className="text-neutral-600">최신 무역 규제 및 정책 정보</p>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-neutral-800">
              관세 환율
            </h3>
            <p className="text-neutral-600">실시간 관세 환율 정보</p>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-neutral-800">
              무역 통계
            </h3>
            <p className="text-neutral-600">국가별, 품목별 무역 통계</p>
          </div>
        </div>

        <div className="rounded-lg bg-neutral-50 p-6 text-center">
          <p className="text-neutral-500">
            ⚠️ 이 페이지는 Phase 4에서 완전히 구현될 예정입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
