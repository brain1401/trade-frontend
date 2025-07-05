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
