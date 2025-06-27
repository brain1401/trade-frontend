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
  /** SMS 알림 활성화 여부 */
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
  /** SMS 알림 활성화 여부 (기본값: false) */
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
  /** SMS 알림 활성화 여부 */
  smsNotificationEnabled?: boolean;
};

/**
 * 북마크 목록 응답 타입
 */
export type BookmarkListResponse = {
  content: Bookmark[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};
