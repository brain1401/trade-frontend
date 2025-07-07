import {
  chatApi,
  type V2SSEEventHandlers,
  type ClaudeErrorEvent,
  type V2ContentDeltaEvent,
} from "@/lib/api/chat";
import type { ChatMessageItem } from "@/components/search";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

export type UseChatOptions = {
  initialMessages?: ChatMessageItem[];
};

export function useChat({ initialMessages = [] }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessageItem[]>(initialMessages);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentMessageId = useRef<string | null>(null);

  const sendMessage = useCallback(
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
          const errorMessage =
            event.error.message || "An unknown error occurred";
          setError(errorMessage);
          toast.error(errorMessage);
          // 에러 발생 시 해당 AI 메시지 제거 또는 에러 상태로 표시
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== currentMessageId.current),
          );
        },
        onChatMessageStop: () => {
          setIsLoading(false);
          currentMessageId.current = null;
        },
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
        // 에러 발생 시 해당 AI 메시지 제거
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== currentMessageId.current),
        );
      }
    },
    [isLoading],
  );

  return {
    messages,
    error,
    isLoading,
    sendMessage,
    currentMessageId: currentMessageId.current,
  };
}
