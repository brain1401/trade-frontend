import { useMemo, useCallback, useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

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
import { Input } from "../ui/input";
import { httpClient } from "@/lib/api";

import type { ProcessingStatus } from "@/hooks/useChat";

/**
 * 진행 상태 표시 컴포넌트
 */
function ProcessingStatusCard({
  message,
  progress,
  currentStep,
  totalSteps,
}: {
  message: string;
  progress: number;
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">{message}</span>
            <span className="text-xs text-blue-600">
              {currentStep}/{totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-blue-600">{progress}% 완료</div>
        </div>
      </CardContent>
    </Card>
  );
}

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
  /** 진행 상태 정보 */
  processingStatus?: ProcessingStatus | null;
};

export type Book = {
  id: number;
  type: string;
  targetValue: string;
  displayName: string;
  sseGenerated: boolean;
  sseEventData: SSEEventData;
  smsNotificationEnabled: boolean;
  emailNotificationEnabled: boolean;
  monitoringActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SSEEventData = {
  additionalProp1: string;
  additionalProp2: string;
  additionalProp3: string;
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
  processingStatus,
}: ChatInterfaceProps) {
  const [bookMarkName, setBookMarkName] = useState("");
  const [searchState, setSearchState] = useState("");
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

  const handleAddBookmark = async () => {
    const response = (await httpClient.post)<Book>("/bookmarks", {
      type: "HS_CODE",
      targetValue: bookMarkName,
      displayName: bookMarkName,
    });
    if (response) {
      console.log(response);
    }
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

        <div className="flex items-center gap-2">
          <Input
            placeholder="추가할 북마크의 HSCode를 입력하세요..."
            value={bookMarkName}
            className="w-[30rem]"
            onChange={(e) => setBookMarkName(e.target.value)}
          />
          <Button variant="outline" onClick={handleAddBookmark}>
            추가
          </Button>
        </div>
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

            {/* 진행 상태 표시 */}
            {isLoading && processingStatus && (
              <div className="mt-4">
                <ProcessingStatusCard
                  message={processingStatus.message}
                  progress={processingStatus.progress}
                  currentStep={processingStatus.currentStep}
                  totalSteps={processingStatus.totalSteps}
                />
              </div>
            )}
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
