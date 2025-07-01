import { createQueryHook } from "../common/createQuery";
import { exchangeRatesQueries } from "./queries";
import type { UseQueryOptions } from "@tanstack/react-query";
import type { ExchangeRates, DetailedExchangeRate } from "./types";
import type { ApiError } from "../common/ApiError";

// 내부 훅 (createQueryHook 사용)
const _useGetExchangeRates = createQueryHook(exchangeRatesQueries.list);
const _useGetExchangeRateByCode = createQueryHook(
  exchangeRatesQueries.detail,
  (currencyCode) => ({
    enabled: !!currencyCode,
  }),
);

// 사용자를 위한 편리한 API 타입 정의
type ExchangeRateOptions = Omit<
  UseQueryOptions<ExchangeRates, ApiError>,
  "queryKey" | "queryFn"
>;
type ExchangeRateDetailOptions = Omit<
  UseQueryOptions<DetailedExchangeRate, ApiError>,
  "queryKey" | "queryFn"
>;

/**
 * 여러 통화의 환율 정보를 가져오는 쿼리 훅
 *
 * @example
 * // 기본 사용 (전역 설정 적용)
 * const { data } = useGetExchangeRates();
 *
 * // 특정 통화만 조회
 * const { data } = useGetExchangeRates({
 *   params: { currencies: "USD,EUR,JPY" }
 * });
 *
 * // 마운트 시 자동 refetch 비활성화
 * const { data } = useGetExchangeRates({
 *   refetchOnMount: false
 * });
 */
export function useGetExchangeRates(options?: {
  params?: { currencies?: string; cache?: boolean };
  refetchOnMount?: boolean | "always" | ((query: any) => boolean | "always");
  staleTime?: number;
  enabled?: boolean;
  retry?:
    | boolean
    | number
    | ((failureCount: number, error: ApiError) => boolean);
  refetchInterval?: number | false;
  [key: string]: any; // 기타 쿼리 옵션들
}) {
  const { params, ...queryOptions } = options || {};

  // params가 있으면 전달, 없으면 undefined를 명시적으로 전달
  return _useGetExchangeRates(
    params as any,
    queryOptions as ExchangeRateOptions,
  );
}

/**
 * 특정 통화의 상세 환율 정보를 가져오는 쿼리 훅
 *
 * @param currencyCode 통화 코드 (예: "USD", "EUR")
 * @param options 추가 쿼리 옵션
 *
 * @example
 * // 기본 사용
 * const { data } = useGetExchangeRateByCode("USD");
 *
 * // 마운트 시 자동 refetch 비활성화
 * const { data } = useGetExchangeRateByCode("USD", {
 *   refetchOnMount: false
 * });
 */
export function useGetExchangeRateByCode(
  currencyCode: string,
  options?: {
    refetchOnMount?: boolean | "always" | ((query: any) => boolean | "always");
    staleTime?: number;
    enabled?: boolean;
    retry?:
      | boolean
      | number
      | ((failureCount: number, error: ApiError) => boolean);
    refetchInterval?: number | false;
    [key: string]: any; // 기타 쿼리 옵션들
  },
) {
  return _useGetExchangeRateByCode(
    currencyCode,
    options as ExchangeRateDetailOptions,
  );
}

// 기존 사용법과의 호환성을 위한 별칭 (deprecated)
/**
 * @deprecated useGetExchangeRates()를 대신 사용하세요
 */
export const useGetExchangeRatesLegacy = _useGetExchangeRates;

/**
 * @deprecated useGetExchangeRateByCode()를 대신 사용하세요
 */
export const useGetExchangeRateByCodeLegacy = _useGetExchangeRateByCode;
