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
 * v6.1 SSE 이벤트 핸들러 타입
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
