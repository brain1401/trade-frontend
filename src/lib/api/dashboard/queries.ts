import { dashboardApi } from "./api";
import type { DashBoardData, DashboardNotification } from "./types";
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

export const dashboardNotificationQueryKeys = {
  all: () => ["dashboardNotification"] as const,
  settings: () =>
    [...dashboardNotificationQueryKeys.all(), "settings"] as const,
};

export const dashboardNotificationQueries = {
  settings: () =>
    queryOptions<DashboardNotification, ApiError>({
      queryKey: dashboardNotificationQueryKeys.settings(),
      queryFn: () => dashboardApi.getDashboardNotificationSettings(),
      refetchOnWindowFocus: true,
    }),
};
