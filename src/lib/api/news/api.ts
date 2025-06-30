import type { NewsItem, NewsDetail } from "./types";
import { httpClient } from "../common/httpClient";

export const newsApi = {
  /**
   * 뉴스 기사 목록 조회
   * @returns 뉴스 기사 목록
   */
  getNews(): Promise<NewsItem[]> {
    return httpClient.get<NewsItem[]>("/news");
  },

  /**
   * 특정 뉴스 기사 조회
   * @param articleId 조회할 기사 ID
   * @returns 뉴스 기사
   */
  getNewsById(articleId: number): Promise<NewsDetail> {
    return httpClient.get<NewsDetail>(`/news/${articleId}`);
  },
};
