import { z } from "zod";

/**
 * Top 항목에 대한 Zod 스키마
 */
export const topSchema = z.object({
  itemName: z.string().min(1, "itemName은 빈 문자열일 수 없음"),
  totalValue: z.number().nonnegative("totalValue는 음수일 수 없음"),
});

/**
 * 통계 데이터에 대한 Zod 스키마
 */
export const statisticsSchema = z.object({
  totalExportValue: z.number().nonnegative("totalExportValue는 음수일 수 없음"),
  totalImportValue: z.number().nonnegative("totalImportValue는 음수일 수 없음"),
  topExportCategories: z.array(topSchema),
  topExportProducts: z.array(topSchema),
  topImportCategories: z.array(topSchema),
  topImportProducts: z.array(topSchema),
});

export const tradeStatisticsParamsSchema = z.object({
  reporterCode: z.string(),
  partnerCode: z.string(),
  StartPeriod: z.string(),
  EndPeriod: z.string(),
});
