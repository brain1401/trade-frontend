import { useState, useRef, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * 채팅 입력 컴포넌트 프로퍼티
 */
export type ChatInputProps = {
  /** 전송 핸들러 (onSend 또는 onSendMessage 지원) */
  onSend?: (message: string) => void;
  onSendMessage?: (message: string) => void;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 플레이스홀더 텍스트 */
  placeholder?: string;
  /** 최대 글자 수 */
  maxLength?: number;
  /** 추가 CSS 클래스 */
  className?: string;
};

/**
 * ChatGPT 스타일 입력창 컴포넌트
 *
 * v6.1 통합 채팅에서 자연어 질문을 입력받는 컴포넌트
 * 엔터키 전송, 자동 높이 조정, 글자 수 제한 등 지원
 */
export function ChatInput({
  onSend,
  onSendMessage,
  isLoading = false,
  disabled = false,
  placeholder = "무역 관련 질문을 자유롭게 입력해주세요...",
  maxLength = 1000,
  className,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * 메시지 전송 처리
   */
  const handleSend = () => {
    const trimmedMessage = message.trim();

    // 최소 2글자 이상 검증 (API v6.1 요구사항)
    if (trimmedMessage.length < 2) {
      return;
    }

    // onSendMessage가 있으면 우선 사용, 없으면 onSend 사용
    const sendHandler = onSendMessage || onSend;
    sendHandler?.(trimmedMessage);
    setMessage("");

    // 높이 리셋
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  /**
   * 키보드 이벤트 처리 (Shift+Enter: 줄바꿈, Enter: 전송)
   */
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * 텍스트 변경 및 자동 높이 조정
   */
  const handleChange = (value: string) => {
    if (value.length <= maxLength) {
      setMessage(value);

      // 자동 높이 조정 (최대 6줄)
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        const scrollHeight = textareaRef.current.scrollHeight;
        const maxHeight = 24 * 6; // 6줄 높이
        textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      }
    }
  };

  const canSend = message.trim().length >= 2 && !isLoading && !disabled;

  return (
    <div className={cn("relative", className)}>
      {/* 메인 입력 영역 */}
      <div className="relative flex items-end gap-2 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm focus-within:border-blue-300 focus-within:shadow-md">
        {/* 텍스트 입력 */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => handleChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className="max-h-[144px] min-h-[24px] resize-none border-0 p-0 text-sm placeholder:text-neutral-500 focus-visible:ring-0"
          rows={1}
        />

        {/* 전송 버튼 */}
        <Button
          onClick={handleSend}
          disabled={!canSend}
          size="sm"
          className={cn(
            "h-8 w-8 flex-shrink-0 p-0",
            canSend
              ? "bg-blue-600 hover:bg-blue-700"
              : "cursor-not-allowed bg-neutral-300",
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* 하단 정보 */}
      <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center gap-4">
          <span>
            <kbd className="rounded border bg-neutral-100 px-1 py-0.5">
              Enter
            </kbd>{" "}
            전송,
            <kbd className="ml-1 rounded border bg-neutral-100 px-1 py-0.5">
              Shift + Enter
            </kbd>{" "}
            줄바꿈
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* 글자 수 카운터 */}
          <span
            className={cn(
              message.length > maxLength * 0.9 && "text-orange-500",
              message.length >= maxLength && "text-red-500",
            )}
          >
            {message.length}/{maxLength}
          </span>
        </div>
      </div>

      {/* 질문 예시 (빈 상태일 때만 표시) */}
      {message.length === 0 && !isLoading && (
        <div className="mt-4">
          <div className="mb-2 text-xs font-medium text-neutral-600">
            💡 이런 질문을 해보세요:
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "냉동피자 HS Code 알려줘",
              "스마트폰 미국 수출 규제",
              "에너지드링크 관세율",
              "12345678901234567 화물 위치",
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setMessage(example)}
                className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700 transition-colors hover:bg-neutral-200"
                disabled={disabled}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 간단한 채팅 입력 컴포넌트 (기본 스타일)
 */
export function SimpleChatInput({
  onSend,
  isLoading,
}: {
  onSend: (message: string) => void;
  isLoading?: boolean;
}) {
  return (
    <ChatInput
      onSend={onSend}
      isLoading={isLoading}
      className="mx-auto max-w-4xl"
    />
  );
}
