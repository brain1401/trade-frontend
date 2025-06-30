import type {
  ChatRequest,
  V61SSEEventHandlers,
  StreamingOptions,
} from "./types";
import type {
  ChatHistoryGetParams,
  PaginatedChatSessions,
  ChatSessionDetail,
  ChatHistorySearchParams,
  PaginatedChatSearchResults,
} from "../../../types/chat";
import { httpClient, ApiError } from "../common";
import type { ApiResponse } from "../../../types/common";
import { tokenStore } from "../../auth/tokenStore";

/**
 * 간단한 채팅 API
 */
export const chatApi = {
  /**
   * 채팅 요청 (SSE 스트리밍)
   */
  async startChat(request: ChatRequest): Promise<Response> {
    const isAuthenticated = tokenStore.isAuthenticated();

    try {
      const token = tokenStore.getToken();
      const config: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(request),
      };

      const response = await fetch("http://localhost:8081/api/chat", config);

      if (!response.ok) {
        throw new ApiError(response.status, undefined, "채팅 요청 실패");
      }

      return response;
    } catch (error) {
      console.error("채팅 요청 실패:", error);
      throw error;
    }
  },

  /**
   * v6.1 채팅 + SSE 스트리밍 처리 (통합)
   */
  async startV61ChatWithStreaming(
    request: ChatRequest,
    handlers: V61SSEEventHandlers,
    options?: StreamingOptions,
  ): Promise<void> {
    const response = await this.startChat(request);

    if (!response.body) {
      throw new ApiError(0, undefined, "SSE 스트림을 읽을 수 없습니다");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      let result;
      while (!(result = await reader.read()).done) {
        const chunk = decoder.decode(result.value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("event:")) {
            const eventType = line.slice(6).trim();
            continue;
          }

          if (line.startsWith("data:")) {
            const dataStr = line.slice(5).trim();
            if (dataStr) {
              try {
                const data = JSON.parse(dataStr);

                // 이벤트 타입별 핸들러 호출
                switch (data.type || data.event) {
                  case "initial_metadata":
                    handlers.onInitialMetadata?.(data.data);
                    break;
                  case "session_info":
                    handlers.onSessionInfo?.(data.data);
                    break;
                  case "thinking":
                    handlers.onThinking?.(data.data, data.eventType);
                    break;
                  case "main_message_start":
                    handlers.onMainMessageStart?.();
                    break;
                  case "main_message_data":
                    handlers.onMainMessageData?.(data.content);
                    break;
                  case "main_message_complete":
                    handlers.onMainMessageComplete?.(data.data);
                    break;
                  case "detail_page_buttons_start":
                    handlers.onDetailPageButtonsStart?.(data.buttonsCount);
                    break;
                  case "detail_page_button_ready":
                    handlers.onDetailPageButtonReady?.(data.data);
                    break;
                  case "detail_page_buttons_complete":
                    handlers.onDetailPageButtonsComplete?.(
                      data.totalPreparationTime,
                    );
                    break;
                  case "member_event":
                    handlers.onMemberEvent?.(data.data);
                    break;
                  case "error":
                    handlers.onError?.(data);
                    break;
                }
              } catch (parseError) {
                console.error("SSE 데이터 파싱 오류:", parseError);
                handlers.onError?.({
                  errorCode: "CLIENT_PARSE_ERROR",
                  message:
                    parseError instanceof Error
                      ? parseError.message
                      : "SSE 데이터 파싱 중 클라이언트 오류 발생",
                });
              }
            }
          }
        }
      }
      options?.onClose?.();
    } catch (error) {
      console.error("SSE 스트림 처리 오류:", error);
      options?.onError?.(error as Error);
    } finally {
      reader.releaseLock();
    }
  },

  /**
   * SSE 스트림 처리
   */
  async processSSEStream<T>(
    response: Response,
    onMessage: (data: T) => void,
    onError?: (error: unknown) => void,
    onClose?: () => void,
  ): Promise<void> {
    if (!response.body) {
      throw new ApiError(0, undefined, "SSE 스트림을 읽을 수 없습니다");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      let result;
      while (!(result = await reader.read()).done) {
        const chunk = decoder.decode(result.value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data:")) {
            const dataStr = line.slice(5).trim();
            if (dataStr) {
              try {
                const data = JSON.parse(dataStr) as T;
                onMessage(data);
              } catch (parseError) {
                console.error("SSE 데이터 파싱 오류:", parseError);
                onError?.(parseError);
              }
            }
          }
        }
      }
      onClose?.();
    } catch (error) {
      console.error("SSE 스트림 처리 오류:", error);
      onError?.(error);
    } finally {
      reader.releaseLock();
    }
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
  async getChatSessions(
    params?: ChatHistoryGetParams,
  ): Promise<ApiResponse<PaginatedChatSessions>> {
    const queryParams = new URLSearchParams(
      Object.entries(params || {}).map(([key, value]) => [key, String(value)]),
    );
    return httpClient.get(`/chat/history?${queryParams.toString()}`);
  },

  async getChatSession(
    sessionId: string,
  ): Promise<ApiResponse<ChatSessionDetail>> {
    return httpClient.get(`/chat/history/${sessionId}`);
  },

  async searchChatHistory(
    params: ChatHistorySearchParams,
  ): Promise<ApiResponse<PaginatedChatSearchResults>> {
    const queryParams = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    );
    return httpClient.get(`/chat/history/search?${queryParams.toString()}`);
  },
};
