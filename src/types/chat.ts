/**
 * 채팅 API 타입 정의 (API v6.1 - 회원/비회원 차별화 시스템)
 *
 * v6.1의 혁신적 변화:
 * - 회원/비회원 차별화된 채팅 시스템
 * - JWT 세부화 인증 (Access 30분, Refresh 1일/30일)
 * - SSE 메타데이터 기반 북마크 시스템
 * - 3단계 병렬 처리 (자연어 응답 + 상세페이지 + 회원 기록 저장)
 */

/**
 * 채팅 요청 타입 (POST /api/chat)
 */
export type ChatRequest = {
  /** 사용자 질문 메시지 (자연어, 2~1000자) */
  message: string;
  /** 🆕 v6.1: 회원의 기존 세션 ID (연속 대화 시, 회원만) */
  sessionId?: string;
  /** 추가 컨텍스트 정보 (IP, User-Agent 등) */
  context?: {
    userAgent?: string;
    language?: string;
  };
};

/**
 * 채팅 응답 타입 (POST /api/chat 응답) - v6.1에서는 즉시 SSE 스트리밍 시작
 */
export type ChatResponse = {
  /** 🆕 v6.1: 스트리밍이 즉시 시작되므로 성공 확인용 */
  success: "SUCCESS";
  message: string;
  /** SSE 스트리밍이 즉시 시작됨을 알리는 메시지 */
  data: null;
};

/**
 * Server-Sent Events 이벤트 타입 (v6.1 - 3단계 병렬 처리)
 */
export type SSEEventType =
  // 🆕 v6.1: 초기 메타데이터 (회원/비회원 차별화)
  | "initial_metadata" // TrAI-Bot 의도 분석 + 회원/비회원 상태 + RAG 활성화
  | "session_info" // 회원/비회원 차별화 정보

  // Phase 1: Thinking Events (v6.1 3단계 병렬 처리)
  | "thinking_intent_analysis" // 질문 의도 분석 중
  | "thinking_parallel_processing_start" // 🆕 3단계 병렬 처리 시작
  | "thinking_rag_search_planning" // RAG 검색 계획 수립 중
  | "thinking_rag_search_executing" // 벡터 DB 검색 실행 중
  | "thinking_web_search_executing" // 웹검색 실행 중
  | "thinking_data_processing" // RAG + 웹 데이터 통합 분석 중
  | "thinking_detail_page_preparation" // 상세페이지 정보 병렬 준비 중
  | "thinking_member_record_saving" // 🆕 회원 대화 기록 저장 중 (회원만)
  | "thinking_response_generation" // 최종 응답 생성 중

  // Phase 2: Main Message Events (최종 답변)
  | "main_message_start" // 메인 메시지 시작
  | "main_message_data" // 메인 메시지 데이터 스트림
  | "main_message_complete" // 메인 메시지 완료 (🆕 v6.1: SSE 메타데이터 포함)

  // 🆕 v6.1: 상세페이지 버튼 이벤트 (병렬 처리)
  | "detail_page_buttons_start" // 상세페이지 버튼 준비 시작
  | "detail_page_button_ready" // 개별 버튼 준비 완료
  | "detail_page_buttons_complete" // 모든 버튼 준비 완료

  // 🆕 v6.1: 회원 전용 이벤트
  | "member_session_created" // 회원 세션 생성 완료
  | "member_record_saved" // 회원 대화 기록 저장 완료

  // 오류 이벤트
  | "error"; // 에러 발생

/**
 * 🆕 v6.1: 초기 메타데이터 이벤트 데이터
 */
export type InitialMetadataEvent = {
  /** TrAI-Bot 분석 의도 */
  claudeIntent: QueryType;
  /** 예상 처리 시간 (초) */
  estimatedTime: number;
  /** 인증 상태 */
  isAuthenticated: boolean;
  /** 🆕 세션 생성 여부 (회원만) */
  sessionCreated?: boolean;
  /** 🆕 세션 ID (회원만) */
  sessionId?: string;
  /** RAG 검색 활성화 여부 */
  ragEnabled: boolean;
  /** 3단계 병렬 처리 활성화 여부 */
  parallelProcessing: boolean;
};

/**
 * 🆕 v6.1: 세션 정보 이벤트 데이터 (회원/비회원 차별화)
 */
export type SessionInfoEvent = {
  /** 인증 상태 */
  isAuthenticated: boolean;
  /** 사용자 타입 */
  userType: "MEMBER" | "GUEST";
  /** 세션 ID (회원만) */
  sessionId?: string;
  /** 기록 활성화 여부 (회원만) */
  recordingEnabled: boolean;
  /** 차별화 안내 메시지 */
  message: string;
};

/**
 * Thinking 단계 이벤트 데이터 (v6.1 업데이트)
 */
export type ThinkingEventData = {
  /** 처리 단계 */
  stage: string;
  /** AI 사고과정 메시지 */
  content: string;
  /** 진행률 (0-100) */
  progress: number;
  /** 🆕 사용자 타입 (일부 이벤트에서) */
  userType?: "MEMBER" | "GUEST";
};

/**
 * Main Message 데이터 스트림 이벤트
 */
export type MainMessageDataEvent = {
  /** 이벤트 타입 */
  type: "content";
  /** 스트리밍 텍스트 조각 */
  content: string;
};

/**
 * 🆕 v6.1: Main Message 완료 이벤트 데이터 (SSE 메타데이터 기반 북마크)
 */
export type MainMessageCompleteEvent = {
  /** 이벤트 타입 */
  type: "metadata";
  /** 참고 자료 출처 목록 */
  sources?: SourceReference[];
  /** 관련 정보 메타데이터 */
  relatedInfo?: RelatedInfo;
  /** 처리 시간 (초) */
  processingTime: number;
  /** 세션 ID (회원만) */
  sessionId?: string;
  /** RAG 검색 소스 */
  ragSources: string[];
  /** 캐시 히트 여부 */
  cacheHit: boolean;

  /** 🆕 v6.1: SSE 메타데이터 기반 북마크 데이터 */
  bookmarkData?: {
    /** 북마크 가능 여부 */
    available: boolean;
    /** HS Code */
    hsCode?: string;
    /** 제품명 */
    productName?: string;
    /** 분류 신뢰도 */
    confidence?: number;
  };
};

/**
 * 🆕 v6.1: 상세페이지 버튼 이벤트 데이터
 */
export type DetailPageButtonEvent = {
  /** 이벤트 타입 */
  type: "button";
  /** 버튼 타입 */
  buttonType: "HS_CODE" | "REGULATION" | "STATISTICS";
  /** 우선순위 */
  priority: number;
  /** 상세페이지 URL */
  url: string;
  /** 버튼 제목 */
  title: string;
  /** 버튼 설명 */
  description: string;
  /** 준비 완료 여부 */
  isReady: boolean;
};

/**
 * 🆕 v6.1: 회원 전용 이벤트 데이터
 */
export type MemberSessionEvent = {
  /** 이벤트 타입 */
  type: "session_created" | "record_saved";
  /** 세션 ID */
  sessionId: string;
  /** 첫 메시지 여부 (세션 생성 시) */
  isFirstMessage?: boolean;
  /** 메시지 수 (기록 저장 시) */
  messageCount?: number;
  /** 파티션 연도 (기록 저장 시) */
  partitionYear?: number;
  /** 타임스탬프 */
  timestamp: string;
};

/**
 * 참고 자료 출처 정보
 */
export type SourceReference = {
  /** 출처 제목 */
  title: string;
  /** 출처 URL */
  url: string;
  /** 출처 타입 */
  type: "OFFICIAL" | "NEWS" | "REGULATION" | "STATISTICS" | "OTHER";
};

/**
 * 관련 정보 메타데이터
 */
export type RelatedInfo = {
  /** HS Code (HS Code 분석 시) */
  hsCode?: string;
  /** 품목 카테고리 */
  category?: string;
  /** 화물 번호 (화물 추적 시) */
  trackingNumber?: string;
  /** 국가 코드 (규제 조회 시) */
  countryCode?: string;
  /** 기타 메타데이터 */
  [key: string]: unknown;
};

/**
 * 에러 이벤트 데이터
 */
export type ErrorEventData = {
  /** 에러 코드 */
  errorCode: string;
  /** 에러 메시지 */
  message: string;
  /** HTTP 상태 코드 (선택적) */
  statusCode?: number;
};

/**
 * 🆕 v6.1: TrAI-Bot + RAG 의도 분석 결과
 */
export type QueryType =
  | "HS_CODE_ANALYSIS" // HS Code 분류 및 관세율 조회
  | "CARGO_TRACKING" // 화물 추적 및 상태 조회
  | "TRADE_REGULATION" // 무역 규제 및 요건 조회
  | "GENERAL_TRADE_INFO" // 일반 무역 정보 및 절차
  | "MARKET_ANALYSIS" // 시장 분석 및 통계
  | "NON_TRADE_RELATED"; // 무역 관련 없음 (처리 거부)

/**
 * 채팅 세션 상태 타입
 */
export type ChatSessionStatus =
  | "PENDING" // 대기 중
  | "THINKING" // AI 사고 중
  | "RESPONDING" // 응답 생성 중
  | "COMPLETED" // 완료
  | "FAILED" // 실패
  | "EXPIRED"; // 만료

/**
 * 🆕 v6.1: 실시간 채팅 상태 관리용 타입 (3단계 병렬 처리 지원)
 */
export type ChatState = {
  /** 현재 상태 */
  status: ChatSessionStatus;
  /** 🆕 회원/비회원 상태 */
  isAuthenticated: boolean;
  userType: "MEMBER" | "GUEST";
  sessionId: string | null;

  /** 초기 메타데이터 */
  initialMetadata: InitialMetadataEvent | null;
  /** 사고과정 메시지들 */
  thinkingMessages: string[];
  /** 메인 응답 내용 */
  mainResponse: string;
  /** 완료 데이터 */
  completeData: MainMessageCompleteEvent | null;

  /** 🆕 v6.1: 3단계 병렬 처리 상태 */
  parallelProcessing: {
    /** 메인 메시지 완료 여부 */
    mainMessageComplete: boolean;
    /** 상세페이지 버튼들 */
    detailButtons: DetailPageButtonEvent[];
    /** 회원 기록 저장 완료 여부 */
    memberRecordSaved: boolean;
    /** 모든 처리 완료 여부 */
    allProcessingComplete: boolean;
  };

  /** 🆕 v6.1: SSE 메타데이터 기반 북마크 데이터 */
  bookmarkData: {
    available: boolean;
    hsCode?: string;
    productName?: string;
    confidence?: number;
  } | null;

  /** 에러 정보 */
  error: ErrorEventData | null;
};

/**
 * SSE 연결 옵션
 */
export type SSEConnectionOptions = {
  /** 재연결 시도 횟수 */
  retryAttempts?: number;
  /** 재연결 지연 시간 (ms) */
  retryDelay?: number;
  /** 타임아웃 시간 (ms) */
  timeout?: number;
  /** 연결 종료 콜백 */
  onClose: () => void;
  /** 에러 콜백 */
  onError?: (error: Error) => void;
};

/**
 * 채팅 히스토리 아이템 (클라이언트 사이드 저장용)
 */
export type ChatHistoryItem = {
  /** 고유 ID */
  id: string;
  /** 사용자 질문 */
  userMessage: string;
  /** AI 응답 */
  aiResponse: string;
  /** 질의 유형 */
  queryType: QueryType;
  /** 생성 시간 */
  createdAt: string;
  /** 관련 정보 */
  relatedInfo?: RelatedInfo;
  /** 참고 자료 */
  sources?: SourceReference[];
  /** 🆕 v6.1: 북마크 데이터 */
  bookmarkData?: {
    available: boolean;
    hsCode?: string;
    productName?: string;
    confidence?: number;
  };
};

// ======================================================================================
// 🆕 v6.1: 회원 전용 채팅 기록 API 타입
// ======================================================================================

/**
 * 채팅 세션 목록 조회 API 쿼리 파라미터 (GET /api/chat/history)
 */
export type ChatHistoryGetParams = {
  page?: number;
  size?: number;
  startDate?: string;
  endDate?: string;
  keyword?: string;
};

/**
 * 채팅 기록 통계
 */
export type ChatHistorySummary = {
  totalSessions: number;
  totalMessages: number;
  sessionsLast30Days: number;
  oldestSessionDate: string;
  newestSessionDate: string;
};

/**
 * HSCode 분석 정보 (AI 메시지에 포함)
 */
export type HSCodeAnalysis = {
  hsCode: string;
  productName: string;
  confidence: number;
  classificationBasis: string;
};

/**
 * SSE 기반 북마크 데이터 (AI 메시지에 포함)
 */
export type SSEBookmarkData = {
  available: boolean;
  hsCode: string;
  productName: string;
  confidence: number;
};

/**
 * 채팅 세션 관련 데이터
 */
export type ChatRelatedData = {
  extractedHsCodes: string[];
  createdBookmarks: {
    bookmarkId: string;
    hsCode: string;
    displayName: string;
    createdAt: string;
  }[];
  sessionStats: {
    totalTokens: number;
    processingTimeMs: number;
    ragSearches: number;
    webSearches: number;
  };
};

/**
 * 채팅 기록 검색 API 쿼리 파라미터 (GET /api/chat/history/search)
 */
export type ChatHistorySearchParams = {
  keyword: string;
  page?: number;
  size?: number;
  startDate?: string;
  endDate?: string;
};

/**
 * 채팅 기록 검색 결과 항목
 */
export type ChatSearchResult = {
  sessionId: string;
  sessionTitle: string;
  matchedMessage: string;
  matchType: "USER_MESSAGE" | "AI_MESSAGE";
  createdAt: string;
  relevanceScore: number;
};

/**
 * 채팅 기록 검색 정보
 */
export type ChatSearchInfo = {
  keyword: string;
  searchTimeMs: number;
  totalMatches: number;
};

/**
 * 채팅 기록 검색 API 응답 데이터 (GET /api/chat/history/search)
 */
export type PaginatedChatSearchResults = {
  searchResults: ChatSearchResult[];
  pagination: import("./common").PaginationMeta;
  searchInfo: ChatSearchInfo;
};

/**
 * 채팅 세션 목록 조회 API 응답 데이터 (GET /api/chat/history)
 */
export type PaginatedChatSessions = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: ChatSessionSummary[];
  number: number;
};

/**
 * 채팅 세션 요약 정보
 */
export type ChatSessionSummary = {
  sessionId: string;
  sessionTitle: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
};

/**
 * 개별 채팅 세션 상세 API 응답 데이터 (GET /api/chat/history/{sessionId})
 */
export type ChatSessionDetail = {
  sessionInfo: ChatSessionSummary;
  messages: ChatMessage[];
};

/**
 * 채팅 메시지 상세 정보
 */
export type ChatMessage = {
  messageId: string;
  messageType: "USER" | "AI";
  content: string;
  createdAt: Date;
  thinkingSteps?: string[];
  isError?: boolean;
};

export type ChatHistory = {
  sessionInfo: SessionInfo;
  messages: ChatMessage[];
};

export type SessionInfo = {
  sessionId: string;
  sessionTitle: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
};
