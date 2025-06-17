import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ContentCard from "@/components/common/ContentCard";
import { ExternalLink, Filter, Calendar, Tag } from "lucide-react";

// URL 쿼리 파라미터 타입 정의
type SearchParams = {
  q?: string;
  category?: string;
  period?: string;
};

export const Route = createFileRoute("/search/results/")({
  component: SearchResultsPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      q: typeof search.q === "string" ? search.q : undefined,
      category:
        typeof search.category === "string" ? search.category : undefined,
      period: typeof search.period === "string" ? search.period : undefined,
    };
  },
}) as any;

// 목업 검색 결과 데이터
const mockSearchResults = [
  {
    id: "1",
    title: "리튬배터리 수입규제 강화 안내",
    summary: "2024년 3월부터 리튬배터리 관련 안전 기준이 강화됩니다.",
    source: "무역협회",
    date: "2024-01-14",
    category: "규제",
    url: "#",
    tags: ["리튬배터리", "안전기준", "수입규제"],
  },
  {
    id: "2",
    title: "휴대폰 KC 인증 절차 간소화",
    summary: "휴대폰 관련 KC 인증 절차가 간소화되어 인증 기간이 단축됩니다.",
    source: "방송통신위원회",
    date: "2024-01-15",
    category: "인증",
    url: "#",
    tags: ["휴대폰", "KC인증", "절차간소화"],
  },
];

function SearchResultsPage() {
  const { q, category, period } = Route.useSearch();

  // 검색 파라미터에 따른 결과 필터링
  const filteredResults = mockSearchResults.filter((result) => {
    if (category && category !== "전체" && result.category !== category) {
      return false;
    }
    if (
      q &&
      !result.title.toLowerCase().includes(q.toLowerCase()) &&
      !result.summary.toLowerCase().includes(q.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const searchTitle = q ? `"${q}" 검색 결과` : "검색 결과";
  const resultCount = filteredResults.length;

  return (
    <div className="lg:flex lg:space-x-8">
      <div className="lg:w-2/3">
        <ContentCard
          title={searchTitle}
          titleRightElement={
            <span className="text-sm text-neutral-500">
              총 {resultCount}개 결과
            </span>
          }
        >
          {q && (
            <div className="mb-4 rounded-lg bg-neutral-50 p-3">
              <p className="text-sm text-neutral-600">
                <strong>"{q}"</strong>에 대한 검색 결과입니다.
                {category && category !== "전체" && (
                  <span> (카테고리: {category})</span>
                )}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <div
                  key={result.id}
                  className="rounded-lg border border-neutral-200 p-4"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-medium text-neutral-800">
                      {result.title}
                    </h3>
                    <Badge variant="outline">{result.category}</Badge>
                  </div>
                  <p className="mb-2 text-sm text-neutral-600">
                    {result.summary}
                  </p>
                  <div className="mb-2 flex flex-wrap gap-1">
                    {result.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">
                      {result.source} · {result.date}
                    </span>
                    <Button variant="link" className="h-auto p-0 text-sm">
                      상세보기 <ExternalLink size={14} className="ml-1" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-neutral-500">검색 결과가 없습니다.</p>
                <p className="mt-1 text-sm text-neutral-400">
                  다른 검색어를 시도해보세요.
                </p>
              </div>
            )}
          </div>
        </ContentCard>
      </div>

      <div className="mt-8 lg:mt-0 lg:w-1/3">
        <ContentCard title="검색 필터">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">카테고리</label>
              <select
                title="카테고리"
                className="mt-1 w-full rounded border border-neutral-200 px-2 py-1"
              >
                <option>전체</option>
                <option>규제</option>
                <option>인증</option>
                <option>뉴스</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">기간</label>
              <select
                title="기간"
                className="mt-1 w-full rounded border border-neutral-200 px-2 py-1"
              >
                <option>전체</option>
                <option>최근 1주일</option>
                <option>최근 1개월</option>
                <option>최근 3개월</option>
              </select>
            </div>
          </div>
        </ContentCard>
      </div>
    </div>
  );
}
