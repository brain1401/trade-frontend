import {
  chatApi,
  type ChatRequest,
  type V2SSEEventHandlers,
  type ClaudeErrorEvent,
  type V2ContentDeltaEvent,
} from "@/lib/api/chat";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useChatState } from "@/stores/chatStore";

export type UseChatOptions = {
  session_uuid: string | null;
  onNewSessionCreated: (newSessionId: string) => void;
};

export function useChat({ session_uuid, onNewSessionCreated }: UseChatOptions) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);

  const { addMessage, updateMessage, clearPendingState, resetChat } =
    useChatState();

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (isLoading) {
        return;
      }

      setIsLoading(true);
      setError(null);

      const userMessageId = `user_${Date.now()}`;
      addMessage({
        messageId: userMessageId,
        messageType: "USER",
        content: messageText,
        createdAt: new Date(),
      });

      const aiMessageId = `ai_${Date.now()}`;
      setCurrentMessageId(aiMessageId);
      addMessage({
        messageId: aiMessageId,
        messageType: "AI",
        content: "",
        createdAt: new Date(),
        thinkingSteps: [],
        isError: false,
      });

      let thinkingStepsCleared = false;

      const handlers: V2SSEEventHandlers = {
        onChatSessionInfo: (data) => {
          if (data.session_uuid && !session_uuid) {
            onNewSessionCreated(data.session_uuid);
          }
        },
        onProcessingStatus: (data) => {
          updateMessage(aiMessageId, (msg) => ({
            ...msg,
            thinkingSteps: [...(msg.thinkingSteps || []), data.message],
          }));
        },
        onChatContentDelta: (data: V2ContentDeltaEvent) => {
          if (data.delta.type === "text_delta" && data.delta.text) {
            if (!thinkingStepsCleared) {
              updateMessage(aiMessageId, (msg) => ({
                ...msg,
                thinkingSteps: [],
                content: data.delta.text,
              }));
              thinkingStepsCleared = true;
            } else {
              updateMessage(aiMessageId, (msg) => ({
                ...msg,
                content: (msg.content || "") + data.delta.text,
              }));
            }
          }
        },
        onError: (event: ClaudeErrorEvent) => {
          const errorMessage =
            event.error.message || "An unknown error occurred";
          setError(errorMessage);
          toast.error(errorMessage);
          updateMessage(aiMessageId, (msg) => ({
            ...msg,
            content: errorMessage,
            isError: true,
          }));
          setIsLoading(false);
          setCurrentMessageId(null);
        },
        onMessageDelta: (event) => {
          if (event.delta.stop_reason) {
            setIsLoading(false);
            setCurrentMessageId(null);
            if (event.delta.stop_reason === "error") {
              updateMessage(aiMessageId, (msg) => ({ ...msg, isError: true }));
            }
          }
        },
        onChatMessageStop: () => {
          setIsLoading(false);
          setCurrentMessageId(null);
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
        updateMessage(aiMessageId, (msg) => ({
          ...msg,
          content: errorMessage,
          isError: true,
        }));
      } finally {
        setIsLoading(false);
        setCurrentMessageId(null);
        clearPendingState();
      }
    },
    [
      isLoading,
      session_uuid,
      onNewSessionCreated,
      addMessage,
      updateMessage,
      clearPendingState,
    ],
  );

  return {
    error,
    isLoading,
    sendMessage,
    currentMessageId,
  };
}
