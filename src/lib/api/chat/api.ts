import type {
  ChatRequest,
  V61SSEEventHandlers,
  StreamingOptions,
  SSEEventHandlers,
  SSEEventData,
  ClaudeSSEEventHandlers,
  ClaudeSSEEventData,
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
                  "알 수 없는 SSE 이벤트 타입 수신:",
                  data.type,
                  "데이터:",
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
                  "알 수 없는 v6.1 SSE 이벤트 타입 수신:",
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
   * Claude API 표준 SSE 형식을 지원하는 채팅 스트리밍 처리
   * @param request 채팅 요청 데이터
   * @param handlers Claude API 표준 SSE 이벤트 핸들러들
   * @param options 스트리밍 옵션
   */
  async startClaudeStandardStreaming(
    request: ChatRequest,
    handlers: ClaudeSSEEventHandlers,
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
            const data = JSON.parse(event.data) as ClaudeSSEEventData;

            console.log("Claude SSE 이벤트 타입:", data.type);

            // Claude API 표준 이벤트 타입별 핸들러 호출
            switch (data.type) {
              case "message_start":
                handlers.onMessageStart?.(data);
                break;

              case "content_block_start":
                handlers.onContentBlockStart?.(data);
                break;

              case "content_block_delta":
                // 실제 서버 응답: delta.text에 JSON 문자열이 들어있음
                if (data.delta.type === "text_delta" && data.delta.text) {
                  try {
                    // delta.text는 JSON 문자열이므로 파싱 필요
                    // 예: "{'thinking': '\uc0ac\uc6a9\uc790\uac00 \"', 'type': 'thinking', 'index': 0}"
                    const parsedText = data.delta.text;

                    // JSON 문자열을 파싱하여 실제 데이터 추출
                    // Python dict 형태이므로 더 안전한 방법으로 파싱
                    const jsonMatch = parsedText.match(/\{.*\}/);
                    if (jsonMatch) {
                      try {
                        // Python dict 형태를 JSON 형태로 변환
                        let jsonStr = jsonMatch[0];

                        // 더 안전한 파싱을 위한 단계별 변환
                        jsonStr = jsonStr
                          .replace(/'/g, '"') // 작은따옴표를 큰따옴표로 변환
                          .replace(/(\w+):/g, '"$1":') // 키를 따옴표로 감싸기
                          .replace(/\\"/g, '\\"') // 이스케이프된 따옴표 처리
                          .replace(/\\\\/g, "\\\\"); // 이스케이프된 백슬래시 처리

                        const parsed = JSON.parse(jsonStr);
                        console.log("파싱된 델타 데이터:", parsed);

                        if (parsed.type === "thinking" && parsed.thinking) {
                          handlers.onThinkingDelta?.(
                            parsed.thinking,
                            parsed.index || data.index,
                          );
                        } else if (parsed.type === "text" && parsed.text) {
                          handlers.onTextDelta?.(
                            parsed.text,
                            parsed.index || data.index,
                          );
                        }
                      } catch (innerParseError) {
                        // 파싱 실패 시 원본 텍스트를 그대로 처리
                        console.warn(
                          "내부 JSON 파싱 실패, 원본 텍스트 사용:",
                          parsedText,
                        );
                        handlers.onTextDelta?.(parsedText, data.index);
                      }
                    } else {
                      // JSON 패턴이 없으면 원본 텍스트 그대로 사용
                      handlers.onTextDelta?.(parsedText, data.index);
                    }
                  } catch (parseError) {
                    console.error("delta.text 파싱 오류:", parseError);
                    handlers.onTextDelta?.(data.delta.text, data.index);
                  }
                } else if (
                  data.delta.type === "thinking_delta" &&
                  data.delta.thinking
                ) {
                  handlers.onThinkingDelta?.(data.delta.thinking, data.index);
                }

                // 원본 이벤트도 전달
                handlers.onContentBlockDelta?.(data);
                break;

              case "content_block_stop":
                handlers.onContentBlockStop?.(data);
                break;

              case "message_delta":
                handlers.onMessageDelta?.(data);
                break;

              case "message_stop":
                handlers.onMessageStop?.(data);
                break;

              case "ping":
                handlers.onPing?.(data);
                break;

              case "error":
                handlers.onError?.(data);
                break;

              case "message_limit":
                handlers.onMessageLimit?.(data);
                break;

              default:
                console.warn(
                  "알 수 없는 Claude SSE 이벤트 타입:",
                  (data as any).type,
                  "데이터:",
                  data,
                );
                break;
            }
          } catch (parseError) {
            console.error(
              "Claude SSE 데이터 파싱 오류:",
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
                    : "Claude SSE 데이터 파싱 중 클라이언트 오류 발생",
              },
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
        console.log("Claude SSE fetch aborted by client.");
      } else {
        console.error("Claude fetchEventSource 실행 중 예외 발생:", error);
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

// 기존 방법: 새로운 startChatWithStreaming 함수 사용
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

// === 새로운 방법: Claude API 표준 스트리밍 함수 사용 ===

// 텍스트와 생각 누적을 위한 상태
let accumulatedText = '';
let accumulatedThinking = '';

await chatApi.startClaudeStandardStreaming(
  {
    message: "게으르고 맨날 119에 짜장면 있냐고 하는 소방관 박성준을 위한 장편 시를 써줘",
    sessionId: "session-123", // 선택사항
  },
  {
    onMessageStart: (event) => {
      console.log("메시지 시작:", event.message.id);
      console.log("모델:", event.message.model);
      // 누적 상태 초기화
      accumulatedText = '';
      accumulatedThinking = '';
    },
    
    onContentBlockStart: (event) => {
      console.log(`콘텐츠 블록 시작 [${event.index}]:`, event.content_block.type);
      if (event.content_block.type === "thinking") {
        console.log("생각 블록 시작됨");
      } else if (event.content_block.type === "text") {
        console.log("텍스트 블록 시작됨");
      }
    },
    
    onTextDelta: (text, index) => {
      // 실시간으로 들어오는 텍스트를 누적하여 UI에 표시
      accumulatedText += text;
      console.log(`텍스트 델타 [${index}]:`, text);
      // UI 업데이트: 실시간 텍스트 스트리밍 표시
      updateUIWithText(accumulatedText);
    },
    
    onThinkingDelta: (thinking, index) => {
      // 실시간으로 들어오는 생각을 누적하여 UI에 표시
      accumulatedThinking += thinking;
      console.log(`생각 델타 [${index}]:`, thinking);
      // UI 업데이트: 실시간 생각 과정 표시
      updateUIWithThinking(accumulatedThinking);
    },
    
    onContentBlockDelta: (event) => {
      // 원본 델타 이벤트 처리 (필요시 사용)
      console.log("콘텐츠 블록 델타:", event.delta.type, event.index);
    },
    
    onContentBlockStop: (event) => {
      console.log(`콘텐츠 블록 종료 [${event.index}]`);
      if (event.stop_timestamp) {
        console.log("종료 시간:", event.stop_timestamp);
      }
    },
    
    onMessageDelta: (event) => {
      console.log("메시지 델타:", event.delta.stop_reason);
      if (event.delta.stop_reason === "end_turn") {
        console.log("응답 완료");
      }
    },
    
    onMessageStop: (event) => {
      console.log("메시지 스트림 종료");
      console.log("최종 텍스트:", accumulatedText);
      console.log("최종 생각:", accumulatedThinking);
    },
    
    onPing: (event) => {
      console.log("핑 이벤트 수신");
    },
    
    onError: (event) => {
      console.error("에러 발생:", event.error.type, event.error.message);
    },
    
    onMessageLimit: (event) => {
      console.log("메시지 한도 정보:", event.message_limit);
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

// UI 업데이트 함수 예시
function updateUIWithText(text: string) {
  // 실제 UI 업데이트 로직
  const textElement = document.getElementById('streaming-text');
  if (textElement) {
    textElement.textContent = text;
  }
}

function updateUIWithThinking(thinking: string) {
  // 실제 UI 업데이트 로직  
  const thinkingElement = document.getElementById('streaming-thinking');
  if (thinkingElement) {
    thinkingElement.textContent = thinking;
  }
}

*/
