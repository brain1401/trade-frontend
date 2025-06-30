import type {
  GetBookmarksParamsV61,
  PaginatedBookmarksV61,
  CreateBookmarkRequestV61,
  AddBookmarkResponseDataV61,
  UpdateBookmarkRequestV61,
  BookmarkV61,
} from "../../../types/bookmark";
import type { ApiResponse } from "../../../types/common";
import { httpClient, ApiError } from "../common";

/**
 * 북마크 API
 */
export const bookmarkApi = {
  async getBookmarks(
    params?: GetBookmarksParamsV61,
  ): Promise<ApiResponse<PaginatedBookmarksV61>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    return httpClient.get(`/bookmarks?${queryParams.toString()}`);
  },

  async addBookmark(
    bookmarkData: CreateBookmarkRequestV61,
  ): Promise<ApiResponse<AddBookmarkResponseDataV61>> {
    return httpClient.post("/bookmarks", bookmarkData);
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
