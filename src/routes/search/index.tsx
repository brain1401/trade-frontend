import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import { FullPageChatInterface } from "@/components/search";
import { useAuth } from "@/stores/authStore";
import { bookmarkApi } from "@/lib/api";
import { toast } from "sonner";
import type { RelatedInfo } from "@/types/chat";

/**
 * 검색 라우트 정의 (v4.0 - ChatGPT 스타일)
 */
export const Route = createFileRoute("/search/")({
  component: SearchPage,
});

/**
 * v4.0 검색 페이지 - ChatGPT 스타일 통합 채팅
 *
 * 🌟 혁신적 변화:
 * - 복잡한 검색 폼과 결과 카드 → 단일 채팅 인터페이스
 * - 6개 분리된 API → 1개 통합 채팅 API
 * - Claude AI 사고과정 실시간 표시
 * - 모든 무역 질의를 자연어로 처리
 */
function SearchPage() {
  const { isAuthenticated } = useAuth();

  /**
   * 북마크 추가 핸들러
   *
   * AI 응답에서 제공된 관련 정보(HS Code 등)를 북마크에 추가
   */
  const handleBookmark = useCallback(
    async (relatedInfo: RelatedInfo) => {
      if (!isAuthenticated) {
        toast.error("북마크 기능을 사용하려면 로그인이 필요합니다.");
        return;
      }

      try {
        let bookmarkData;

        if (relatedInfo.hsCode) {
          // HS Code 북마크
          bookmarkData = {
            type: "HS_CODE" as const,
            targetValue: relatedInfo.hsCode,
            displayName:
              relatedInfo.category || `HS Code ${relatedInfo.hsCode}`,
            description: `검색에서 추가된 HS Code 정보`,
            monitoringEnabled: true,
            smsNotificationEnabled: false,
          };
        } else if (relatedInfo.trackingNumber) {
          // 화물 번호 북마크
          bookmarkData = {
            type: "CARGO" as const,
            targetValue: relatedInfo.trackingNumber,
            displayName: `화물 ${relatedInfo.trackingNumber}`,
            description: `검색에서 추가된 화물 정보`,
            monitoringEnabled: true,
            smsNotificationEnabled: false,
          };
        } else {
          toast.warning("북마크할 수 있는 정보가 없습니다.");
          return;
        }

        const response = await bookmarkApi.addBookmark(bookmarkData);

        // 성공적으로 Bookmark 객체가 반환되면 성공
        if (response) {
          if (relatedInfo.hsCode) {
            toast.success(
              `HS Code ${relatedInfo.hsCode}이(가) 북마크에 추가되었습니다!`,
            );
          } else if (relatedInfo.trackingNumber) {
            toast.success(
              `화물 ${relatedInfo.trackingNumber}이(가) 북마크에 추가되었습니다!`,
            );
          }
        } else {
          toast.error("북마크 추가에 실패했습니다.");
        }
      } catch (error) {
        console.error("북마크 추가 실패:", error);
        toast.error("북마크 추가 중 오류가 발생했습니다.");
      }
    },
    [isAuthenticated],
  );

  return <FullPageChatInterface onBookmark={handleBookmark} />;
}
