import type { NewsListResponse, NewsDetail } from "./types";
import { httpClient, ApiError } from "../common";

/**
 * 무역 뉴스 API v6.1 🌐 PUBLIC API
 *
 * 주요 기능:
 * - 무역 관련 최신 뉴스 조회
 * - 카테고리별 뉴스 필터링
 * - 뉴스 상세 조회
 */
export const newsApi = {
  /**
   * 무역 뉴스 목록 조회
   */
  async getNews(params?: {
    category?: string;
    page?: number;
    size?: number;
    priority?: "HIGH" | "MEDIUM" | "LOW";
  }): Promise<NewsListResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.category) {
        queryParams.append("category", params.category);
      }
      if (params?.page) {
        queryParams.append("page", params.page.toString());
      }
      if (params?.size) {
        queryParams.append("size", params.size.toString());
      }
      if (params?.priority) {
        queryParams.append("priority", params.priority);
      }

      const endpoint = `/news${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await httpClient.get<NewsListResponse>(endpoint);

      console.log("뉴스 목록 조회 성공:", {
        newsCount: response.news.length,
        totalElements: response.pagination.totalElements,
        categoriesCount: response.categories.length,
      });

      return response;
    } catch (error) {
      console.error("뉴스 목록 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 뉴스 상세 조회
   */
  async getNewsDetail(newsId: string): Promise<NewsDetail> {
    try {
      const response = await httpClient.get<NewsDetail>(`/news/${newsId}`);

      console.log("뉴스 상세 조회 성공:", {
        newsId: response.id,
        title: response.title,
        category: response.category,
        viewCount: response.viewCount,
      });

      return response;
    } catch (error) {
      console.error("뉴스 상세 조회 실패:", error);
      throw error;
    }
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
