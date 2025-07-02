import type { ImportanceLevel, PaginationMeta } from "./common";
import type { BookmarkType } from "../lib/api/bookmark/types";

/**
 * 대시보드 API 관련 타입 정의 (API v4.0)
 *
 * 🔐 Private API: 모든 대시보드 기능은 로그인이 필요합니다
 * 🆕 v4.0 변경사항: SMS 알림 통계 추가, 페이지네이션 구조 변경
 */

/**
 * 피드 타입
 */
export type FeedType =
  | "HS_CODE_TARIFF_CHANGE" // 관세율 변경
  | "HS_CODE_REGULATION_UPDATE" // 규제 정보 업데이트
  | "CARGO_STATUS_UPDATE" // 화물 상태 변경
  | "TRADE_NEWS" // 관련 무역 뉴스
  | "POLICY_UPDATE"; // 정책 변경 사항

/**
 * 업데이트 피드 타입 (API v4.0 표준)
 */
export type UpdateFeed = {
  /** 피드 ID */
  id: number;
  /** 피드 타입 */
  feedType: FeedType;
  /** 대상 타입 */
  targetType: BookmarkType;
  /** 대상 값 (HS Code 또는 화물번호) */
  targetValue: string;
  /** 피드 제목 */
  title: string;
  /** 피드 내용 */
  content: string;
  /** 변경 상세 정보 */
  changeDetails: {
    /** 변경 전 값 */
    previous: string;
    /** 변경 후 값 */
    current: string;
    /** 효력 발생일 (선택적) */
    effectiveDate?: string;
    /** 완료 시간 (화물 추적용, 선택적) */
    completedAt?: string;
  };
  /** 출처 URL (선택적) */
  sourceUrl: string | null;
  /** 중요도 */
  importance: ImportanceLevel;
  /** 읽음 여부 */
  isRead: boolean;
  /** 🆕 SMS 알림 발송 여부 (v4.0 신규) */
  smsNotificationSent: boolean;
  /** 생성 시간 (ISO 8601) */
  createdAt: string;
};

/**
 * 피드 목록 조회 파라미터 타입 (API v4.0)
 */
export type DashboardFeedsParams = {
  /** 페이지 오프셋 (기본값: 0) */
  offset?: number;
  /** 페이지 크기 (기본값: 20) */
  limit?: number;
  /** 읽지 않은 피드만 조회 */
  unreadOnly?: boolean;
  /** 피드 타입 필터 */
  feedType?: FeedType;
};

/**
 * 피드 목록 응답 타입 (API v4.0 표준)
 */
export type DashboardFeedsResponse = {
  /** 피드 목록 */
  content: UpdateFeed[];
  /** 페이지네이션 정보 (v4.0 표준) */
  pagination: PaginationMeta;
  /** 피드 요약 정보 */
  summary: {
    /** 총 읽지 않은 피드 수 */
    totalUnread: number;
    /** 중요도별 개수 */
    totalHigh: number;
    totalMedium: number;
    totalLow: number;
  };
};

/**
 * 최근 활동 타입 (API v4.0)
 */
export type RecentActivity = {
  /** 활동 타입 */
  type: RecentActivityType;
  /** 활동 메시지 */
  message: string;
  /** 활동 시간 (ISO 8601) */
  timestamp: string;
};

/**
 * 🆕 최근 활동 타입 (v4.0 확장)
 */
export type RecentActivityType =
  | "BOOKMARK_ADDED" // 북마크 추가
  | "FEED_RECEIVED" // 피드 수신
  | "SMS_SENT" // 🆕 SMS 발송
  | "SEARCH_PERFORMED" // 검색 수행 (채팅 사용)
  | "SETTINGS_UPDATED"; // 설정 변경

/**
 * 대시보드 요약 정보 타입 (API v4.0 표준)
 */
export type DashboardSummaryResponse = {
  /** 북마크 요약 */
  bookmarks: {
    /** 전체 북마크 수 */
    total: number;
    /** 모니터링 활성화 수 */
    activeMonitoring: number;
    /** 🆕 SMS 알림 활성화 수 (v4.0 신규) */
    smsNotificationEnabled: number;
    /** 타입별 개수 */
    byType: Record<BookmarkType, number>;
  };
  /** 피드 요약 */
  feeds: {
    /** 읽지 않은 피드 수 */
    unreadCount: number;
    /** 오늘 받은 피드 수 */
    todayCount: number;
    /** 이번 주 받은 피드 수 */
    weekCount: number;
    /** 중요도별 분포 */
    byImportance: Record<ImportanceLevel, number>;
  };
  /** 🆕 알림 통계 (v4.0 신규) */
  notifications: {
    /** SMS 활성화 여부 */
    smsEnabled: boolean;
    /** 휴대폰 인증 여부 */
    phoneVerified: boolean;
    /** 오늘 발송 수 */
    sentToday: number;
    /** 이번 주 발송 수 */
    sentThisWeek: number;
  };
  /** 최근 활동 */
  recentActivity: RecentActivity[];
  /** 빠른 통계 */
  quickStats: {
    /** 검색 횟수 (채팅 사용 횟수) */
    searchCount: number;
    /** 절약된 시간 */
    totalSavedTime: string;
    /** 정확도 */
    accuracyRate: string;
  };
};

/**
 * 피드 읽음 처리 응답 타입 (PUT /api/dashboard/feeds/{feedId}/read)
 */
export type FeedReadResponse = {
  /** 처리 결과 메시지 */
  message: string;
};

/**
 * 피드 일괄 읽음 처리 응답 타입 (PUT /api/dashboard/feeds/read-all)
 */
export type FeedReadAllResponse = {
  /** 처리된 피드 수 */
  processedCount: number;
};

/**
 * 클라이언트 사이드 대시보드 상태 관리용 타입
 */
export type DashboardState = {
  /** 요약 정보 */
  summary: DashboardSummaryResponse | null;
  /** 피드 목록 */
  feeds: UpdateFeed[];
  /** 피드 요약 */
  feedSummary: DashboardFeedsResponse["summary"] | null;
  /** 페이지네이션 */
  pagination: PaginationMeta | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 정보 */
  error: string | null;
  /** 마지막 업데이트 시간 */
  lastUpdated: string | null;
};

/**
 * 🗑️ 레거시 타입들 (v4.0에서 단순화됨)
 *
 * v4.0에서는 복잡한 대시보드 설정, 위젯, 레이아웃 기능들이 제거되었습니다.
 * 간단하고 직관적인 대시보드로 변경되었습니다.
 */

/**
 * @deprecated v4.0에서 제거됨 - 단순화된 구조로 변경
 * 대시보드 설정 타입
 */
export type DashboardSettings = {
  userId: string;
  displaySettings: {
    defaultSortOrder: "newest" | "oldest" | "importance";
    itemsPerPage: number;
    autoRefreshInterval: number;
    autoMarkAsRead: boolean;
  };
  notificationSettings: {
    browserNotifications: boolean;
    emailNotifications: boolean;
    notificationHours: {
      start: string;
      end: string;
    };
    weekendNotifications: boolean;
  };
  filterSettings: {
    defaultImportanceFilter: ImportanceLevel[];
    defaultTypeFilter: FeedType[];
    autoFilterRules: Array<{
      name: string;
      conditions: Record<string, unknown>;
      action: "hide" | "highlight" | "priority";
    }>;
  };
};

/**
 * @deprecated v4.0에서 제거됨 - 단순화된 구조로 변경
 * 대시보드 위젯 타입
 */
export type DashboardWidget = {
  id: string;
  type:
    | "RECENT_FEEDS"
    | "BOOKMARK_SUMMARY"
    | "QUICK_STATS"
    | "ACTIVITY_CHART"
    | "NEWS_FEED";
  title: string;
  settings: {
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    visible: boolean;
    refreshInterval?: number;
    customSettings?: Record<string, unknown>;
  };
  data?: unknown;
  lastUpdated: string;
};

/**
 * @deprecated v4.0에서 제거됨 - 단순화된 구조로 변경
 * 대시보드 레이아웃 타입
 */
export type DashboardLayout = {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  settings: {
    gridSize: {
      columns: number;
      rows: number;
    };
    responsive: boolean;
    theme: "light" | "dark" | "auto";
  };
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * @deprecated v4.0에서 제거됨 - 채팅 API 사용 권장
 * 대시보드 성능 메트릭 타입
 */
export type DashboardMetrics = {
  period: {
    startDate: string;
    endDate: string;
  };
  userActivity: {
    totalVisits: number;
    averageSessionTime: number;
    mostUsedFeatures: Array<{
      feature: string;
      usage: number;
    }>;
  };
  feedMetrics: {
    totalReceived: number;
    totalRead: number;
    readRate: number;
    averageResponseTime: number;
  };
  bookmarkMetrics: {
    activeBookmarks: number;
    averageUsage: number;
    mostUsefulBookmarks: Array<{
      bookmarkId: string;
      displayName: string;
      usage: number;
    }>;
  };
};

/**
 * 🗑️ 레거시 호환성 유지를 위한 타입 별칭들
 */

/** @deprecated v4.0에서 제거됨 - FeedType 사용 권장 */
export type FeedTargetType = BookmarkType;

/** @deprecated v4.0에서 제거됨 - DashboardFeedsParams 사용 권장 */
export type FeedListParams = DashboardFeedsParams;

/** @deprecated v4.0에서 제거됨 - DashboardFeedsResponse 사용 권장 */
export type FeedListResponse = DashboardFeedsResponse;

/** @deprecated v4.0에서 제거됨 - DashboardSummaryResponse 사용 권장 */
export type DashboardSummary = Omit<DashboardSummaryResponse, "notifications">;
