import type {
  BookmarkListResponse,
  CreateBookmarkRequest,
  UpdateBookmarkRequest,
} from "./types";
import { httpClient, ApiError } from "../common";

/**
 * 북마크 API
 */
export const bookmarkApi = {
  async getBookmarks(params?: any): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return httpClient.get(`/bookmarks?${queryParams.toString()}`);
  },

  async addBookmark(bookmarkData: CreateBookmarkRequest): Promise<any> {
    return httpClient.post("/bookmarks", bookmarkData);
  },

  async updateBookmark(
    bookmarkId: string,
    updateData: UpdateBookmarkRequest,
  ): Promise<any> {
    return httpClient.put(`/bookmarks/${bookmarkId}`, updateData);
  },

  async deleteBookmark(bookmarkId: string): Promise<void> {
    return httpClient.delete(`/bookmarks/${bookmarkId}`);
  },

  /**
   * 에러 메시지 파싱
   */
  parseErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "알 수 없는 오류가 발생했습니다";
  },
};
