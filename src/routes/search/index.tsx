import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  TrendingUp,
  Clock,
  ExternalLink,
  Package,
  FileText,
  Ship,
  BookOpen,
} from "lucide-react";
import {
  mockPopularKeywords,
  mockRecentSearchItems,
  searchByQuery,
  getSearchSuggestions,
  getTrendingKeywords,
  getRecentSearchItems,
} from "@/data/mock/search";
import type { SearchResult } from "@/types/search";

/**
 * 검색 라우트 정의
 */
export const Route = createFileRoute("/search/")({
  component: SearchPage,
});

/**
 * 검색 결과 타입별 아이콘 매핑
 */
const getResultIcon = (type: string) => {
  switch (type) {
    case "hscode":
      return <Package className="h-4 w-4 text-primary-600" />;
    case "regulation":
      return <FileText className="h-4 w-4 text-warning-600" />;
    case "cargo":
      return <Ship className="h-4 w-4 text-info-600" />;
    case "news":
      return <BookOpen className="h-4 w-4 text-success-600" />;
    default:
      return <Search className="h-4 w-4 text-neutral-600" />;
  }
};

/**
 * 검색 결과 타입명 매핑
 */
const getResultTypeName = (type: string) => {
  switch (type) {
    case "hscode":
      return "HS Code";
    case "regulation":
      return "규제";
    case "cargo":
      return "화물";
    case "news":
      return "뉴스";
    default:
      return "기타";
  }
};

/**
 * 개별 검색 결과 카드 컴포넌트
 */
type SearchResultCardProps = {
  result: SearchResult;
};

function SearchResultCard({ result }: SearchResultCardProps) {
  const resultIcon = getResultIcon(result.type);
  const typeName = getResultTypeName(result.type);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {resultIcon}
            <CardTitle className="text-lg">{result.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{typeName}</Badge>
            <Badge variant="outline" className="text-xs">
              관련도 {Math.round(result.relevanceScore * 100)}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-neutral-600">{result.description}</p>

        {/* 하이라이트된 텍스트 */}
        {result.highlightedText && (
          <div className="mb-3">
            <span className="text-xs text-neutral-500">매칭: </span>
            <span className="rounded bg-primary-100 px-1 text-sm text-primary-800">
              {result.highlightedText}
            </span>
          </div>
        )}

        {/* 메타데이터 표시 */}
        {result.metadata && (
          <div className="mb-4 flex flex-wrap gap-1">
            {Object.entries(result.metadata).map(([key, value]) => (
              <Badge key={key} variant="outline" className="text-xs">
                {Array.isArray(value) ? value.join(", ") : String(value)}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-500">
            {new Date(result.createdAt).toLocaleDateString("ko-KR")}
          </span>
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-1 h-4 w-4" />
            상세보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 인기 검색어 컴포넌트
 */
function PopularKeywords() {
  const popularKeywords = mockPopularKeywords.slice(0, 5);
  const trendingKeywords = getTrendingKeywords();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary-600" />
          인기 검색어
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-medium text-neutral-800">
            트렌딩 키워드
          </h4>
          <div className="flex flex-wrap gap-2">
            {trendingKeywords.map((keyword, index) => (
              <Badge
                key={keyword.keyword}
                variant="secondary"
                className="cursor-pointer bg-primary-100 text-primary-800 hover:bg-primary-200"
              >
                <TrendingUp className="mr-1 h-3 w-3" />
                {keyword.keyword}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="mb-2 text-sm font-medium text-neutral-800">
            인기 검색어
          </h4>
          <div className="space-y-2">
            {popularKeywords.map((keyword, index) => (
              <div
                key={keyword.keyword}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium text-neutral-600">
                    {index + 1}
                  </span>
                  <span className="text-sm text-neutral-800">
                    {keyword.keyword}
                  </span>
                </div>
                <span className="text-xs text-neutral-500">
                  {keyword.searchCount.toLocaleString()}회
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 최근 검색 컴포넌트
 */
function RecentSearches() {
  const recentSearches = getRecentSearchItems(5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-info-600" />
          최근 검색
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentSearches.map((search, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 transition-colors hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                {getResultIcon(search.resultType || "hscode")}
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    {search.text}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {search.searchedAt.toLocaleDateString("ko-KR")}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                다시 검색
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 검색 페이지
 */
function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    // Mock 검색 실행 (실제로는 API 호출)
    setTimeout(() => {
      const results = searchByQuery(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* 헤더 섹션 */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          통합 검색
        </h1>
        <p className="mt-2 text-neutral-600">
          HS Code, 규제 정보, 화물 추적, 무역 뉴스를 한번에 검색하세요
        </p>
      </div>

      {/* 검색 입력 섹션 */}
      <div className="mb-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex gap-2">
            <Input
              placeholder="HS Code, 상품명, 화물번호 등을 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-lg"
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-6"
            >
              <Search className="mr-2 h-4 w-4" />
              {isSearching ? "검색 중..." : "검색"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 메인 콘텐츠 - 검색 결과 */}
        <div className="lg:col-span-2">
          {searchResults.length > 0 ? (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-neutral-900">
                  검색 결과
                </h2>
                <p className="text-sm text-neutral-600">
                  "{searchQuery}"에 대한 {searchResults.length}개 결과
                </p>
              </div>
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <SearchResultCard key={result.id} result={result} />
                ))}
              </div>
            </div>
          ) : searchQuery && !isSearching ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-neutral-400" />
                <h3 className="mb-2 text-lg font-medium text-neutral-900">
                  검색 결과가 없습니다
                </h3>
                <p className="text-neutral-600">
                  다른 키워드로 다시 검색해보세요
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-neutral-400" />
                <h3 className="mb-2 text-lg font-medium text-neutral-900">
                  검색어를 입력하세요
                </h3>
                <p className="text-neutral-600">
                  HS Code, 상품명, 화물번호 등으로 검색할 수 있습니다
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 사이드바 - 인기 검색어와 최근 검색 */}
        <div className="space-y-6">
          <PopularKeywords />
          <RecentSearches />
        </div>
      </div>
    </div>
  );
}
