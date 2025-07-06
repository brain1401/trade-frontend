import {
  RefreshCw,
  Trash2,
  AlertCircle,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  parseStreamingWebSearchResults,
  containsPythonDict,
} from "@/lib/utils/webSearchParser";
import { chatApi, type V2SSEEventHandlers } from "@/lib/api/chat";
import { useAuth } from "@/stores/authStore";
import type {
  ChatSessionStatus,
  RelatedInfo,
  SourceReference,
} from "@/types/chat";
import type {
  URLInfo,
  ThinkingInfo,
  WebSearchResult,
} from "@/lib/api/chat/types";

import { ChatInput } from "./ChatInput";
import {
  ChatMessage,
  type ChatMessageType,
  type ChatMessageData,
} from "./ChatMessage";
import { WebSearchResults } from "./WebSearchResults";

/**
 * 채팅 메시지 아이템 (UI용)
 */
export type ChatMessageItem = {
  id: string;
  type: ChatMessageType;
  data: ChatMessageData;
  timestamp: string;
};

/**
 * 채팅 인터페이스 프로퍼티
 */
export type ChatInterfaceProps = {
  /** 북마크 추가 핸들러 */
  onBookmark?: (relatedInfo: RelatedInfo) => void;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 초기 메시지 */
  welcomeMessage?: string;
};

/**
 * 🆕 v2.0: 병렬 처리 상태
 */
type ParallelProcessingState = {
  stage: string;
  content: string;
  progress: number;
  timestamp: string;
};

/**
 * 🆕 v2.0: 상세 버튼 상태
 */
type DetailButtonsState = {
  isStarted: boolean;
  expectedCount: number;
  readyButtons: URLInfo[];
  isComplete: boolean;
  error?: string;
};

/**
 * 🆕 v2.1: ChatGPT 스타일 SSE 이벤트 처리 채팅 인터페이스
 *
 * v2.1의 핵심 변화:
 * - 웹 검색 결과 완전 분리 (chat_web_search_results 이벤트)
 * - 순수 텍스트 스트리밍 (chat_content_delta는 JSON 없음)
 * - 표준화된 이벤트 매핑 적용
 */
export function ChatInterface({
  onBookmark,
  className,
  welcomeMessage = "무역 관련 질문을 자유롭게 물어보세요! 🚀",
}: ChatInterfaceProps) {
  // 인증 상태
  const { isAuthenticated } = useAuth();

  // 채팅 상태
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [sessionStatus, setSessionStatus] =
    useState<ChatSessionStatus>("PENDING");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionUuid, setSessionUuid] = useState<string | null>(null);

  // 현재 스트리밍 중인 메시지
  const [currentMainResponse, setCurrentMainResponse] = useState<string>("");

  // 🆕 v2.1: URL과 thinking 정보를 위한 별도 상태
  const [urlInfoList, setUrlInfoList] = useState<URLInfo[]>([]);
  const [thinkingInfoList, setThinkingInfoList] = useState<ThinkingInfo[]>([]);

  // 🆕 v2.1: 병렬 처리 및 상세 버튼 상태
  const [parallelProcessing, setParallelProcessing] =
    useState<ParallelProcessingState | null>(null);
  const [detailButtons, setDetailButtons] = useState<DetailButtonsState>({
    isStarted: false,
    expectedCount: 0,
    readyButtons: [],
    isComplete: false,
  });

  // 🆕 v2.1: 웹 검색 결과 상태 (완전 분리됨)
  const [webSearchResults, setWebSearchResults] = useState<WebSearchResult[]>(
    [],
  );

  // ref로 상태 관리 (useEffect/useCallback 내부에서 최신 값 참조)
  const sessionStatusRef = useRef<ChatSessionStatus>("PENDING");
  const sessionUuidRef = useRef<string | null>(null);
  const currentMainResponseRef = useRef<string>("");
  const isStreamingRef = useRef<boolean>(false); // 🆕 추가

  // ref와 state 동기화
  useEffect(() => {
    sessionStatusRef.current = sessionStatus;
  }, [sessionStatus]);

  useEffect(() => {
    sessionUuidRef.current = sessionUuid;
  }, [sessionUuid]);

  useEffect(() => {
    currentMainResponseRef.current = currentMainResponse;
  }, [currentMainResponse]);

  useEffect(() => {
    isStreamingRef.current = isStreaming;
  }, [isStreaming]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * 메시지 목록 하단으로 스크롤
   */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /**
   * 메시지 목록에 새 메시지 추가 (ref 기반으로 최신 상태 보장)
   */
  const addMessage = useCallback(
    (type: ChatMessageType, data: ChatMessageData) => {
      const newMessage: ChatMessageItem = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        data,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setTimeout(scrollToBottom, 100);
    },
    [scrollToBottom],
  );

  /**
   * URL 버튼 클릭 핸들러
   */
  const handleUrlButtonClick = useCallback((urlInfo: URLInfo) => {
    window.open(urlInfo.url, "_blank");
  }, []);

  /**
   * 🔧 v2.1 표준화된 SSE 이벤트 핸들러들
   * 웹 검색 결과 분리 및 순수 텍스트 스트리밍 지원
   */
  const v2SSEHandlers: V2SSEEventHandlers = useMemo(
    () => ({
      // 세션 정보 핸들러
      onChatSessionInfo: (event) => {
        console.log("🆔 세션 정보 수신:", event.session_uuid);
        setSessionUuid(event.session_uuid);
      },

      // 메시지 시작 핸들러
      onChatMessageStart: (event) => {
        console.log("🔍 메시지 시작:", event.message.id);
        setCurrentSessionId(event.message.id);
        setSessionStatus("RESPONDING");
      },

      // 🆕 v2.1: 메타데이터 이벤트 핸들러 (새 세션 시)
      onChatMetadataStart: () => {
        console.log("📋 메타데이터 시작 (새 세션)");
        // 필요시 UI 상태 업데이트
      },

      onChatMetadataStop: () => {
        console.log("📋 메타데이터 종료 (새 세션)");
        // 필요시 UI 상태 업데이트
      },

      // 콘텐츠 시작 핸들러
      onChatContentStart: () => {
        console.log("📊 콘텐츠 시작");
        setSessionStatus("RESPONDING");
      },

      // 🔧 v2.1: 텍스트 델타 핸들러 (Context7 기반 통합 웹 검색 결과 파싱)
      onChatContentDelta: (event) => {
        console.log("💬 텍스트 델타 이벤트:", {
          textLength: event.delta.text.length || 0,
          isStreaming: isStreamingRef.current,
          preview:
            event.delta.text.substring(0, 100) +
            (event.delta.text.length > 100 ? "..." : ""),
        });

        if (event.delta.text) {
          let textToAdd = event.delta.text;

          // 🔧 Context7 기반: 웹 검색 결과 감지 및 파싱
          if (containsPythonDict(event.delta.text)) {
            console.log("🔍 웹 검색 데이터 감지 - 파싱 시작:", {
              textLength: event.delta.text.length,
              hasJsonArray: event.delta.text.includes("[{"),
              hasPythonDict: event.delta.text.includes(
                "'type': 'web_search_result'",
              ),
            });

            const parseResult = parseStreamingWebSearchResults(
              event.delta.text,
            );

            console.log("📊 파싱 결과:", {
              hasWebSearchData: parseResult.hasWebSearchData,
              resultsCount: parseResult.partialResults?.length || 0,
              cleanTextLength: parseResult.cleanText.length,
              originalTextLength: event.delta.text.length,
            });

            // 웹 검색 결과가 발견된 경우 별도 처리
            if (parseResult.hasWebSearchData && parseResult.partialResults) {
              console.log("✅ 웹 검색 결과 파싱 성공:", {
                newResults: parseResult.partialResults.length,
                titles: parseResult.partialResults.map(
                  (r) => r.title.substring(0, 30) + "...",
                ),
              });

              // 기존 웹 검색 결과에 추가
              setWebSearchResults((prev) => {
                const newResults = [
                  ...prev,
                  ...(parseResult.partialResults || []),
                ];
                // 중복 제거 (URL 기준)
                const uniqueResults = newResults.filter(
                  (result, index, arr) =>
                    arr.findIndex((r) => r.url === result.url) === index,
                );

                console.log("🔄 웹 검색 결과 업데이트:", {
                  previous: prev.length,
                  added: (parseResult.partialResults || []).length,
                  total: uniqueResults.length,
                  duplicatesRemoved: newResults.length - uniqueResults.length,
                });

                return uniqueResults;
              });
            }

            // 파싱된 깨끗한 텍스트 사용
            textToAdd = parseResult.cleanText;

            if (parseResult.hasWebSearchData) {
              console.log("🧹 텍스트 정리 완료:", {
                originalLength: event.delta.text.length,
                cleanLength: textToAdd.length,
                removed: event.delta.text.length - textToAdd.length,
              });
            }
          }

          // 텍스트 누적 (파싱된 텍스트 또는 원본 텍스트)
          if (textToAdd && textToAdd.trim()) {
            setCurrentMainResponse((prev) => {
              const newResponse = prev + textToAdd;
              console.log("📝 응답 텍스트 누적:", {
                previousLength: prev.length,
                addedLength: textToAdd.length,
                totalLength: newResponse.length,
              });
              return newResponse;
            });
          }

          // 스트리밍 상태가 활성화되지 않았다면 활성화
          if (!isStreamingRef.current) {
            console.log("🚀 스트리밍 시작");
            setIsStreaming(true);
          }
        }
      },

      // 🆕 v2.1: 웹 검색 결과 핸들러 (완전 분리됨)
      onChatWebSearchResults: (event) => {
        console.log("🔍 웹 검색 결과 수신:", event.total_count, "개");

        // 구조화된 웹 검색 결과를 상태에 저장
        const searchResults: WebSearchResult[] = event.results.map(
          (result) => ({
            title: result.title,
            url: result.url,
            type: result.type,
            // content는 암호화되어 있으므로 표시하지 않음
            encrypted_content: result.content,
            page_age: result.page_age,
          }),
        );

        setWebSearchResults(searchResults);
        console.log("🔍 파싱된 웹 검색 결과:", searchResults);
      },

      // 콘텐츠 종료 핸들러
      onChatContentStop: () => {
        console.log("✅ 콘텐츠 종료");
      },

      // 병렬 처리 상태 핸들러
      onParallelProcessing: (event) => {
        console.log("🔄 병렬 처리:", event.stage, event.progress);
        setParallelProcessing(event);
      },

      // 상세 버튼 준비 시작
      onDetailButtonsStart: (event) => {
        console.log("🔘 상세 버튼 준비 시작:", event.buttonsCount);
        setDetailButtons({
          isStarted: true,
          expectedCount: event.buttonsCount,
          readyButtons: [],
          isComplete: false,
        });
      },

      // 개별 버튼 준비 완료
      onDetailButtonReady: (event) => {
        console.log("✅ 버튼 준비 완료:", event.buttonType);
        setDetailButtons((prev) => ({
          ...prev,
          readyButtons: [
            ...prev.readyButtons,
            {
              url: event.url,
              title: event.title,
              description: event.description,
              buttonType: event.buttonType,
              metadata: event.metadata,
            },
          ],
        }));
      },

      // 모든 버튼 준비 완료
      onDetailButtonsComplete: (event) => {
        console.log("🎉 모든 버튼 준비 완료:", event.buttonsGenerated);
        setDetailButtons((prev) => ({
          ...prev,
          isComplete: true,
        }));
      },

      // 버튼 준비 에러
      onDetailButtonsError: (event) => {
        console.log("❌ 버튼 준비 에러:", event.errorCode);
        setDetailButtons((prev) => ({
          ...prev,
          error: event.errorMessage,
        }));
      },

      // 🆕 v2.1: Heartbeat 핸들러 (연결 유지)
      onHeartbeat: (event) => {
        console.log("💓 연결 유지:", event.session_uuid);
        // 필요시 연결 상태 UI 업데이트
      },

      // 메시지 종료 핸들러
      onChatMessageStop: () => {
        console.log("🔚 메시지 스트림 종료");

        // 누적된 응답을 최종 메시지로 추가
        const finalContent = currentMainResponseRef.current;

        // 최종 메시지가 있는 경우 먼저 메시지 추가
        if (finalContent && finalContent.trim()) {
          const newMessage: ChatMessageItem = {
            id: `msg_${Date.now()}_content_${Math.random().toString(36).substr(2, 9)}`,
            type: "ai",
            data: {
              content: finalContent, // 🔧 v2.1: 이미 깨끗한 순수 텍스트
            },
            timestamp: new Date().toISOString(),
          };

          // 새 메시지 추가와 동시에 스트리밍 상태 정리
          setMessages((prev) => [...prev, newMessage]);

          // 다음 프레임에서 스트리밍 상태 정리 (깜빡임 방지)
          requestAnimationFrame(() => {
            setIsStreaming(false);
            setCurrentMainResponse("");
            setSessionStatus("PENDING");
          });

          setTimeout(scrollToBottom, 100);
        } else {
          // 응답이 없는 경우에만 즉시 상태 정리
          setIsStreaming(false);
          setCurrentMainResponse("");
          setSessionStatus("PENDING");
        }
      },

      // URL 정보 업데이트 핸들러
      onUrlInfoUpdate: (urlInfo) => {
        console.log("🔗 URL 정보 업데이트:", urlInfo.title, urlInfo.url);
        setUrlInfoList((prev) => [...prev, urlInfo]);
      },

      // Thinking 정보 업데이트 핸들러
      onThinkingInfoUpdate: (thinkingInfo) => {
        console.log("🤔 Thinking 정보 업데이트:", thinkingInfo.stage);
        setThinkingInfoList((prev) => [...prev, thinkingInfo]);
      },

      // 에러 핸들러
      onError: (event) => {
        console.error("❌ SSE 에러:", event.error.type, event.error.message);
        setError(event.error.message || "채팅 처리 중 오류가 발생했습니다");
        setSessionStatus("FAILED");
        setIsStreaming(false);
        setCurrentMainResponse("");
        toast.error(event.error.message || "오류가 발생했습니다");
      },
    }),
    [scrollToBottom],
  );

  /**
   * 채팅 메시지 전송 및 v2.1 SSE 스트리밍 시작
   */
  const handleSendMessage = useCallback(
    async (message: string) => {
      try {
        setError(null);
        setSessionStatus("THINKING");
        setIsStreaming(true);

        // 새 메시지 시작 시 이전 스트리밍 상태 완전 초기화
        setCurrentMainResponse("");

        // v2.1: 별도 상태들 초기화
        setUrlInfoList([]);
        setThinkingInfoList([]);
        setWebSearchResults([]); // 🔧 v2.1: 웹 검색 결과 초기화
        setParallelProcessing(null);
        setDetailButtons({
          isStarted: false,
          expectedCount: 0,
          readyButtons: [],
          isComplete: false,
        });

        // 사용자 메시지 추가
        const userMessage: ChatMessageItem = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: "user",
          data: { content: message },
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setTimeout(scrollToBottom, 100);

        // v2.1 표준화된 채팅 요청
        const request = {
          message,
          session_uuid: sessionUuidRef.current || undefined,
        };

        console.log("📤 v2.1 채팅 요청 전송:", request);

        // v2.1 표준화된 SSE 처리
        await chatApi.startV2StandardStreaming(request, v2SSEHandlers, {
          onClose: () => {
            console.log("🔌 v2.1 SSE 연결 종료");
            setIsStreaming(false);
            setCurrentMainResponse("");
            if (sessionStatusRef.current !== "COMPLETED") {
              setSessionStatus("PENDING");
            }
          },
          onError: (error: Error) => {
            console.error("🚨 v2.1 SSE 연결 에러:", error);
            setError(error.message);
            setSessionStatus("FAILED");
            setIsStreaming(false);
            setCurrentMainResponse("");
            toast.error(error.message);
          },
        });
      } catch (error) {
        console.error("v2.1 채팅 처리 실패:", error);
        setError(chatApi.parseErrorMessage(error));
        setSessionStatus("FAILED");
        setIsStreaming(false);
        setCurrentMainResponse("");
      }
    },
    [v2SSEHandlers, scrollToBottom],
  );

  /**
   * 채팅 기록 초기화
   */
  const handleClearChat = useCallback(() => {
    setMessages([]);
    // 🔧 v2.1: 모든 상태 초기화
    setCurrentMainResponse("");
    setUrlInfoList([]);
    setThinkingInfoList([]);
    setWebSearchResults([]); // 🔧 v2.1: 웹 검색 결과 초기화
    setParallelProcessing(null);
    setDetailButtons({
      isStarted: false,
      expectedCount: 0,
      readyButtons: [],
      isComplete: false,
    });
    setSessionStatus("PENDING");
    setError(null);
    setCurrentSessionId(null);
    setSessionUuid(null);
  }, []);

  const userType = isAuthenticated ? "MEMBER" : "GUEST";

  return (
    <div className={cn("flex h-full flex-col bg-background", className)}>
      {/* 사용자 상태 및 세션 정보 표시 */}
      <div className="border-b bg-white/90 px-4 py-2 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge
              variant={userType === "MEMBER" ? "default" : "outline"}
              className={
                userType === "MEMBER" ? "bg-success-600" : "text-neutral-600"
              }
            >
              {userType === "MEMBER" ? "👤 회원" : "👥 비회원"}
            </Badge>
            {userType === "MEMBER" && currentSessionId && (
              <Badge variant="secondary" className="text-xs">
                세션: {currentSessionId.slice(-8)}
              </Badge>
            )}
            {userType === "GUEST" && (
              <span className="text-sm text-neutral-600">
                로그인하면 대화 기록을 저장할 수 있습니다
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* 병렬 처리 상태 표시 */}
            {isStreaming && (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-primary-600" />
                <span className="text-sm text-neutral-600">
                  {sessionStatus === "THINKING" && "분석 중..."}
                  {sessionStatus === "RESPONDING" && "응답 생성 중..."}
                  {parallelProcessing && ` (${parallelProcessing.stage})`}
                </span>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              disabled={isStreaming}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <Card className="max-w-md">
              <CardContent className="p-6 text-center">
                <h3 className="mb-2 text-lg font-semibold">
                  AI 무역 정보 플랫폼 (v2.0)
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {welcomeMessage}
                </p>
                {userType === "GUEST" && (
                  <Badge variant="outline" className="text-xs">
                    로그인하면 더 많은 기능을 이용할 수 있습니다
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* 메시지 목록 */}
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              type={message.type}
              data={message.data}
              timestamp={message.timestamp}
            />
          ))}

          {/* 🔧 실시간 스트리밍 중인 내용 표시 */}
          {isStreaming && (
            <ChatMessage
              type="ai"
              data={{ content: currentMainResponse || "" }}
              timestamp={new Date().toISOString()}
              isLoading={
                !currentMainResponse || currentMainResponse.length === 0
              }
            />
          )}
        </div>

        {/* 🆕 v2.0: 별도 URL 정보 UI */}
        {urlInfoList.length > 0 && (
          <Card className="mt-4 border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <h4 className="mb-3 text-sm font-medium text-blue-800">
                🔗 관련 상세 페이지
              </h4>
              <div className="grid gap-2">
                {urlInfoList.map((urlInfo, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleUrlButtonClick(urlInfo)}
                    className="h-auto justify-start py-2 text-left"
                  >
                    <ExternalLink className="mr-2 h-3 w-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{urlInfo.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {urlInfo.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 🆕 v2.0: 별도 Thinking 정보 UI */}
        {thinkingInfoList.length > 0 && (
          <Card className="mt-4 border-amber-200 bg-amber-50/50">
            <CardContent className="p-4">
              <h4 className="mb-3 text-sm font-medium text-amber-800">
                🤔 AI 분석 과정
              </h4>
              <div className="space-y-2">
                {thinkingInfoList.slice(-3).map((thinkingInfo, index) => (
                  <div key={index} className="text-sm">
                    <Badge variant="outline" className="mr-2 text-xs">
                      {thinkingInfo.stage}
                    </Badge>
                    <span className="text-amber-700">
                      {thinkingInfo.content}
                    </span>
                  </div>
                ))}
                {thinkingInfoList.length > 3 && (
                  <div className="text-xs text-amber-600">
                    +{thinkingInfoList.length - 3}개 더
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 🆕 웹 검색 결과 UI */}
        {webSearchResults.length > 0 && (
          <WebSearchResults
            results={webSearchResults}
            className="mt-4"
            maxResults={6}
          />
        )}

        {/* 스크롤 기준점 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="border-t bg-white px-4 py-4">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isStreaming}
          disabled={sessionStatus === "FAILED"}
        />

        {/* 에러 표시 */}
        {error && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* 병렬 처리 진행상황 */}
        {parallelProcessing && (
          <div className="mt-2 text-xs text-neutral-600">
            📊 {parallelProcessing.content} ({parallelProcessing.progress}%)
          </div>
        )}

        {/* 상세 버튼 준비 상황 */}
        {detailButtons.isStarted && !detailButtons.isComplete && (
          <div className="mt-2 text-xs text-blue-600">
            🔘 상세 페이지 준비 중... ({detailButtons.readyButtons.length}/
            {detailButtons.expectedCount})
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 전체 페이지 채팅 인터페이스 (랩퍼)
 */
export function FullPageChatInterface({
  onBookmark,
  welcomeMessage,
}: {
  onBookmark?: (relatedInfo: RelatedInfo) => void;
  welcomeMessage?: string;
}) {
  return (
    <div className="h-full">
      <ChatInterface
        onBookmark={onBookmark}
        welcomeMessage={welcomeMessage}
        className="h-full"
      />
    </div>
  );
}
