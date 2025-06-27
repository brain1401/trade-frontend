/**
 * 통합 API 모듈
 * 모든 도메인별 API를 중앙에서 관리
 */

// 공통 모듈
export * from "./common";

// 도메인별 API 모듈
export * from "./chat";
export * from "./exchange-rates";
export * from "./news";
export * from "./notification";
export * from "./bookmark";

// 하위 호환성을 위한 기본 export
export { httpClient, ApiError } from "./common";
export { chatApi, chatHistoryApi } from "./chat";
export { exchangeRatesApi } from "./exchange-rates";
export { newsApi } from "./news";
export { notificationApi } from "./notification";
export { bookmarkApi } from "./bookmark";
