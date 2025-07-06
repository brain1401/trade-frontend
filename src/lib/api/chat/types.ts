import type {
  InitialMetadataEvent,
  SessionInfoEvent,
  ThinkingEventData,
  MainMessageCompleteEvent,
  DetailPageButtonEvent,
  MemberSessionEvent,
  ErrorEventData,
} from "../../../types/chat";

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
