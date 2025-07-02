import type { ImportanceLevel } from "@/types/base";
import type { Bookmark } from "@/lib/api/bookmark/types";
import type { PaginationMeta } from "../../types/common";

/**
 * 피드 아이템의 타입을 정의하는 열거형
 *
 * v6.1 API 명세서 기준 피드 타입
 */
export type FeedType =
  | "HS_CODE_TARIFF_CHANGE" // HS Code 관세율 변경
  | "HS_CODE_REGULATION_UPDATE" // HS Code 규제 변경
  | "CARGO_STATUS_UPDATE" // 화물 상태 업데이트
  | "TRADE_NEWS" // 무역 관련 뉴스
  | "POLICY_UPDATE"; // 정책 변경 사항

/**
 * v6.1 API 명세서 기준, 업데이트 피드 아이템 타입
 */
export type Feed = {
  /** 피드 아이템의 고유 식별자 */
  id: string;
  /** 피드 타입 */
  feedType: FeedType;
  /** 대상 타입 (예: "HS_CODE") */
  targetType: "HS_CODE" | "CARGO";
  /** 대상 값 (예: "8517.12.00") */
  targetValue: string;
  /** 피드 제목 */
  title: string;
  /** 피드 요약 내용 */
  content: string;
  /** 정보 출처 URL */
  sourceUrl: string | null;
  /** 중요도 */
  importance: ImportanceLevel;
  /** 읽음 여부 */
  isRead: boolean;
  /** 일일 알림에 포함되었는지 여부 */
  includedInDailyNotification: boolean;
  /** 일일 알림 발송 시간 (ISO 8601) */
  dailyNotificationSentAt: string | null;
  /** 생성 시간 (ISO 8601) */
  createdAt: string;
  /** 연관된 북마크 정보 */
  bookmarkInfo: {
    bookmarkId: string;
    displayName: string;
  };
};

/**
 * v6.1 API 명세서 기준, 최근 활동 타입
 */
export type RecentActivity = {
  /** 활동 유형 */
  type: "CHAT_SESSION_CREATED" | "BOOKMARK_CREATED" | "DAILY_NOTIFICATION_SENT";
  /** 활동 제목 */
  title: string;
  /** 관련 세션 ID (선택 사항) */
  sessionId?: string;
  /** 관련 북마크 ID (선택 사항) */
  bookmarkId?: string;
  /** 활동 시간 (ISO 8601) */
  timestamp: string;
};

/**
 * v6.1 API 명세서 기준, 대시보드 요약 응답 타입
 */
export type DashboardSummaryResponse = {
  /** 사용자 정보 */
  user: {
    name: string;
    email: string;
    profileImage: string | null;
    phoneVerified: boolean;
    rememberMe: boolean;
    joinedAt: string;
  };
  /** 북마크 통계 */
  bookmarks: {
    total: number;
    hsCode: number;
    cargo: number;
    sseGenerated: number;
    smsEnabled: number;
    emailEnabled: number;
    monitoringActive: number;
  };
  /** 채팅 기록 통계 */
  chatHistory: {
    totalSessions: number;
    totalMessages: number;
    sessionsLast30Days: number;
    messagesLast30Days: number;
    oldestSession: string;
    latestSession: string;
    partitionYears: number[];
  };
  /** 알림 통계 */
  notifications: {
    unreadFeeds: number;
    dailySms: number;
    dailyEmails: number;
    weeklyNotifications: number;
    smsEnabled: boolean;
    emailEnabled: boolean;
    lastNotificationSent: string;
  };
  /** 최근 활동 목록 */
  recentActivities: RecentActivity[];
};

/**
 * v6.1 API 명세서 기준, 피드 목록 응답 타입
 */
export type DashboardFeedsResponse = {
  /** 피드 목록 */
  feeds: Feed[];
  /** 페이지네이션 정보 */
  pagination: PaginationMeta;
  /** 요약 정보 */
  summary: {
    totalFeeds: number;
    unreadFeeds: number;
    highImportanceFeeds: number;
    todayFeeds: number;
    dailyNotificationFeeds: number;
  };
};

/**
 * 샘플 업데이트 피드 데이터 (v6.1)
 */
export const mockUpdateFeeds: Feed[] = [
  {
    id: "feed_001",
    feedType: "HS_CODE_TARIFF_CHANGE",
    targetType: "HS_CODE",
    targetValue: "8517.12.00",
    title: "스마트폰 관세율 변경 알림",
    content: "HS Code 8517.12.00의 기본 관세율이 8%에서 6%로 인하되었습니다.",
    sourceUrl: "https://unipass.customs.go.kr/...",
    importance: "HIGH",
    isRead: false,
    includedInDailyNotification: true,
    dailyNotificationSentAt: "2024-01-16T09:00:00Z",
    createdAt: "2024-01-16T08:15:00Z",
    bookmarkInfo: {
      bookmarkId: "bm_001",
      displayName: "스마트폰 HS Code",
    },
  },
  {
    id: "feed_002",
    feedType: "CARGO_STATUS_UPDATE",
    targetType: "CARGO",
    targetValue: "KRPU1234567890",
    title: "화물 상태 업데이트",
    content: "수입신고가 완료되어 통관 절차가 진행 중입니다.",
    sourceUrl: null,
    importance: "MEDIUM",
    isRead: true,
    includedInDailyNotification: false,
    dailyNotificationSentAt: null,
    createdAt: "2024-01-15T16:30:00Z",
    bookmarkInfo: {
      bookmarkId: "bm_002",
      displayName: "1월 수입 화물",
    },
  },
];

/**
 * 대시보드 요약 Mock 데이터 (v6.1)
 */
export const mockDashboardSummary: DashboardSummaryResponse = {
  user: {
    name: "홍길동",
    email: "user@example.com",
    profileImage: null,
    phoneVerified: true,
    rememberMe: true,
    joinedAt: "2024-01-10T09:00:00Z",
  },
  bookmarks: {
    total: 8,
    hsCode: 5,
    cargo: 3,
    sseGenerated: 6,
    smsEnabled: 6,
    emailEnabled: 8,
    monitoringActive: 7,
  },
  chatHistory: {
    totalSessions: 45,
    totalMessages: 180,
    sessionsLast30Days: 8,
    messagesLast30Days: 32,
    oldestSession: "2023-06-15T09:00:00Z",
    latestSession: "2024-01-16T10:32:00Z",
    partitionYears: [2023, 2024],
  },
  notifications: {
    unreadFeeds: 3,
    dailySms: 1,
    dailyEmails: 1,
    weeklyNotifications: 7,
    smsEnabled: true,
    emailEnabled: true,
    lastNotificationSent: "2024-01-16T09:00:00Z",
  },
  recentActivities: [
    {
      type: "CHAT_SESSION_CREATED",
      title: "새 채팅 세션: 아이폰 15 프로 수입 문의",
      sessionId: "chat_session_20240116_123456",
      timestamp: "2024-01-16T10:32:00Z",
    },
    {
      type: "BOOKMARK_CREATED",
      title: "새 북마크 생성: 스마트폰 HS Code",
      bookmarkId: "bm_003",
      timestamp: "2024-01-16T10:33:00Z",
    },
    {
      type: "DAILY_NOTIFICATION_SENT",
      title: "일일 알림 발송: 관세율 변경 2건",
      timestamp: "2024-01-16T09:00:00Z",
    },
  ],
};

/**
 * 피드 목록 응답 Mock 데이터 (v6.1)
 */
export const mockDashboardFeedsResponse: DashboardFeedsResponse = {
  feeds: mockUpdateFeeds,
  pagination: {
    currentPage: 1,
    totalPages: 2,
    totalElements: 25,
    pageSize: 20,
    hasNext: true,
    hasPrevious: false,
  },
  summary: {
    totalFeeds: 25,
    unreadFeeds: 3,
    highImportanceFeeds: 2,
    todayFeeds: 5,
    dailyNotificationFeeds: 12,
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
    page?: number;
    size?: number;
    unreadOnly?: boolean;
  }): Promise<DashboardFeedsResponse> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    let filteredFeeds = [...mockUpdateFeeds];

    if (params?.unreadOnly) {
      filteredFeeds = filteredFeeds.filter((feed) => !feed.isRead);
    }

    const page = params?.page || 1;
    const size = params?.size || 20;
    const offset = (page - 1) * size;
    const paginatedFeeds = filteredFeeds.slice(offset, offset + size);

    return {
      feeds: paginatedFeeds,
      pagination: {
        currentPage: page,
        pageSize: size,
        totalElements: filteredFeeds.length,
        totalPages: Math.ceil(filteredFeeds.length / size),
        hasNext: offset + size < filteredFeeds.length,
        hasPrevious: page > 1,
      },
      summary: {
        totalFeeds: filteredFeeds.length,
        unreadFeeds: filteredFeeds.filter((f) => !f.isRead).length,
        highImportanceFeeds: filteredFeeds.filter(
          (f) => f.importance === "HIGH",
        ).length,
        todayFeeds: filteredFeeds.filter(
          (f) =>
            new Date(f.createdAt).toDateString() === new Date().toDateString(),
        ).length,
        dailyNotificationFeeds: filteredFeeds.filter(
          (f) => f.includedInDailyNotification,
        ).length,
      },
    };
  },

  /**
   * 피드 읽음 처리
   */
  async markFeedAsRead(feedId: string): Promise<void> {
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
export const getRecentFeedItems = (limit: number = 10): Feed[] => {
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
  if (category === "전체") return []; // mockBookmarks를 import해야함
  return []; // mockBookmarks.filter((bookmark) => bookmark.type === category);
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
  return []; // mockBookmarks.filter((bookmark) => bookmark.monitoringEnabled);
};
