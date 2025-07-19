import { httpClient, ApiError } from "../common";
import { stream } from "fetch-event-stream";
import type {
  PaginatedChatSessions,
  ChatHistorySearchParams,
  PaginatedChatSearchResults,
  ChatHistory,
} from "../../../types/chat";
import { tokenStore } from "../../auth/tokenStore";
import type { ApiResponse } from "../../../types/common";
import type {
  ChatRequest,
  V2SSEEventHandlers,
  ChatSession,
  StreamingOptions,
  NewChatSession,
  ClaudeErrorEvent,
  ActualSSEEventHandlers,
  ActualSessionInfoEvent,
  ActualProcessingStatusEvent,
  ActualMessageStartEvent,
  ActualContentBlockStartEvent,
  ActualContentBlockDeltaEvent,
  ActualContentBlockStopEvent,
  ActualMessageDeltaEvent,
  ActualEndEvent,
} from "./types";

const CHAT_API_URL = "http://localhost:8081/api/chat";

/**
 * 간단한 채팅 API
 */
export const chatApi = {
  /**
   * 실제 SSE 응답 형식에 맞춘 스트리밍 처리
   * @param request 채팅 요청 데이터
   * @param handlers 실제 SSE 이벤트 핸들러들
   * @param options 스트리밍 옵션
   */
  async startActualStreaming(
    request: ChatRequest,
    handlers: ActualSSEEventHandlers,
    options?: StreamingOptions,
  ): Promise<void> {
    const token = tokenStore.getToken();
    const headers = {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      // fetch-event-stream의 stream 함수 사용
      const events = await stream(`${CHAT_API_URL}`, {
        method: "POST",
        headers,
        body: JSON.stringify(request),
        signal: options?.signal,
      });

      // events는 이미 검증된 Response의 async iterator
      for await (const event of events) {
        // event.data가 JSON 문자열이므로 파싱 필요
        if (event.data) {
          try {
            const data = JSON.parse(event.data);

            // 실제 SSE 응답 형식에 맞춰 이벤트 타입 판단
            if (data.session_uuid && data.timestamp && !data.type) {
              // 세션 정보 이벤트 (type 필드 없음)
              handlers.onSessionInfo?.(data as ActualSessionInfoEvent);
            } else if (data.type) {
              // type 필드 기반 이벤트 처리
              switch (data.type) {
                case "processing_status":
                  handlers.onProcessingStatus?.(
                    data as ActualProcessingStatusEvent,
                  );
                  break;
                case "message_start":
                  handlers.onMessageStart?.(data as ActualMessageStartEvent);
                  break;
                case "content_block_start":
                  handlers.onContentBlockStart?.(
                    data as ActualContentBlockStartEvent,
                  );
                  break;
                case "content_block_delta":
                  handlers.onContentBlockDelta?.(
                    data as ActualContentBlockDeltaEvent,
                  );
                  break;
                case "content_block_stop":
                  handlers.onContentBlockStop?.(
                    data as ActualContentBlockStopEvent,
                  );
                  break;
                case "message_delta":
                  handlers.onMessageDelta?.(data as ActualMessageDeltaEvent);
                  break;
                case "end":
                  handlers.onEnd?.(data as ActualEndEvent);
                  break;
                default:
                  console.warn("[API] 알 수 없는 이벤트 타입", data.type);
              }
            } else {
              console.warn("[API] 인식할 수 없는 SSE 데이터 형식", data);
            }
          } catch (parseError) {
            console.error(
              "[API] 데이터 파싱 오류",
              parseError,
              "원본 데이터:",
              event.data,
            );
            handlers.onError?.({
              type: "error",
              error: {
                type: "CLIENT_PARSE_ERROR",
                message:
                  parseError instanceof Error
                    ? parseError.message
                    : "SSE 데이터 파싱 중 클라이언트 오류 발생",
              },
            });
          }
        }
      }
    } catch (error) {
      // stream 함수가 Response를 throw할 수 있음 (2xx가 아닌 경우)
      if (error instanceof Response) {
        const errorText = await error.text();
        throw new ApiError(
          error.status,
          undefined,
          `채팅 요청 실패: ${errorText}`,
        );
      }

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        console.log("[API] SSE fetch가 클라이언트에 의해 중단됨.");
      } else {
        const errorPayload: ClaudeErrorEvent = {
          type: "error",
          error: {
            type: "CLIENT_EXCEPTION",
            message: error instanceof Error ? error.message : "알 수 없는 오류",
          },
        };
        handlers.onError?.(errorPayload);
      }
    }
  },

  /**
   * 🔧 v2.1 표준화된 SSE 이벤트 처리 (sse_event_mapping.md v2.1 기준)
   * 🚨 fetch-event-stream 라이브러리 사용법에 맞춘 처리 방식
   * @param request 채팅 요청 데이터
   * @param handlers v2.1 SSE 이벤트 핸들러들
   * @param options 스트리밍 옵션
   */
  async startV2StandardStreaming(
    request: ChatRequest,
    handlers: V2SSEEventHandlers,
    options?: StreamingOptions,
  ): Promise<void> {
    const token = tokenStore.getToken();
    const headers = {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      // fetch-event-stream의 stream 함수 사용
      // 이 함수는 fetch를 수행하고 2xx가 아닌 경우 Response를 throw함
      const events = await stream(`${CHAT_API_URL}`, {
        method: "POST",
        headers,
        body: JSON.stringify(request),
        signal: options?.signal,
      });

      // events는 이미 검증된 Response의 async iterator
      for await (const event of events) {
        // event.data가 JSON 문자열이므로 파싱 필요
        if (event.data) {
          try {
            const data = JSON.parse(event.data);

            if (data.event) {
              switch (data.event) {
                case "heartbeat": {
                  handlers.onHeartbeat?.(data);
                  break;
                }
                case "session_info":
                  handlers.onChatSessionInfo?.(data.data);
                  break;
                case "processing_status":
                  handlers.onProcessingStatus?.(data.data);
                  break;
                case "content_delta":
                  handlers.onChatContentDelta?.(data.data);
                  break;
                case "message_delta":
                  handlers.onMessageDelta?.(data.data);
                  break;
                case "error":
                  handlers.onError?.(data.data);
                  break;
                case "message_stop":
                  handlers.onChatMessageStop?.(data.data || {});
                  break;
                default:
                  console.warn("[API] 알 수 없는 이벤트 타입", data.event);
              }
            } else {
              console.warn("[API] 'event' 필드 없는 데이터 수신", data);
            }
          } catch (parseError) {
            console.error(
              "[API] 데이터 파싱 오류",
              parseError,
              "원본 데이터:",
              event.data,
            );
            handlers.onError?.({
              type: "error",
              error: {
                type: "CLIENT_PARSE_ERROR",
                message:
                  parseError instanceof Error
                    ? parseError.message
                    : "SSE 데이터 파싱 중 클라이언트 오류 발생",
              },
            });
          }
        }
      }
    } catch (error) {
      // stream 함수가 Response를 throw할 수 있음 (2xx가 아닌 경우)
      if (error instanceof Response) {
        const errorText = await error.text();
        throw new ApiError(
          error.status,
          undefined,
          `채팅 요청 실패: ${errorText}`,
        );
      }

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        console.log("[API] SSE fetch가 클라이언트에 의해 중단됨.");
      } else {
        const errorPayload: ClaudeErrorEvent = {
          type: "error",
          error: {
            type: "CLIENT_EXCEPTION",
            message: error instanceof Error ? error.message : "알 수 없는 오류",
          },
        };
        handlers.onError?.(errorPayload);
      }
    }
  },

  /**
   * 세션 ID로 채팅 기록 가져오기
   * @param sessionId 가져올 세션의 UUID
   */
  getChatSession: (sessionId: string) => {
    return httpClient.get<ChatSession>(`/chat/sessions/${sessionId}`);
  },

  /**
   * 에러 메시지 파싱
   */
  parseErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "알 수 없는 오류가 발생했습니다";
  },
};

/**
 * 채팅 기록 API
 */
export const chatHistoryApi = {
  /**
   * 전체 채팅 세션 목록을 조회
   * @returns 페이지네이션된 채팅 세션 목록
   */
  getChatHistories(): Promise<PaginatedChatSessions> {
    return httpClient.get("/chat/histories");
  },

  /**
   * 특정 채팅 세션의 상세 내역을 조회
   * @param sessionId 조회할 세션의 ID
   * @returns 채팅 세션 상세 정보
   */
  async getChatHistory(sessionId: string): Promise<ChatHistory> {
    const data = await httpClient.get<ChatHistory>(`/chat/${sessionId}`);

    const newData = {
      ...data,
      messages: data.messages.map((message) => ({
        ...message,
        createdAt: new Date(message.createdAt),
      })),
      sessionInfo: {
        ...data.sessionInfo,
        createdAt: new Date(data.sessionInfo.createdAt),
        updatedAt: new Date(data.sessionInfo.updatedAt),
      },
    };
    return newData;
  },

  async searchChatHistory(
    params: ChatHistorySearchParams,
  ): Promise<ApiResponse<PaginatedChatSearchResults>> {
    const queryParams = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    );
    return httpClient.get(`/chat/histories/search?${queryParams.toString()}`);
  },

  async getNewChatSession(): Promise<NewChatSession> {
    const session = await httpClient.get<NewChatSession>("/chat/session");
    console.log("Spring 에서 받아온 새 새션 :", session);
    return session;
  },
};
