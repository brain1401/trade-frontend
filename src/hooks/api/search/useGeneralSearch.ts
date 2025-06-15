import { useQuery } from "@tanstack/react-query";
import type { SearchResult, SearchResponse } from "@/types/domain/search";

type SearchParams = {
  query: string;
  type?: string;
  filters?: Record<string, any>;
};

// Mock API 함수
const searchApi = async (params: SearchParams): Promise<SearchResponse> => {
  // 실제로는 백엔드 API 호출
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock 데이터
  const mockResults: SearchResult[] = [
    {
      id: "1",
      title: "HS Code 분류 가이드",
      description:
        "제품의 HS Code를 정확하게 분류하는 방법에 대한 상세 가이드입니다.",
      type: "general" as const,
      relevanceScore: 0.95,
      metadata: { category: "가이드" },
    },
    {
      id: "2",
      title: "최신 수출입 규정 업데이트",
      description: "2024년 새로운 수출입 규정 변경사항을 안내드립니다.",
      type: "regulation" as const,
      relevanceScore: 0.88,
      metadata: { category: "규정", year: "2024" },
    },
    {
      id: "3",
      title: "무역 통계 리포트",
      description: "최근 3개월간의 주요 무역 통계 데이터입니다.",
      type: "news" as const,
      relevanceScore: 0.75,
      metadata: { category: "통계", period: "3개월" },
    },
  ].filter(
    (result) =>
      result.title.toLowerCase().includes(params.query.toLowerCase()) ||
      result.description.toLowerCase().includes(params.query.toLowerCase()),
  );

  return {
    results: mockResults,
    totalCount: mockResults.length,
    facets: {
      types: [
        { type: "regulation", count: 5 },
        { type: "news", count: 3 },
        { type: "general", count: 2 },
      ],
      countries: [
        { country: "KR", count: 8 },
        { country: "US", count: 2 },
      ],
    },
    suggestions: ["HS Code", "수출입 규정", "무역 통계"],
  };
};

export const useGeneralSearch = (params: SearchParams) => {
  return useQuery({
    queryKey: ["search", "general", params],
    queryFn: () => searchApi(params),
    enabled: !!params.query && params.query.length > 0,
    staleTime: 30000, // 30초간 캐시 유지
  });
};
