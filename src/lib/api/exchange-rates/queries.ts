import { queryOptions } from "@tanstack/react-query";
import { exchangeRatesApi } from "./api";
import type { ExchangeRates, DetailedExchangeRate } from "./types";
import { ApiError } from "../common/ApiError";

export const exchangeRatesQueryKeys = {
  all: () => ["exchangeRates"] as const,

  lists: () => [...exchangeRatesQueryKeys.all(), "list"] as const,
  list: (params?: { currencies?: string; cache?: boolean }) =>
    [...exchangeRatesQueryKeys.lists(), params ?? {}] as const,

  details: () => [...exchangeRatesQueryKeys.all(), "detail"] as const,
  detail: (code: string) =>
    [...exchangeRatesQueryKeys.details(), code] as const,
};

export const exchangeRatesQueries = {
  list: (params?: { currencies?: string; cache?: boolean }) =>
    queryOptions<ExchangeRates, ApiError>({
      queryKey: exchangeRatesQueryKeys.list(params),
      queryFn: () => exchangeRatesApi.getExchangeRates(params),
      // 전역 설정 사용 (retry: 3, refetchOnMount: true)
      // 필요시 개별 쿼리에서 옵션 오버라이드 가능:
      // refetchOnMount: false, // 이 쿼리만 마운트 시 refetch 비활성화
      staleTime: 1000 * 30, // 30초 (환율은 자주 변동하므로 더 짧게)
    }),
  detail: (code: string) =>
    queryOptions<DetailedExchangeRate, ApiError>({
      queryKey: exchangeRatesQueryKeys.detail(code),
      queryFn: () => exchangeRatesApi.getExchangeRateByCode(code),
      // 전역 설정 사용
      staleTime: 1000 * 30, // 30초
    }),
};
