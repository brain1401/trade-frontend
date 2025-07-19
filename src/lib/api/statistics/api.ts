import { httpClient } from "../common/httpClient";
import type { StatisticsParams, TradeStatistics } from "./types";

export const statisticsApi = {
  /**
   * 특정 국가 간의 무역 통계 데이터 조회
   * @param params - 조회할 국가 및 기간 정보
   * @returns 무역 통계 데이터
   */
  getStatistics(params: StatisticsParams): Promise<TradeStatistics> {
    return httpClient.post<TradeStatistics>("/statistics", params);
  },
};
