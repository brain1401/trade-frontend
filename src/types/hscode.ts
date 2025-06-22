import type { SourceInfo, JobStatus } from "./base";
import type {
  ExportRequirement,
  CertificationInfo,
  RelatedNews,
  TradeStatisticsInfo,
  HSCodeAnalysisResult,
} from "./search";

/**
 * HS Code 분석 API 관련 타입 정의 (API v2.4)
 *
 * Public API: HS Code 분석은 로그인 없이 사용 가능
 */

/**
 * HS Code 기본 정보 타입
 */
export type HSCodeInfo = {
  /** HS Code (10자리) */
  code: string;
  /** 품목 설명 */
  description: string;
  /** 품목 분류 */
  category: string;
  /** 세부 분류 */
  subCategory?: string;
  /** 관련 키워드 */
  keywords: string[];
  /** 유효 기간 */
  validFrom?: string;
  validTo?: string;
};

/**
 * HS Code 분류 단계별 정보 타입
 */
export type HSCodeClassification = {
  /** 2자리 류(Class) */
  class: {
    code: string;
    name: string;
  };
  /** 4자리 호(Heading) */
  heading: {
    code: string;
    name: string;
  };
  /** 6자리 소호(Subheading) */
  subheading: {
    code: string;
    name: string;
  };
  /** 10자리 세번(Tariff Number) */
  tariffNumber: {
    code: string;
    name: string;
  };
};

/**
 * HS Code 관세 정보 타입
 */
export type HSCodeTariffInfo = {
  /** 기본 관세율 */
  basicRate: string;
  /** 협정 관세율 */
  agreementRates: {
    /** 협정명 (예: 한-미 FTA) */
    agreement: string;
    /** 관세율 */
    rate: string;
    /** 적용 조건 */
    conditions?: string[];
  }[];
  /** 계절 관세 여부 */
  seasonalTariff: boolean;
  /** 할당 관세 정보 */
  quotaTariff?: {
    quotaRate: string;
    overQuotaRate: string;
    quotaAmount: string;
  };
};

/**
 * HS Code 규제 정보 타입
 */
export type HSCodeRegulationInfo = {
  /** 수입 규제 */
  importRegulations: {
    /** 규제 타입 */
    type: "금지" | "제한" | "허가" | "신고";
    /** 규제 내용 */
    description: string;
    /** 관련 법령 */
    law?: string;
    /** 담당 기관 */
    authority?: string;
  }[];
  /** 수출 규제 */
  exportRegulations: {
    type: "금지" | "제한" | "허가" | "신고";
    description: string;
    law?: string;
    authority?: string;
  }[];
  /** 필수 인증서/허가서 */
  requiredCertifications: CertificationInfo[];
};

/**
 * 분석 메시지 타입 (챗봇 인터페이스용)
 */
export type AnalysisMessage = {
  /** 메시지 고유 ID */
  id: string;
  /** 메시지 타입 */
  type: "user" | "assistant" | "smart_question" | "system";
  /** 메시지 내용 */
  content: string;
  /** 메시지 생성 시간 (ISO 8601) */
  timestamp: string;
  /** 선택 옵션 (스마트 질문인 경우) */
  options?: string[];
  /** 분석 결과 (결과 메시지인 경우) */
  analysisResult?: HSCodeAnalysisResult;
  /** 메시지 상태 */
  status?: "sending" | "sent" | "delivered" | "error";
};

/**
 * HS Code 검색 옵션 타입
 */
export type HSCodeSearchOptions = {
  /** 검색 모드 */
  mode: "exact" | "fuzzy" | "keyword";
  /** 검색 범위 */
  scope?: {
    /** 특정 류(Class)에서만 검색 */
    classCode?: string;
    /** 특정 호(Heading)에서만 검색 */
    headingCode?: string;
  };
  /** 정렬 옵션 */
  sort?: {
    field: "code" | "name" | "relevance";
    direction: "asc" | "desc";
  };
  /** 결과 제한 */
  limit?: number;
};

/**
 * HS Code 검색 결과 타입
 */
export type HSCodeSearchResult = {
  /** 검색 결과 항목들 */
  items: {
    /** HS Code */
    code: string;
    /** 품목명 */
    name: string;
    /** 관련성 점수 (0.0 ~ 1.0) */
    relevanceScore: number;
    /** 하이라이트된 부분 */
    highlightedName?: string;
    /** 부모 분류 정보 */
    parentClassification: {
      classCode: string;
      className: string;
      headingCode: string;
      headingName: string;
    };
  }[];
  /** 검색 통계 */
  statistics: {
    /** 전체 결과 수 */
    totalCount: number;
    /** 검색 소요 시간 (ms) */
    searchTime: number;
    /** 사용된 검색 모드 */
    usedMode: "exact" | "fuzzy" | "keyword";
  };
};

/**
 * HS Code 비교 분석 타입
 */
export type HSCodeComparison = {
  /** 비교 대상 HS Code들 */
  codes: string[];
  /** 비교 결과 */
  comparison: {
    /** 공통점 */
    similarities: string[];
    /** 차이점 */
    differences: {
      code: string;
      aspect: "관세율" | "규제" | "인증" | "분류";
      value: string;
    }[];
    /** 추천 사항 */
    recommendations: string[];
  };
};

/**
 * HS Code 변경 이력 타입
 */
export type HSCodeChangeHistory = {
  /** 변경 ID */
  id: string;
  /** HS Code */
  code: string;
  /** 변경 타입 */
  changeType: "신설" | "폐지" | "이관" | "내용변경";
  /** 변경 전 정보 */
  previousInfo?: {
    code?: string;
    name?: string;
    description?: string;
  };
  /** 변경 후 정보 */
  newInfo: {
    code: string;
    name: string;
    description: string;
  };
  /** 변경 사유 */
  reason: string;
  /** 시행일 (ISO 8601) */
  effectiveDate: string;
  /** 관련 공고 */
  announcement?: {
    title: string;
    url: string;
    publishedAt: string;
  };
};

/**
 * HS Code 통계 정보 타입
 */
export type HSCodeStatistics = {
  /** HS Code */
  code: string;
  /** 기간 */
  period: {
    startDate: string;
    endDate: string;
  };
  /** 무역 통계 */
  tradeStats: {
    /** 수출 실적 */
    export: {
      value: number;
      weight: number;
      unit: string;
      growthRate: number;
    };
    /** 수입 실적 */
    import: {
      value: number;
      weight: number;
      unit: string;
      growthRate: number;
    };
  };
  /** 주요 거래국 */
  majorCountries: {
    /** 수출국 */
    exportCountries: Array<{
      country: string;
      value: number;
      share: number;
    }>;
    /** 수입국 */
    importCountries: Array<{
      country: string;
      value: number;
      share: number;
    }>;
  };
};
