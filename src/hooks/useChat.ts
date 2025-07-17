import {
  chatApi,
  type ChatRequest,
  type ActualSSEEventHandlers,
  type ClaudeErrorEvent,
  type ActualContentBlockDeltaEvent,
  type ActualProcessingStatusEvent,
  type ActualSessionInfoEvent,
  type ActualMessageStartEvent,
  type ActualContentBlockStartEvent,
  type ActualContentBlockStopEvent,
  type ActualMessageDeltaEvent,
  type ActualEndEvent,
} from "@/lib/api/chat";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useChatState } from "@/stores/chatStore";

export type UseChatOptions = {
  session_uuid: string | null;
  onNewSessionCreated: (newSessionId: string) => void;
};

export type ProcessingStatus = {
  id: string;
  message: string;
  progress: number;
  currentStep: number;
  totalSteps: number;
  timestamp: string;
};

export function useChat({ session_uuid, onNewSessionCreated }: UseChatOptions) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] =
    useState<ProcessingStatus | null>(null);

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

      const handlers: ActualSSEEventHandlers = {
        onSessionInfo: (data: ActualSessionInfoEvent) => {
          if (data.session_uuid && !session_uuid) {
            onNewSessionCreated(data.session_uuid);
          }
        },
        onProcessingStatus: (data: ActualProcessingStatusEvent) => {
          // 진행 상태 업데이트
          setProcessingStatus({
            id: data.id,
            message: data.message,
            progress: data.progress,
            currentStep: data.current_step,
            totalSteps: data.total_steps,
            timestamp: data.timestamp,
          });

          // thinking steps에도 추가
          updateMessage(aiMessageId, (msg) => ({
            ...msg,
            thinkingSteps: [...(msg.thinkingSteps || []), data.message],
          }));
        },
        onMessageStart: (data: ActualMessageStartEvent) => {
          console.log("메시지 시작:", data.message.id);
        },
        onContentBlockStart: (data: ActualContentBlockStartEvent) => {
          console.log("콘텐츠 블록 시작:", data.content_block.type);
        },
        onContentBlockDelta: (data: ActualContentBlockDeltaEvent) => {
          if (data.delta.type === "text_delta" && data.delta.text) {
            const textDelta = data.delta.text;
            if (!thinkingStepsCleared) {
              updateMessage(aiMessageId, (msg) => ({
                ...msg,
                thinkingSteps: [],
                content: textDelta,
              }));
              thinkingStepsCleared = true;
            } else {
              updateMessage(aiMessageId, (msg) => ({
                ...msg,
                content: (msg.content || "") + textDelta,
              }));
            }
          }
        },
        onContentBlockStop: (data: ActualContentBlockStopEvent) => {
          console.log("콘텐츠 블록 종료:", data.index);
        },
        onMessageDelta: (data: ActualMessageDeltaEvent) => {
          if (data.delta.stop_reason) {
            setIsLoading(false);
            setCurrentMessageId(null);
            if (data.delta.stop_reason === "error") {
              updateMessage(aiMessageId, (msg) => ({ ...msg, isError: true }));
            }
          }
        },
        onEnd: (data: ActualEndEvent) => {
          setIsLoading(false);
          setCurrentMessageId(null);
          setProcessingStatus(null);
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
          setProcessingStatus(null);
        },
      };

      try {
        const request: ChatRequest = { message: messageText };
        if (session_uuid) {
          request.session_uuid = session_uuid;
        }
        await chatApi.startActualStreaming(request, handlers);
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
        setProcessingStatus(null);
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
    processingStatus,
  };
}
