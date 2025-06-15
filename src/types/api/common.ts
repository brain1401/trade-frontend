// API 공통 응답 타입 정의
export type ApiResponse<T> = {
  result: "SUCCESS" | "ERROR";
  message: string;
  data: T;
  timestamp?: string;
  correlationId?: string;
};

// API 에러 타입 정의
export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, any>;
};

// 페이지네이션 타입
export type PaginationRequest = {
  page: number;
  size: number;
  sort?: string;
  direction?: "ASC" | "DESC";
};

export type PaginationResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
};

// 검색 필터 기본 타입
export type SearchFilters = {
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];
  countries?: string[];
};

// 정렬 옵션
export type SortOption = "relevance" | "date" | "popularity";
