/**
 * 북마크 관리 관련 API 함수 모음
 *
 * HS Code 분석 결과 및 화물 추적 정보의 북마크 CRUD 기능 제공
 * 모니터링 설정과 연동하여 자동 변동사항 감지 기능 포함
 *
 * @module BookmarksApi
 * @since 1.0.0
 */

import { apiClient, type ApiResponse, API_ENDPOINTS } from "./client";

/**
 * 북마크 타입 정의
 */
export type BookmarkType = "HSCODE" | "CARGO_TRACKING";

/**
 * 북마크 생성 요청 데이터 타입
 */
export type CreateBookmarkRequest = {
  /** 북마크 타입 */
  type: BookmarkType;
  /** 북마크 제목 */
  title: string;
  /** 북마크 설명 */
  description?: string;
  /** HS Code (HS Code 북마크인 경우 필수) */
  hsCode?: string;
  /** 화물관리번호 (화물 추적 북마크인 경우 필수) */
  cargoNumber?: string;
  /** 분석 세션 ID (HS Code 북마크인 경우) */
  sessionId?: string;
  /** 모니터링 활성화 여부 */
  monitoringEnabled?: boolean;
  /** 태그 목록 */
  tags?: string[];
};

/**
 * 북마크 수정 요청 데이터 타입
 */
export type UpdateBookmarkRequest = {
  /** 북마크 제목 */
  title?: string;
  /** 북마크 설명 */
  description?: string;
  /** 모니터링 활성화 여부 */
  monitoringEnabled?: boolean;
  /** 태그 목록 */
  tags?: string[];
};

/**
 * 북마크 응답 데이터 타입
 */
export type BookmarkResponse = {
  /** 북마크 ID */
  id: string;
  /** 북마크 타입 */
  type: BookmarkType;
  /** 북마크 제목 */
  title: string;
  /** 북마크 설명 */
  description?: string;
  /** HS Code */
  hsCode?: string;
  /** 화물관리번호 */
  cargoNumber?: string;
  /** 분석 세션 ID */
  sessionId?: string;
  /** 모니터링 활성화 여부 */
  monitoringEnabled: boolean;
  /** 태그 목록 */
  tags: string[];
  /** 생성일시 */
  createdAt: string;
  /** 수정일시 */
  updatedAt: string;
  /** 마지막 모니터링 체크 시간 */
  lastCheckedAt?: string;
  /** 변동사항 수 */
  changeCount: number;
  /** 마지막 변동사항 */
  lastChange?: {
    type: string;
    description: string;
    timestamp: string;
  };
};

/**
 * 북마크 목록 조회 요청 파라미터 타입
 */
export type GetBookmarksParams = {
  /** 페이지 번호 (1부터 시작) */
  page?: number;
  /** 페이지 크기 */
  size?: number;
  /** 북마크 타입 필터 */
  type?: BookmarkType;
  /** 모니터링 활성화 필터 */
  monitoringEnabled?: boolean;
  /** 태그 필터 */
  tags?: string[];
  /** 검색 키워드 */
  search?: string;
  /** 정렬 기준 */
  sortBy?: "createdAt" | "updatedAt" | "title" | "changeCount";
  /** 정렬 방향 */
  sortDirection?: "ASC" | "DESC";
};

/**
 * 북마크 목록 응답 데이터 타입
 */
export type BookmarksListResponse = {
  /** 북마크 목록 */
  bookmarks: BookmarkResponse[];
  /** 페이지네이션 정보 */
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};

/**
 * 북마크 생성 API 함수
 *
 * @param bookmarkData - 북마크 생성 요청 데이터
 * @returns 생성된 북마크 정보
 *
 * @example
 * ```typescript
 * const result = await createBookmark({
 *   type: "HSCODE",
 *   title: "스마트폰 HS Code 분석",
 *   hsCode: "8517.12.00",
 *   sessionId: "session_123",
 *   monitoringEnabled: true,
 *   tags: ["전자제품", "수입"]
 * });
 *
 * if (result.success) {
 *   console.log("북마크 생성 완료:", result.data.id);
 * }
 * ```
 */
export const createBookmark = async (
  bookmarkData: CreateBookmarkRequest,
): Promise<ApiResponse<BookmarkResponse>> => {
  const response = await apiClient.post<ApiResponse<BookmarkResponse>>(
    API_ENDPOINTS.BOOKMARKS.CREATE,
    bookmarkData,
  );
  return response.data;
};

/**
 * 북마크 목록 조회 API 함수
 *
 * @param params - 조회 파라미터
 * @returns 북마크 목록 및 페이지네이션 정보
 *
 * @example
 * ```typescript
 * const result = await getBookmarks({
 *   page: 1,
 *   size: 10,
 *   type: "HSCODE",
 *   monitoringEnabled: true,
 *   sortBy: "updatedAt",
 *   sortDirection: "DESC"
 * });
 *
 * if (result.success) {
 *   result.data.bookmarks.forEach(bookmark => {
 *     console.log(`북마크: ${bookmark.title} (변동 ${bookmark.changeCount}회)`);
 *   });
 * }
 * ```
 */
export const getBookmarks = async (
  params?: GetBookmarksParams,
): Promise<ApiResponse<BookmarksListResponse>> => {
  const queryString = params
    ? new URLSearchParams(params as any).toString()
    : "";
  const url = queryString
    ? `${API_ENDPOINTS.BOOKMARKS.LIST}?${queryString}`
    : API_ENDPOINTS.BOOKMARKS.LIST;

  const response = await apiClient.get<ApiResponse<BookmarksListResponse>>(url);
  return response.data;
};

/**
 * 북마크 상세 조회 API 함수
 *
 * @param bookmarkId - 북마크 ID
 * @returns 북마크 상세 정보
 *
 * @example
 * ```typescript
 * const result = await getBookmarkDetail("bookmark_123");
 * if (result.success) {
 *   console.log("북마크 상세:", result.data);
 * }
 * ```
 */
export const getBookmarkDetail = async (
  bookmarkId: string,
): Promise<ApiResponse<BookmarkResponse>> => {
  const response = await apiClient.get<ApiResponse<BookmarkResponse>>(
    `${API_ENDPOINTS.BOOKMARKS.LIST}/${bookmarkId}`,
  );
  return response.data;
};

/**
 * 북마크 수정 API 함수
 *
 * @param bookmarkId - 북마크 ID
 * @param updateData - 수정할 데이터
 * @returns 수정된 북마크 정보
 *
 * @example
 * ```typescript
 * const result = await updateBookmark("bookmark_123", {
 *   title: "새로운 제목",
 *   monitoringEnabled: false,
 *   tags: ["업데이트된", "태그"]
 * });
 * ```
 */
export const updateBookmark = async (
  bookmarkId: string,
  updateData: UpdateBookmarkRequest,
): Promise<ApiResponse<BookmarkResponse>> => {
  const response = await apiClient.put<ApiResponse<BookmarkResponse>>(
    `${API_ENDPOINTS.BOOKMARKS.UPDATE}/${bookmarkId}`,
    updateData,
  );
  return response.data;
};

/**
 * 북마크 삭제 API 함수
 *
 * @param bookmarkId - 북마크 ID
 * @returns 삭제 결과
 *
 * @example
 * ```typescript
 * const result = await deleteBookmark("bookmark_123");
 * if (result.success) {
 *   console.log("북마크가 삭제되었습니다");
 * }
 * ```
 */
export const deleteBookmark = async (
  bookmarkId: string,
): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    `${API_ENDPOINTS.BOOKMARKS.DELETE}/${bookmarkId}`,
  );
  return response.data;
};

/**
 * 북마크 모니터링 설정 토글 API 함수
 *
 * @param bookmarkId - 북마크 ID
 * @param enabled - 모니터링 활성화 여부
 * @returns 업데이트된 북마크 정보
 *
 * @example
 * ```typescript
 * const result = await toggleBookmarkMonitoring("bookmark_123", true);
 * if (result.success) {
 *   console.log("모니터링이 활성화되었습니다");
 * }
 * ```
 */
export const toggleBookmarkMonitoring = async (
  bookmarkId: string,
  enabled: boolean,
): Promise<ApiResponse<BookmarkResponse>> => {
  const response = await apiClient.patch<ApiResponse<BookmarkResponse>>(
    `${API_ENDPOINTS.BOOKMARKS.UPDATE}/${bookmarkId}/monitoring`,
    { monitoringEnabled: enabled },
  );
  return response.data;
};

/**
 * 북마크 벌크 삭제 API 함수
 *
 * @param bookmarkIds - 삭제할 북마크 ID 목록
 * @returns 삭제 결과
 *
 * @example
 * ```typescript
 * const result = await deleteBulkBookmarks(["bookmark_1", "bookmark_2"]);
 * if (result.success) {
 *   console.log("선택한 북마크들이 삭제되었습니다");
 * }
 * ```
 */
export const deleteBulkBookmarks = async (
  bookmarkIds: string[],
): Promise<ApiResponse<{ deletedCount: number }>> => {
  const response = await apiClient.delete<
    ApiResponse<{ deletedCount: number }>
  >(`${API_ENDPOINTS.BOOKMARKS.DELETE}/bulk`, { data: { bookmarkIds } });
  return response.data;
};
