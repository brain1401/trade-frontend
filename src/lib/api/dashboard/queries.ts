import { dashboardApi } from "./api";
import type { DashBoardData } from "./types";
import type { ApiError } from "../common/ApiError";
import { queryOptions } from "@tanstack/react-query";

export const dashboardQueryKeys = {
  all: () => ["dashboard"] as const,
  data: () => [...dashboardQueryKeys.all(), "data"] as const,
};

export const dashboardQueries = {
  data: () =>
    queryOptions<DashBoardData, ApiError>({
      queryKey: ["dashboard", "data"],
      queryFn: () => dashboardApi.getDashboardData(),
      retry: false,
      refetchOnWindowFocus: true,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 5, // 5분
    }),
};