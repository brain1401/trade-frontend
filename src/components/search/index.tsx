/**
 * 검색/채팅 컴포넌트 인덱스 (v4.1 - ChatGPT 스타일 + Markdown 지원)
 *
 * v4.1의 주요 업데이트:
 * - 🆕 react-markdown 통합으로 AI 응답의 마크다운 렌더링 지원
 * - 🎨 Tailwind CSS 기반 마크다운 스타일링
 * - 📝 GitHub Flavored Markdown (GFM) 지원
 * - 💻 코드 블록 문법 하이라이팅
 * - 📊 테이블, 취소선, 작업 목록 등 확장 기능
 * - ⚡ 성능 최적화된 메모이제이션 적용
 *
 * v4.0의 혁신적 변화:
 * - 복잡한 검색 결과 카드 → ChatGPT 스타일 메시지
 * - 다중 검색 API → 단일 통합 채팅 API
 * - TrAI-Bot AI 사고과정 실시간 표시
 */

// 메인 컴포넌트들
export { ChatInterface } from "./ChatInterface";
export { ChatMessage, UserMessage, ThinkingMessage } from "./ChatMessage";
export { ChatInput } from "./ChatInput";
export { WebSearchResults, WebSearchResultItem } from "./WebSearchResults";

// 타입들
export type { ChatInterfaceProps } from "./ChatInterface";
export type {
  ChatMessageProps,
  ChatMessageData,
  ChatMessageType,
  ChatMessageItem,
} from "./ChatMessage";
export type { ChatInputProps } from "./ChatInput";
export type {
  WebSearchResultsProps,
  WebSearchResultItemProps,
} from "./WebSearchResults";

// 사용법 예시:
// import { FullPageChatInterface } from "@/components/search";
// import { ChatInterface } from "@/components/search";

/**
 * 기본 사용법:
 *
 * ```tsx
 * // 1. 전체 페이지 채팅 인터페이스 (마크다운 지원)
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
 *
 * ## 마크다운 지원 기능
 *
 * v4.1부터 AI 응답은 다음 마크다운 기능을 지원합니다:
 *
 * - **헤딩**: `# H1`, `## H2`, `### H3`, `#### H4`
 * - **강조**: `**굵게**`, `*기울임*`, `~~취소선~~`
 * - **링크**: `[텍스트](URL)` - 자동으로 새 탭에서 열림
 * - **리스트**: 순서 있는/없는 리스트, 작업 목록
 * - **코드**: 인라인 코드 및 코드 블록 (언어별 하이라이팅)
 * - **인용구**: `> 인용문`
 * - **테이블**: GitHub 스타일 마크다운 테이블
 * - **구분선**: `---`
 *
 * ### 코드 블록 예시:
 * ````markdown
 * ```javascript
 * console.log("Hello, World!");
 * ```
 * ````
 *
 * ### 테이블 예시:
 * ```markdown
 * | 항목 | 설명 |
 * |------|------|
 * | HS Code | 상품분류코드 |
 * | 관세율 | 수입 시 적용 세율 |
 * ```
 */
