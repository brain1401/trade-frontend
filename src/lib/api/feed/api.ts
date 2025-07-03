import type { 
    RecentUpdatesFeedData 
} from "./types";

import { httpClient } from "../common";

export const feedApi = {
  getRecentUpdatesFeed(): Promise<RecentUpdatesFeedData> {
    return httpClient.get<RecentUpdatesFeedData>("/dashboard/feeds");
  },
};
