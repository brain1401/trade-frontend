import type { Bookmark, BookmarkData, BookmarkListRequest } from "./types";
import type { ApiResponse } from "../../../types/common";
import { httpClient } from "../common";

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

  // 필요한 body의 데이터 타입을 작성해서 넣어야 함.

  // async addBookmark(
  //   data,
  // ): Promise<ApiResponse<AddBookmarkResponseDataV61>> {
  //   return httpClient.post("/bookmarks", data);
  // },

  // async updateBookmark(
  //   bookmarkId: string,
  //   updateData: UpdateBookmarkRequestV61,
  // ): Promise<ApiResponse<BookmarkV61>> {
  //   return httpClient.put(`/bookmarks/${bookmarkId}`, updateData);
  // },

  // async deleteBookmark(bookmarkId: string): Promise<void> {
  //   await httpClient.delete(`/bookmarks/${bookmarkId}`);
  // },
};
