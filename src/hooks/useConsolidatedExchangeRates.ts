import type { ExchangeRate } from "@/lib/api/exchange-rates/types";
import { useMemo } from "react";
import type { ExchangeRateCardProps } from "@/components/exchange-rates/ExchangeRateCard";
import { getCurrencyInfo } from "@/data/exchange-rates/currency-data";

/**
 * 원본 환율 데이터를 UI 카드에 표시하기 적합한 형태로 통합하고 가공하는 커스텀 훅.
 *
 * 이 훅은 React.useMemo를 사용하여 최적화되어,
 * 입력된 exchangeRates 배열이 변경될 때만 데이터 변환 로직을 다시 실행함.
 *
 * @param exchangeRates - API로부터 받은 원본 환율 데이터 배열
 * @returns - ExchangeRateCardProps 타입의 배열로 가공된 환율 데이터
 */
export function useConsolidatedExchangeRates(
  exchangeRates: ExchangeRate[] | undefined,
): ExchangeRateCardProps[] {
  return useMemo(() => {
    if (!exchangeRates) return [];

    // 1. 통화 코드(currencyCode)를 기준으로 수입/수출 정보를 그룹화
    const rateMap = new Map<
      string,
      {
        importRate: ExchangeRateCardProps["importRate"];
        exportRate: ExchangeRateCardProps["exportRate"];
      }
    >();

    exchangeRates.forEach((rate) => {
      const { currencyCode, currencyName } = rate;

      // 통화에 대한 항목을 가져오거나 새로 생성
      let consolidated = rateMap.get(currencyCode);
      if (!consolidated) {
        consolidated = { importRate: null, exportRate: null };
        rateMap.set(currencyCode, consolidated);
      }

      const rateInfo = {
        currencyName,
        exchangeRate: rate.exchangeRate,
        lastUpdated: rate.lastUpdated,
      };

      if (currencyName.includes("(수입)")) {
        consolidated.importRate = rateInfo;
      } else if (currencyName.includes("(수출)")) {
        consolidated.exportRate = rateInfo;
      }
    });

    // 2. 그룹화된 데이터를 기반으로 ExchangeRateCardProps 배열 생성
    return Array.from(rateMap.entries()).map(([currencyCode, rates]) => {
      const { koreanName, flagUrl } = getCurrencyInfo(currencyCode);
      return {
        currencyCode,
        koreanName,
        flagUrl,
        importRate: rates.importRate,
        exportRate: rates.exportRate,
      };
    });
  }, [exchangeRates]);
}
