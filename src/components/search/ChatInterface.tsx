import { useState, useCallback, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertCircle, Trash2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  ChatMessage,
  type ChatMessageData,
  type ChatMessageType,
} from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { chatApi, type SSEEventHandlers } from "@/lib/api";
import { useAuth } from "@/stores/authStore";
import { toast } from "sonner";
import type { ChatSessionStatus, RelatedInfo } from "@/types/chat";

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
 * 🆕 v6.1: 3단계 병렬 처리 상태
 */
type ParallelProcessingState = {
  mainMessageComplete: boolean;
  detailButtons: any[];
  memberRecordSaved: boolean;
  allProcessingComplete: boolean;
};

/**
 * 🆕 v6.1: ChatGPT 스타일 회원/비회원 차별화 통합 채팅 인터페이스
 *
 * v6.1의 핵심 컴포넌트로, 회원/비회원 차별화된 채팅을 처리하고
 * SSE 메타데이터 기반 북마크와 3단계 병렬 처리를 지원한다.
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

  // 현재 스트리밍 중인 메시지들
  const [currentThinking, setCurrentThinking] = useState<string>("");
  const [currentMainResponse, setCurrentMainResponse] = useState<string>("");

  // 3단계 병렬 처리 상태
  const [parallelProcessing, setParallelProcessing] =
    useState<ParallelProcessingState>({
      mainMessageComplete: false,
      detailButtons: [],
      memberRecordSaved: false,
      allProcessingComplete: false,
    });

  // SSE 메타데이터 기반 북마크 데이터
  const [bookmarkData, setBookmarkData] = useState<{
    available: boolean;
    hsCode?: string;
    productName?: string;
    confidence?: number;
  } | null>(null);

  // 🔧 모든 상태의 최신 값을 유지하는 ref들
  const isAuthenticatedRef = useRef(isAuthenticated);
  const messagesRef = useRef(messages);
  const sessionStatusRef = useRef(sessionStatus);
  const currentThinkingRef = useRef(currentThinking);
  const currentMainResponseRef = useRef(currentMainResponse);
  const parallelProcessingRef = useRef(parallelProcessing);
  const currentSessionIdRef = useRef(currentSessionId);

  // ref 값들을 최신 상태로 동기화
  isAuthenticatedRef.current = isAuthenticated;
  messagesRef.current = messages;
  sessionStatusRef.current = sessionStatus;
  currentThinkingRef.current = currentThinking;
  currentMainResponseRef.current = currentMainResponse;
  parallelProcessingRef.current = parallelProcessing;
  currentSessionIdRef.current = currentSessionId;

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
   * SSE 메타데이터 기반 북마크 생성
   */
  const handleCreateBookmark = useCallback(async () => {
    if (
      !bookmarkData?.available ||
      !bookmarkData.hsCode ||
      !isAuthenticatedRef.current
    ) {
      toast.error("북마크를 생성할 수 없습니다.");
      return;
    }

    const relatedInfo: RelatedInfo = {
      hsCode: bookmarkData.hsCode,
      category: bookmarkData.productName,
    };

    try {
      await onBookmark?.(relatedInfo);
      toast.success(`${bookmarkData.productName} 북마크가 생성되었습니다!`);
      setBookmarkData(null);
    } catch (error) {
      console.error("북마크 생성 실패:", error);
      toast.error("북마크 생성에 실패했습니다.");
    }
  }, [bookmarkData, onBookmark]);

  /**
   * 상세페이지 버튼 클릭 핸들러
   */
  const handleDetailPageButton = useCallback((button: any) => {
    window.location.href = button.url;
  }, []);

  /**
   * 🔧 v6.1 SSE 이벤트 핸들러들 (실제 서버 응답에 맞게 수정)
   */
  const sseHandlers: SSEEventHandlers = useMemo(
    () => ({
      // 세션 ID 수신
      onSessionId: (data) => {
        console.log("🔍 새 세션 ID:", data.session_id);
        setCurrentSessionId(data.session_id);
      },

      // HSCode 검색 결과 수신
      onHSCodeResult: (data) => {
        console.log("📊 HSCode 검색 결과:", data);
        // HSCode 결과를 메시지로 추가
        if (data.results && data.results.length > 0) {
          const newMessage: ChatMessageItem = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: "ai",
            data: {
              content: `HSCode 검색 결과: ${data.results.length}개 항목 발견`,
              relatedInfo: data.results[0]
                ? { hsCode: data.results[0].code }
                : undefined,
            },
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, newMessage]);
          setTimeout(scrollToBottom, 100);
        }
      },

      // 토큰 스트리밍 (실시간 응답 생성)
      onToken: (data) => {
        console.log("💬 토큰 수신:", data.content);
        setCurrentMainResponse((prev) => prev + data.content);
        setSessionStatus("RESPONDING");
      },

      // 응답 완료
      onComplete: (data) => {
        console.log("✅ 응답 완료:", data);

        // 누적된 응답이 있으면 최종 메시지로 추가
        const finalContent = currentMainResponseRef.current || data.message;

        if (finalContent) {
          const newMessage: ChatMessageItem = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: "ai",
            data: {
              content: finalContent,
              sources: data.source
                ? [{ title: data.source, url: "", type: "OTHER" as const }]
                : undefined,
            },
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, newMessage]);
          setCurrentMainResponse("");
          setTimeout(scrollToBottom, 100);
        }

        setSessionStatus("COMPLETED");
        toast.success(`응답 완료 (토큰: ${data.token_count})`);
      },

      // 스트림 종료
      onFinish: (data) => {
        console.log("🔚 스트림 종료:", data.message);
        setIsStreaming(false);
        setCurrentThinking("");
        setCurrentMainResponse("");
        if (sessionStatusRef.current !== "COMPLETED") {
          setSessionStatus("PENDING");
        }
      },

      // 에러 처리
      onError: (data) => {
        console.error("❌ SSE 에러:", data);
        setError(data.message || "채팅 처리 중 오류가 발생했습니다");
        setSessionStatus("FAILED");
        setIsStreaming(false);
        setCurrentThinking("");
        setCurrentMainResponse("");
        toast.error(data.message || "오류가 발생했습니다");
      },
    }),
    [scrollToBottom],
  );

  /**
   * 채팅 메시지 전송 및 SSE 스트리밍 시작
   */
  const handleSendMessage = useCallback(
    async (message: string) => {
      try {
        setError(null);
        setSessionStatus("THINKING");
        setIsStreaming(true);

        // 새 메시지 시작 시 이전 스트리밍 상태 완전 초기화
        setCurrentThinking("");
        setCurrentMainResponse("");

        // 3단계 병렬 처리 상태 초기화
        setParallelProcessing({
          mainMessageComplete: false,
          detailButtons: [],
          memberRecordSaved: false,
          allProcessingComplete: false,
        });
        setBookmarkData(null);

        // 사용자 메시지 추가
        const userMessage: ChatMessageItem = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: "user",
          data: { content: message },
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setTimeout(scrollToBottom, 100);

        // 회원/비회원 차별화 채팅 요청
        const request = {
          message,
          sessionId: currentSessionIdRef.current || undefined,
          context: {
            userAgent: navigator.userAgent,
            language: "ko",
          },
        };

        console.log("📤 채팅 요청 전송:", request);

        // 새로운 API 사용: 실제 서버 응답에 맞는 SSE 처리
        await chatApi.startChatWithStreaming(request, sseHandlers, {
          onClose: () => {
            console.log("🔌 SSE 연결 종료");
            setIsStreaming(false);
            setCurrentThinking("");
            setCurrentMainResponse("");
            if (sessionStatusRef.current !== "COMPLETED") {
              setSessionStatus("PENDING");
            }
          },
          onError: (error: Error) => {
            console.error("🚨 SSE 연결 에러:", error);
            setError(error.message);
            setSessionStatus("FAILED");
            setIsStreaming(false);
            setCurrentThinking("");
            setCurrentMainResponse("");
            toast.error(error.message);
          },
        });
      } catch (error) {
        console.error("채팅 처리 실패:", error);
        setError(chatApi.parseErrorMessage(error));
        setSessionStatus("FAILED");
        setIsStreaming(false);
        setCurrentThinking("");
        setCurrentMainResponse("");
      }
    },
    [sseHandlers, scrollToBottom],
  );

  /**
   * 채팅 기록 초기화
   */
  const handleClearChat = useCallback(() => {
    setMessages([]);
    // 🔧 초기화 시 모든 스트리밍 상태 확실히 초기화
    setCurrentThinking("");
    setCurrentMainResponse("");
    setBookmarkData(null);
    setParallelProcessing({
      mainMessageComplete: false,
      detailButtons: [],
      memberRecordSaved: false,
      allProcessingComplete: false,
    });
    setSessionStatus("PENDING");
    setError(null);
    setCurrentSessionId(null);
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
            {/* 3단계 병렬 처리 상태 표시 */}
            {isStreaming && (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-primary-600" />
                <span className="text-sm text-neutral-600">
                  {sessionStatus === "THINKING" && "분석 중..."}
                  {sessionStatus === "RESPONDING" && "응답 생성 중..."}
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
                  AI 무역 정보 플랫폼
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

          {/* 🔧 세션 상태에 따른 thinking 메시지 렌더링 제어 */}
          {currentThinking && sessionStatus === "THINKING" && (
            <ChatMessage
              type="thinking"
              data={{ content: currentThinking }}
              timestamp={new Date().toISOString()}
            />
          )}

          {/* 🔧 세션 상태에 따른 Main Response 렌더링 제어 */}
          {currentMainResponse && sessionStatus === "RESPONDING" && (
            <ChatMessage
              type="ai"
              data={{ content: currentMainResponse }}
              timestamp={new Date().toISOString()}
            />
          )}
        </div>

        {/* SSE 메타데이터 기반 북마크 버튼 */}
        {bookmarkData?.available && isAuthenticated && (
          <div className="mt-4">
            <Card className="border-primary-200 bg-primary-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-primary-900">
                      북마크 추가 가능
                    </h4>
                    <p className="text-sm text-primary-700">
                      {bookmarkData.productName} (HS Code: {bookmarkData.hsCode}
                      )
                    </p>
                    <p className="text-xs text-primary-600">
                      분류 신뢰도:{" "}
                      {((bookmarkData.confidence || 0) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <Button
                    onClick={handleCreateBookmark}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    북마크 추가
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 상세페이지 버튼들 (병렬 처리 결과) */}
        {parallelProcessing.detailButtons.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium text-neutral-700">
              관련 상세 정보
            </h4>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {parallelProcessing.detailButtons.map((button) => (
                <Button
                  key={button.buttonType}
                  variant="outline"
                  className="justify-start text-left"
                  onClick={() => handleDetailPageButton(button)}
                >
                  <div>
                    <div className="font-medium">{button.title}</div>
                    <div className="text-xs text-neutral-600">
                      {button.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* 에러 표시 */}
        {error && (
          <div className="mt-4">
            <Card className="border-destructive">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="border-t bg-white/90 p-4 backdrop-blur-sm">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isStreaming}
          placeholder={
            isStreaming
              ? "메시지 처리 중..."
              : `${userType === "MEMBER" ? "회원님, " : ""}무역 관련 질문을 입력해주세요...`
          }
        />

        {/* 회원/비회원 차별화 안내 */}
        <div className="mt-2 text-center">
          <span className="text-xs text-neutral-500">
            {userType === "MEMBER"
              ? "회원님의 모든 대화가 자동으로 저장됩니다"
              : "로그인하시면 대화 기록과 북마크 기능을 이용할 수 있습니다"}
          </span>
        </div>
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
