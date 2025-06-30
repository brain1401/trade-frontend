import type { ExchangeRates, DetailedExchangeRate } from "./types";
import { httpClient, ApiError } from "../common";

/**
 * 실시간 환율 API v6.1 🌐 PUBLIC API
 *
 * 주요 기능:
 * - 주요 통화 실시간 환율 조회
 * - 특정 통화 상세 환율 정보
 * - 환율 변동 추이 데이터
 */
export const exchangeRatesApi = {
  /**
   * 실시간 환율 정보 조회
   */
  async getExchangeRates(params?: {
    currencies?: string;
    cache?: boolean;
  }): Promise<ExchangeRates> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.currencies) {
        queryParams.append("currencies", params.currencies);
      }
      if (params?.cache !== undefined) {
        queryParams.append("cache", params.cache.toString());
      }

      if(params?.currencies) {
      const endpoint = `/exchange-rates/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await httpClient.get<ExchangeRates>(endpoint);


      return response;
      }
      const endpoint = `/exchange-rates`;
      const response = await httpClient.get<ExchangeRates>(endpoint);


      return response;


    } catch (error) {
      console.error("환율 정보 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 특정 통화 환율 조회
   */
  async getExchangeRate(currencyCode: string): Promise<DetailedExchangeRate> {
    try {
      const response = await httpClient.get<DetailedExchangeRate>(
        `/exchange-rates/${currencyCode}`,
      );

      console.log("특정 통화 환율 조회 성공:", {
        currencyCode: response.currencyCode,
        exchangeRate: response.exchangeRate,
        trend: response.trend,
      });

      return response;
    } catch (error) {
      console.error("특정 통화 환율 조회 실패:", error);
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
