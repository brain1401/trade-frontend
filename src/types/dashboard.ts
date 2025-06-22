import type { ImportanceLevel, PaginationInfo } from "./base";
import type { BookmarkType } from "./bookmark";

/**
 * 대시보드 API 관련 타입 정의 (API v2.4)
 *
 * Private API: 모든 대시보드 기능은 로그인이 필요합니다
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
 * 피드 대상 타입
 */
export type FeedTargetType = "HS_CODE" | "CARGO";

/**
 * 업데이트 피드 타입
 */
export type UpdateFeed = {
  /** 피드 ID */
  id: number;
  /** 피드 타입 */
  feedType: FeedType;
  /** 대상 타입 */
  targetType: FeedTargetType;
  /** 대상 값 (HS Code 또는 화물번호) */
  targetValue: string;
  /** 피드 제목 */
  title: string;
  /** 피드 내용 */
  content: string;
  /** 변경 상세 정보 */
  changeDetails: {
    /** 변경 전 값 */
    previous?: string;
    /** 변경 후 값 */
    current: string;
    /** 시행일/완료일 */
    effectiveDate?: string;
    /** 완료일시 */
    completedAt?: string;
  };
  /** 소스 URL */
  sourceUrl: string | null;
  /** 중요도 */
  importance: ImportanceLevel;
  /** 읽음 여부 */
  isRead: boolean;
  /** 생성 일시 */
  createdAt: string;
};

/**
 * 피드 목록 조회 파라미터 타입
 */
export type FeedListParams = {
  /** 페이지 오프셋 */
  offset?: number;
  /** 페이지 크기 */
  limit?: number;
  /** 읽지 않은 피드만 조회 */
  unreadOnly?: boolean;
  /** 피드 타입 필터 */
  feedType?: FeedType;
  /** 중요도 필터 */
  importance?: ImportanceLevel;
  /** 날짜 범위 */
  dateRange?: {
    startDate: string;
    endDate: string;
  };
};

/**
 * 피드 목록 응답 타입
 */
export type FeedListResponse = {
  /** 피드 목록 */
  content: UpdateFeed[];
  /** 페이지네이션 정보 */
  pagination: PaginationInfo;
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
 * 최근 활동 타입
 */
export type RecentActivity = {
  /** 활동 타입 */
  type:
    | "BOOKMARK_ADDED"
    | "FEED_RECEIVED"
    | "SEARCH_PERFORMED"
    | "ALERT_TRIGGERED";
  /** 활동 메시지 */
  message: string;
  /** 활동 시간 */
  timestamp: string;
  /** 관련 데이터 */
  relatedData?: {
    /** 관련 ID */
    id?: string;
    /** 관련 타입 */
    type?: string;
    /** 추가 정보 */
    metadata?: Record<string, any>;
  };
};

/**
 * 대시보드 요약 정보 타입
 */
export type DashboardSummary = {
  /** 북마크 요약 */
  bookmarks: {
    /** 전체 북마크 수 */
    total: number;
    /** 모니터링 활성화 수 */
    activeMonitoring: number;
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
  /** 최근 활동 */
  recentActivity: RecentActivity[];
  /** 빠른 통계 */
  quickStats: {
    /** 검색 횟수 */
    searchCount: number;
    /** 절약된 시간 */
    totalSavedTime: string;
    /** 정확도 */
    accuracyRate: string;
  };
};

/**
 * 피드 읽음 처리 응답 타입
 */
export type FeedReadResponse = {
  /** 처리된 피드 ID */
  feedId: number;
  /** 읽음 처리 시간 */
  readAt: string;
};

/**
 * 피드 일괄 읽음 처리 응답 타입
 */
export type FeedBulkReadResponse = {
  /** 처리된 피드 개수 */
  processedCount: number;
  /** 처리 완료 시간 */
  processedAt: string;
};

/**
 * 대시보드 설정 타입
 */
export type DashboardSettings = {
  /** 사용자 ID */
  userId: string;
  /** 표시 설정 */
  displaySettings: {
    /** 기본 정렬 순서 */
    defaultSortOrder: "newest" | "oldest" | "importance";
    /** 페이지당 표시 개수 */
    itemsPerPage: number;
    /** 자동 새로고침 간격 (분) */
    autoRefreshInterval: number;
    /** 읽음 표시 자동화 */
    autoMarkAsRead: boolean;
  };
  /** 알림 설정 */
  notificationSettings: {
    /** 브라우저 알림 활성화 */
    browserNotifications: boolean;
    /** 이메일 알림 활성화 */
    emailNotifications: boolean;
    /** 알림 시간 설정 */
    notificationHours: {
      start: string;
      end: string;
    };
    /** 주말 알림 여부 */
    weekendNotifications: boolean;
  };
  /** 필터 설정 */
  filterSettings: {
    /** 기본 중요도 필터 */
    defaultImportanceFilter: ImportanceLevel[];
    /** 기본 타입 필터 */
    defaultTypeFilter: FeedType[];
    /** 자동 필터링 규칙 */
    autoFilterRules: Array<{
      /** 규칙 이름 */
      name: string;
      /** 조건 */
      conditions: Record<string, any>;
      /** 액션 */
      action: "hide" | "highlight" | "priority";
    }>;
  };
};

/**
 * 대시보드 위젯 타입
 */
export type DashboardWidget = {
  /** 위젯 ID */
  id: string;
  /** 위젯 타입 */
  type:
    | "RECENT_FEEDS"
    | "BOOKMARK_SUMMARY"
    | "QUICK_STATS"
    | "ACTIVITY_CHART"
    | "NEWS_FEED";
  /** 위젯 제목 */
  title: string;
  /** 위젯 설정 */
  settings: {
    /** 표시 위치 */
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    /** 표시 여부 */
    visible: boolean;
    /** 새로고침 간격 */
    refreshInterval?: number;
    /** 위젯별 설정 */
    customSettings?: Record<string, any>;
  };
  /** 위젯 데이터 */
  data?: any;
  /** 마지막 업데이트 시간 */
  lastUpdated: string;
};

/**
 * 대시보드 레이아웃 타입
 */
export type DashboardLayout = {
  /** 레이아웃 ID */
  id: string;
  /** 레이아웃 이름 */
  name: string;
  /** 위젯 목록 */
  widgets: DashboardWidget[];
  /** 레이아웃 설정 */
  settings: {
    /** 그리드 크기 */
    gridSize: {
      columns: number;
      rows: number;
    };
    /** 반응형 설정 */
    responsive: boolean;
    /** 테마 */
    theme: "light" | "dark" | "auto";
  };
  /** 기본 레이아웃 여부 */
  isDefault: boolean;
  /** 생성 일시 */
  createdAt: string;
  /** 수정 일시 */
  updatedAt: string;
};

/**
 * 대시보드 성능 메트릭 타입
 */
export type DashboardMetrics = {
  /** 메트릭 수집 기간 */
  period: {
    startDate: string;
    endDate: string;
  };
  /** 사용자 활동 메트릭 */
  userActivity: {
    /** 총 방문 횟수 */
    totalVisits: number;
    /** 평균 세션 시간 (분) */
    averageSessionTime: number;
    /** 가장 많이 사용한 기능 */
    mostUsedFeatures: Array<{
      feature: string;
      usage: number;
    }>;
  };
  /** 피드 메트릭 */
  feedMetrics: {
    /** 받은 피드 수 */
    totalReceived: number;
    /** 읽은 피드 수 */
    totalRead: number;
    /** 읽음율 (%) */
    readRate: number;
    /** 평균 응답 시간 */
    averageResponseTime: number;
  };
  /** 북마크 메트릭 */
  bookmarkMetrics: {
    /** 활성 북마크 수 */
    activeBookmarks: number;
    /** 평균 사용 빈도 */
    averageUsage: number;
    /** 가장 유용한 북마크 */
    mostUsefulBookmarks: Array<{
      bookmarkId: string;
      displayName: string;
      usage: number;
    }>;
  };
};
