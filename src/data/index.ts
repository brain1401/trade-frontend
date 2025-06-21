// 목업 데이터 통합 관리 인덱스 파일

// 공통 데이터
export * from "./common";

// 뉴스 관련
export * from "./mock/news";

// 검색 관련
export * from "./mock/search";

// 환율 관련
export * from "./mock/exchange-rates";

// 무역 통계 관련
export * from "./mock/trade-statistics";

// 화물 추적 관련
export * from "./mock/tracking";

// HS Code 관련
export * from "./mock/hscode";

// 사용자 관련
export * from "./mock/user";

// 알림 관련
export * from "./mock/notifications";

// 대시보드 관련
export * from "./mock/dashboard";

// 인증 관련
export * from "./mock/auth";

// 레거시 지원을 위한 호환성 export
export { mockPopularKeywords, mockRecentSearchItems } from "./mock/search";
export {
  mockExchangeRates,
  mockGlobalExchangeRates,
} from "./mock/exchange-rates";
export { mockTradeNews, mockHSCodeNews } from "./mock/news";
export { mockCurrentUser } from "./mock/user";
export { mockBookmarks, mockUpdatesFeed } from "./mock/dashboard";
