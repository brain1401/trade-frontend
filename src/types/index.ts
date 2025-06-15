// 기존 타입들을 도메인별로 분리하여 re-export
export type {
  ExchangeRate,
  TradeStatistics,
  CountryInfo,
} from "./domain/trade";
export type {
  TradeNews,
  HSCodeNews,
  NewsType,
  NewsFilterOption,
} from "./domain/news";
export type {
  User,
  UserStats,
  QuickLinkItem,
  UserPreferences,
} from "./domain/user";
export type {
  SearchResult,
  SearchRequest,
  PopularKeyword,
  RecentSearchItem,
} from "./domain/search";
export type {
  ApiResponse,
  ApiError,
  PaginationRequest,
  PaginationResponse,
} from "./api/common";

// 컴포넌트 공통 타입
export type ContentCardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleRightElement?: React.ReactNode;
};

// 레거시 타입 (하위 호환성을 위해 유지)
export type FilterOption = "latest" | "bookmarked";
