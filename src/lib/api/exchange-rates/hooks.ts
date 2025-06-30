import { createQueryHook } from "../common/createQuery";
import { exchangeRatesQueries } from "./queries";

/**
 * 여러 통화의 환율 정보를 가져오는 쿼리 훅.
 */
export const useGetExchangeRates = createQueryHook(exchangeRatesQueries.list);

/**
 * 특정 통화의 상세 환율 정보를 가져오는 쿼리 훅.
 * currencyCode가 제공될 때만 쿼리 활성화.
 */
export const useGetExchangeRateByCode = createQueryHook(
  exchangeRatesQueries.detail,
  (currencyCode) => ({
    enabled: !!currencyCode,
  }),
);
