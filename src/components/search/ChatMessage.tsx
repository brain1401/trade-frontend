import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bot, Copy, ExternalLink, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { memo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { SourceReference, RelatedInfo } from "@/types/chat";
import { Skeleton } from "@/components/ui/skeleton";
import { WebSearchResults } from "./WebSearchResults";

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
 * 채팅 메시지 아이템 (UI용)
 */
export type ChatMessageItem = {
  id: string;
  type: ChatMessageType;
  data: ChatMessageData;
  timestamp: string;
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
 * 🆕 react-markdown용 커스텀 컴포넌트들
 * Tailwind CSS와 호환되는 스타일링 적용
 */
const MarkdownComponents = {
  // 헤딩 스타일링
  h1: ({ children, ...props }: any) => (
    <h1
      className="mt-6 mb-4 text-2xl font-bold text-neutral-900 first:mt-0"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2
      className="mt-5 mb-3 text-xl font-semibold text-neutral-900 first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3
      className="mt-4 mb-2 text-lg font-medium text-neutral-900 first:mt-0"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: any) => (
    <h4
      className="mt-3 mb-2 text-base font-medium text-neutral-900 first:mt-0"
      {...props}
    >
      {children}
    </h4>
  ),

  // 문단 스타일링
  p: ({ children, ...props }: any) => (
    <p className="mb-3 leading-relaxed text-neutral-700 last:mb-0" {...props}>
      {children}
    </p>
  ),

  // 리스트 스타일링
  ul: ({ children, ...props }: any) => (
    <ul
      className="mb-3 list-inside list-disc space-y-1 text-neutral-700"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol
      className="mb-3 list-inside list-decimal space-y-1 text-neutral-700"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="text-neutral-700" {...props}>
      {children}
    </li>
  ),

  // 강조 스타일링
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-neutral-900" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="text-neutral-800 italic" {...props}>
      {children}
    </em>
  ),

  // 링크 스타일링
  a: ({ children, href, ...props }: any) => (
    <a
      href={href}
      className="text-blue-600 underline decoration-1 underline-offset-2 hover:text-blue-800 hover:decoration-2"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),

  // 코드 스타일링
  code: ({ children, className, ...props }: any) => {
    const isInline = !className?.startsWith("language-");

    if (isInline) {
      return (
        <code
          className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm text-red-600"
          {...props}
        >
          {children}
        </code>
      );
    }

    // 코드 블록 처리
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "text";

    return (
      <div className="relative my-4">
        {/* 언어 라벨 */}
        {language && language !== "text" && (
          <div className="absolute top-2 right-2 z-10 rounded bg-neutral-700 px-2 py-1 font-mono text-xs text-neutral-100">
            {language}
          </div>
        )}
        {/* 구문 강조된 코드 블록 */}
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language === "text" ? "text" : language}
          PreTag="div"
          className="!my-0 rounded-lg"
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
          }}
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    );
  },

  // 인용구 스타일링
  blockquote: ({ children, ...props }: any) => (
    <blockquote
      className="my-3 border-l-4 border-blue-200 bg-blue-50/30 py-2 pl-4 text-neutral-700 italic"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // 구분선 스타일링
  hr: ({ ...props }: any) => (
    <hr className="my-6 border-neutral-200" {...props} />
  ),

  // 테이블 스타일링 (GFM)
  table: ({ children, ...props }: any) => (
    <div className="my-4 overflow-x-auto">
      <table
        className="min-w-full rounded-lg border border-neutral-200"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead className="bg-neutral-50" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: any) => (
    <th
      className="border-b border-neutral-200 px-4 py-2 text-left font-medium text-neutral-900"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td
      className="border-b border-neutral-100 px-4 py-2 text-neutral-700"
      {...props}
    >
      {children}
    </td>
  ),

  // 취소선 (GFM)
  del: ({ children, ...props }: any) => (
    <del className="text-neutral-500 line-through" {...props}>
      {children}
    </del>
  ),
};

/**
 * 🆕 마크다운 콘텐츠 렌더러 컴포넌트
 * 성능 최적화를 위한 메모이제이션 적용
 */
const MarkdownContent = memo(({ content }: { content: string }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={MarkdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownContent.displayName = "MarkdownContent";

export const WelcomeMessage = memo(({ message }: { message: string }) => {
  return (
    <Card className="rounded-xl border-2 border-primary-100 bg-primary-50/30 shadow-sm">
      <CardContent className="p-6 text-center">
        <h3 className="mb-2 text-lg font-semibold text-primary-800">
          AI 무역 플랫폼 (v2.0)
        </h3>
        <p className="text-sm whitespace-pre-line text-neutral-600">
          {message}
        </p>
      </CardContent>
    </Card>
  );
});

/**
 * ChatGPT 스타일 메시지 컴포넌트
 *
 * v6.1 통합 채팅에서 사용자 질문과 AI 답변을 표시
 * 🆕 react-markdown을 사용하여 AI 응답의 마크다운 렌더링 지원
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

  /**
   * 복사 핸들러
   */
  const handleCopy = useCallback(() => {
    if (message.content) {
      navigator.clipboard.writeText(message.content).then(() => {
        // toast.success("메시지가 복사되었습니다");
      });
      onCopy?.(message.content);
    }
  }, [message.content, onCopy]);

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
              )}
            >
              {isUser ? (
                // 🔧 사용자 메시지는 단순 텍스트로 표시
                <div className="whitespace-pre-wrap text-neutral-700">
                  {message.content}
                </div>
              ) : (
                // 🆕 AI 메시지는 마크다운으로 렌더링
                <MarkdownContent content={message.content} />
              )}
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
              onClick={handleCopy}
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
