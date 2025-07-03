import { queryOptions } from "@tanstack/react-query";
import type { Bookmark, BookmarkData, BookmarkListRequest } from "./types";
import { bookmarkApi } from "./api";
import type { ApiError } from "../common/ApiError";

export const bookmarkQueryKeys = {
  /**
   * 북마크 리소스 전체에 대한 키.
   * 예: ['bookmarks']
   */
  all: () => ["bookmarks"] as const,
  /**
   * 필터링된 북마크 목록을 위한 키.
   * 예: ['bookmarks', { page: 1 }]
   */
  list: (filters: BookmarkListRequest = {}) =>
    [...bookmarkQueryKeys.all(), filters] as const,
  /**
   * 특정 북마크의 상세 정보를 위한 키.
   * 예: ['bookmark', 'bookmark-123']
   */
  detail: (id: string) => ["bookmark", id] as const,
};

export const bookmarkQueries = {
  /**
   * 북마크 목록을 가져오는 쿼리 옵션.
   * @param filters 필터 조건 (페이지네이션 등)
   */
  list: (filters?: BookmarkListRequest) =>
    queryOptions<BookmarkData, ApiError>({
      queryKey: bookmarkQueryKeys.list(filters),
      queryFn: () => bookmarkApi.getBookmarks(filters),
    }),

  /**
   * 특정 북마크의 상세 정보를 가져오는 쿼리 옵션.
   * @param id 북마크 ID
   */
  detail: (id: string) =>
    queryOptions<Bookmark, ApiError>({
      queryKey: bookmarkQueryKeys.detail(id),
      queryFn: () => bookmarkApi.getBookmark(id),
    }),
};
