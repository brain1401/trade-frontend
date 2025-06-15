// 검색 결과 타입
export type SearchResult = {
  id: string;
  title: string;
  description: string;
  type: "hscode" | "regulation" | "news" | "general";
  relevanceScore: number;
  highlightedText?: string;
  metadata?: Record<string, any>;
};

// 검색 요청 타입
export type SearchRequest = {
  query: string;
  filters?: {
    type?: SearchResult["type"][];
    dateRange?: {
      start: Date;
      end: Date;
    };
    countries?: string[];
    hsCodePrefix?: string;
  };
  sortBy?: "relevance" | "date" | "popularity";
  limit?: number;
  offset?: number;
};

// 검색 응답 타입
export type SearchResponse = {
  results: SearchResult[];
  totalCount: number;
  facets?: {
    types: { type: string; count: number }[];
    countries: { country: string; count: number }[];
  };
  suggestions?: string[];
};

// 인기 검색어 타입
export type PopularKeyword = {
  keyword: string;
  searchCount: number;
  trending: boolean;
};

// 최근 검색 항목 타입
export type RecentSearchItem = {
  text: string;
  hscode: string;
  searchedAt: string;
};
