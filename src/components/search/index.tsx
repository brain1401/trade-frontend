/**
 * 검색/채팅 컴포넌트 인덱스 (v4.0 - ChatGPT 스타일)
 *
 * v4.0의 혁신적 변화:
 * - 복잡한 검색 결과 카드 → ChatGPT 스타일 메시지
 * - 다중 검색 API → 단일 통합 채팅 API
 * - Claude AI 사고과정 실시간 표시
 */

// 메인 컴포넌트들
export { ChatInterface, FullPageChatInterface } from "./ChatInterface";
export { ChatMessage, UserMessage, ThinkingMessage } from "./ChatMessage";
export { ChatInput, SimpleChatInput } from "./ChatInput";

// 타입들
export type { ChatInterfaceProps, ChatMessageItem } from "./ChatInterface";
export type {
  ChatMessageProps,
  ChatMessageData,
  ChatMessageType,
} from "./ChatMessage";
export type { ChatInputProps } from "./ChatInput";

// 사용법 예시:
// import { FullPageChatInterface } from "@/components/search";
// import { ChatInterface } from "@/components/search";

/**
 * 기본 사용법:
 *
 * ```tsx
 * // 1. 전체 페이지 채팅 인터페이스
 * import { FullPageChatInterface } from "@/components/search";
 *
 * function SearchPage() {
 *   const handleBookmark = (relatedInfo: RelatedInfo) => {
 *     // 북마크 추가 로직
 *   };
 *
 *   return <FullPageChatInterface onBookmark={handleBookmark} />;
 * }
 *
 * // 2. 커스텀 채팅 인터페이스
 * import { ChatInterface } from "@/components/search";
 *
 * function CustomChatPage() {
 *   return (
 *     <div className="container mx-auto p-4">
 *       <ChatInterface
 *         className="h-[600px] border rounded-lg"
 *         welcomeMessage="무역 정보를 물어보세요!"
 *         onBookmark={handleBookmark}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
