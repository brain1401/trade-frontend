import type { PaginationMeta, SortOrder } from "../../../types/common";

/**
 * 북마크 API 관련 타입 정의 (API v4.0)
 *
 * 🔐 Private API: 모든 북마크 기능은 로그인이 필요합니다
 * 🆕 v4.0 변경사항: SMS 알림 설정 추가, 페이지네이션 구조 변경
 */

/**
 * 북마크 타입
 */
export type BookmarkType = "HS_CODE" | "CARGO";

/**
 * 북마크 정보 타입 (API v4.0 표준)
 */
export type Bookmark = {
  /** 북마크 고유 ID */
  bookmarkId: string;
  /** 북마크 타입 */
  type: BookmarkType;
  /** 북마크 대상 값 (HS Code 또는 화물번호) */
  targetValue: string;
  /** 사용자 지정 표시명 */
  displayName: string;
  /** 북마크 설명 */
  description?: string;
  /** 모니터링 활성화 여부 */
  monitoringEnabled: boolean;
  /** 🆕 SMS 알림 활성화 여부 (v4.0 신규) */
  smsNotificationEnabled: boolean;
  /** 알림 개수 */
  alertCount: number;
  /** 마지막 알림 시간 */
  lastAlert: string | null;
  /** 생성 일시 */
  createdAt: string;
  /** 수정 일시 */
  updatedAt: string;
};

/**
 * 북마크 추가 요청 타입 (API v4.0)
 */
export type CreateBookmarkRequest = {
  /** 북마크 타입 ("HS_CODE" 또는 "CARGO") */
  type: BookmarkType;
  /** 북마크할 대상 값 (HS Code 또는 화물번호) */
  targetValue: string;
  /** 사용자 지정 표시명 */
  displayName: string;
  /** 북마크 설명 (선택적) */
  description?: string;
  /** 모니터링 활성화 여부 (기본값: false) */
  monitoringEnabled?: boolean;
  /** 🆕 SMS 알림 활성화 여부 (기본값: false) */
  smsNotificationEnabled?: boolean;
};

/**
 * 북마크 수정 요청 타입 (API v4.0)
 */
export type UpdateBookmarkRequest = {
  /** 사용자 지정 표시명 */
  displayName?: string;
  /** 북마크 설명 */
  description?: string;
  /** 모니터링 활성화 여부 */
  monitoringEnabled?: boolean;
  /** 🆕 SMS 알림 활성화 여부 */
  smsNotificationEnabled?: boolean;
};

/**
 * 북마크 목록 조회 파라미터 타입 (API v4.0)
 */
export type BookmarkListParams = {
  /** 북마크 타입 필터 ("HS_CODE", "CARGO", "ALL") */
  type?: BookmarkType | "ALL";
  /** 페이지 오프셋 (기본값: 0) */
  offset?: number;
  /** 페이지 크기 (기본값: 20, 최대: 100) */
  limit?: number;
  /** 정렬 기준 ("createdAt", "updatedAt", "name") */
  sort?: "createdAt" | "updatedAt" | "name";
  /** 정렬 순서 ("asc", "desc", 기본값: desc) */
  order?: SortOrder;
};

/**
 * 북마크 목록 응답 타입 (API v4.0 표준)
 */
export type BookmarkListResponse = {
  /** 북마크 목록 */
  content: Bookmark[];
  /** 페이지네이션 정보 (v4.0 표준) */
  pagination: PaginationMeta;
};

/**
 * 🗑️ 레거시 타입들 (v4.0에서 단순화됨)
 *
 * v4.0에서는 복잡한 검색, 통계, 내보내기 기능들이 제거되었습니다.
 * 채팅 API를 통해 필요한 정보를 조회할 수 있습니다.
 */

/**
 * @deprecated v4.0에서 제거됨 - 채팅 API 사용 권장
 * 북마크 검색 필터 타입
 */
export type BookmarkSearchFilter = {
  keyword?: string;
  types?: BookmarkType[];
  monitoringStatus?: "enabled" | "disabled" | "all";
  hasAlerts?: boolean;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
};

/**
 * @deprecated v4.0에서 제거됨 - 대시보드 API 사용 권장
 * 북마크 통계 타입
 */
export type BookmarkStatistics = {
  totalCount: number;
  typeDistribution: Record<
    BookmarkType,
    {
      count: number;
      percentage: number;
      activeMonitoring: number;
    }
  >;
  monitoringStats: {
    activeCount: number;
    averageAlerts: number;
    recentAlerts: number;
  };
  activityStats: {
    recentlyAdded: number;
    recentlyUpdated: number;
    averageUsage: number;
  };
};

/**
 * @deprecated v4.0에서 제거됨 - 단순화된 구조로 변경
 * 북마크 내보내기 관련 타입들
 */
export type BookmarkExportFormat = "json" | "csv" | "excel";

export type BookmarkExportRequest = {
  format: BookmarkExportFormat;
  bookmarkIds?: string[];
  filters?: BookmarkSearchFilter;
  includeData?: {
    includeAlerts: boolean;
    includeStats: boolean;
    includeSettings: boolean;
  };
};

export type BookmarkImportRequest = {
  format: BookmarkExportFormat;
  fileData: string;
  duplicateHandling: "skip" | "overwrite" | "merge";
  validateData?: boolean;
};

export type BookmarkImportResult = {
  summary: {
    totalProcessed: number;
    successCount: number;
    failureCount: number;
    skippedCount: number;
  };
  failures: Array<{
    lineNumber: number;
    reason: string;
    originalData: unknown;
  }>;
  createdBookmarkIds: string[];
};

/**
 * @deprecated v4.0에서 제거됨 - SMS 설정 API로 이관
 * 북마크 알림 설정 타입
 */
export type BookmarkNotificationSettings = {
  bookmarkId: string;
  enabled: boolean;
  methods: Array<"email" | "browser" | "sms">;
  frequency: "realtime" | "daily" | "weekly";
  conditions: {
    onStatusChange: boolean;
    onInfoUpdate: boolean;
    onImportantNews: boolean;
    onTariffChange: boolean;
  };
  quietHours?: {
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
  };
};

// ======================================================================================
// 🆕 v6.1: API 명세 기준 신규 타입
// ======================================================================================

/**
 * 북마크 정보 타입 (v6.1)
 */
export type BookmarkV61 = {
  id: string;
  type: BookmarkType;
  targetValue: string;
  displayName: string;
  description: string;
  sseGenerated: boolean;
  smsNotificationEnabled: boolean;
  emailNotificationEnabled: boolean;
  monitoringActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * 북마크 목록 조회 쿼리 파라미터 (v6.1)
 */
export type GetBookmarksParamsV61 = {
  page?: number;
  size?: number;
  type?: BookmarkType;
  smsEnabled?: boolean;
  emailEnabled?: boolean;
  sort?: "createdAt" | "updatedAt" | "displayName";
  order?: "asc" | "desc";
};

/**
 * 북마크 통계 요약 (v6.1)
 */
export type BookmarkSummaryV61 = {
  totalBookmarks: number;
  hsCodeBookmarks: number;
  cargoBookmarks: number;
  sseGeneratedBookmarks: number;
  smsEnabledBookmarks: number;
  emailEnabledBookmarks: number;
  monitoringActiveBookmarks: number;
};

/**
 * 북마크 목록 API 응답 데이터 (v6.1)
 */
export type PaginatedBookmarksV61 = {
  bookmarks: BookmarkV61[];
  pagination: PaginationMeta;
  summary: BookmarkSummaryV61;
};

/**
 * 북마크 생성 요청 타입 (v6.1)
 */
export type CreateBookmarkRequestV61 = {
  type: BookmarkType;
  targetValue: string;
  displayName: string;
  description?: string;
  sseEventData?: Record<string, unknown>;
  smsNotificationEnabled?: boolean;
  emailNotificationEnabled?: boolean;
};

/**
 * 북마크 생성 응답 데이터 (v6.1)
 */
export type AddBookmarkResponseDataV61 = {
  bookmark: BookmarkV61;
  smsSetupRequired: boolean;
  monitoringAutoEnabled: boolean;
};

/**
 * 북마크 수정 요청 타입 (v6.1 추정)
 * @description v6.1 명세에는 없으나 기존 코드를 바탕으로 추정된 타입.
 */
export type UpdateBookmarkRequestV61 = {
  displayName?: string;
  description?: string;
  monitoringActive?: boolean;
  smsNotificationEnabled?: boolean;
  emailNotificationEnabled?: boolean;
};

/**
 * 북마크 알림 설정 변경 요청 타입 (v6.1)
 */
export type UpdateBookmarkNotificationSettingsV61 = {
  smsNotificationEnabled?: boolean;
  emailNotificationEnabled?: boolean;
};

/**
 * 북마크 알림 설정 변경 응답 데이터 (v6.1)
 */
export type UpdateBookmarkNotificationResponseV61 = {
  bookmarkId: string;
  displayName: string;
  previousSettings: {
    smsNotificationEnabled: boolean;
    emailNotificationEnabled: boolean;
  };
  currentSettings: {
    smsNotificationEnabled: boolean;
    emailNotificationEnabled: boolean;
  };
  monitoringActive: boolean;
  changedAt: string;
};
