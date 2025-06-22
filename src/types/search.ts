import type { JobStatus, SourceInfo } from "./base";

/**
 * 검색/분석 API 관련 타입 정의 (API v2.4)
 *
 * Public API: 로그인 없이 사용 가능한 검색 기능
 */

/**
 * 의도 분석 요청 타입
 */
export type IntentAnalysisRequest = {
  /** 사용자 검색 질의 (자연어) */
  query: string;
};

/**
 * 의도 타입 (API v2.4 표준)
 */
export type IntentType =
  | "HS_CODE_ANALYSIS" // HS Code 분석 및 품목 분류
  | "CARGO_TRACKING" // 화물 추적 조회
  | "GENERAL_TRADE_INQUIRY"; // 일반 무역 정보 조회

/**
 * 의도 분석 응답 타입
 */
export type IntentAnalysisResponse = {
  /** 분석된 사용자 의도 코드 */
  intent: IntentType;
  /** 의도 분석 신뢰도 (0.0 ~ 1.0) */
  confidence: number;
  /** 추천 다음 단계 액션 */
  suggestedAction: string;
  /** 질의에서 추출된 핵심 키워드 */
  extractedKeywords: string[];
  /** 다음 단계 API 엔드포인트 URL */
  nextStepUrl: string;
};

/**
 * HS Code 분석 시작 요청 타입
 */
export type HSCodeAnalysisStartRequest = {
  /** 분석할 품목명 또는 상품 설명 */
  query: string;
  /** 추가 분석 정보 */
  additionalInfo?: {
    /** 무역 목적 */
    purpose?: string;
    /** 대상 국가명 */
    targetCountry?: string;
  };
};

/**
 * 작업 시작 응답 타입
 */
export type JobStartResponse = {
  /** 분석 작업 고유 식별자 */
  jobId: string;
  /** 현재 작업 상태 */
  status: JobStatus;
  /** 예상 완료 시간 (초) */
  estimatedTime: number;
  /** 실시간 결과 스트리밍 URL */
  streamUrl: string;
};

/**
 * SSE 이벤트 타입
 */
export type SSEEventType =
  | "thinking" // AI 분석 시작
  | "stream_start" // 스트리밍 시작
  | "stream_data" // 스트리밍 데이터
  | "stream_end"; // 스트리밍 완료

/**
 * SSE 스트리밍 데이터 타입
 */
export type SSEStreamData = {
  /** 스트리밍 콘텐츠 */
  content?: string;
  /** 진행률 (0-100) */
  progress?: number;
  /** 상태 메시지 */
  message?: string;
};

/**
 * 수출 요건 정보 타입
 */
export type ExportRequirement = {
  /** 대상 국가 */
  country: string;
  /** 필요 서류 목록 */
  requirements: string[];
  /** 관세율 */
  tariffRate: string;
  /** 추가 참고사항 */
  notes?: string;
};

/**
 * 인증서 정보 타입
 */
export type CertificationInfo = {
  /** 인증서명 */
  name: string;
  /** 인증서 설명 */
  description: string;
  /** 필수 여부 */
  required: boolean;
  /** 발급 기관 */
  issuer?: string;
  /** 유효 기간 */
  validityPeriod?: string;
};

/**
 * 관련 뉴스 타입
 */
export type RelatedNews = {
  /** 뉴스 제목 */
  title: string;
  /** 뉴스 URL */
  url: string;
  /** 소스명 */
  sourceName: string;
  /** 발행일시 (ISO 8601) */
  publishedAt: string;
  /** 요약 */
  summary?: string;
};

/**
 * 무역 통계 정보 타입
 */
export type TradeStatisticsInfo = {
  /** 연도별 수출 통계 */
  yearlyExport: Record<string, string>;
  /** 연도별 수입 통계 */
  yearlyImport?: Record<string, string>;
  /** 주요 수출 대상국 */
  topDestinations: string[];
  /** 주요 수입국 */
  topOrigins?: string[];
};

/**
 * HS Code 분석 결과 타입
 */
export type HSCodeAnalysisResult = {
  /** HS Code */
  hsCode: string;
  /** 품목 설명 */
  description: string;
  /** 분석 내용 */
  analysis: {
    /** 분석 요약 */
    summary: string;
    /** 수출 요건 */
    exportRequirements: ExportRequirement[];
    /** 필요 인증서 */
    certifications: CertificationInfo[];
    /** 관련 뉴스 */
    relatedNews: RelatedNews[];
    /** 무역 통계 */
    tradeStatistics: TradeStatisticsInfo;
  };
  /** 참고 자료 출처 */
  sources: SourceInfo[];
};

/**
 * 일반 무역 정보 조회 시작 요청 타입
 */
export type GeneralTradeInquiryStartRequest = {
  /** 검색 질의 */
  query: string;
  /** 추가 컨텍스트 */
  additionalContext?: {
    /** 지역 */
    region?: string;
    /** 시간 범위 */
    timeframe?: string;
    /** 관심 주제 */
    topics?: string[];
  };
};

/**
 * 일반 무역 정보 조회 결과 타입
 */
export type GeneralTradeInquiryResult = {
  /** AI 생성 답변 */
  answer: string;
  /** 관련 뉴스 */
  relatedNews: RelatedNews[];
  /** 참고 자료 출처 */
  sources: SourceInfo[];
  /** 관련 주제 */
  relatedTopics: string[];
  /** 추천 사항 */
  recommendations: string[];
};

/**
 * 인기 검색어 타입
 */
export type PopularKeyword = {
  /** 검색어 */
  keyword: string;
  /** 검색 횟수 */
  searchCount: number;
  /** 트렌딩 여부 */
  trending: boolean;
  /** 카테고리 */
  category?: string;
};

/**
 * 최근 검색 항목 타입
 */
export type RecentSearchItem = {
  /** 검색어 */
  text: string;
  /** 관련 HS Code */
  hscode?: string;
  /** 검색 일시 */
  searchedAt: Date;
  /** 검색 결과 타입 */
  resultType: IntentType;
};

/**
 * 검색 결과 타입
 */
export type SearchResult = {
  /** 결과 ID */
  id: string;
  /** 제목 */
  title: string;
  /** 설명 */
  description: string;
  /** 결과 타입 */
  type: "hscode" | "regulation" | "news" | "cargo" | "general";
  /** 관련성 점수 */
  relevanceScore: number;
  /** 하이라이트된 텍스트 */
  highlightedText?: string;
  /** 메타데이터 */
  metadata: Record<string, any>;
  /** 생성 일시 */
  createdAt: string;
};
