import type { ExchangeRate } from "@/lib/api/exchange-rates/types";
import { useMemo } from "react";
import type { ExchangeRateCardProps } from "@/components/exchange-rates/ExchangeRateCard";
import {
  getCurrencyInfo,
  PREFERRED_CURRENCY_CODES,
} from "@/data/exchange-rates/currency-data";

type GroupedRates = Map<
  string,
  {
    importRate: ExchangeRateCardProps["importRate"];
    exportRate: ExchangeRateCardProps["exportRate"];
  }
>;

/**
 * 환율 데이터를 통화 코드로 그룹화.
 * @param rates - 원본 환율 데이터 배열
 * @returns 통화 코드별로 그룹화된 Map 객체
 */
const groupExchangeRates = (rates: ExchangeRate[]): GroupedRates => {
  return rates.reduce<GroupedRates>((acc, rate) => {
    const { currencyCode, currencyName } = rate;
    const consolidated = acc.get(currencyCode) ?? {
      importRate: null,
      exportRate: null,
    };

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

    if (!acc.has(currencyCode)) {
      acc.set(currencyCode, consolidated);
    }

    return acc;
  }, new Map());
};

/**
 * 그룹화된 환율 데이터를 정렬하고 최종 UI 모델로 매핑.
 * @param groupedRates - 그룹화된 환율 데이터 Map
 * @returns 정렬된 ExchangeRateCardProps 배열
 */
const mapAndSortRates = (
  groupedRates: GroupedRates,
): ExchangeRateCardProps[] => {
  const mapped = Array.from(groupedRates.entries()).map(
    ([currencyCode, rates]) => {
      const { koreanName, flagUrl } = getCurrencyInfo(currencyCode);
      return {
        currencyCode,
        koreanName,
        flagUrl,
        importRate: rates.importRate,
        exportRate: rates.exportRate,
      };
    },
  );

  return mapped.sort((a, b) => {
    const indexA = PREFERRED_CURRENCY_CODES.indexOf(a.currencyCode);
    const indexB = PREFERRED_CURRENCY_CODES.indexOf(b.currencyCode);

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.currencyCode.localeCompare(b.currencyCode);
  });
};

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
    if (!exchangeRates || exchangeRates.length === 0) return [];

    const grouped = groupExchangeRates(exchangeRates);
    return mapAndSortRates(grouped);
  }, [exchangeRates]);
}
