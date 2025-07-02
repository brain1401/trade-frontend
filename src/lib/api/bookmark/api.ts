import type {
  BookmarkData,
} from "./types";
import type { ApiResponse } from "../../../types/common";
import { httpClient } from "../common";

/**
 * 북마크 API
 */
export const bookmarkApi = {
  async getBookmarks(): Promise<BookmarkData> {
    return httpClient.get(`/bookmarks`);
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
