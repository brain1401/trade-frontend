import { createFileRoute, Link } from "@tanstack/react-router";
import ContentCard from "@/components/common/ContentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookmarkPlus, Share2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/news/$newsId")({
  component: NewsDetailPage,
});

// 상수 정의 (기존 메인 페이지 패턴 준수)
const LINK_BUTTON_BASE_CLASSES = "h-auto p-0 text-sm hover:underline";
const CARD_SPACING_CLASSES = "mt-8";

function NewsDetailPage() {
  const { newsId } = Route.useParams();

  // 목업 뉴스 데이터 (실제로는 API에서 가져올 데이터)
  const mockNewsDetail = {
    id: newsId,
    title: "2024년 수출입 신규 규제 시행 안내",
    summary:
      "새로운 품질인증 절차가 2024년 3월부터 시행됩니다. 전자제품 및 화학제품에 대한 추가 검사가 필요할 예정입니다.",
    content: `
관세청은 2024년 3월 1일부터 새로운 품질인증 절차를 시행한다고 발표했습니다. 이번 규제는 전자제품과 화학제품의 안전성을 강화하기 위한 조치로, 수출입 업체들은 추가적인 인증 절차를 준비해야 합니다.

주요 변경사항은 다음과 같습니다:

1. 전자제품 (HS Code 84-85류): EMC(전자파적합성) 인증 의무화
2. 화학제품 (HS Code 28-38류): 안전성 평가서 제출 의무
3. 인증 처리 기간: 기존 5일 → 10일로 연장
4. 수수료: 기존 대비 20% 인상

수출입 업체들은 새로운 규제에 대비하여 미리 준비하시기 바랍니다. 자세한 내용은 관세청 홈페이지를 참조하거나 관할 세관에 문의하시기 바랍니다.
    `,
    source: "관세청",
    publishedAt: "2024-01-15T09:00:00Z",
    category: "regulation",
    priority: "high",
    tags: ["규제", "품질인증", "전자제품", "화학제품"],
    isBookmarked: false,
    viewCount: 1234,
    relatedHsCodes: ["8471.30", "8542.31", "2801.10", "3801.20"],
    aiSummary:
      "이번 규제는 한국의 수출입 안전성을 강화하는 중요한 조치입니다. 특히 전자제품과 화학제품 분야의 수출입 업체들은 새로운 인증 절차에 대비한 선제적 준비가 필요합니다. 인증 처리 기간이 연장되므로 납기일정을 재조정하는 것이 권장됩니다.",
  };

  let badgeVariant: "secondary" | "destructive" | "default" = "secondary";
  if (mockNewsDetail.category === "regulation") badgeVariant = "destructive";
  else if (mockNewsDetail.category === "trade") badgeVariant = "default";

  return (
    <>
      {/* 메인 레이아웃: 기존 메인 페이지와 동일한 2/3 + 1/3 구조 */}
      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-2/3">
          {/* 뒤로가기 및 제목 */}
          <ContentCard title="뉴스 상세">
            <div className="space-y-4">
              <Button
                variant="link"
                asChild
                className={cn(LINK_BUTTON_BASE_CLASSES, "text-neutral-600")}
              >
                <Link to="/news">
                  <ArrowLeft size={16} className="mr-1" />
                  뉴스 목록으로
                </Link>
              </Button>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={badgeVariant}
                    className="rounded-full px-2 py-0.5 text-xs font-medium"
                  >
                    {mockNewsDetail.category}
                  </Badge>
                  {mockNewsDetail.priority === "high" && (
                    <Badge
                      variant="destructive"
                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                    >
                      중요
                    </Badge>
                  )}
                </div>

                <h1 className="text-lg font-semibold text-neutral-800">
                  {mockNewsDetail.title}
                </h1>

                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-800">
                      {mockNewsDetail.source}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-neutral-800">
                      <Calendar className="h-3 w-3" />
                      {new Date(mockNewsDetail.publishedAt).toLocaleDateString(
                        "ko-KR",
                      )}
                    </span>
                    <span>•</span>
                    <span className="text-neutral-800">
                      조회수 {mockNewsDetail.viewCount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-auto p-1">
                      <BookmarkPlus
                        className={`h-4 w-4 ${mockNewsDetail.isBookmarked ? "fill-current text-primary-600" : "text-neutral-400"}`}
                      />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-auto p-1">
                      <Share2 className="h-4 w-4 text-neutral-400" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ContentCard>

          {/* 뉴스 본문 */}
          <ContentCard title="본문" className={CARD_SPACING_CLASSES}>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed font-medium text-neutral-700">
                {mockNewsDetail.summary}
              </p>
              <div className="prose max-w-none">
                <div className="text-sm leading-relaxed whitespace-pre-line text-neutral-600">
                  {mockNewsDetail.content}
                </div>
              </div>
            </div>
          </ContentCard>

          {/* AI 요약 및 분석 */}
          <ContentCard title="AI 요약 및 분석" className={CARD_SPACING_CLASSES}>
            <div className="rounded-lg bg-neutral-50 p-4">
              <p className="text-sm leading-relaxed text-neutral-600">
                {mockNewsDetail.aiSummary}
              </p>
            </div>
          </ContentCard>
        </div>

        {/* 사이드바 */}
        <aside className="mt-8 lg:mt-0 lg:w-1/3">
          {/* 관련 HS Code */}
          <ContentCard title="관련 HS Code">
            <div className="space-y-2">
              {mockNewsDetail.relatedHsCodes.map((hsCode) => (
                <div
                  key={hsCode}
                  className="border-b border-neutral-100 py-1.5 last:border-0"
                >
                  <Button
                    variant="link"
                    asChild
                    className={cn(
                      LINK_BUTTON_BASE_CLASSES,
                      "text-neutral-700 hover:text-primary-600",
                    )}
                  >
                    <Link
                      to="/hscode/result/$resultId"
                      params={{ resultId: `result-${hsCode}` }}
                    >
                      {hsCode}
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </ContentCard>

          {/* 태그 */}
          <ContentCard title="태그" className={CARD_SPACING_CLASSES}>
            <div className="flex flex-wrap gap-2">
              {mockNewsDetail.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer text-xs hover:bg-neutral-50"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </ContentCard>

          {/* 관련 뉴스 */}
          <ContentCard title="관련 뉴스" className={CARD_SPACING_CLASSES}>
            <div className="space-y-2">
              {[
                {
                  id: "2",
                  title: "미국-중국 무역 협정 업데이트",
                  category: "trade",
                },
                {
                  id: "3",
                  title: "EU 탄소국경세 시행 임박",
                  category: "policy",
                },
                {
                  id: "4",
                  title: "아시아 반도체 시장 동향 분석",
                  category: "market",
                },
              ].map((news) => (
                <div
                  key={news.id}
                  className="border-b border-neutral-100 py-1.5 last:border-0"
                >
                  <Button
                    variant="link"
                    asChild
                    className={cn(
                      LINK_BUTTON_BASE_CLASSES,
                      "text-left text-neutral-700 hover:text-primary-600",
                    )}
                  >
                    <Link to="/news/$newsId" params={{ newsId: news.id }}>
                      <div className="space-y-1">
                        <div className="text-sm">{news.title}</div>
                        <Badge variant="outline" className="text-xs">
                          {news.category}
                        </Badge>
                      </div>
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </ContentCard>

          {/* Phase 2 안내 */}
          <div className="mt-8 rounded-lg bg-neutral-50 p-4 text-center">
            <p className="text-xs text-neutral-500">
              ⚠️ 이 페이지는 Phase 2에서 완전히 구현될 예정입니다.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
