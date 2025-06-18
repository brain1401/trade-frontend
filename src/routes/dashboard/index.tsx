import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useRouteGuard } from "@/hooks/common/useRouteGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockUpdatesFeed,
  mockBookmarks,
  type FeedItem,
  type Bookmark,
} from "@/data/mock/dashboard";
import UpdatesFeedTab from "@/components/dashboard/UpdatesFeedTab";
import BookmarkManagementTab from "@/components/dashboard/BookmarkManagementTab";
import type {
  FeedFilterType,
  BookmarkFilterType,
} from "@/components/dashboard/types";

export const Route = createFileRoute("/dashboard" as any)({
  component: DashboardPage,
});

function DashboardPage() {
  // 라우트 가드 적용 - 로그인 사용자만 접근 허용
  const { isAllowed, LoadingComponent } = useRouteGuard("protected");

  // 필터 상태 관리
  const [feedFilter, setFeedFilter] = useState<FeedFilterType>("all");
  const [bookmarkFilter, setBookmarkFilter] =
    useState<BookmarkFilterType>("all");

  // 인증 상태 확인 중이면 스켈레톤 UI 표시
  if (!isAllowed && LoadingComponent) {
    return <LoadingComponent />;
  }

  // 인증 상태 확인 완료 후 접근 권한 없으면 null 반환 (리다이렉션됨)
  if (!isAllowed) {
    return null;
  }

  // 페이지네이션 상태 관리
  const [feedCurrentPage, setFeedCurrentPage] = useState(1);
  const [bookmarkCurrentPage, setBookmarkCurrentPage] = useState(1);

  // 피드 필터링 로직
  const filteredFeed = (mockUpdatesFeed as FeedItem[]).filter(
    (item) => feedFilter === "all" || item.importance === feedFilter,
  );

  // 북마크 필터링 로직
  const filteredBookmarks = (mockBookmarks as Bookmark[]).filter(
    (bookmark) => bookmarkFilter === "all" || bookmark.type === bookmarkFilter,
  );

  // 피드 필터 변경 핸들러 (페이지네이션 초기화 포함)
  const handleFeedFilterChange = (newFilter: FeedFilterType) => {
    setFeedFilter(newFilter);
    setFeedCurrentPage(1);
  };

  // 북마크 필터 변경 핸들러 (페이지네이션 초기화 포함)
  const handleBookmarkFilterChange = (newFilter: BookmarkFilterType) => {
    setBookmarkFilter(newFilter);
    setBookmarkCurrentPage(1);
  };

  // 북마크 모니터링 토글 핸들러
  const toggleMonitoring = (bookmarkId: string) => {
    // 실제로는 API 호출
    console.log(`Toggle monitoring for bookmark: ${bookmarkId}`);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">
          마이 대시보드
        </h1>
        <p className="text-neutral-600">
          북마크한 항목들의 업데이트와 관리를 한 곳에서 확인하세요
        </p>
      </div>

      <Tabs defaultValue="updates" className="w-full">
        <TabsList className="mb-6 grid h-[3rem] w-full grid-cols-2">
          <TabsTrigger value="updates">최신 업데이트 피드</TabsTrigger>
          <TabsTrigger value="bookmarks">북마크 관리</TabsTrigger>
        </TabsList>

        {/* 첫 번째 탭: 최신 업데이트 피드 */}
        <TabsContent value="updates">
          <UpdatesFeedTab
            feedFilter={feedFilter}
            onFeedFilterChange={handleFeedFilterChange}
            feedCurrentPage={feedCurrentPage}
            onFeedPageChange={setFeedCurrentPage}
            filteredFeed={filteredFeed}
          />
        </TabsContent>

        {/* 두 번째 탭: 북마크 관리 */}
        <TabsContent value="bookmarks">
          <BookmarkManagementTab
            bookmarkFilter={bookmarkFilter}
            onBookmarkFilterChange={handleBookmarkFilterChange}
            bookmarkCurrentPage={bookmarkCurrentPage}
            onBookmarkPageChange={setBookmarkCurrentPage}
            filteredBookmarks={filteredBookmarks}
            onToggleMonitoring={toggleMonitoring}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
