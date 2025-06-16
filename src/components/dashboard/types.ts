import type { FeedItem, Bookmark } from "@/data/mock/dashboard";

// 필터 관련 타입 정의
export type FeedFilterType = "all" | "high" | "medium";
export type BookmarkFilterType = "all" | "hscode" | "tracking" | "regulation";

// 페이지네이션 관련 타입 정의
export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

// 컴포넌트 Props 타입 정의
export type FeedItemProps = {
  item: FeedItem;
};

export type BookmarkItemProps = {
  bookmark: Bookmark;
  onToggleMonitoring: (bookmarkId: string) => void;
};

export type UpdatesFeedTabProps = {
  feedFilter: FeedFilterType;
  onFeedFilterChange: (filter: FeedFilterType) => void;
  feedCurrentPage: number;
  onFeedPageChange: (page: number) => void;
  filteredFeed: FeedItem[];
};

export type BookmarkManagementTabProps = {
  bookmarkFilter: BookmarkFilterType;
  onBookmarkFilterChange: (filter: BookmarkFilterType) => void;
  bookmarkCurrentPage: number;
  onBookmarkPageChange: (page: number) => void;
  filteredBookmarks: Bookmark[];
  onToggleMonitoring: (bookmarkId: string) => void;
};

// 사이드바 컴포넌트 Props 타입 정의
export type NotificationSettingsSidebarProps = {
  className?: string;
};

export type WeeklySummarySidebarProps = {
  className?: string;
};

export type BookmarkStatsSidebarProps = {
  bookmarks: Bookmark[];
  className?: string;
};

export type QuickActionsSidebarProps = {
  className?: string;
};

export type MonitoringSettingsSidebarProps = {
  className?: string;
};
