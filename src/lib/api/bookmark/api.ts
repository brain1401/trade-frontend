import type {
  PaginatedBookmarksV61,
  CreateBookmarkRequestV61,
  AddBookmarkResponseDataV61,
  UpdateBookmarkRequestV61,
  BookmarkV61,
} from "./types";
import type { ApiResponse } from "../../../types/common";
import { httpClient } from "../common";

/**
 * 북마크 API
 */
export const bookmarkApi = {
  async getBookmarks(): Promise<ApiResponse<PaginatedBookmarksV61>> {
    return httpClient.get(`/bookmarks`);
  },

  async addBookmark(
    data: CreateBookmarkRequestV61,
  ): Promise<ApiResponse<AddBookmarkResponseDataV61>> {
    return httpClient.post("/bookmarks", data);
  },

  async updateBookmark(
    bookmarkId: string,
    updateData: UpdateBookmarkRequestV61,
  ): Promise<ApiResponse<BookmarkV61>> {
    return httpClient.put(`/bookmarks/${bookmarkId}`, updateData);
  },

  async deleteBookmark(bookmarkId: string): Promise<void> {
    await httpClient.delete(`/bookmarks/${bookmarkId}`);
  },
};
