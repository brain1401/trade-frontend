import type {
  PopularKeyword,
  RecentSearchItem,
  SearchResult,
} from "@/types/search";
import type { PaginationMeta } from "../../types/common";

/**
 * 인기 검색어 Mock 데이터
 *
 * 사용자들이 자주 검색하는 키워드들의 목록입니다.
 * 검색량과 트렌딩 여부 정보를 포함하여 검색 추천에 활용됩니다.
 *
 * @example
 * ```typescript
 * const trendingKeywords = mockPopularKeywords.filter(keyword => keyword.trending);
 * console.log(`트렌딩 키워드 ${trendingKeywords.length}개`);
 * ```
 */
export const mockPopularKeywords: PopularKeyword[] = [
  { keyword: "리튬 배터리 HS Code", searchCount: 1247, trending: true },
  { keyword: "화장품 유럽 수출 규제", searchCount: 892, trending: false },
  { keyword: "의료기기 FDA 인증", searchCount: 756, trending: true },
  { keyword: "자동차 부품 관세율", searchCount: 623, trending: false },
  { keyword: "태양광 패널 인도 BIS", searchCount: 545, trending: true },
];

/**
 * 최근 검색 항목 Mock 데이터
 *
 * 사용자의 최근 검색 기록을 저장합니다.
 * HS Code 검색 기록이 포함되어 있어 빠른 재검색이 가능합니다.
 *
 * @example
 * ```typescript
 * const recentSearches = mockRecentSearchItems.slice(0, 3);
 * recentSearches.forEach(item => {
 *   console.log(`${item.text} - ${item.searchedAt}`);
 * });
 * ```
 */
export const mockRecentSearchItems: RecentSearchItem[] = [
  {
    text: "HS Code 8517.12 (스마트폰)",
    hscode: "8517.12",
    searchedAt: new Date("2025-01-12T14:30:00Z"),
    resultType: "HS_CODE_ANALYSIS",
  },
  {
    text: "HS Code 3304.99 (기타 화장품)",
    hscode: "3304.99",
    searchedAt: new Date("2025-01-12T13:15:00Z"),
    resultType: "HS_CODE_ANALYSIS",
  },
  {
    text: "HS Code 8542.31 (반도체)",
    hscode: "8542.31",
    searchedAt: new Date("2025-01-12T11:45:00Z"),
    resultType: "HS_CODE_ANALYSIS",
  },
  {
    text: "HS Code 9018.90 (기타 의료기기)",
    hscode: "9018.90",
    searchedAt: new Date("2025-01-12T10:20:00Z"),
    resultType: "HS_CODE_ANALYSIS",
  },
  {
    text: "HS Code 6203.42 (면바지)",
    hscode: "6203.42",
    searchedAt: new Date("2025-01-12T09:00:00Z"),
    resultType: "HS_CODE_ANALYSIS",
  },
  {
    text: "화물추적 MSKU1234567",
    searchedAt: new Date("2025-01-12T08:30:00Z"),
    resultType: "CARGO_TRACKING",
  },
  {
    text: "EU 탄소국경조정제도",
    searchedAt: new Date("2025-01-11T16:45:00Z"),
    resultType: "GENERAL_TRADE_INQUIRY",
  },
];

/**
 * 검색 결과 Mock 데이터
 *
 * 다양한 검색 쿼리에 대한 결과를 시뮬레이션합니다.
 * HS Code, 규제 정보, 뉴스 등 다양한 타입의 결과를 포함합니다.
 *
 * @example
 * ```typescript
 * const hsCodeResults = mockSearchResults.filter(result => result.type === "hscode");
 * console.log(`HS Code 관련 결과: ${hsCodeResults.length}개`);
 * ```
 */
export const mockSearchResults: SearchResult[] = [
  {
    id: "search-1",
    title: "스마트폰 HS Code 8517.12 상세 정보",
    description: "스마트폰 관련 HS Code 분류 및 수출입 규제 정보를 제공합니다.",
    type: "hscode",
    relevanceScore: 0.95,
    highlightedText: "스마트폰 HS Code",
    metadata: { hsCode: "8517.12", category: "전자제품" },
    createdAt: "2025-01-12T09:00:00Z",
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
    createdAt: "2025-01-11T14:00:00Z",
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
    createdAt: "2025-01-10T16:30:00Z",
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
    createdAt: "2025-01-09T11:20:00Z",
  },
  {
    id: "search-5",
    title: "화물 MSKU1234567 추적 정보",
    description:
      "상하이에서 부산으로 운송되는 전자제품 화물의 실시간 추적 정보입니다.",
    type: "cargo",
    relevanceScore: 0.88,
    highlightedText: "화물 추적 MSKU1234567",
    metadata: { cargoNumber: "MSKU1234567", status: "통관 진행 중" },
    createdAt: "2025-01-12T10:15:00Z",
  },
];

/**
 * 검색 제안어 Mock 데이터
 *
 * 사용자가 입력하는 동안 보여줄 수 있는 검색 제안어들입니다.
 * 자동완성 기능 구현에 사용됩니다.
 *
 * @example
 * ```typescript
 * const suggestions = mockSearchSuggestions.slice(0, 3);
 * // ["리튬 배터리", "리튬 배터리 HS Code", "리튬 배터리 수출 규제"]
 * ```
 */
export const mockSearchSuggestions: string[] = [
  "리튬 배터리",
  "리튬 배터리 HS Code",
  "리튬 배터리 수출 규제",
  "리튬 배터리 운송 규정",
  "리튬 배터리 안전 인증",
];

/**
 * 인기 검색어 목록 조회
 *
 * 검색량 기준으로 정렬된 인기 검색어를 지정된 개수만큼 반환합니다.
 * 메인 페이지나 검색 페이지에서 추천 검색어로 활용됩니다.
 *
 * @param limit - 반환할 검색어 개수 (기본값: 5)
 * @returns 검색량 순으로 정렬된 인기 검색어 배열
 *
 * @example
 * ```typescript
 * const topKeywords = getPopularKeywords(3);
 * topKeywords.forEach(keyword => {
 *   console.log(`${keyword.keyword}: ${keyword.searchCount}회`);
 * });
 * ```
 */
export const getPopularKeywords = (limit: number = 5): PopularKeyword[] => {
  return mockPopularKeywords
    .sort((a, b) => b.searchCount - a.searchCount)
    .slice(0, limit);
};

/**
 * 트렌딩 검색어 조회
 *
 * 현재 인기 상승 중인 검색어들만 필터링하여 반환합니다.
 * 실시간 트렌드 섹션에서 사용됩니다.
 *
 * @returns 트렌딩 중인 검색어 배열
 *
 * @example
 * ```typescript
 * const trending = getTrendingKeywords();
 * console.log(`현재 트렌딩: ${trending.map(k => k.keyword).join(", ")}`);
 * ```
 */
export const getTrendingKeywords = (): PopularKeyword[] => {
  return mockPopularKeywords.filter((keyword) => keyword.trending);
};

/**
 * 최근 검색 항목 조회
 *
 * 사용자의 최근 검색 기록을 시간순으로 정렬하여 반환합니다.
 * 검색 페이지에서 "최근 검색" 섹션을 구성할 때 사용됩니다.
 *
 * @param limit - 반환할 검색 기록 개수 (기본값: 5)
 * @returns 최신순으로 정렬된 검색 기록 배열
 *
 * @example
 * ```typescript
 * const recentItems = getRecentSearchItems(3);
 * recentItems.forEach(item => {
 *   console.log(`최근 검색: ${item.text}`);
 * });
 * ```
 */
export const getRecentSearchItems = (limit: number = 5): RecentSearchItem[] => {
  return mockRecentSearchItems
    .sort(
      (a, b) =>
        new Date(b.searchedAt).getTime() - new Date(a.searchedAt).getTime(),
    )
    .slice(0, limit);
};

/**
 * 검색어 기반 결과 조회
 *
 * 입력된 검색어와 일치하는 결과들을 찾아 반환합니다.
 * 제목과 설명에서 대소문자 구분 없이 검색을 수행합니다.
 *
 * @param query - 검색할 키워드
 * @returns 검색 조건에 일치하는 결과 배열
 *
 * @example
 * ```typescript
 * const results = searchByQuery("스마트폰");
 * console.log(`검색 결과: ${results.length}개`);
 * results.forEach(result => {
 *   console.log(`- ${result.title} (관련도: ${result.relevanceScore})`);
 * });
 * ```
 *
 * @example 빈 검색어 처리
 * ```typescript
 * const emptyResults = searchByQuery("");
 * console.log(emptyResults.length); // 0
 * ```
 */
export const searchByQuery = (query: string): SearchResult[] => {
  if (!query.trim()) return [];

  const lowercaseQuery = query.toLowerCase();
  return mockSearchResults.filter(
    (result) =>
      result.title.toLowerCase().includes(lowercaseQuery) ||
      result.description.toLowerCase().includes(lowercaseQuery),
  );
};

/**
 * 검색 제안어 조회
 *
 * 입력된 검색어와 관련된 제안어들을 반환합니다.
 * 자동완성 드롭다운 구현에 사용됩니다.
 *
 * @param query - 기준이 되는 검색어
 * @returns 관련 제안어 배열
 *
 * @example
 * ```typescript
 * const suggestions = getSearchSuggestions("리튬");
 * // ["리튬 배터리", "리튬 배터리 HS Code", "리튬 배터리 수출 규제", ...]
 * ```
 *
 * @example 빈 검색어 처리
 * ```typescript
 * const noSuggestions = getSearchSuggestions("");
 * console.log(noSuggestions.length); // 0
 * ```
 */
export const getSearchSuggestions = (query: string): string[] => {
  if (!query.trim()) return [];

  const lowercaseQuery = query.toLowerCase();
  return mockSearchSuggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(lowercaseQuery),
  );
};

/**
 * v6.1 API 명세서 기준, 채팅 세션 정보 타입
 */
export type ChatSession = {
  /** 세션 고유 ID */
  sessionId: string;
  /** 세션 제목 */
  sessionTitle: string;
  /** 메시지 수 */
  messageCount: number;
  /** 생성 시간 (ISO 8601) */
  createdAt: string;
  /** 마지막 업데이트 시간 (ISO 8601) */
  updatedAt: string;
  /** 첫 번째 메시지 내용 */
  firstMessage: string;
  /** 마지막 메시지 내용 */
  lastMessage: string;
  /** 데이터 파티션 연도 */
  partitionYear: number;
};

/**
 * v6.1 API 명세서 기준, 채팅 세션 목록 응답 타입
 */
export type ChatHistoryResponse = {
  /** 세션 목록 */
  sessions: ChatSession[];
  /** 페이지네이션 정보 */
  pagination: PaginationMeta;
  /** 요약 정보 */
  summary: {
    totalSessions: number;
    totalMessages: number;
    sessionsLast30Days: number;
    oldestSessionDate: string;
    newestSessionDate: string;
  };
};

/**
 * v6.1 API 명세서 기준, 채팅 검색 결과 항목 타입
 */
export type ChatSearchResultItem = {
  /** 세션 고유 ID */
  sessionId: string;
  /** 세션 제목 */
  sessionTitle: string;
  /** 일치하는 메시지 내용 */
  matchedMessage: string;
  /** 일치 타입 (USER 또는 AI 메시지) */
  matchType: "USER_MESSAGE" | "AI_MESSAGE";
  /** 메시지 생성 시간 (ISO 8601) */
  createdAt: string;
  /** 관련도 점수 */
  relevanceScore: number;
};

/**
 * v6.1 API 명세서 기준, 채팅 검색 응답 타입
 */
export type ChatSearchResponse = {
  /** 검색 결과 목록 */
  searchResults: ChatSearchResultItem[];
  /** 페이지네이션 정보 */
  pagination: PaginationMeta;
  /** 검색 정보 */
  searchInfo: {
    keyword: string;
    searchTimeMs: number;
    totalMatches: number;
  };
};

/**
 * 채팅 세션 목록 Mock 데이터 (v6.1)
 */
export const mockChatHistory: ChatHistoryResponse = {
  sessions: [
    {
      sessionId: "chat_session_20240116_123456",
      sessionTitle: "아이폰 15 프로 수입 HS Code 문의",
      messageCount: 6,
      createdAt: "2024-01-16T10:32:00Z",
      updatedAt: "2024-01-16T10:45:00Z",
      firstMessage:
        "아이폰 15 프로를 수입할 때 HS Code와 관세율이 어떻게 되나요?",
      lastMessage: "추가 질문이 있으시면 언제든 문의해 주세요.",
      partitionYear: 2024,
    },
    {
      sessionId: "chat_session_20240115_098765",
      sessionTitle: "전자제품 수입 규제 확인",
      messageCount: 4,
      createdAt: "2024-01-15T14:20:00Z",
      updatedAt: "2024-01-15T14:35:00Z",
      firstMessage:
        "전자제품을 중국에서 수입할 때 필요한 인증서류가 무엇인가요?",
      lastMessage: "KC 인증과 전파인증이 필수입니다.",
      partitionYear: 2024,
    },
  ],
  pagination: {
    currentPage: 1,
    totalPages: 3,
    totalElements: 45,
    pageSize: 20,
    hasNext: true,
    hasPrevious: false,
  },
  summary: {
    totalSessions: 45,
    totalMessages: 180,
    sessionsLast30Days: 8,
    oldestSessionDate: "2023-06-15T09:00:00Z",
    newestSessionDate: "2024-01-16T10:32:00Z",
  },
};

/**
 * 채팅 검색 결과 Mock 데이터 (v6.1)
 */
export const mockChatSearchResponse: ChatSearchResponse = {
  searchResults: [
    {
      sessionId: "chat_session_20240116_123456",
      sessionTitle: "아이폰 15 프로 수입 HS Code 문의",
      matchedMessage:
        "아이폰 15 프로를 수입할 때 HS Code와 관세율이 어떻게 되나요?",
      matchType: "USER_MESSAGE",
      createdAt: "2024-01-16T10:32:00Z",
      relevanceScore: 0.95,
    },
  ],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalElements: 5,
    pageSize: 20,
    hasNext: false,
    hasPrevious: false,
  },
  searchInfo: {
    keyword: "아이폰",
    searchTimeMs: 150,
    totalMatches: 5,
  },
};
