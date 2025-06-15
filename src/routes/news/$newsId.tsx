import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/news/$newsId")({
  component: NewsDetailPage,
});

function NewsDetailPage() {
  const { newsId } = Route.useParams();

  return (
    <div className="container mx-auto py-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="border-l-4 border-primary-600 pl-4">
          <h1 className="text-2xl font-bold text-neutral-800">뉴스 상세</h1>
          <p className="mt-2 text-neutral-600">뉴스 ID: {newsId}</p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-4">
            <div className="border-b border-neutral-100 pb-4">
              <h2 className="mb-2 text-xl font-semibold text-neutral-800">
                뉴스 제목 (예시)
              </h2>
              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <span>출처: 관세청</span>
                <span>•</span>
                <span>2024년 12월 19일</span>
                <span>•</span>
                <span>조회수: 1,234</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="leading-relaxed text-neutral-700">
                뉴스 본문 내용이 여기에 표시됩니다. 실제 구현은 Phase 2에서
                진행될 예정입니다.
              </p>
            </div>

            <div className="border-t border-neutral-100 pt-4">
              <h3 className="mb-3 text-lg font-semibold text-neutral-800">
                AI 요약 및 분석
              </h3>
              <div className="rounded-lg bg-neutral-50 p-4">
                <p className="text-neutral-600">
                  Claude AI가 생성한 뉴스 요약 및 비즈니스 영향 분석이 여기에
                  표시됩니다.
                </p>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-4">
              <h3 className="mb-3 text-lg font-semibold text-neutral-800">
                관련 HS Code
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-700">
                  8471.30
                </span>
                <span className="rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-700">
                  8542.31
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-neutral-50 p-6 text-center">
          <p className="text-neutral-500">
            ⚠️ 이 페이지는 Phase 2에서 완전히 구현될 예정입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
