import type { DashboardNotification } from "./types";
import { httpClient } from "../common";

export const dashboardNotificationApi = {
  getDashboardNotificationSettings(): Promise<DashboardNotification> {
    return httpClient.get<DashboardNotification>("/notifications/settings");
  },
  updateDashboardNotificationSettings(
    settings: DashboardNotification,
  ): Promise<DashboardNotification> {
    return httpClient.put<DashboardNotification>(
      "/notifications/settings",
      settings,
    );
  },
};
