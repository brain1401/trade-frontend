import type { PopularKeyword, RecentSearchItem, SearchResult } from "@/types";

// 인기 검색어 Mock 데이터
export const mockPopularKeywords: PopularKeyword[] = [
  { keyword: "리튬 배터리 HS Code", searchCount: 1247, trending: true },
  { keyword: "화장품 유럽 수출 규제", searchCount: 892, trending: false },
  { keyword: "의료기기 FDA 인증", searchCount: 756, trending: true },
  { keyword: "자동차 부품 관세율", searchCount: 623, trending: false },
  { keyword: "태양광 패널 인도 BIS", searchCount: 545, trending: true },
];

// 최근 분석 품목 Mock 데이터
export const mockRecentSearchItems: RecentSearchItem[] = [
  {
    text: "HS Code 8517.12 (스마트폰)",
    hscode: "8517.12",
    searchedAt: new Date("2025-01-12T14:30:00Z"),
  },
  {
    text: "HS Code 3304.99 (기타 화장품)",
    hscode: "3304.99",
    searchedAt: new Date("2025-01-12T13:15:00Z"),
  },
  {
    text: "HS Code 8542.31 (반도체)",
    hscode: "8542.31",
    searchedAt: new Date("2025-01-12T11:45:00Z"),
  },
  {
    text: "HS Code 9018.90 (기타 의료기기)",
    hscode: "9018.90",
    searchedAt: new Date("2025-01-12T10:20:00Z"),
  },
  {
    text: "HS Code 6203.42 (면바지)",
    hscode: "6203.42",
    searchedAt: new Date("2025-01-12T09:00:00Z"),
  },
];

// 검색 결과 Mock 데이터
export const mockSearchResults: SearchResult[] = [
  {
    id: "search-1",
    title: "스마트폰 HS Code 8517.12 상세 정보",
    description: "스마트폰 관련 HS Code 분류 및 수출입 규제 정보를 제공합니다.",
    type: "hscode",
    relevanceScore: 0.95,
    highlightedText: "스마트폰 HS Code",
    metadata: { hsCode: "8517.12", category: "전자제품" },
  },
  {
    id: "search-2",
    title: "화장품 수출 시 필요한 규제 정보",
    description:
      "EU, 미국 등 주요국의 화장품 수출 규제 및 인증 요구사항을 안내합니다.",
    type: "regulation",
    relevanceScore: 0.87,
    highlightedText: "화장품 수출 규제",
    metadata: { category: "규제", regions: ["EU", "US"] },
  },
  {
    id: "search-3",
    title: "의료기기 FDA 인증 절차 가이드",
    description:
      "미국 FDA 의료기기 인증을 위한 단계별 절차와 필요 서류를 설명합니다.",
    type: "regulation",
    relevanceScore: 0.82,
    highlightedText: "의료기기 FDA 인증",
    metadata: { category: "인증", regions: ["US"], industry: ["의료"] },
  },
  {
    id: "search-4",
    title: "자동차 부품 관세율 최신 정보",
    description:
      "주요국의 자동차 부품 관세율 현황과 FTA 적용 혜택을 제공합니다.",
    type: "news",
    relevanceScore: 0.78,
    highlightedText: "자동차 부품 관세율",
    metadata: { category: "관세", industry: ["자동차"] },
  },
];

// 검색 제안어 Mock 데이터
export const mockSearchSuggestions: string[] = [
  "리튬 배터리",
  "리튬 배터리 HS Code",
  "리튬 배터리 수출 규제",
  "리튬 배터리 운송 규정",
  "리튬 배터리 안전 인증",
];

// 유틸리티 함수들
export const getPopularKeywords = (limit: number = 5): PopularKeyword[] => {
  return mockPopularKeywords
    .sort((a, b) => b.searchCount - a.searchCount)
    .slice(0, limit);
};

export const getTrendingKeywords = (): PopularKeyword[] => {
  return mockPopularKeywords.filter((keyword) => keyword.trending);
};

export const getRecentSearchItems = (limit: number = 5): RecentSearchItem[] => {
  return mockRecentSearchItems
    .sort(
      (a, b) =>
        new Date(b.searchedAt).getTime() - new Date(a.searchedAt).getTime(),
    )
    .slice(0, limit);
};

export const searchByQuery = (query: string): SearchResult[] => {
  if (!query.trim()) return [];

  const lowercaseQuery = query.toLowerCase();
  return mockSearchResults.filter(
    (result) =>
      result.title.toLowerCase().includes(lowercaseQuery) ||
      result.description.toLowerCase().includes(lowercaseQuery),
  );
};

export const getSearchSuggestions = (query: string): string[] => {
  if (!query.trim()) return [];

  const lowercaseQuery = query.toLowerCase();
  return mockSearchSuggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(lowercaseQuery),
  );
};
