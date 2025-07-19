import { queryOptions } from "@tanstack/react-query";
import { exchangeRatesApi } from "./api";
import type { ExchangeRates, DetailedExchangeRate } from "./types";
import type { ApiError } from "../common/ApiError";

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

      refetchOnWindowFocus: false, // 윈도우 포커스 시 refetch 비활성화
      refetchOnReconnect: false, // 네트워크 재연결 시 refetch 비활성화
      refetchInterval: false, // 주기적 refetch 비활성화
      refetchOnMount: false, // 페이지 진입(컴포넌트 마운트) 시에만 refetch
    }),
  detail: (code: string) =>
    queryOptions<DetailedExchangeRate, ApiError>({
      queryKey: exchangeRatesQueryKeys.detail(code),
      queryFn: () => exchangeRatesApi.getExchangeRateByCode(code),
      refetchOnWindowFocus: false, // 윈도우 포커스 시 refetch 비활성화
      refetchOnReconnect: false, // 네트워크 재연결 시 refetch 비활성화
      refetchInterval: false, // 주기적 refetch 비활성화
      refetchOnMount: true, // 페이지 진입(컴포넌트 마운트) 시에만 refetch
    }),
};
