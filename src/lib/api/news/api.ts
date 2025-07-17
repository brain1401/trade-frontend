import { httpClient } from "../common/httpClient";
import type { News } from "./types";

export const newsApi = {
  /**
   * 뉴스 기사 목록 조회
   * @param params.offset - 페이지 오프셋
   * @param params.limit - 페이지당 아이템 수
   * @returns 페이지네이션된 뉴스 기사 목록
   */
  getNews({ offset, limit }: { offset: number; limit: number }): Promise<News> {
    return httpClient.get<News>("/news", {
      params: { offset, limit },
    });
  },
};
