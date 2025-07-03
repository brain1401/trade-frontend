import type { z } from "zod";
import type {
  statisticsSchema,
  topSchema,
  tradeStatisticsParamsSchema,
} from "./schemas";

export type Statistics = z.infer<typeof statisticsSchema>;
export type Top = z.infer<typeof topSchema>;
export type TradeStatistics = z.infer<typeof statisticsSchema>;

export type StatisticsParams = z.infer<typeof tradeStatisticsParamsSchema>;
