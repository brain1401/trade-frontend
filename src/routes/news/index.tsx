import { createFileRoute, Link } from "@tanstack/react-router";
import ContentCard from "@/components/common/ContentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CalendarDays, Filter, Search, BookmarkPlus } from "lucide-react";

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
];

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
      <div className="container mx-auto py-6">
        <ContentCard>
          <div className="p-6 text-center">
            <p className="text-destructive">
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
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">무역 뉴스</h1>
          <p className="text-muted-foreground">
            최신 무역 규제, 정책 변경, 시장 동향 정보를 확인하세요
          </p>
        </div>

        {/* Filters and Search */}
        <ContentCard>
          <div className="space-y-4 p-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="뉴스 검색..."
                value={searchQuery}
                className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                readOnly
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={
                    selectedCategory === category.value ? "default" : "outline"
                  }
                  size="sm"
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">정렬:</span>
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "default" : "ghost"}
                  size="sm"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </ContentCard>
      </div>

      {/* News List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-3/4 rounded bg-muted"></div>
                <div className="h-3 w-1/2 rounded bg-muted"></div>
                <div className="h-3 w-full rounded bg-muted"></div>
                <div className="h-3 w-2/3 rounded bg-muted"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredNews.length === 0 ? (
        <ContentCard>
          <div className="p-6 text-center">
            <p className="text-muted-foreground">
              조건에 맞는 뉴스가 없습니다.
            </p>
          </div>
        </ContentCard>
      ) : (
        <div className="space-y-4">
          {filteredNews.map((article) => (
            <Card
              key={article.id}
              className="p-6 transition-shadow hover:shadow-md"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <Link
                      to="/news/$newsId"
                      params={{ newsId: article.id }}
                      className="block"
                    >
                      <h3 className="text-lg font-semibold transition-colors hover:text-primary">
                        {article.title}
                      </h3>
                    </Link>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(article.publishedAt).toLocaleDateString(
                          "ko-KR",
                        )}
                      </span>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm">
                    <BookmarkPlus
                      className={`h-4 w-4 ${
                        article.isBookmarked ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                </div>

                {/* Content */}
                {article.summary && (
                  <p className="line-clamp-2 text-muted-foreground">
                    {article.summary}
                  </p>
                )}

                {/* Tags and Category */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{article.category}</Badge>
                  {article.priority === "high" && (
                    <Badge variant="destructive">중요</Badge>
                  )}
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Button */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          더 많은 뉴스 보기
        </Button>
      </div>
    </div>
  );
}
