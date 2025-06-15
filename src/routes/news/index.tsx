import { createFileRoute } from "@tanstack/react-router";
import { useNewsStore } from "@/stores/newsStore";
import ContentCard from "@/components/common/ContentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CalendarDays, Filter, Search, BookmarkPlus } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/news/")({
  component: NewsListPage,
});

function NewsListPage() {
  const {
    news,
    selectedCategory,
    searchQuery,
    sortBy,
    isLoading,
    error,
    setFilter,
    setSearchQuery,
    setSortBy,
    getFilteredNews,
    toggleBookmark,
    isBookmarked,
  } = useNewsStore();

  const filteredNews = getFilteredNews();

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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
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
                  onClick={() => setFilter(category.value as any)}
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
                  onClick={() => setSortBy(option.value as any)}
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

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBookmark(article.id)}
                  >
                    <BookmarkPlus
                      className={`h-4 w-4 ${
                        isBookmarked(article.id) ? "fill-current" : ""
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

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        article.priority === "high"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {article.category}
                    </Badge>
                    {article.priority === "high" && (
                      <Badge variant="destructive">중요</Badge>
                    )}
                  </div>

                  <Link to="/news/$newsId" params={{ newsId: article.id }}>
                    <Button variant="outline" size="sm">
                      자세히 보기
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
