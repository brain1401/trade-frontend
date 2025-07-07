import type {
  InitialMetadataEvent,
  SessionInfoEvent,
  ThinkingEventData,
  MainMessageCompleteEvent,
  DetailPageButtonEvent,
  MemberSessionEvent,
  ErrorEventData,
} from "../../../types/chat";
import type { ChatMessageItem } from "@/components/search";

/**
 * 채팅 요청 타입 (POST /api/chat)
 */
export type ChatRequest = {
  /** 사용자 질문 메시지 (자연어, 2~1000자) */
  message: string;
  /** 🆕 v6.1: 회원의 기존 세션 ID (연속 대화 시, 회원만) */
  sessionId?: string;
  /** 세션 UUID (연속 대화 시 사용) */
  session_uuid?: string;
  /** 추가 컨텍스트 정보 (IP, User-Agent 등) */
  context?: {
    userAgent?: string;
    language?: string;
  };
};

/**
 * 실제 서버 SSE 이벤트 타입 (명세서 기반)
 */
export type SSEEventData = {
  type:
    | "session_id"
    | "hscode_result"
    | "token"
    | "complete"
    | "finish"
    | "error";
  data: any;
};

/**
 * 세션 ID 이벤트 데이터
 */
export type SessionIdEvent = {
  type: "session_id";
  data: {
    session_id: string;
  };
};

/**
 * HSCode 검색 결과 이벤트 데이터
 */
export type HSCodeResultEvent = {
  type: "hscode_result";
  data: {
    results: any[]; // HSCode 결과 구조
    message?: string;
  };
};

/**
 * 토큰 이벤트 데이터
 */
export type TokenEvent = {
  type: "token";
  data: {
    content: string;
  };
};

/**
 * 완료 이벤트 데이터
 */
export type CompleteEvent = {
  type: "complete";
  data: {
    message: string;
    token_count: number;
    source: string;
  };
};

/**
 * 스트림 종료 이벤트 데이터
 */
export type FinishEvent = {
  type: "finish";
  data: {
    message: string;
  };
};

/**
 * 오류 이벤트 데이터
 */
export type ErrorEvent = {
  type: "error";
  data: {
    error: string;
    message: string;
  };
};

/**
 * 실제 서버 응답에 맞는 SSE 이벤트 핸들러 타입
 */
export type SSEEventHandlers = {
  onSessionId?: (data: SessionIdEvent["data"]) => void;
  onHSCodeResult?: (data: HSCodeResultEvent["data"]) => void;
  onToken?: (data: TokenEvent["data"]) => void;
  onComplete?: (data: CompleteEvent["data"]) => void;
  onFinish?: (data: FinishEvent["data"]) => void;
  onError?: (data: ErrorEvent["data"]) => void;
};

/**
 * v6.1 SSE 이벤트 핸들러 타입 (기존 호환성 유지)
 */
export type V61SSEEventHandlers = {
  onInitialMetadata?: (data: InitialMetadataEvent) => void;
  onSessionInfo?: (data: SessionInfoEvent) => void;
  onThinking?: (message: string, eventType?: string) => void;
  onMainMessageStart?: () => void;
  onMainMessageData?: (content: string) => void;
  onMainMessageComplete?: (data: MainMessageCompleteEvent) => void;
  onDetailPageButtonsStart?: (buttonsCount: number) => void;
  onDetailPageButtonReady?: (button: DetailPageButtonEvent) => void;
  onDetailPageButtonsComplete?: (totalPreparationTime: number) => void;
  onMemberEvent?: (data: MemberSessionEvent) => void;
  onError?: (error: ErrorEventData) => void;
};

/**
 * SSE 스트리밍 옵션
 */
export type StreamingOptions = {
  /**
   * 스트림 에러 발생시 콜백
   */
  onError?: (error: Error) => void;

  /**
   * 스트림 종료시 콜백
   */
  onClose?: () => void;

  /**
   * 요청 중단을 위한 AbortSignal
   */
  signal?: AbortSignal;
};

/**
 * Claude API 표준 SSE 이벤트 타입
 */
export type ClaudeSSEEventType =
  | "session_uuid" // 새로운 세션 UUID 이벤트
  | "message_start"
  | "content_block_start"
  | "content_block_delta"
  | "content_block_stop"
  | "message_delta"
  | "message_stop"
  | "ping"
  | "error";

/**
 * Claude API 표준 콘텐츠 블록 타입
 */
export type ClaudeContentBlockType = "text" | "thinking" | "tool_use";

/**
 * Claude API 표준 델타 타입
 */
export type ClaudeDeltaType =
  | "text_delta"
  | "thinking_delta"
  | "input_json_delta";

/**
 * Claude API 표준 메시지 시작 이벤트
 */
export type ClaudeMessageStartEvent = {
  type: "message_start";
  message: {
    id: string;
    type: "message";
    role: "assistant";
    model: string;
    parent_uuid?: string;
    uuid?: string;
    content: any[];
    stop_reason: string | null;
    stop_sequence: string | null;
  };
};

/**
 * Claude API 표준 콘텐츠 블록 시작 이벤트
 */
export type ClaudeContentBlockStartEvent = {
  type: "content_block_start";
  index: number;
  content_block: {
    type: ClaudeContentBlockType;
    text?: string;
    thinking?: string;
    start_timestamp?: string;
    stop_timestamp?: string | null;
    summaries?: any[];
    cut_off?: boolean;
  };
};

/**
 * Claude API 표준 콘텐츠 블록 델타 이벤트
 */
export type ClaudeContentBlockDeltaEvent = {
  type: "content_block_delta";
  index: number;
  delta: {
    type: ClaudeDeltaType;
    text?: string;
    thinking?: string;
    partial_json?: string;
    summary?: {
      summary: string;
    };
  };
};

/**
 * Claude API 표준 콘텐츠 블록 종료 이벤트
 */
export type ClaudeContentBlockStopEvent = {
  type: "content_block_stop";
  index: number;
  stop_timestamp?: string;
};

/**
 * Claude API 표준 메시지 델타 이벤트
 */
export type ClaudeMessageDeltaEvent = {
  type: "message_delta";
  delta: {
    stop_reason: string | null;
    stop_sequence: string | null;
  };
};

/**
 * Claude API 표준 메시지 종료 이벤트
 */
export type ClaudeMessageStopEvent = {
  type: "message_stop";
};

/**
 * Claude API 표준 세션 UUID 이벤트
 */
export type ClaudeSessionUuidEvent = {
  session_uuid: string;
  timestamp: number;
};

/**
 * Claude API 표준 핑 이벤트
 */
export type ClaudePingEvent = {
  type: "ping";
};

/**
 * Claude API 표준 에러 이벤트
 */
export type ClaudeErrorEvent = {
  type: "error";
  error: {
    type: string;
    message: string;
  };
};

/**
 * Claude API 표준 메시지 한도 이벤트
 */
export type ClaudeMessageLimitEvent = {
  type: "message_limit";
  message_limit: {
    type: string;
    resetsAt: string | null;
    remaining: number | null;
    perModelLimit: any | null;
  };
};

/**
 * Claude API 표준 SSE 이벤트 데이터 통합 타입
 */
export type ClaudeSSEEventData =
  | ClaudeMessageStartEvent
  | ClaudeContentBlockStartEvent
  | ClaudeContentBlockDeltaEvent
  | ClaudeContentBlockStopEvent
  | ClaudeMessageDeltaEvent
  | ClaudeMessageStopEvent
  | ClaudePingEvent
  | ClaudeErrorEvent
  | ClaudeMessageLimitEvent;

/**
 * Claude API 표준 SSE 이벤트 핸들러
 */
export type ClaudeSSEEventHandlers = {
  /**
   * 세션 UUID 핸들러
   */
  onSessionUuid?: (event: ClaudeSessionUuidEvent) => void;

  /**
   * 메시지 시작 핸들러
   */
  onMessageStart?: (event: ClaudeMessageStartEvent) => void;

  /**
   * 콘텐츠 블록 시작 핸들러
   */
  onContentBlockStart?: (event: ClaudeContentBlockStartEvent) => void;

  /**
   * 텍스트 델타 핸들러 (실시간 텍스트 스트리밍)
   */
  onTextDelta?: (text: string, index: number) => void;

  /**
   * 생각 델타 핸들러 (실시간 생각 스트리밍)
   */
  onThinkingDelta?: (thinking: string, index: number) => void;

  /**
   * 콘텐츠 블록 델타 핸들러 (원본 이벤트)
   */
  onContentBlockDelta?: (event: ClaudeContentBlockDeltaEvent) => void;

  /**
   * 콘텐츠 블록 종료 핸들러
   */
  onContentBlockStop?: (event: ClaudeContentBlockStopEvent) => void;

  /**
   * 메시지 델타 핸들러
   */
  onMessageDelta?: (event: ClaudeMessageDeltaEvent) => void;

  /**
   * 메시지 종료 핸들러
   */
  onMessageStop?: (event: ClaudeMessageStopEvent) => void;

  /**
   * 핑 이벤트 핸들러
   */
  onPing?: (event: ClaudePingEvent) => void;

  /**
   * 에러 핸들러
   */
  onError?: (event: ClaudeErrorEvent) => void;

  /**
   * 메시지 한도 핸들러
   */
  onMessageLimit?: (event: ClaudeMessageLimitEvent) => void;
};

/**
 * v2.0 표준화된 SSE 이벤트 타입들 (chat_endpoint_response_formats.md 기준)
 */
export type V2SSEEventType =
  | "chat_session_info"
  | "chat_message_start"
  | "chat_metadata_start" // 🆕 v2.1: 새 세션 메타데이터
  | "chat_metadata_stop" // 🆕 v2.1: 새 세션 메타데이터 종료
  | "chat_content_start"
  | "chat_content_delta"
  | "chat_web_search_results" // 🆕 v2.1: 웹 검색 결과 분리
  | "chat_content_stop"
  | "parallel_processing"
  | "detail_buttons_start"
  | "detail_button_ready"
  | "detail_buttons_complete"
  | "detail_buttons_error"
  | "chat_message_delta"
  | "chat_message_limit"
  | "chat_message_stop"
  | "heartbeat"; // 🆕 v2.1: 연결 유지

/**
 * v2.0 세션 정보 이벤트
 */
export type V2SessionInfoEvent = {
  session_uuid: string;
  timestamp: number;
};

/**
 * v2.0 메시지 시작 이벤트
 */
export type V2MessageStartEvent = {
  type: "message_start";
  message: {
    id: string;
    type: "message";
    role: "assistant";
    model: string;
    parent_uuid?: string;
    uuid?: string;
    content: any[];
    stop_reason: string | null;
    stop_sequence: string | null;
  };
};

/**
 * v2.0 콘텐츠 델타 이벤트
 */
export type V2ContentDeltaEvent = {
  type: "content_block_delta";
  index: number;
  delta: {
    type: "text_delta";
    text: string;
  };
};

/**
 * v2.0 병렬 처리 이벤트
 */
export type V2ParallelProcessingEvent = {
  stage:
    | "parallel_processing_start"
    | "parallel_processing_progress"
    | "parallel_processing_complete";
  content: string;
  progress: number;
  timestamp: string;
};

/**
 * v2.0 상세 버튼 이벤트들
 */
export type V2DetailButtonsStartEvent = {
  type: "start";
  buttonsCount: number;
  estimatedPreparationTime: number;
  timestamp: string;
  processingInfo: {
    context7_enabled: boolean;
    fallback_available: boolean;
    cache_checked: boolean;
  };
};

export type V2DetailButtonReadyEvent = {
  type: "button";
  buttonType: string;
  priority: number;
  url: string;
  title: string;
  description: string;
  isReady: boolean;
  metadata: {
    hscode?: string | null;
    confidence: number;
    source: string;
    query_params: Record<string, any>;
  };
  actionData: {
    queryParams: Record<string, any>;
    analytics: {
      click_tracking: boolean;
      conversion_target: string;
    };
  };
};

export type V2DetailButtonsCompleteEvent = {
  type: "complete";
  totalPreparationTime: number;
  buttonsGenerated: number;
  timestamp: string;
  summary: {
    hscode_detected: string | null;
    confidence_score: number;
    analysis_source: string;
    fallback_used: boolean;
    cache_hit: boolean;
  };
  performance: {
    context7_calls: number;
    context7_latency_ms: number;
    database_queries: number;
    total_processing_time: number;
  };
};

export type V2DetailButtonsErrorEvent = {
  type: "error";
  errorCode: string;
  errorMessage: string;
  timestamp: string;
  fallbackActivated: boolean;
  retryInfo: {
    retryable: boolean;
    retryAfter: number;
    maxRetries: number;
  };
};

/**
 * v2.0 메시지 종료 이벤트
 */
export type V2MessageStopEvent = {
  type: "message_stop";
};

/**
 * 🆕 v2.1 웹 검색 결과 이벤트 (완전 분리됨)
 */
export type V2WebSearchResultsEvent = {
  type: "web_search_results";
  timestamp: string;
  total_count: number;
  results: Array<{
    type: "web_search_result";
    title: string;
    url: string;
    content: string;
    page_age: number | null;
    metadata: {
      source: string;
      confidence: number;
    };
  }>;
};

/**
 * 🆕 v2.1 메타데이터 이벤트 (새 세션 시만)
 */
export type V2MetadataStartEvent = {
  type: "content_block_start";
  index: number;
  content_block: {
    start_timestamp: string;
    stop_timestamp: string | null;
    type: "text";
    text: string;
    citations: any[];
  };
};

export type V2MetadataStopEvent = {
  type: "content_block_stop";
  index: number;
  content_block: {
    start_timestamp: string;
    stop_timestamp: string;
    type: "text";
    text: string;
    citations: any[];
  };
};

/**
 * 🆕 v2.1 Heartbeat 이벤트 (연결 유지)
 */
export type V2HeartbeatEvent = {
  session_uuid: string;
  timestamp: number;
};

/**
 * URL과 thinking 정보를 위한 별도 상태 타입
 */
export type URLInfo = {
  url: string;
  title: string;
  description: string;
  buttonType: string;
  metadata?: Record<string, any>;
};

export type ThinkingInfo = {
  content: string;
  stage: string;
  timestamp: string;
};

/**
 * v2.0 SSE 이벤트 핸들러
 */
export type V2SSEEventHandlers = {
  /** 세션 정보 핸들러 */
  onChatSessionInfo?: (event: V2SessionInfoEvent) => void;

  /** 메시지 시작 핸들러 */
  onChatMessageStart?: (event: V2MessageStartEvent) => void;

  /** 🆕 v2.1: 메타데이터 시작 핸들러 (새 세션 시) */
  onChatMetadataStart?: (event: V2MetadataStartEvent) => void;

  /** 🆕 v2.1: 메타데이터 종료 핸들러 (새 세션 시) */
  onChatMetadataStop?: (event: V2MetadataStopEvent) => void;

  /** 콘텐츠 시작 핸들러 */
  onChatContentStart?: () => void;

  /** 텍스트 델타 핸들러 (🔧 v2.1: 순수 텍스트만, JSON 없음) */
  onChatContentDelta?: (event: V2ContentDeltaEvent) => void;

  /** 🆕 v2.1: 웹 검색 결과 핸들러 (별도 분리됨) */
  onChatWebSearchResults?: (event: V2WebSearchResultsEvent) => void;

  /** 콘텐츠 종료 핸들러 */
  onChatContentStop?: () => void;

  /** 병렬 처리 상태 핸들러 */
  onParallelProcessing?: (event: V2ParallelProcessingEvent) => void;

  /** 상세 버튼 준비 시작 */
  onDetailButtonsStart?: (event: V2DetailButtonsStartEvent) => void;

  /** 개별 버튼 준비 완료 */
  onDetailButtonReady?: (event: V2DetailButtonReadyEvent) => void;

  /** 모든 버튼 준비 완료 */
  onDetailButtonsComplete?: (event: V2DetailButtonsCompleteEvent) => void;

  /** 버튼 준비 에러 */
  onDetailButtonsError?: (event: V2DetailButtonsErrorEvent) => void;

  /** 메시지 종료 핸들러 */
  onChatMessageStop?: (event: V2MessageStopEvent) => void;

  /** 🆕 v2.1: Heartbeat 핸들러 (연결 유지) */
  onHeartbeat?: (event: V2HeartbeatEvent) => void;

  /** 에러 핸들러 */
  onError?: (event: ClaudeErrorEvent) => void;

  /** URL 정보 업데이트 핸들러 */
  onUrlInfoUpdate?: (urlInfo: URLInfo) => void;

  /** Thinking 정보 업데이트 핸들러 */
  onThinkingInfoUpdate?: (thinkingInfo: ThinkingInfo) => void;
};

/**
 * 웹 검색 결과 타입
 */
export type WebSearchResult = {
  title: string;
  url: string;
  type: string;
  encrypted_content?: string;
  page_age?: number | null;
};

/**
 * 파싱된 웹 검색 결과 그룹
 */
export type ParsedWebSearchResults = {
  results: WebSearchResult[];
  count: number;
};

export type ChatSession = {
  session_uuid: string;
  messages: ChatMessageItem[];
  // 기타 세션 관련 메타데이터
};

export type NewChatSession = {
  session_uuid: string;
};
