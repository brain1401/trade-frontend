import type { Bookmark, BookmarkData, BookmarkListRequest } from "./types";
import { httpClient } from "../common";

export type UpdateBookmarkRequest = {
  displayName: string;
  smsNotificationEnabled: boolean;
  emailNotificationEnabled: boolean;
};

/**
 * 북마크 API
 */
export const bookmarkApi = {
  /**
   * 북마크 목록 조회
   * @param params 필터 및 페이지네이션 옵션
   */
  async getBookmarks(params?: BookmarkListRequest): Promise<BookmarkData> {
    return httpClient.get<BookmarkData>(`/bookmarks`, {
      params,
    });
  },

  /**
   * 특정 북마크 상세 조회
   * @param id 북마크 ID
   */
  async getBookmark(id: string): Promise<Bookmark> {
    return httpClient.get<Bookmark>(`/bookmarks/${id}`);
  },

  /**
   * 북마크 수정 (추가)
   * @param id 수정할 북마크 ID
   * @param data 수정할 북마크 데이터
   */
  async updateBookmark(
    id: number,
    data: UpdateBookmarkRequest,
  ): Promise<Bookmark> {
    return httpClient.put<Bookmark>(`/bookmarks/${id}`, data);
  },

  /**
   * 북마크 삭제 (추가)
   * @param id 삭제할 북마크 ID
   */
  async deleteBookmark(id: number): Promise<void> {
    return httpClient.delete(`/bookmarks/${id}`);
  },
};
