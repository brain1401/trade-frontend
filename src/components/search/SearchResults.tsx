import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle } from "lucide-react";
import type { SearchResult } from "@/types/domain/search";

type SearchResultsProps = {
  query: string;
  results?: SearchResult[];
  isLoading: boolean;
  error?: Error | null;
  type?: string;
  filters?: Record<string, any>;
};

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  results = [],
  isLoading,
  error,
  type,
  filters,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 w-3/4 rounded bg-muted"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 rounded bg-muted"></div>
                <div className="h-3 w-5/6 rounded bg-muted"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>검색 중 오류가 발생했습니다: {error.message}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Search className="mx-auto mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">검색 결과가 없습니다</h3>
            <p>"{query}"에 대한 검색 결과를 찾을 수 없습니다.</p>
            <p className="mt-2">다른 검색어를 시도해보세요.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            총 {results.length}개의 결과
            {type && <span> (카테고리: {type})</span>}
          </p>
        </div>
        {filters && Object.keys(filters).length > 0 && (
          <Button variant="outline" size="sm">
            필터 수정
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {results.map((result) => (
          <Card key={result.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">{result.title}</CardTitle>
              <div className="flex items-center space-x-2">
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${getTypeColor(result.type)}`}
                >
                  {getTypeLabel(result.type)}
                </span>
                <span className="text-xs text-muted-foreground">
                  관련도: {Math.round(result.relevanceScore * 100)}%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">{result.description}</p>
              <Button variant="outline" size="sm">
                자세히 보기
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

function getTypeColor(type: SearchResult["type"]): string {
  switch (type) {
    case "hscode":
      return "bg-blue-100 text-blue-800";
    case "regulation":
      return "bg-red-100 text-red-800";
    case "news":
      return "bg-green-100 text-green-800";
    case "general":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getTypeLabel(type: SearchResult["type"]): string {
  switch (type) {
    case "hscode":
      return "HS Code";
    case "regulation":
      return "규정";
    case "news":
      return "뉴스";
    case "general":
      return "일반";
    default:
      return "기타";
  }
}
