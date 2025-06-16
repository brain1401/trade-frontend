import ContentCard from "@/components/common/ContentCard";
import { Filter } from "lucide-react";
import BookmarkItem from "./BookmarkItem";
import DashboardPagination from "./DashboardPagination";
import { BookmarkManagementSidebar } from "./DashboardSidebar";
import type { BookmarkManagementTabProps } from "./types";

// 스타일 상수 정의 (THEME_GUIDE 기준)
const LIST_SPACING_CLASSES = "space-y-2";

// 페이지네이션 설정
const ITEMS_PER_PAGE = 5;

export default function BookmarkManagementTab({
  bookmarkFilter,
  onBookmarkFilterChange,
  bookmarkCurrentPage,
  onBookmarkPageChange,
  filteredBookmarks,
  onToggleMonitoring,
}: BookmarkManagementTabProps) {
  // 페이지네이션 계산
  const bookmarkTotalPages = Math.ceil(
    filteredBookmarks.length / ITEMS_PER_PAGE,
  );
  const bookmarkStartIndex = (bookmarkCurrentPage - 1) * ITEMS_PER_PAGE;
  const bookmarkEndIndex = Math.min(
    bookmarkStartIndex + ITEMS_PER_PAGE,
    filteredBookmarks.length,
  );

  // 현재 페이지의 북마크 항목들
  const currentBookmarkItems = filteredBookmarks.slice(
    bookmarkStartIndex,
    bookmarkEndIndex,
  );

  return (
    <div className="lg:flex lg:space-x-8">
      <div className="lg:w-2/3">
        <ContentCard
          title="북마크 목록"
          titleRightElement={
            <div className="flex items-center space-x-2">
              <select
                value={bookmarkFilter}
                onChange={(e) => onBookmarkFilterChange(e.target.value as any)}
                className="rounded border border-neutral-200 px-2 py-1 text-xs"
                aria-label="북마크 필터 선택"
              >
                <option value="all">전체</option>
                <option value="hscode">HS Code</option>
                <option value="tracking">화물 추적</option>
                <option value="regulation">규제</option>
              </select>
              <Filter size={14} className="text-neutral-400" />
            </div>
          }
        >
          {/* 북마크 항목들 */}
          <div className={LIST_SPACING_CLASSES}>
            {currentBookmarkItems.map((bookmark) => (
              <BookmarkItem
                key={bookmark.id}
                bookmark={bookmark}
                onToggleMonitoring={onToggleMonitoring}
              />
            ))}
          </div>

          {/* 북마크 페이지네이션 */}
          <div className="mt-6 flex justify-center">
            <DashboardPagination
              currentPage={bookmarkCurrentPage}
              totalPages={bookmarkTotalPages}
              onPageChange={onBookmarkPageChange}
            />
          </div>
        </ContentCard>
      </div>

      <BookmarkManagementSidebar bookmarks={filteredBookmarks} />
    </div>
  );
}
