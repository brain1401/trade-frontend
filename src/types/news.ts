import type { NewsCategory, ImportanceLevel, SourceInfo } from "./base";

/**
 * 뉴스 관련 타입 정의 (API v2.4)
 *
 * API 명세서의 관련 뉴스 및 무역 정보에 맞춘 타입 정의
 */

/**
 * 기본 뉴스 타입
 */
export type BaseNews = {
  /** 뉴스 고유 식별자 */
  uuid: string;
  /** 뉴스 제목 */
  title: string;
  /** 뉴스 요약 */
  summary: string;
  /** 뉴스 전문 */
  content: string;
  /** 뉴스 소스/출처 */
  source: string;
  /** 뉴스 카테고리 */
  category: NewsCategory;
  /** 관련 태그 */
  tags: string[];
  /** 중요도 */
  importance: ImportanceLevel;
  /** 발행일 (ISO 8601) */
  date: string;
  /** 원문 URL */
  url: string;
};

/**
 * 무역 뉴스 타입 (일반 무역 정보 조회 결과용)
 */
export type TradeNews = BaseNews & {
  /** 발행 일시 (ISO 8601) */
  publishedAt: string;
  /** 뉴스 타입 */
  type: "규제" | "뉴스" | "관세" | "정책" | "협정";
  /** 관련 국가 */
  relatedCountries?: string[];
  /** 영향받는 산업 */
  affectedIndustries?: string[];
  /** 시행일 (정책/규제 뉴스인 경우, ISO 8601) */
  effectiveDate?: string;
};

/**
 * HS Code 관련 뉴스 타입 (HS Code 분석 결과용)
 */
export type HSCodeNews = BaseNews & {
  /** 관련 HS Code */
  hscode: string;
  /** 발행일시 (ISO 8601) */
  publishedAt: string;
  /** 북마크 여부 (로그인한 사용자의 경우) */
  bookmarked: boolean;
  /** 뉴스 영향도 */
  impact?: "HIGH" | "MEDIUM" | "LOW";
  /** 관련 키워드 */
  relatedKeywords?: string[];
};

/**
 * HS Code 정보 뉴스 타입 (규제/관세 변경 등)
 */
export type HSCodeInfo = BaseNews & {
  /** 관련 HS Code */
  hsCode: string;
  /** 정보 타입 */
  type: "tariff" | "certification" | "regulation" | "policy";
  /** 발행일시 (ISO 8601) */
  publishedAt: string;
  /** 시행일 (ISO 8601) */
  effectiveDate: string;
  /** 관련 규제/법령 */
  relatedRegulations: string[];
  /** 변경 사항 */
  changes?: {
    /** 변경 전 값 */
    previous?: string;
    /** 변경 후 값 */
    current: string;
    /** 변경 사유 */
    reason?: string;
  };
  /** 영향받는 품목 */
  affectedItems?: string[];
};

/**
 * 뉴스 검색 필터 타입
 */
export type NewsSearchFilter = {
  /** 카테고리 필터 */
  categories?: NewsCategory[];
  /** 중요도 필터 */
  importance?: ImportanceLevel[];
  /** 날짜 범위 */
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  /** 관련 HS Code */
  hsCode?: string;
  /** 키워드 */
  keywords?: string[];
  /** 소스 필터 */
  sources?: string[];
};

/**
 * 뉴스 검색 결과 타입
 */
export type NewsSearchResult = {
  /** 검색된 뉴스 목록 */
  items: TradeNews[];
  /** 페이지네이션 정보 */
  pagination: {
    /** 현재 페이지 */
    page: number;
    /** 페이지 크기 */
    limit: number;
    /** 전체 항목 수 */
    total: number;
    /** 전체 페이지 수 */
    totalPages: number;
  };
  /** 검색 통계 */
  searchStats: {
    /** 검색 소요 시간 (ms) */
    searchTime: number;
    /** 카테고리별 분포 */
    categoryDistribution: Record<NewsCategory, number>;
    /** 중요도별 분포 */
    importanceDistribution: Record<ImportanceLevel, number>;
  };
};

/**
 * 뉴스 알림 설정 타입
 */
export type NewsAlertSettings = {
  /** 알림 ID */
  id: string;
  /** 알림명 */
  name: string;
  /** 활성화 여부 */
  enabled: boolean;
  /** 필터 조건 */
  filters: NewsSearchFilter;
  /** 알림 방식 */
  notificationMethods: ("email" | "browser" | "sms")[];
  /** 알림 빈도 */
  frequency: "realtime" | "daily" | "weekly";
  /** 생성 일시 (ISO 8601) */
  createdAt: string;
  /** 마지막 업데이트 (ISO 8601) */
  updatedAt: string;
};

/**
 * 뉴스 트렌드 분석 타입
 */
export type NewsTrendAnalysis = {
  /** 분석 기간 */
  period: {
    startDate: string;
    endDate: string;
  };
  /** 인기 키워드 */
  trendingKeywords: Array<{
    keyword: string;
    count: number;
    growth: number;
    relatedNews: number;
  }>;
  /** 주요 이슈 */
  majorIssues: Array<{
    title: string;
    description: string;
    newsCount: number;
    importance: ImportanceLevel;
    relatedHSCodes?: string[];
  }>;
  /** 카테고리별 활동 */
  categoryActivity: Record<
    NewsCategory,
    {
      newsCount: number;
      avgImportance: number;
      topKeywords: string[];
    }
  >;
};

/**
 * 뉴스 요약 리포트 타입
 */
export type NewsSummaryReport = {
  /** 리포트 생성 일시 (ISO 8601) */
  generatedAt: string;
  /** 리포트 기간 */
  period: {
    startDate: string;
    endDate: string;
  };
  /** 핵심 요약 */
  executiveSummary: string;
  /** 주요 뉴스 */
  majorNews: TradeNews[];
  /** 정책 변화 */
  policyChanges: Array<{
    title: string;
    summary: string;
    impact: ImportanceLevel;
    effectiveDate?: string;
    relatedIndustries: string[];
  }>;
  /** 시장 동향 */
  marketTrends: Array<{
    trend: string;
    description: string;
    supportingNews: Array<{
      title: string;
      url: string;
    }>;
  }>;
  /** 추천 액션 */
  recommendedActions: string[];
};
