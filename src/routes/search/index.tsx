import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SearchResults } from "@/components/search/SearchResults";
import { IntelligentSearch } from "@/components/search/IntelligentSearch";
import { useGeneralSearch } from "@/hooks/api/search/useGeneralSearch";
import type { IntentDetectionResult } from "@/hooks/api/search/useIntentDetection";
import { useCallback } from "react";

type SearchParams = {
  q: string;
  type?: string;
  filters?: Record<string, any>;
};

export const Route = createFileRoute("/search/")({
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: String(search.q || ""),
    type: search.type ? String(search.type) : undefined,
    filters: search.filters as Record<string, any> | undefined,
  }),
});

function SearchPage() {
  const { q: query, type, filters } = Route.useSearch();
  const navigate = useNavigate();

  const {
    data: searchResponse,
    isLoading,
    error,
  } = useGeneralSearch({
    query,
    type,
    filters,
  });

  // AI 분석 결과에 따른 네비게이션 처리
  const handleIntelligentSearchResult = useCallback(
    (result: IntentDetectionResult) => {
      const primaryAction = result.suggestedActions[0];

      if (!primaryAction) {
        console.warn("No suggested actions found");
        return;
      }

      switch (result.intent) {
        case "hscode": {
          // HS Code 분석 - suggestedActions의 라우팅 정보 사용
          if (primaryAction.route === "/hscode/analyze/$sessionId") {
            // 실제로는 analysisStore에서 세션 생성 후 이동
            const mockSessionId = `session-${Date.now()}`;
            navigate({
              to: "/hscode/analyze/$sessionId",
              params: { sessionId: mockSessionId },
            });
          } else if (primaryAction.route?.includes("/hscode/guide/")) {
            // HS Code 가이드로 이동 (새로운 패턴)
            const hsCode = result.extractedData.hsCode;
            if (hsCode) {
              navigate({
                to: "/hscode/guide/$code",
                params: { code: hsCode },
              });
            }
          }
          break;
        }
        case "tracking": {
          // 화물 추적으로 이동
          const cargoNumber = result.extractedData.cargoNumber;
          if (cargoNumber) {
            navigate({
              to: "/tracking/$number",
              params: { number: cargoNumber },
            });
          }
          break;
        }
        case "general": {
          // 일반 검색 결과 표시 (현재 페이지에서 계속)
          const searchQuery = primaryAction.params?.query;
          if (searchQuery) {
            navigate({
              to: "/search",
              search: { q: searchQuery },
            });
          }
          break;
        }
        default:
          console.warn("Unknown intent detected:", result.intent);
      }
    },
    [navigate],
  );

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Intelligent Search Header */}
      <div className="space-y-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">AI 기반 스마트 검색</h1>
          <p className="text-muted-foreground">
            제품명을 설명하시면 AI가 의도를 파악하여 최적의 결과를 제공합니다
          </p>
        </div>

        <IntelligentSearch
          onSearch={handleIntelligentSearchResult}
          placeholder="예: 스마트폰 수출하려고 하는데 HS Code 찾아주세요"
          autoFocus={!query}
        />
      </div>

      {/* 기존 검색어가 있을 때만 결과 표시 */}
      {query && (
        <div className="space-y-4">
          <div className="border-t pt-6">
            <h2 className="mb-4 text-xl font-semibold">일반 검색 결과</h2>
            <p className="mb-4 text-muted-foreground">
              "{query}"에 대한 일반 검색 결과입니다.
            </p>
          </div>

          <SearchResults
            query={query}
            results={searchResponse?.results}
            isLoading={isLoading}
            error={error}
            type={type}
            filters={filters}
          />
        </div>
      )}
    </div>
  );
}
