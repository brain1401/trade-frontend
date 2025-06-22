import type { PaginationInfo, SortOption } from "./base";

/**
 * 북마크 API 관련 타입 정의 (API v2.4)
 *
 * Private API: 모든 북마크 기능은 로그인이 필요합니다
 */

/**
 * 북마크 타입
 */
export type BookmarkType = "HS_CODE" | "CARGO";

/**
 * 북마크 정보 타입
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
 * 북마크 추가 요청 타입
 */
export type CreateBookmarkRequest = {
  /** 북마크 타입 */
  type: BookmarkType;
  /** 북마크할 대상 값 */
  targetValue: string;
  /** 사용자 지정 표시명 */
  displayName: string;
  /** 북마크 설명 */
  description?: string;
  /** 모니터링 활성화 여부 */
  monitoringEnabled?: boolean;
};

/**
 * 북마크 수정 요청 타입
 */
export type UpdateBookmarkRequest = {
  /** 사용자 지정 표시명 */
  displayName?: string;
  /** 북마크 설명 */
  description?: string;
  /** 모니터링 활성화 여부 */
  monitoringEnabled?: boolean;
};

/**
 * 북마크 목록 조회 파라미터 타입
 */
export type BookmarkListParams = {
  /** 북마크 타입 필터 */
  type?: BookmarkType | "ALL";
  /** 페이지 오프셋 */
  offset?: number;
  /** 페이지 크기 */
  limit?: number;
  /** 정렬 기준 */
  sort?: "createdAt" | "updatedAt" | "name" | "alertCount";
  /** 정렬 순서 */
  order?: "asc" | "desc";
  /** 모니터링 활성화 필터 */
  monitoringEnabled?: boolean;
  /** 검색 키워드 */
  search?: string;
};

/**
 * 북마크 목록 응답 타입
 */
export type BookmarkListResponse = {
  /** 북마크 목록 */
  content: Bookmark[];
  /** 페이지네이션 정보 */
  pagination: PaginationInfo;
  /** 목록 요약 정보 */
  summary?: {
    /** 전체 북마크 수 */
    totalBookmarks: number;
    /** 타입별 개수 */
    byType: Record<BookmarkType, number>;
    /** 모니터링 활성화 개수 */
    monitoringEnabled: number;
    /** 읽지 않은 알림 수 */
    unreadAlerts: number;
  };
};

/**
 * 북마크 검색 필터 타입
 */
export type BookmarkSearchFilter = {
  /** 검색 키워드 */
  keyword?: string;
  /** 북마크 타입 */
  types?: BookmarkType[];
  /** 모니터링 상태 */
  monitoringStatus?: "enabled" | "disabled" | "all";
  /** 알림 여부 */
  hasAlerts?: boolean;
  /** 날짜 범위 */
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  /** 정렬 옵션 */
  sortOptions?: SortOption[];
};

/**
 * 북마크 통계 타입
 */
export type BookmarkStatistics = {
  /** 전체 북마크 수 */
  totalCount: number;
  /** 타입별 분포 */
  typeDistribution: Record<
    BookmarkType,
    {
      count: number;
      percentage: number;
      activeMonitoring: number;
    }
  >;
  /** 모니터링 통계 */
  monitoringStats: {
    /** 활성 모니터링 수 */
    activeCount: number;
    /** 평균 알림 수 */
    averageAlerts: number;
    /** 최근 7일 알림 수 */
    recentAlerts: number;
  };
  /** 활동 통계 */
  activityStats: {
    /** 최근 추가된 북마크 수 (7일) */
    recentlyAdded: number;
    /** 최근 수정된 북마크 수 (7일) */
    recentlyUpdated: number;
    /** 평균 사용 빈도 */
    averageUsage: number;
  };
};

/**
 * 북마크 내보내기 형식 타입
 */
export type BookmarkExportFormat = "json" | "csv" | "excel";

/**
 * 북마크 내보내기 요청 타입
 */
export type BookmarkExportRequest = {
  /** 내보내기 형식 */
  format: BookmarkExportFormat;
  /** 내보낼 북마크 ID 목록 (비어있으면 전체) */
  bookmarkIds?: string[];
  /** 필터 조건 */
  filters?: BookmarkSearchFilter;
  /** 포함할 데이터 */
  includeData?: {
    /** 알림 히스토리 포함 */
    includeAlerts: boolean;
    /** 통계 정보 포함 */
    includeStats: boolean;
    /** 설정 정보 포함 */
    includeSettings: boolean;
  };
};

/**
 * 북마크 가져오기 요청 타입
 */
export type BookmarkImportRequest = {
  /** 가져올 데이터 형식 */
  format: BookmarkExportFormat;
  /** 파일 데이터 */
  fileData: string;
  /** 중복 처리 방식 */
  duplicateHandling: "skip" | "overwrite" | "merge";
  /** 유효성 검사 수행 여부 */
  validateData?: boolean;
};

/**
 * 북마크 가져오기 결과 타입
 */
export type BookmarkImportResult = {
  /** 처리 결과 요약 */
  summary: {
    /** 전체 처리 항목 수 */
    totalProcessed: number;
    /** 성공적으로 가져온 수 */
    successCount: number;
    /** 실패한 수 */
    failureCount: number;
    /** 건너뛴 수 (중복) */
    skippedCount: number;
  };
  /** 실패한 항목들 */
  failures: Array<{
    /** 라인 번호 */
    lineNumber: number;
    /** 실패 사유 */
    reason: string;
    /** 원본 데이터 */
    originalData: any;
  }>;
  /** 성공적으로 생성된 북마크 ID들 */
  createdBookmarkIds: string[];
};

/**
 * 북마크 알림 설정 타입
 */
export type BookmarkNotificationSettings = {
  /** 북마크 ID */
  bookmarkId: string;
  /** 알림 활성화 여부 */
  enabled: boolean;
  /** 알림 방식 */
  methods: Array<"email" | "browser" | "sms">;
  /** 알림 빈도 */
  frequency: "realtime" | "daily" | "weekly";
  /** 알림 조건 */
  conditions: {
    /** 상태 변경 시 알림 */
    onStatusChange: boolean;
    /** 새로운 정보 업데이트 시 알림 */
    onInfoUpdate: boolean;
    /** 중요 뉴스 발생 시 알림 */
    onImportantNews: boolean;
    /** 관세율 변경 시 알림 */
    onTariffChange: boolean;
  };
  /** 조용한 시간 설정 */
  quietHours?: {
    /** 시작 시간 */
    startTime: string;
    /** 종료 시간 */
    endTime: string;
    /** 적용 요일 */
    daysOfWeek: number[];
  };
};
