import type { DashBoardData, DashboardNotification } from "./types";
import { httpClient } from "../common";

export const dashboardApi = {
  getDashboardData(): Promise<DashBoardData> {
    return httpClient.get<DashBoardData>("/dashboard/summary");
  },

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
