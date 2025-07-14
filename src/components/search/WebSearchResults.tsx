import { ExternalLink, Search, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { WebSearchResult } from "@/lib/api/chat/types";

/**
 * 웹 검색 결과 프로퍼티
 */
export type WebSearchResultsProps = {
  /** 웹 검색 결과 리스트 */
  results: WebSearchResult[];
  /** 추가 CSS 클래스 */
  className?: string;
  /** 최대 표시 개수 */
  maxResults?: number;
  /** 컴팩트 모드 여부 */
  compact?: boolean;
};

/**
 * 웹 검색 결과를 표시하는 컴포넌트
 *
 * AI 응답에서 파싱된 웹 검색 결과를 깔끔하게 표시함
 */
export function WebSearchResults({
  results,
  className,
  maxResults = 8,
  compact = false,
}: WebSearchResultsProps) {
  if (results.length === 0) {
    return null;
  }

  const displayResults = results.slice(0, maxResults);
  const hasMore = results.length > maxResults;

  const handleResultClick = (url: string, title: string) => {
    // 분석 추적
    try {
      console.log("웹 검색 결과 클릭:", { url, title });
    } catch (error) {
      console.warn("분석 추적 실패:", error);
    }

    // 새 탭에서 열기
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (compact) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <Search className="h-4 w-4" />
          <span>관련 검색 결과 ({results.length}개)</span>
        </div>
        <div className="grid gap-2">
          {displayResults.map((result, index) => (
            <Button
              key={`${result.url}-${index}`}
              variant="ghost"
              size="sm"
              onClick={() => handleResultClick(result.url, result.title)}
              className="h-auto justify-start py-2 text-left"
            >
              <div className="flex w-full items-start gap-2">
                <ExternalLink className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary-600" />
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 text-sm font-medium text-neutral-800">
                    {result.title}
                  </div>
                  <div className="line-clamp-1 text-xs text-neutral-500">
                    {new URL(result.url).hostname}
                  </div>
                </div>
              </div>
            </Button>
          ))}
          {hasMore && (
            <div className="px-2 text-xs text-neutral-500">
              +{results.length - maxResults}개 더
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("border-info-200 bg-info-50/50", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-info-800">
          <Globe className="h-4 w-4" />
          관련 웹 자료
          <Badge variant="secondary" className="text-xs">
            {results.length}개
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-3">
          {displayResults.map((result, index) => (
            <Button
              key={`${result.url}-${index}`}
              variant="ghost"
              size="sm"
              onClick={() => handleResultClick(result.url, result.title)}
              className="h-auto justify-start border border-neutral-200 bg-white p-3 hover:border-primary-300 hover:bg-neutral-50"
            >
              <div className="flex w-full items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <ExternalLink className="h-4 w-4 text-primary-600" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div className="line-clamp-2 leading-tight font-medium text-neutral-800">
                    {result.title}
                  </div>
                  <div className="mt-1 font-mono text-xs text-neutral-500">
                    {new URL(result.url).hostname}
                  </div>
                </div>
              </div>
            </Button>
          ))}
          {hasMore && (
            <div className="border-t border-info-200 py-2 text-center text-xs text-info-600">
              총 {results.length}개 결과 중 {maxResults}개 표시
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 단일 웹 검색 결과 아이템 컴포넌트
 */
export type WebSearchResultItemProps = {
  /** 검색 결과 */
  result: WebSearchResult;
  /** 클릭 핸들러 */
  onClick?: (url: string, title: string) => void;
  /** 추가 CSS 클래스 */
  className?: string;
};

export function WebSearchResultItem({
  result,
  onClick,
  className,
}: WebSearchResultItemProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(result.url, result.title);
    } else {
      window.open(result.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn(
        "h-auto justify-start border border-neutral-200 bg-white p-2 hover:bg-neutral-50",
        className,
      )}
    >
      <div className="flex w-full items-center gap-2">
        <ExternalLink className="h-3 w-3 flex-shrink-0 text-primary-600" />
        <div className="min-w-0 flex-1 text-left">
          <div className="line-clamp-1 text-sm font-medium text-neutral-800">
            {result.title}
          </div>
          <div className="line-clamp-1 text-xs text-neutral-500">
            {new URL(result.url).hostname}
          </div>
        </div>
      </div>
    </Button>
  );
}
