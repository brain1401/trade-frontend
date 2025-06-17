import { createFileRoute, Link } from "@tanstack/react-router";
import ContentCard from "@/components/common/ContentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CalendarDays,
  Filter,
  Search,
  BookmarkPlus,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/news/")({
  component: NewsListPage,
});

// 하드코딩된 뉴스 데이터
const mockNews = [
  {
    id: "1",
    title: "2024년 수출입 신규 규제 시행 안내",
    summary:
      "새로운 품질인증 절차가 2024년 3월부터 시행됩니다. 전자제품 및 화학제품에 대한 추가 검사가 필요할 예정입니다.",
    content: "상세 내용...",
    source: "관세청",
    publishedAt: "2024-01-15T09:00:00Z",
    category: "regulation",
    priority: "high",
    tags: ["규제", "품질인증", "전자제품"],
    isBookmarked: false,
  },
  {
    id: "2",
    title: "미국-중국 무역 협정 업데이트",
    summary:
      "최근 미중 무역 협상에서 관세 조정 합의가 이루어졌습니다. IT 부품에 대한 관세가 5% 인하될 예정입니다.",
    content: "상세 내용...",
    source: "무역협회",
    publishedAt: "2024-01-12T14:30:00Z",
    category: "trade",
    priority: "medium",
    tags: ["미국", "중국", "관세"],
    isBookmarked: true,
  },
  {
    id: "3",
    title: "EU 탄소국경세 시행 임박",
    summary:
      "2024년 10월부터 EU 탄소국경세가 본격 시행됩니다. 철강, 시멘트 등 탄소집약적 산업에 큰 영향이 예상됩니다.",
    content: "상세 내용...",
    source: "산업통상자원부",
    publishedAt: "2024-01-10T11:15:00Z",
    category: "policy",
    priority: "high",
    tags: ["EU", "탄소국경세", "환경"],
    isBookmarked: false,
  },
  {
    id: "4",
    title: "아시아 반도체 시장 동향 분석",
    summary:
      "2024년 상반기 아시아 반도체 수출이 전년 대비 15% 증가했습니다. 특히 메모리 반도체 분야에서 성장세가 두드러집니다.",
    content: "상세 내용...",
    source: "한국반도체산업협회",
    publishedAt: "2024-01-08T16:20:00Z",
    category: "market",
    priority: "medium",
    tags: ["반도체", "아시아", "메모리"],
    isBookmarked: false,
  },
  {
    id: "5",
    title: "신재생에너지 관련 무역 정책 변화",
    summary:
      "태양광 패널과 풍력 발전 설비에 대한 수입 관세가 조정됩니다. 녹색 전환 정책에 따른 무역 환경 변화가 예상됩니다.",
    content: "상세 내용...",
    source: "에너지부",
    publishedAt: "2024-01-05T10:45:00Z",
    category: "policy",
    priority: "medium",
    tags: ["신재생에너지", "태양광", "관세"],
    isBookmarked: true,
  },
];

// 상수 정의 (기존 메인 페이지 패턴 준수)
const LINK_BUTTON_BASE_CLASSES = "h-auto p-0 text-sm hover:underline";
const CARD_SPACING_CLASSES = "mt-8";
const LIST_SPACING_CLASSES = "space-y-2";

function NewsListPage() {
  // 하드코딩된 상태들
  const news = mockNews;
  const selectedCategory = "all";
  const searchQuery = "";
  const sortBy = "date";
  const isLoading = false;
  const error = null;

  const filteredNews = news; // 필터링 로직 제거

  const categories = [
    { value: "all", label: "전체" },
    { value: "trade", label: "무역" },
    { value: "regulation", label: "규제" },
    { value: "policy", label: "정책" },
    { value: "market", label: "시장" },
    { value: "technology", label: "기술" },
  ];

  const sortOptions = [
    { value: "date", label: "최신순" },
    { value: "relevance", label: "관련도순" },
    { value: "priority", label: "중요도순" },
  ];

  if (error) {
    return (
      <ContentCard title="오류">
        <div className="p-4 text-center">
          <p className="text-neutral-600">
            뉴스를 불러오는 중 오류가 발생했습니다.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            다시 시도
          </Button>
        </div>
      </ContentCard>
    );
  }

  // THEME_GUIDE 적용: 필터 버튼 컴포넌트
  const FilterButtons = () => (
    <div className="space-y-3">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={
              selectedCategory === category.value ? "default" : "outline"
            }
            size="sm"
            className="rounded-full px-3 py-2 text-xs"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-neutral-500" />
        <span className="text-sm text-neutral-500">정렬:</span>
        {sortOptions.map((option) => (
          <Button
            key={option.value}
            variant={sortBy === option.value ? "default" : "ghost"}
            size="sm"
            className="h-auto px-2 py-1 text-xs"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );

  // THEME_GUIDE 적용: NewsItem 패턴 (기존 TradeNewsItem 스타일 준수)
  const NewsItem = ({ article }: { article: (typeof mockNews)[0] }) => {
    let badgeVariant: "secondary" | "destructive" | "default" = "secondary";
    if (article.category === "regulation") badgeVariant = "destructive";
    else if (article.category === "trade") badgeVariant = "default";

    return (
      <div className="border-b border-neutral-100 py-3 last:border-b-0">
        <Link to="/news/$newsId" params={{ newsId: article.id }}>
          <div className="mb-1 flex items-start justify-between">
            <h4 className="cursor-pointer pr-2 font-semibold text-neutral-800">
              {article.title}
            </h4>
            <div className="flex items-center gap-2">
              <Badge
                variant={badgeVariant}
                className="rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
              >
                {article.category}
              </Badge>
              {article.priority === "high" && (
                <Badge
                  variant="destructive"
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                >
                  중요
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm leading-relaxed text-neutral-600">
            {article.summary}
          </p>
        </Link>

        <div className="mt-1.5 flex items-center justify-between">
          <div className="text-xs text-neutral-400">
            <span className="text-neutral-800">{article.source}</span> |{" "}
            <span className="text-neutral-800">
              {new Date(article.publishedAt).toLocaleDateString("ko-KR")}
            </span>
          </div>
          <Button variant="ghost" size="sm" className="h-auto p-1">
            <BookmarkPlus
              className={`h-4 w-4 ${article.isBookmarked ? "fill-current text-primary-600" : "text-neutral-400"}`}
            />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 메인 레이아웃: 기존 메인 페이지와 동일한 2/3 + 1/3 구조 */}
      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-2/3">
          {/* 검색 및 필터 섹션 */}
          <ContentCard
            title="무역 뉴스"
            titleRightElement={
              <Button
                variant="link"
                className={cn(LINK_BUTTON_BASE_CLASSES, "text-primary-600")}
              >
                <Search size={16} className="mr-1" />
                검색
              </Button>
            }
          >
            <FilterButtons />
          </ContentCard>

          {/* 뉴스 리스트 */}
          <ContentCard title="뉴스 목록" className={CARD_SPACING_CLASSES}>
            {isLoading ? (
              <div className={LIST_SPACING_CLASSES}>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="border-b border-neutral-100 py-3 last:border-b-0"
                  >
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 w-3/4 rounded bg-neutral-200"></div>
                      <div className="h-3 w-full rounded bg-neutral-200"></div>
                      <div className="h-3 w-2/3 rounded bg-neutral-200"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-neutral-500">조건에 맞는 뉴스가 없습니다.</p>
              </div>
            ) : (
              <ScrollArea className="h-[40rem] pr-3">
                <div className={LIST_SPACING_CLASSES}>
                  {filteredNews.map((article) => (
                    <NewsItem key={article.id} article={article} />
                  ))}
                </div>
              </ScrollArea>
            )}

            {/* 더보기 버튼 */}
            <div className="mt-3 text-right">
              <Button
                variant="link"
                className={cn(
                  LINK_BUTTON_BASE_CLASSES,
                  "flex items-center justify-end text-primary-600",
                )}
              >
                더 많은 뉴스 보기 <ChevronRight size={16} className="ml-0.5" />
              </Button>
            </div>
          </ContentCard>
        </div>

        {/* 사이드바 */}
        <aside className="mt-8 lg:mt-0 lg:w-1/3">
          <ContentCard title="뉴스 카테고리">
            <ul className="space-y-1">
              {categories.slice(1).map((category) => (
                <li key={category.value} className="py-1">
                  <Button
                    variant="link"
                    className={cn(
                      LINK_BUTTON_BASE_CLASSES,
                      "justify-start text-neutral-700 hover:text-primary-600",
                    )}
                  >
                    {category.label}
                  </Button>
                </li>
              ))}
            </ul>
          </ContentCard>

          <ContentCard title="인기 태그" className={CARD_SPACING_CLASSES}>
            <div className="flex flex-wrap gap-2">
              {["규제", "관세", "무역협정", "EU", "미국", "반도체"].map(
                (tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer text-xs hover:bg-neutral-50"
                  >
                    {tag}
                  </Badge>
                ),
              )}
            </div>
            <div className="mt-3 text-right">
              <Button
                variant="link"
                className={cn(
                  LINK_BUTTON_BASE_CLASSES,
                  "flex items-center justify-end text-primary-600",
                )}
              >
                태그별 뉴스 <ChevronRight size={16} className="ml-0.5" />
              </Button>
            </div>
          </ContentCard>
        </aside>
      </div>
    </>
  );
}
