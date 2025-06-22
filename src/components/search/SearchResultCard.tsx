import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Bookmark } from "lucide-react";
import type { SearchResult } from "@/types/search";
import { getSearchResultTypeName } from "@/lib/utils/ui-helpers";
import { getSearchResultIcon } from "@/lib/utils/icon-helpers";

/**
 * 검색 결과 카드 프로퍼티 타입
 */
export type SearchResultCardProps = {
  /** 검색 결과 데이터 */
  result: SearchResult;
  /** 북마크 추가 핸들러 */
  onBookmark?: (result: SearchResult) => void;
};

/**
 * 검색 결과 카드 컴포넌트
 *
 * 개별 검색 결과를 카드 형태로 표시
 * 타입별 아이콘, 북마크 기능, 외부 링크 등을 포함
 */
export function SearchResultCard({
  result,
  onBookmark,
}: SearchResultCardProps) {
  const resultIcon = getSearchResultIcon(result.type);
  const typeName = getSearchResultTypeName(result.type);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {resultIcon}
            <div>
              <CardTitle className="text-lg">{result.title}</CardTitle>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {typeName}
                </Badge>
                {result.relevanceScore && (
                  <Badge variant="secondary" className="text-xs">
                    관련도: {(result.relevanceScore * 100).toFixed(0)}%
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 설명 */}
          <p className="line-clamp-3 text-sm text-neutral-600">
            {result.description}
          </p>

          {/* 메타데이터 정보 (metadata 기반) */}
          {result.type === "hscode" && result.metadata.hsCode && (
            <div className="rounded-md bg-neutral-50 p-3">
              <div className="text-xs font-medium text-neutral-700">
                HS Code: {result.metadata.hsCode}
              </div>
              {result.metadata.tariffRate && (
                <div className="mt-1 text-xs text-neutral-600">
                  관세율: {result.metadata.tariffRate}
                </div>
              )}
            </div>
          )}

          {/* 액션 버튼들 */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-neutral-500">
              생성일: {new Date(result.createdAt).toLocaleDateString("ko-KR")}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBookmark?.(result)}
              >
                <Bookmark className="mr-1 h-4 w-4" />
                북마크
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-1 h-4 w-4" />
                상세보기
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
