import {
  chatApi,
  type ChatRequest,
  type V2SSEEventHandlers,
  type ClaudeErrorEvent,
  type V2ContentDeltaEvent,
} from "@/lib/api/chat";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { ChatMessage } from "@/types/chat";
import { router } from "@/main";
import { useChatState } from "@/stores/chatStore";

export type UseChatOptions = {
  // 상태를 직접 갖는 대신, 상태를 변경하는 함수와 콜백을 props로 받음
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  session_uuid: string | null;
  onNewSessionCreated: (newSessionId: string) => void;
};

export function useChat({
  setMessages,
  session_uuid,
  onNewSessionCreated,
}: UseChatOptions) {
  // isLoading, error 등 작업과 직접 관련된 휘발성 상태만 훅이 관리
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);

  const { clearChatState } = useChatState();

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (isLoading) return;

      setIsLoading(true);
      setError(null);

      // 사용자 메시지를 UI에 추가 (부모로부터 받은 setMessages 사용)
      const userMessageId = `user_${Date.now()}`;
      const userMessage: ChatMessage = {
        messageId: userMessageId,
        messageType: "USER",
        content: messageText,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // AI 응답을 위한 자리 표시자 추가 (부모로부터 받은 setMessages 사용)
      const aiMessageId = `ai_${Date.now()}`;
      setCurrentMessageId(aiMessageId);
      const aiPlaceholder: ChatMessage = {
        messageId: aiMessageId,
        messageType: "AI",
        content: "",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, aiPlaceholder]);

      const handlers: V2SSEEventHandlers = {
        onChatSessionInfo: (data) => {
          // 새 세션 ID를 받으면 직접 URL을 변경하는 대신 콜백을 호출
          if (data.session_uuid && !session_uuid) {
            console.log("새로운 세션 ID 수신, 콜백 호출 :", data.session_uuid);
            onNewSessionCreated(data.session_uuid);
          }
        },
        onProcessingStatus: (data) => {
          console.log(
            `[Processing Status] ${data.message} (${data.progress}%)`,
          );
          // TODO: 이 상태를 UI에 표시 (예: 토스트 메시지, 진행률 표시줄)
        },
        onChatContentDelta: (data: V2ContentDeltaEvent) => {
          if (data.delta.type === "text_delta" && data.delta.text) {
            // 스트리밍 데이터 업데이트
            setMessages((prev) =>
              prev.map((msg) =>
                msg.messageId === aiMessageId
                  ? { ...msg, content: (msg.content || "") + data.delta.text }
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
          // 에러 발생 시 AI 메시지 자리 표시자 제거
          setMessages((prev) =>
            prev.filter((msg) => msg.messageId !== aiMessageId),
          );
        },
        onMessageDelta: (event) => {
          if (event.delta.stop_reason === "end_turn") {
            setIsLoading(false);
            setCurrentMessageId(null);
            console.log("스트림 종료 (end_turn)");
          }
        },
        onChatMessageStop: () => {
          setIsLoading(false);
          setCurrentMessageId(null);
          console.log("스트림 종료 (message_stop)");
        },
      };

      try {
        const request: ChatRequest = { message: messageText };
        if (session_uuid) {
          request.session_uuid = session_uuid;
        }
        await chatApi.startV2StandardStreaming(request, handlers);
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
        // 예외 발생 시 AI 메시지 자리 표시자 제거
        setMessages((prev) =>
          prev.filter((msg) => msg.messageId !== aiMessageId),
        );
      } finally {
        clearChatState();
      }
    },
    [isLoading, session_uuid, setMessages, onNewSessionCreated, clearChatState],
  );

  return {
    error,
    isLoading,
    sendMessage,
    currentMessageId,
  };
}
