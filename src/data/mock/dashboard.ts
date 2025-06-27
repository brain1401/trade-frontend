import type { ImportanceLevel } from "@/types/base";
import type {
  UpdateFeed,
  DashboardSummary,
  DashboardSummaryResponse,
  DashboardFeedsResponse,
  RecentActivity,
} from "@/types/dashboard";
import type {
  BookmarkType,
  Bookmark as OfficialBookmark,
} from "@/types/bookmark";

/**
 * 피드 아이템의 타입을 정의하는 열거형
 *
 * 대시보드에서 표시되는 다양한 종류의 업데이트 정보를 분류합니다.
 * 각 타입별로 다른 UI 스타일과 액션이 적용됩니다.
 */
export type FeedItemType =
  | "HS_CODE_TARIFF_CHANGE" // HS Code 관세율 변경
  | "HS_CODE_REGULATION_UPDATE" // HS Code 규제 변경
  | "CARGO_STATUS_UPDATE" // 화물 상태 업데이트
  | "TRADE_NEWS" // 무역 관련 뉴스
  | "POLICY_UPDATE"; // 정책 변경 사항

/**
 * 대시보드 피드에 표시되는 개별 아이템의 데이터 구조
 *
 * 사용자가 관심있어하는 항목들의 변경사항이나 업데이트를
 * 시간순으로 표시하기 위한 정보를 담고 있습니다.
 */
export type FeedItem = {
  /** 피드 아이템의 고유 식별자 */
  id: string;
  /** 피드 아이템의 유형 */
  type: FeedItemType;
  /** 피드 아이템의 제목 */
  title: string;
  /** 피드 아이템의 요약 설명 */
  summary: string;
  /** 업데이트 발생 시간 (ISO 문자열) */
  timestamp: string;
  /** 정보 출처 */
  source: string;
  /** 중요도 레벨 */
  importance: ImportanceLevel;
  /** 연관된 북마크 ID */
  bookmarkId: string;
  /** 변경사항 목록 */
  changes: string[];
};

/**
 * API 명세서에 맞는 북마크 타입
 * 공식 bookmark.ts의 Bookmark 타입을 사용
 */
export type Bookmark = OfficialBookmark;

/**
 * 대시보드 Mock 데이터 (API v4.0)
 *
 * 🆕 v4.0 변경사항:
 * - SMS 알림 필드 추가
 * - 새로운 피드 타입 및 중요도 추가
 * - 개선된 응답 구조
 */

/**
 * 샘플 업데이트 피드 데이터
 */
export const mockUpdateFeeds: UpdateFeed[] = [
  {
    id: 1,
    feedType: "HS_CODE_TARIFF_CHANGE",
    targetType: "HS_CODE",
    targetValue: "1905.90.90",
    title: "냉동피자 관세율 변경",
    content: "미국향 냉동피자 관세율이 8%에서 5%로 인하되었습니다.",
    changeDetails: {
      previous: "8%",
      current: "5%",
      effectiveDate: "2024-01-15T00:00:00Z",
    },
    sourceUrl: "https://example.com/tariff-update",
    importance: "HIGH",
    isRead: false,
    smsNotificationSent: true,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    feedType: "CARGO_STATUS_UPDATE",
    targetType: "CARGO",
    targetValue: "241CJ1A12340001234567",
    title: "화물 통관 완료",
    content: "등록하신 화물의 통관이 완료되었습니다.",
    changeDetails: {
      previous: "검사 대기",
      current: "통관 완료",
      completedAt: "2024-01-15T14:30:00Z",
    },
    sourceUrl: null,
    importance: "MEDIUM",
    isRead: true,
    smsNotificationSent: false,
    createdAt: "2024-01-15T14:35:00Z",
  },
  {
    id: 3,
    feedType: "TRADE_NEWS",
    targetType: "HS_CODE",
    targetValue: "2202.10.00",
    title: "에너지드링크 새로운 수출 규제",
    content:
      "미국 FDA에서 에너지드링크 수출 시 추가 라벨링 요구사항을 발표했습니다.",
    changeDetails: {
      previous: "기존 규제",
      current: "새로운 라벨링 요구사항 추가",
      effectiveDate: "2024-02-01T00:00:00Z",
    },
    sourceUrl: "https://example.com/fda-update",
    importance: "HIGH",
    isRead: false,
    smsNotificationSent: true,
    createdAt: "2024-01-16T09:30:00Z",
  },
  {
    id: 4,
    feedType: "POLICY_UPDATE",
    targetType: "HS_CODE",
    targetValue: "8517.12.00",
    title: "스마트폰 관련 정책 변경",
    content: "중국향 스마트폰 수출 시 새로운 인증 절차가 추가되었습니다.",
    changeDetails: {
      previous: "기존 인증 절차",
      current: "강화된 보안 인증 추가",
      effectiveDate: "2024-01-20T00:00:00Z",
    },
    sourceUrl: "https://example.com/policy-update",
    importance: "MEDIUM",
    isRead: false,
    smsNotificationSent: false,
    createdAt: "2024-01-16T11:15:00Z",
  },
];

/**
 * 샘플 북마크 데이터 (v4.0 SMS 알림 설정 포함)
 */
export const mockBookmarks: Bookmark[] = [
  {
    bookmarkId: "bm_001",
    type: "HS_CODE",
    targetValue: "1905.90.90",
    displayName: "냉동피자",
    description: "이탈리아식 냉동피자 수출용",
    monitoringEnabled: true,
    smsNotificationEnabled: true,
    alertCount: 3,
    lastAlert: "2024-01-15T10:00:00Z",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
  },
  {
    bookmarkId: "bm_002",
    type: "HS_CODE",
    targetValue: "2202.10.00",
    displayName: "에너지드링크",
    description: "미국 수출용 에너지드링크",
    monitoringEnabled: true,
    smsNotificationEnabled: true,
    alertCount: 2,
    lastAlert: "2024-01-16T09:30:00Z",
    createdAt: "2024-01-12T11:30:00Z",
    updatedAt: "2024-01-12T11:45:00Z",
  },
  {
    bookmarkId: "bm_003",
    type: "CARGO",
    targetValue: "241CJ1A12340001234567",
    displayName: "1월 수입 화물",
    description: "전자제품 수입 화물",
    monitoringEnabled: false,
    smsNotificationEnabled: false,
    alertCount: 1,
    lastAlert: null,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:15:00Z",
  },
];

/**
 * 대시보드 요약 Mock 데이터 (API v4.0 표준)
 */
export const mockDashboardSummary: DashboardSummaryResponse = {
  bookmarks: {
    total: 8,
    activeMonitoring: 5,
    smsNotificationEnabled: 3,
    byType: {
      HS_CODE: 5,
      CARGO: 3,
    },
  },
  feeds: {
    unreadCount: 3,
    todayCount: 7,
    weekCount: 18,
    byImportance: {
      HIGH: 2,
      MEDIUM: 4,
      LOW: 12,
    },
  },
  notifications: {
    smsEnabled: true,
    phoneVerified: true,
    sentToday: 2,
    sentThisWeek: 8,
  },
  recentActivity: [
    {
      type: "BOOKMARK_ADDED",
      message: "새로운 HS Code 북마크 추가: 1905.90.90",
      timestamp: "2024-01-15T09:30:00Z",
    },
    {
      type: "FEED_RECEIVED",
      message: "관세율 변경 알림 수신",
      timestamp: "2024-01-15T10:00:00Z",
    },
    {
      type: "SMS_SENT",
      message: "문자 알림 발송: 냉동피자 관세율 변경",
      timestamp: "2024-01-15T10:01:00Z",
    },
    {
      type: "SEARCH_PERFORMED",
      message: "채팅 검색: 에너지드링크 수출 규제",
      timestamp: "2024-01-16T08:45:00Z",
    },
    {
      type: "SETTINGS_UPDATED",
      message: "SMS 알림 설정 변경",
      timestamp: "2024-01-16T11:20:00Z",
    },
  ],
  quickStats: {
    searchCount: 32,
    totalSavedTime: "3.2시간",
    accuracyRate: "97%",
  },
};

/**
 * 피드 목록 응답 Mock 데이터
 */
export const mockDashboardFeedsResponse: DashboardFeedsResponse = {
  content: mockUpdateFeeds,
  pagination: {
    offset: 0,
    limit: 20,
    total: 4,
    hasNext: false,
    hasPrevious: false,
  },
  summary: {
    totalUnread: 3,
    totalHigh: 2,
    totalMedium: 2,
    totalLow: 0,
  },
};

/**
 * Mock API 지연 시간 시뮬레이션
 */
export const MOCK_DELAY = 800;

/**
 * 대시보드 관련 Mock API 함수들
 */
export const dashboardMockApi = {
  /**
   * 대시보드 요약 정보 조회
   */
  async getDashboardSummary(): Promise<DashboardSummaryResponse> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    return mockDashboardSummary;
  },

  /**
   * 업데이트 피드 목록 조회
   */
  async getUpdateFeeds(params?: {
    offset?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<DashboardFeedsResponse> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    let filteredFeeds = [...mockUpdateFeeds];

    if (params?.unreadOnly) {
      filteredFeeds = filteredFeeds.filter((feed) => !feed.isRead);
    }

    const offset = params?.offset || 0;
    const limit = params?.limit || 20;
    const paginatedFeeds = filteredFeeds.slice(offset, offset + limit);

    return {
      content: paginatedFeeds,
      pagination: {
        offset,
        limit,
        total: filteredFeeds.length,
        hasNext: offset + limit < filteredFeeds.length,
        hasPrevious: offset > 0,
      },
      summary: {
        totalUnread: filteredFeeds.filter((f) => !f.isRead).length,
        totalHigh: filteredFeeds.filter((f) => f.importance === "HIGH").length,
        totalMedium: filteredFeeds.filter((f) => f.importance === "MEDIUM")
          .length,
        totalLow: filteredFeeds.filter((f) => f.importance === "LOW").length,
      },
    };
  },

  /**
   * 피드 읽음 처리
   */
  async markFeedAsRead(feedId: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY / 2));

    const feed = mockUpdateFeeds.find((f) => f.id === feedId);
    if (feed) {
      feed.isRead = true;
    }
  },

  /**
   * 모든 피드 읽음 처리
   */
  async markAllFeedsAsRead(): Promise<{ processedCount: number }> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    let processedCount = 0;
    mockUpdateFeeds.forEach((feed) => {
      if (!feed.isRead) {
        feed.isRead = true;
        processedCount++;
      }
    });

    return { processedCount };
  },
};

/**
 * 카테고리별 통계 데이터
 *
 * 각 카테고리별 북마크 수, 활성 모니터링 수, 최근 업데이트 수 등의
 * 통계 정보를 제공합니다.
 */
export const mockCategoryStats = [
  {
    category: "전자제품",
    totalBookmarks: 3,
    activeMonitoring: 3,
    recentUpdates: 5,
    trend: "증가" as const,
  },
  {
    category: "화장품",
    totalBookmarks: 1,
    activeMonitoring: 1,
    recentUpdates: 2,
    trend: "증가" as const,
  },
  {
    category: "반도체",
    totalBookmarks: 1,
    activeMonitoring: 1,
    recentUpdates: 1,
    trend: "안정" as const,
  },
  {
    category: "규제",
    totalBookmarks: 6,
    activeMonitoring: 5,
    recentUpdates: 8,
    trend: "증가" as const,
  },
];

/**
 * 중요도별 통계 데이터
 *
 * 높음/보통/낮음 중요도별 아이템 수와 비율을 제공합니다.
 */
export const mockImportanceStats = {
  HIGH: { count: 2, percentage: 45, color: "red" },
  MEDIUM: { count: 2, percentage: 40, color: "yellow" },
  LOW: { count: 0, percentage: 15, color: "green" },
};

/**
 * 필터링 옵션 데이터
 *
 * 대시보드에서 사용할 수 있는 다양한 필터 옵션들을 정의합니다.
 */
export const mockFilterOptions = {
  categories: [
    "전체",
    "전자제품",
    "화장품",
    "반도체",
    "자동차",
    "의약품",
    "규제",
    "환율",
  ],
  types: [
    { value: "all", label: "전체" },
    { value: "HS_CODE", label: "HS Code" },
    { value: "CARGO", label: "화물 추적" },
  ],
  sortOptions: [
    { value: "lastUpdated", label: "최근 업데이트순" },
    { value: "createdAt", label: "생성일순" },
    { value: "title", label: "제목순" },
    { value: "category", label: "카테고리순" },
  ],
};

/**
 * 최근 피드 아이템 조회 함수
 *
 * 타임스탬프를 기준으로 최신순으로 정렬된 피드 아이템들을 반환합니다.
 *
 * @param limit - 반환할 아이템 개수 (기본값: 10)
 * @returns 최신순으로 정렬된 피드 아이템 배열
 *
 * @example
 * ```typescript
 * const recentItems = getRecentFeedItems(5);
 * console.log(`최근 ${recentItems.length}개 업데이트`);
 * ```
 */
export const getRecentFeedItems = (limit: number = 10): UpdateFeed[] => {
  return mockUpdateFeeds
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
};

/**
 * 카테고리별 북마크 조회 함수
 *
 * 지정된 카테고리에 해당하는 북마크들을 필터링하여 반환합니다.
 *
 * @param category - 조회할 카테고리명 ("전체"인 경우 모든 북마크 반환)
 * @returns 해당 카테고리의 북마크 배열
 *
 * @example
 * ```typescript
 * const electronicBookmarks = getBookmarksByCategory("전자제품");
 * electronicBookmarks.forEach(bookmark => {
 *   console.log(bookmark.title);
 * });
 * ```
 */
export const getBookmarksByCategory = (category: string): Bookmark[] => {
  if (category === "전체") return mockBookmarks;
  return mockBookmarks.filter((bookmark) => bookmark.type === category);
};

/**
 * 활성 모니터링 북마크 조회 함수
 *
 * 모니터링이 활성화된 북마크들만 필터링하여 반환합니다.
 * 실시간 업데이트 알림이 필요한 북마크들을 관리할 때 사용됩니다.
 *
 * @returns 모니터링이 활성화된 북마크 배열
 *
 * @example
 * ```typescript
 * const activeBookmarks = getActiveBookmarks();
 * console.log(`활성 모니터링: ${activeBookmarks.length}개`);
 * ```
 */
export const getActiveBookmarks = (): Bookmark[] => {
  return mockBookmarks.filter((bookmark) => bookmark.monitoringEnabled);
};
