import type { ExchangeRates, DetailedExchangeRate } from "./types";
import { httpClient } from "../common/httpClient";

export const exchangeRatesApi = {
  /**
   * 실시간 환율 정보 조회
   * @param params 조회할 통화 코드 및 캐시 사용 여부
   * @returns 환율 정보 배열
   */
  getExchangeRates(params?: {
    currencies?: string;
    cache?: boolean;
  }): Promise<ExchangeRates> {
    const queryParams = new URLSearchParams();
    if (params?.currencies) {
      queryParams.append("currencies", params.currencies);
    }
    if (params?.cache !== undefined) {
      queryParams.append("cache", String(params.cache));
    }

    const queryString = queryParams.toString();
    const endpoint = `/exchange-rates${queryString ? `?${queryString}` : ""}`;

    return httpClient.get<ExchangeRates>(endpoint);
  },

  /**
   * 특정 통화의 상세 환율 정보 조회
   * @param currencyCode 조회할 통화 코드
   * @returns 상세 환율 정보
   */
  getExchangeRateByCode(currencyCode: string): Promise<DetailedExchangeRate> {
    return httpClient.get<DetailedExchangeRate>(
      `/exchange-rates/${currencyCode}`,
    );
  },
};
