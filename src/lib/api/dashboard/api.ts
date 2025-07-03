import type { 
    DashBoardData 
} from "./types";
import { httpClient } from "../common";

export const dashboardApi = {
  getDashboardData(): Promise<DashBoardData> {
    return httpClient.get<DashBoardData>("/dashboard/summary");
  },
};

























