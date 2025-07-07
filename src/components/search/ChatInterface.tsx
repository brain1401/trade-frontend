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
  chatApi,
  type V2SSEEventHandlers,
  type ClaudeErrorEvent,
  type V2ContentDeltaEvent,
} from "@/lib/api/chat";
import { useAuth } from "@/stores/authStore";
import type { ChatSessionStatus, RelatedInfo } from "@/types/chat";
import type {
  URLInfo,
  ThinkingInfo,
  WebSearchResult,
} from "@/lib/api/chat/types";

import AppLogo from "@/components/common/AppLogo";
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

export function FullPageChatInterface({
  onBookmark,
  welcomeMessage,
}: ChatInterfaceProps) {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [sessionStatus, setSessionStatus] =
    useState<ChatSessionStatus>("PENDING");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentMessageId = useRef<string | null>(null);

  const handleSendMessage = useCallback(
    async (messageText: string) => {
      if (isLoading) return;

      setIsLoading(true);
      setError(null);

      // 사용자 메시지를 먼저 UI에 추가
      const userMessage: ChatMessageItem = {
        id: `user_${Date.now()}`,
        type: "user",
        data: { content: messageText },
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // AI 응답을 위한 자리 표시자 추가
      const aiMessageId = `ai_${Date.now()}`;
      currentMessageId.current = aiMessageId;
      const aiPlaceholder: ChatMessageItem = {
        id: aiMessageId,
        type: "ai",
        data: { content: "" },
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiPlaceholder]);

      const handlers: V2SSEEventHandlers = {
        onChatContentDelta: (data: V2ContentDeltaEvent) => {
          if (data.delta?.text) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === currentMessageId.current
                  ? {
                      ...msg,
                      data: {
                        ...msg.data,
                        content: (msg.data.content || "") + data.delta.text,
                      },
                    }
                  : msg,
              ),
            );
          }
        },
        onError: (event: ClaudeErrorEvent) => {
          setError(event.error.message);
          toast.error(event.error.message);
        },
        onChatMessageStop: () => {
          setIsLoading(false);
        },
        // 다른 핸들러들은 필요에 따라 추가
      };

      try {
        await chatApi.startV2StandardStreaming(
          { message: messageText },
          handlers,
        );
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "An unknown error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  if (messages.length === 0) {
    // 1. 초기 상태
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
          <AppLogo />
          <h1 className="text-3xl font-bold text-neutral-800">
            무엇이든 물어보세요
          </h1>
          <div className="w-full">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder="예: 대한민국의 주요 수출 품목은 무엇인가요?"
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. 활성 상태
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto max-w-3xl">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              type={message.type}
              data={message.data}
              timestamp={message.timestamp}
              isLoading={isLoading && message.id === currentMessageId.current}
            />
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 w-full bg-neutral-50/80 pt-2 pb-4 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder="후속 질문을 입력하세요..."
          />
        </div>
      </div>
    </div>
  );
}
