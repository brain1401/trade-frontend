import { useMemo, useCallback, useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/stores/authStore";
import type {
  ChatMessage as ChatMessageType,
  ChatSessionStatus,
  RelatedInfo,
} from "@/types/chat";
import type {
  URLInfo,
  ThinkingInfo,
  WebSearchResult,
} from "@/lib/api/chat/types";

import AppLogo from "@/components/common/AppLogo";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { WebSearchResults } from "./WebSearchResults";
import { ScrollArea } from "../ui/scroll-area";
import { useNavigate } from "@tanstack/react-router";

/**
 * 채팅 메시지 아이템 (UI용)
 */
// export type ChatMessageItem = {
//   id: string;
//   type: ChatMessageType;
//   data: ChatMessageData;
//   timestamp: string;
// };

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
  /** 채팅 시작 핸들러 */
  onChatStart?: () => void;
  // useChat 훅에서 전달받을 props 추가
  messages?: ChatMessageType[];
  error?: string;
  isLoading?: boolean;
  sendMessage: (messageText: string) => Promise<void>;
  currentMessageId?: string | null;
  onNewChat?: () => void;
  sessionId?: string;
};

export function ChatInterface({
  onBookmark,
  welcomeMessage,
  onChatStart,
  messages = [], // messages prop의 기본값을 빈 배열로 설정
  isLoading,
  error,
  sendMessage,
  currentMessageId,
  onNewChat,
  sessionId,
}: ChatInterfaceProps) {
  const chatStartedRef = useRef(false);

  useEffect(() => {
    if (messages.length > 0 && !chatStartedRef.current) {
      onChatStart?.();
      chatStartedRef.current = true;
    }
  }, [messages, onChatStart]);

  const handleNewChat = () => {
    // 2. 부모 컴포넌트로부터 받은 onNewChat 콜백을 실행하여 상태를 리셋합니다.
    onNewChat?.();
  };

  if (messages.length === 0) {
    // 1. 초기 상태
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
          <div className="w-full">
            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
    );
  }

  // 2. 활성 상태
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b bg-neutral-50/80 px-4 py-2 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80">
        <h1 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          TrAI-bot
        </h1>
        <Button variant="outline" onClick={handleNewChat}>
          새 대화
        </Button>
      </header>
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4 sm:p-6">
          <div className="mx-auto max-w-3xl">
            {messages.map((message) => (
              <ChatMessage
                key={message.messageId}
                type={message.messageType}
                data={{ content: message.content }}
                timestamp={message.createdAt.toISOString()}
                error={error}
                isLoading={isLoading && message.messageId === currentMessageId}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
      <div className="sticky bottom-0 w-full bg-neutral-50/80 pt-2 pb-4 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4">
          <ChatInput
            onSendMessage={sendMessage}
            isLoading={isLoading}
            placeholder="후속 질문을 입력하세요..."
          />
        </div>
      </div>
    </div>
  );
}
