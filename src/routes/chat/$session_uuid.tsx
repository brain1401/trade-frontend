import {
  createFileRoute,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useChat } from "@/hooks/useChat";
import { chatHistoryQueries } from "@/lib/api/chat";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/types/chat";
import { ChatInterface } from "@/components/search";
import { useChatState } from "@/stores/chatStore";

// Zod 스키마로 search-param 유효성 검사
const chatSearchSchema = z.object({
  message: z.string().optional().catch(""), // newMessage를 message로 변경하고 기본값 제공
  isNew: z.boolean().optional().catch(false),
});

export const Route = createFileRoute("/chat/$session_uuid")({
  validateSearch: chatSearchSchema,
  component: ChatSessionPage,
});

function ChatSessionPage() {
  const { session_uuid } = Route.useParams();
  const {
    isNewSession,
    message: pendingMessage,
    messages,
    setMessages,
    resetChat: resetChatState, // 이름 충돌을 피하기 위해 resetChatState로 변경
  } = useChatState();
  const sentMessageRef = useRef<string | null>(null);

  const navigate = useNavigate();

  const handleNewSessionCreated = (newSessionId: string) => {
    navigate({
      to: "/chat/$session_uuid",
      params: { session_uuid: newSessionId },
      replace: true,
    });
  };

  const { isLoading, error, sendMessage, currentMessageId } = useChat({
    session_uuid,
    onNewSessionCreated: handleNewSessionCreated,
  });

  const {
    data: chatHistory,
    isLoading: isSessionLoading,
    error: sessionError,
  } = useQuery(
    chatHistoryQueries.detail(session_uuid, { isNewChat: isNewSession }),
  );

  useEffect(() => {
    if (!isSessionLoading && chatHistory) {
      const historyMessages = chatHistory.messages.map((message) => ({
        messageId: message.messageId,
        messageType: message.messageType,
        content: message.content,
        createdAt: message.createdAt,
      }));
      setMessages(historyMessages);
    } else if (isNewSession) {
      setMessages([]);
    }
  }, [chatHistory, isSessionLoading, isNewSession, setMessages]);

  useEffect(() => {
    if (sessionError && !isNewSession) {
      navigate({ to: "/", replace: true });
    }
  }, [sessionError, isNewSession, navigate]);

  useEffect(() => {
    if (
      pendingMessage &&
      isNewSession &&
      !isLoading &&
      sentMessageRef.current !== pendingMessage
    ) {
      sentMessageRef.current = pendingMessage;
      sendMessage(pendingMessage);
    }
  }, [pendingMessage, isNewSession, isLoading, sendMessage]);

  // '새 대화' 버튼 클릭 시 실행될 함수
  const resetChat = () => {
    resetChatState(); // 스토어의 resetChat 호출
    navigate({
      to: "/search",
      replace: true,
    });
  };

  return (
    <div key={session_uuid} className="h-full">
      {isSessionLoading && !isNewSession ? (
        <div className="flex h-full items-center justify-center">
          <div>세션을 불러오는 중...</div>
        </div>
      ) : (
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          error={error ?? undefined}
          sendMessage={sendMessage}
          currentMessageId={currentMessageId}
          onNewChat={resetChat}
          sessionId={session_uuid}
        />
      )}
    </div>
  );
}
