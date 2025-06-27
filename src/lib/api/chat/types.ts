/**
 * 채팅 요청 타입
 */
export type ChatRequest = {
  message: string;
  sessionId?: string;
  context?: any;
};

/**
 * 채팅 응답 타입
 */
export type ChatResponse = {
  message: string;
  sessionId: string;
  timestamp: string;
};

/**
 * 채팅 세션 타입
 */
export type ChatSession = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
};

/**
 * 채팅 히스토리 검색 결과 타입
 */
export type ChatHistorySearchResult = {
  sessions: ChatSession[];
  totalCount: number;
};

/**
 * v6.1 SSE 이벤트 핸들러 타입
 */
export type V61SSEEventHandlers = {
  onInitialMetadata?: (data: any) => void;
  onSessionInfo?: (data: any) => void;
  onThinking?: (data: any, eventType?: string) => void;
  onMainMessageStart?: () => void;
  onMainMessageData?: (content: string) => void;
  onMainMessageComplete?: (data: any) => void;
  onDetailPageButtonsStart?: (buttonsCount: number) => void;
  onDetailPageButtonReady?: (button: any) => void;
  onDetailPageButtonsComplete?: (totalPreparationTime: number) => void;
  onMemberEvent?: (data: any) => void;
  onError?: (error: any) => void;
};

/**
 * 스트리밍 옵션 타입
 */
export type StreamingOptions = {
  timeout?: number;
  onClose?: () => void;
  onError?: (error: Error) => void;
};
