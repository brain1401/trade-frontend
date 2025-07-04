import { dashboardNotificationApi } from "./api";
import type { DashboardNotification } from "./types";
import type { ApiError } from "../common";
import { queryOptions } from "@tanstack/react-query";

export const dashboardNotificationQueryKeys = {
  all: () => ["dashboardNotification"] as const,
  settings: () => [...dashboardNotificationQueryKeys.all(), "settings"] as const,
};

export const dashboardNotificationQueries = {
  settings: () =>
    queryOptions<DashboardNotification, ApiError>({
      queryKey: dashboardNotificationQueryKeys.settings(),
      queryFn: () => dashboardNotificationApi.getDashboardNotificationSettings(),
      refetchOnWindowFocus: true,
    }),
};