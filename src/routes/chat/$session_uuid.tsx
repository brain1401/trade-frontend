import {
  createFileRoute,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useChat } from "@/hooks/useChat";
import { chatHistoryQueries } from "@/lib/api/chat";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/types/chat";
import { ChatInterface } from "@/components/search";
import { createNewChat } from "@/lib/utils/chat/createNewChat";
import { router } from "@/main";
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
  const { isNewSession, message: pendingMessage } = useChatState();
  const sentMessageRef = useRef<string | null>(null);

  console.log("[ChatSessionPage] isNewSession :", isNewSession);
  console.log("[ChatSessionPage] pendingMessage :", pendingMessage);

  const navigate = useNavigate();

  // 1. 페이지 컴포넌트가 messages 상태를 직접 소유
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const {
    data: chatHistory,
    isLoading: isSessionLoading,
    error: sessionError,
  } = useQuery(
    // 새 채팅이 아닐 경우에만 API 호출
    chatHistoryQueries.detail(session_uuid, { isNewChat: isNewSession }),
  );

  // 2. useQuery 데이터가 변경되거나, 새 세션일 때 messages 상태를 동기화
  useEffect(() => {
    // API 로딩이 끝났고, 데이터가 있을 경우
    if (!isSessionLoading && chatHistory) {
      const historyMessages = chatHistory.messages.map(
        (message): ChatMessage => ({
          messageId: message.messageId,
          messageType: message.messageType,
          content: message.content,
          createdAt: message.createdAt,
        }),
      );
      setMessages(historyMessages);
    } else if (isNewSession) {
      setMessages([]); // 새 세션이면 메시지 목록을 비움
    }
  }, [chatHistory, isSessionLoading, isNewSession, session_uuid]); // session_uuid 변경 시 재동기화

  // 기존 세션을 찾지 못했을 경우 홈으로 리다이렉트
  useEffect(() => {
    if (sessionError && !isNewSession) {
      navigate({ to: "/", replace: true });
    }
  }, [sessionError, isNewSession, navigate]);

  // 3. 새 세션이 생성되었을 때 URL을 변경하는 콜백 함수
  const handleNewSessionCreated = (newSessionId: string) => {
    navigate({
      to: "/chat/$session_uuid",
      params: { session_uuid: newSessionId },
      replace: true, // URL 히스토리 교체
    });
  };

  // 4. 리팩토링된 useChat 훅 사용
  const { isLoading, error, sendMessage, currentMessageId } = useChat({
    setMessages, // 상태 업데이트 함수 전달
    session_uuid, // 현재 세션 ID (URL에서 가져온 값) 전달
    onNewSessionCreated: handleNewSessionCreated, // 콜백 전달
  });

  // 5. 페이지 진입 시 대기 중인 메시지(pendingMessage) 자동 전송
  useEffect(() => {
    if (
      pendingMessage &&
      isNewSession &&
      !isLoading &&
      sentMessageRef.current !== pendingMessage
    ) {
      console.log(
        "[ChatSessionPage] pendingMessage 처리 useEffect",
        pendingMessage,
        isNewSession,
        isLoading,
      );

      sentMessageRef.current = pendingMessage;
      sendMessage(pendingMessage);
    }
    // 이 useEffect는 pendingMessage가 변경될 때만 실행
  }, [pendingMessage, isNewSession, isLoading, sendMessage]);

  // '새 대화' 버튼 클릭 시 실행될 함수
  const resetChat = () => {
    // isNew 쿼리 파라미터를 가진 URL로 이동하여 새 채팅 플로우 시작
    navigate({
      to: "/",
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
