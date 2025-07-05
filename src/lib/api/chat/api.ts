import type {
  ChatRequest,
  V61SSEEventHandlers,
  StreamingOptions,
  SSEEventHandlers,
  SSEEventData,
} from "./types";
import {
  fetchEventSource,
  type EventSourceMessage,
} from "@microsoft/fetch-event-source";
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

const CHAT_API_URL = "http://localhost:8081/api/chat";

/**
 * 간단한 채팅 API
 */
export const chatApi = {
  /**
   * 실제 서버 SSE 응답에 맞는 채팅 스트리밍 처리
   * @param request 채팅 요청 데이터
   * @param handlers SSE 이벤트 핸들러들
   * @param options 스트리밍 옵션
   */
  async startChatWithStreaming(
    request: ChatRequest,
    handlers: SSEEventHandlers,
    options?: StreamingOptions,
  ): Promise<void> {
    const token = tokenStore.getToken();
    console.log("현재 엑세스 토큰 token : ", token);

    const headers = {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      await fetchEventSource(CHAT_API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(request),
        signal: options?.signal,

        onopen: async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new ApiError(
              response.status,
              undefined,
              `채팅 요청 실패: ${errorText}`,
            );
          }
        },

        onmessage: (event: EventSourceMessage) => {
          // 스트림 종료 체크
          if (event.event === "close" || event.data === "[DONE]") {
            return;
          }

          if (!event.data) {
            return;
          }

          try {
            const data = JSON.parse(event.data) as SSEEventData;

            // 실제 서버 응답 타입별 핸들러 호출
            switch (data.type) {
              case "session_id":
                handlers.onSessionId?.(data.data);
                break;
              case "hscode_result":
                handlers.onHSCodeResult?.(data.data);
                break;
              case "token":
                handlers.onToken?.(data.data);
                break;
              case "complete":
                handlers.onComplete?.(data.data);
                break;
              case "finish":
                handlers.onFinish?.(data.data);
                break;
              case "error":
                handlers.onError?.(data.data);
                break;
              default:
                console.warn(
                  "Unknown SSE event type received:",
                  data.type,
                  "Data:",
                  data.data,
                );
                break;
            }
          } catch (parseError) {
            console.error(
              "SSE 데이터 파싱 오류:",
              parseError,
              "원본 데이터:",
              event.data,
            );
            handlers.onError?.({
              error: "CLIENT_PARSE_ERROR",
              message:
                parseError instanceof Error
                  ? parseError.message
                  : "SSE 데이터 파싱 중 클라이언트 오류 발생",
            });
          }
        },

        onclose: () => {
          options?.onClose?.();
        },

        onerror: (err) => {
          options?.onError?.(
            err instanceof Error ? err : new Error("알 수 없는 SSE 오류"),
          );
          // 재시도를 중단하려면 에러를 throw해야 함
          throw err;
        },
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("SSE fetch aborted by client.");
      } else {
        console.error("fetchEventSource 실행 중 예외 발생:", error);
      }
    }
  },

  /**
   * v6.1 채팅 + SSE 스트리밍 처리 (기존 호환성 유지)
   * @microsoft/fetch-event-source를 사용하여 안정적으로 SSE 스트림을 처리
   */
  async startV61ChatWithStreaming(
    request: ChatRequest,
    handlers: V61SSEEventHandlers,
    options?: StreamingOptions,
  ): Promise<void> {
    const token = tokenStore.getToken();
    console.log("현재 엑세스 토큰 token : ", token);
    const headers = {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      await fetchEventSource(CHAT_API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(request),
        signal: options?.signal,

        onopen: async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new ApiError(
              response.status,
              undefined,
              `채팅 요청 실패: ${errorText}`,
            );
          }
        },

        onmessage: (event: EventSourceMessage) => {
          if (event.event === "close" || event.data === "[DONE]") {
            return;
          }

          if (!event.data) {
            return;
          }

          try {
            const data = JSON.parse(event.data);

            // v6.1 이벤트 타입별 핸들러 호출
            switch (data.eventType) {
              case "initial_metadata":
                handlers.onInitialMetadata?.(data);
                break;
              case "session_info":
                handlers.onSessionInfo?.(data.sessionInfo);
                break;
              case "thinking_intent_analysis":
              case "thinking_parallel_processing_start":
              case "thinking_rag_search_planning":
              case "thinking_rag_search_executing":
              case "thinking_data_processing":
              case "thinking_detail_page_preparation":
              case "thinking_member_record_saving":
              case "thinking_response_generation":
                handlers.onThinking?.(data.thinkingProcess, data.eventType);
                break;
              case "main_message_start":
                handlers.onMainMessageStart?.();
                break;
              case "main_message_data":
                handlers.onMainMessageData?.(data.partialContent);
                break;
              case "main_message_complete":
                handlers.onMainMessageComplete?.(data);
                break;
              case "detail_page_buttons_start":
                handlers.onDetailPageButtonsStart?.(
                  data.metadata?.buttonsCount,
                );
                break;
              case "detail_page_button_ready":
                handlers.onDetailPageButtonReady?.(data.detailPageButton);
                break;
              case "detail_page_buttons_complete":
                handlers.onDetailPageButtonsComplete?.(
                  data.metadata?.totalPreparationTime,
                );
                break;
              case "member_session_created":
              case "member_record_saved":
                handlers.onMemberEvent?.(data);
                break;
              case "error":
                handlers.onError?.(data);
                break;
              default:
                console.warn(
                  "Unknown SSE event type received:",
                  data.eventType,
                );
                break;
            }
          } catch (parseError) {
            console.error(
              "SSE 데이터 파싱 오류:",
              parseError,
              "원본 데이터:",
              event.data,
            );
            handlers.onError?.({
              errorCode: "CLIENT_PARSE_ERROR",
              message:
                parseError instanceof Error
                  ? parseError.message
                  : "SSE 데이터 파싱 중 클라이언트 오류 발생",
            });
          }
        },

        onclose: () => {
          options?.onClose?.();
        },

        onerror: (err) => {
          options?.onError?.(
            err instanceof Error ? err : new Error("알 수 없는 SSE 오류"),
          );
          // To stop retries, we must throw an error.
          // The default behavior is to retry indefinitely.
          throw err;
        },
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("SSE fetch aborted by client.");
      } else {
        console.error("fetchEventSource 실행 중 예외 발생:", error);
      }
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
  /**
   * 전체 채팅 세션 목록을 조회
   * @returns 페이지네이션된 채팅 세션 목록
   */
  getChatSessions(): Promise<PaginatedChatSessions> {
    return httpClient.get("/chat/sessions");
  },

  /**
   * 특정 채팅 세션의 상세 내역을 조회
   * @param sessionId 조회할 세션의 ID
   * @returns 채팅 세션 상세 정보
   */
  getChatSession(sessionId: string): Promise<ChatSessionDetail> {
    return httpClient.get(`/chat/sessions/${sessionId}`);
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

/* 
=== 사용 예시 ===

// 올바른 방법: 새로운 startChatWithStreaming 함수 사용
import { chatApi } from './api';

// 메시지 누적을 위한 상태
let accumulatedMessage = '';

await chatApi.startChatWithStreaming(
  {
    message: "안녕하세요",
    sessionId: "session-123", // 선택사항
  },
  {
    onSessionId: (data) => {
      console.log("새 세션 ID:", data.session_id);
    },
    onToken: (data) => {
      // 실시간으로 들어오는 토큰을 누적
      accumulatedMessage += data.content;
      console.log("현재 메시지:", accumulatedMessage);
    },
    onComplete: (data) => {
      console.log("응답 완료:", data.message);
      console.log("토큰 수:", data.token_count);
      console.log("소스:", data.source);
    },
    onHSCodeResult: (data) => {
      console.log("HSCode 검색 결과:", data.results);
    },
    onFinish: (data) => {
      console.log("스트림 종료:", data.message);
    },
    onError: (data) => {
      console.error("에러 발생:", data.error, data.message);
    },
  },
  {
    onError: (error) => {
      console.error("스트림 에러:", error);
    },
    onClose: () => {
      console.log("스트림 연결 종료");
    },
  }
);

*/
