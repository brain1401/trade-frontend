// 뉴스 타입 분류
export type NewsType = "규제" | "관세" | "뉴스";

// 기본 뉴스 타입
export type BaseNews = {
  id: number;
  title: string;
  summary: string;
  source: string;
  date: string;
  uuid: string;
  type: NewsType;
};

// 무역 뉴스 타입
export type TradeNews = BaseNews & {
  hscode: string;
};

// HS Code 관련 뉴스 타입
export type HSCodeNews = BaseNews & {
  hscode: string;
  bookmarked: boolean;
};

// 뉴스 필터 옵션
export type NewsFilterOption = "latest" | "bookmarked";

// 뉴스 검색 요청 타입
export type NewsSearchRequest = {
  query?: string;
  type?: NewsType;
  hsCode?: string;
  dateFrom?: string;
  dateTo?: string;
  source?: string;
  bookmarked?: boolean;
};
