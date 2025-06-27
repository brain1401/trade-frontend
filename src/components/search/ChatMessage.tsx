import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bot, Copy, ExternalLink, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { SourceReference, RelatedInfo } from "@/types/chat";

/**
 * 채팅 메시지 타입
 */
export type ChatMessageType = "user" | "ai" | "thinking";

/**
 * 채팅 메시지 데이터
 */
export type ChatMessageData = {
  /** 메시지 내용 */
  content?: string;
  /** 타임스탬프 */
  timestamp?: string;
  /** 관련 정보 (AI 답변 시) */
  relatedInfo?: RelatedInfo;
  /** 상세 페이지 URL */
  detailPageUrl?: string;
  /** 참고 자료 */
  sources?: SourceReference[];
};

/**
 * 채팅 메시지 컴포넌트 프로퍼티
 */
export type ChatMessageProps = {
  /** 메시지 데이터 */
  data: ChatMessageData;
  /** 메시지 타입 */
  type: ChatMessageType;
  /** 타임스탬프 */
  timestamp?: string;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 북마크 추가 핸들러 */
  onBookmark?: (relatedInfo: RelatedInfo) => void;
  /** 복사 핸들러 */
  onCopy?: (content: string) => void;
};

/**
 * ChatGPT 스타일 메시지 컴포넌트
 *
 * v6.1 통합 채팅에서 사용자 질문과 AI 답변을 표시
 * Thinking 과정과 Main Message를 구분하여 표시 가능
 */
export function ChatMessage({
  data,
  type,
  timestamp,
  isLoading = false,
  onBookmark,
  onCopy,
}: ChatMessageProps) {
  const isUser = type === "user";
  const isThinking = type === "thinking";
  const isAI = type === "ai" || type === "thinking";

  // message 객체를 data와 timestamp로 재구성
  const message = {
    ...data,
    timestamp: timestamp || data.timestamp,
  };

  return (
    <div
      className={cn(
        "flex w-full gap-4 px-4 py-6",
        isUser && "bg-neutral-50/50",
        isThinking && "border-l-4 border-l-blue-200 bg-blue-50/30",
      )}
    >
      {/* 아바타 */}
      <div className="flex-shrink-0">
        <Avatar className="h-8 w-8">
          {isUser ? (
            <AvatarFallback className="bg-blue-100">
              <User className="h-4 w-4 text-blue-600" />
            </AvatarFallback>
          ) : (
            <AvatarFallback
              className={cn(
                "text-white",
                isThinking ? "bg-blue-500" : "bg-green-500",
              )}
            >
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      {/* 메시지 내용 */}
      <div className="min-w-0 flex-1">
        {/* 메시지 헤더 */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-700">
            {isUser ? "나" : isThinking ? "Claude (분석 중)" : "Claude"}
          </span>
          {isThinking && (
            <Badge
              variant="outline"
              className="border-blue-200 text-xs text-blue-600"
            >
              사고 과정
            </Badge>
          )}
          {message.timestamp && (
            <span className="text-xs text-neutral-500">
              {new Date(message.timestamp).toLocaleTimeString("ko-KR")}
            </span>
          )}
        </div>

        {/* 메시지 본문 */}
        <div className="space-y-4">
          {/* 로딩 상태 */}
          {isLoading && (
            <div className="flex items-center gap-2 text-neutral-600">
              <div className="flex gap-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400"></div>
              </div>
              <span className="text-sm">답변 생성 중...</span>
            </div>
          )}

          {/* 메시지 텍스트 */}
          {message.content && (
            <div
              className={cn(
                "prose prose-sm max-w-none",
                isThinking && "text-blue-700",
                "prose-headings:text-neutral-800 prose-p:text-neutral-700",
              )}
            >
              {/* 안전한 텍스트 렌더링 */}
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          )}

          {/* AI 답변의 추가 정보 */}
          {isAI && !isThinking && message.relatedInfo && (
            <Card className="mt-4 bg-neutral-50/50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* HS Code 정보 */}
                  {message.relatedInfo.hsCode && (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-neutral-700">
                          HS Code: {message.relatedInfo.hsCode}
                        </div>
                        {message.relatedInfo.category && (
                          <div className="mt-1 text-xs text-neutral-600">
                            카테고리: {message.relatedInfo.category}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          message.relatedInfo &&
                          onBookmark?.(message.relatedInfo)
                        }
                        className="text-xs"
                      >
                        <Bookmark className="mr-1 h-3 w-3" />
                        북마크
                      </Button>
                    </div>
                  )}

                  {/* 상세 페이지 링크 */}
                  {message.detailPageUrl && (
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          message.detailPageUrl &&
                          window.open(message.detailPageUrl, "_blank")
                        }
                        className="text-xs"
                      >
                        <ExternalLink className="mr-1 h-3 w-3" />
                        상세 정보 보기
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 출처 정보 */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-4 border-t pt-3">
              <div className="mb-2 text-xs font-medium text-neutral-600">
                참고 자료
              </div>
              <div className="space-y-1">
                {message.sources.slice(0, 3).map((source, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge
                      variant={
                        source.type === "OFFICIAL" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {source.type === "OFFICIAL" ? "공식" : "참고"}
                    </Badge>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-xs text-blue-600 hover:underline"
                    >
                      {source.title}
                    </a>
                  </div>
                ))}
                {message.sources.length > 3 && (
                  <div className="text-xs text-neutral-500">
                    +{message.sources.length - 3}개 더
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 액션 버튼들 */}
        {!isLoading && !isThinking && (
          <div className="mt-4 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy?.(message.content || "")}
              className="text-xs text-neutral-600 hover:text-neutral-700"
            >
              <Copy className="mr-1 h-3 w-3" />
              복사
            </Button>
            {!isUser && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-neutral-600 hover:text-neutral-700"
              >
                👍
              </Button>
            )}
            {!isUser && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-neutral-600 hover:text-neutral-700"
              >
                👎
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 사용자 메시지 컴포넌트 (간단한 래퍼)
 */
export function UserMessage({ content }: { content: string }) {
  return (
    <ChatMessage
      data={{ content, timestamp: new Date().toISOString() }}
      type="user"
    />
  );
}

/**
 * AI 사고과정 메시지 컴포넌트 (간단한 래퍼)
 */
export function ThinkingMessage({ content }: { content: string }) {
  return (
    <ChatMessage
      data={{ content, timestamp: new Date().toISOString() }}
      type="thinking"
    />
  );
}
