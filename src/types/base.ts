/**
 * @file 도메인 전반에서 사용되는 원자적(atomic) 기본 타입 정의
 * @description
 * 특정 도메인에 종속되지 않고, 프로젝트 전반에서 재사용되는 가장 기본적인 타입들을 정의함.
 * - API 응답 구조와 같은 상위 레벨 타입은 `common.ts`에 정의.
 * - 특정 도메인(뉴스, 인증 등)에 특화된 타입은 각 `types/{domain}.ts`에 정의.
 */

/**
 * 중요도 레벨 타입 (API v2.4 표준)
 */
export type ImportanceLevel = "HIGH" | "MEDIUM" | "LOW";

/**
 * 뉴스 카테고리 타입
 */
export type NewsCategory = "무역" | "규제" | "관세" | "인증" | "정책";

/**
 * 국가 정보 타입
 */
export type CountryInfo = {
  /** 국가 코드 (ISO 3166-1 alpha-2) */
  code: string;
  /** 국가명 */
  name: string;
  /** 국기 이미지 URL 또는 이모지 */
  flag: string;
};

/**
 * 환율 정보 타입
 */
export type ExchangeRate = {
  /** 통화 코드 (USD, EUR, JPY 등) */
  currency: string;
  /** 통화명 */
  currencyName: string;
  /** 환율 */
  rate: number;
  /** 전일 대비 변동률 */
  change: number;
  /** 통화 심볼 */
  symbol: string;
  /** 마지막 업데이트 시간 */
  lastUpdated: string;
};

/**
 * 사용자 설정 타입
 */
export type UserPreferences = {
  /** 언어 설정 */
  language: string;
  /** 타임존 설정 */
  timezone: string;
  /** 알림 설정 */
  notifications: {
    email: boolean;
    browser: boolean;
    sms: boolean;
  };
  /** 기본 화면 설정 */
  defaultView: string;
};

/**
 * 정렬 옵션 타입
 */
export type SortOption = {
  /** 정렬 필드 */
  field: string;
  /** 정렬 방향 */
  direction: "asc" | "desc";
};

/**
 * 날짜 범위 타입
 */
export type DateRange = {
  /** 시작 날짜 */
  startDate: string;
  /** 종료 날짜 */
  endDate: string;
};

/**
 * 소스 정보 타입 (신뢰도 포함)
 */
export type SourceInfo = {
  /** 소스 제목 */
  title: string;
  /** 소스 URL */
  url: string;
  /** 소스 타입 */
  type: "OFFICIAL" | "ANALYSIS" | "NEWS" | "REFERENCE";
  /** 신뢰도 */
  reliability?: "HIGH" | "MEDIUM" | "LOW";
  /** 간단한 설명 */
  snippet?: string;
};

/**
 * 작업 상태 타입 (비동기 작업용)
 */
export type JobStatus =
  | "THINKING" // AI가 생각 중
  | "PROCESSING" // 처리 중
  | "COMPLETED" // 완료
  | "FAILED" // 실패
  | "EXPIRED"; // 만료
