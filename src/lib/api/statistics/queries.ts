import { queryOptions } from "@tanstack/react-query";

import { statisticsApi } from "./api";
import type { ApiError } from "../common/ApiError";

import type { StatisticsParams, TradeStatistics } from "./types";
import { statisticsSchema } from "./schemas";

export const statisticsQueryKeys = {
  all: ["statistics"] as const,
  details: () => [...statisticsQueryKeys.all, "detail"] as const,
  detail: (params: StatisticsParams) =>
    [...statisticsQueryKeys.details(), params] as const,
};

export const statisticsQueries = {
  detail: (params: StatisticsParams) =>
    queryOptions<TradeStatistics, ApiError>({
      queryKey: statisticsQueryKeys.detail(params),
      queryFn: async () => {
        const response = await statisticsApi.getStatistics(params);
        return statisticsSchema.parse(response);
      },
    }),
};
