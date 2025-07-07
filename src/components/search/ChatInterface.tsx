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
import { useChat } from "@/hooks/useChat";
import { ChatInput } from "./ChatInput";
import {
  ChatMessage,
  type ChatMessageData,
  type ChatMessageItem,
  type ChatMessageType,
} from "./ChatMessage";
import { WebSearchResults } from "./WebSearchResults";

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
};

export function FullPageChatInterface({
  onBookmark,
  welcomeMessage,
}: ChatInterfaceProps) {
  const { isAuthenticated } = useAuth();
  const { messages, isLoading, sendMessage, currentMessageId } = useChat();

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
      <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto max-w-3xl">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              type={message.type}
              data={message.data}
              timestamp={message.timestamp}
              isLoading={isLoading && message.id === currentMessageId}
            />
          ))}
        </div>
      </div>
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
