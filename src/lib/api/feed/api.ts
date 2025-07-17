import type { RecentUpdatesFeedData } from "./types";

import { httpClient, rawHttpClient } from "../common";

export const feedApi = {
  getRecentUpdatesFeed({
    pageParam = 0,
  }: {
    pageParam?: number;
  }): Promise<RecentUpdatesFeedData> {
    return httpClient.get<RecentUpdatesFeedData>("/dashboard/feeds", {
      params: {
        page: pageParam,
        size: 10,
      },
    });
  },

  /**
   * 특정 피드를 읽음으로 처리
   * @param feedId 읽음 처리할 피드 ID
   */
  async markFeedAsRead(feedId: number): Promise<void> {
    const response = await rawHttpClient.put(`/dashboard/feeds/${feedId}/read`);

    if (response.success === "ERROR") {
      throw new Error(
        response.message || "피드를 읽음 처리하는 데 실패했습니다.",
      );
    }
  },
};
