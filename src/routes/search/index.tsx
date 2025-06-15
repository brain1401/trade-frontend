import { createFileRoute } from "@tanstack/react-router";
import { SearchResults } from "@/components/search/SearchResults";
import { useGeneralSearch } from "@/hooks/api/search/useGeneralSearch";

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

  const {
    data: searchResponse,
    isLoading,
    error,
  } = useGeneralSearch({
    query,
    type,
    filters,
  });

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* 기존 검색어가 있을 때만 결과 표시 */}
      {query && (
        <div className="space-y-4">
          <div className="pt-6">
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
