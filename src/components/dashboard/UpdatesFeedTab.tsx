import ContentCard from "@/components/common/ContentCard";
import { Filter } from "lucide-react";
import FeedItem from "./FeedItem";
import DashboardPagination from "./DashboardPagination";
import { UpdatesFeedSidebar } from "./DashboardSidebar";
import type { UpdatesFeedTabProps } from "./types";

// 스타일 상수 정의 (THEME_GUIDE 기준)
const LIST_SPACING_CLASSES = "space-y-2";

// 페이지네이션 설정
const ITEMS_PER_PAGE = 5;

export default function UpdatesFeedTab({
  feedFilter,
  onFeedFilterChange,
  feedCurrentPage,
  onFeedPageChange,
  filteredFeed,
}: UpdatesFeedTabProps) {
  // 페이지네이션 계산
  const feedTotalPages = Math.ceil(filteredFeed.length / ITEMS_PER_PAGE);
  const feedStartIndex = (feedCurrentPage - 1) * ITEMS_PER_PAGE;
  const feedEndIndex = Math.min(
    feedStartIndex + ITEMS_PER_PAGE,
    filteredFeed.length,
  );

  // 현재 페이지의 피드 항목들
  const currentFeedItems = filteredFeed.slice(feedStartIndex, feedEndIndex);

  return (
    <div className="lg:flex lg:space-x-8">
      <div className="lg:w-2/3">
        <ContentCard
          title="업데이트 피드"
          titleRightElement={
            <div className="flex items-center space-x-2">
              <select
                value={feedFilter}
                onChange={(e) => onFeedFilterChange(e.target.value as any)}
                className="rounded border border-neutral-200 px-2 py-1 text-xs"
                aria-label="피드 필터 선택"
              >
                <option value="all">전체</option>
                <option value="high">중요</option>
                <option value="medium">보통</option>
              </select>
              <Filter size={14} className="text-neutral-400" />
            </div>
          }
        >
          {/* 피드 항목들 */}
          <div className={LIST_SPACING_CLASSES}>
            {currentFeedItems.map((item) => (
              <FeedItem key={item.id} item={item} />
            ))}
          </div>

          {/* 피드 페이지네이션 */}
          <div className="mt-6 flex justify-center">
            <DashboardPagination
              currentPage={feedCurrentPage}
              totalPages={feedTotalPages}
              onPageChange={onFeedPageChange}
            />
          </div>
        </ContentCard>
      </div>

      <UpdatesFeedSidebar />
    </div>
  );
}
