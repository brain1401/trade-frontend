import type { TradeStatistics } from "@/types";
import type { StatisticsSummaryData } from "@/components/trade/StatisticsSummaryCard";
import type { TradeBalanceData } from "@/components/trade/TradeBalanceChart";
import type { CountryStatsData } from "@/components/trade/CountryStatsTable";
import type { ProductStatsData } from "@/components/trade/ProductStatsGrid";

// 날짜 범위 필터 타입 정의
export type DateRange = {
  from: Date;
  to: Date;
};

// 국가 옵션 타입 정의
export type CountryOption = {
  code: string;
  name: string;
  flag: string;
};

// 기간 옵션 타입 정의
export type PeriodOption = {
  value: string;
  label: string;
  months: number;
};

// 사용 가능한 국가 목록
export const availableCountries: CountryOption[] = [
  { code: "ALL", name: "전체 국가", flag: "🌍" },
  { code: "CN", name: "중국", flag: "🇨🇳" },
  { code: "US", name: "미국", flag: "🇺🇸" },
  { code: "VN", name: "베트남", flag: "🇻🇳" },
  { code: "JP", name: "일본", flag: "🇯🇵" },
  { code: "IN", name: "인도", flag: "🇮🇳" },
  { code: "TW", name: "대만", flag: "🇹🇼" },
  { code: "SA", name: "사우디아라비아", flag: "🇸🇦" },
  { code: "AU", name: "호주", flag: "🇦🇺" },
];

// 기간 옵션 목록
export const periodOptions: PeriodOption[] = [
  { value: "3m", label: "최근 3개월", months: 3 },
  { value: "6m", label: "최근 6개월", months: 6 },
  { value: "12m", label: "최근 12개월", months: 12 },
  { value: "24m", label: "최근 24개월", months: 24 },
];

// 무역 통계 요약 데이터
export const mockStatisticsSummary: StatisticsSummaryData = {
  totalTradeValue: 1328000000000, // 1.328조 달러
  exportValue: 683400000000, // 6,834억 달러
  importValue: 644600000000, // 6,446억 달러
  tradeBalance: 38800000000, // 388억 달러 흑자
  exportGrowth: 8.3,
  importGrowth: 7.1,
  period: "2024년 1-11월",
};

// 월별 무역 수지 추이 데이터
export const mockTradeBalanceChart: TradeBalanceData[] = [
  {
    month: "2024-01",
    export: 54200000000,
    import: 57800000000,
    balance: -3600000000,
  },
  {
    month: "2024-02",
    export: 52100000000,
    import: 52900000000,
    balance: -800000000,
  },
  {
    month: "2024-03",
    export: 60800000000,
    import: 60200000000,
    balance: 600000000,
  },
  {
    month: "2024-04",
    export: 59700000000,
    import: 58100000000,
    balance: 1600000000,
  },
  {
    month: "2024-05",
    export: 61500000000,
    import: 57900000000,
    balance: 3600000000,
  },
  {
    month: "2024-06",
    export: 58900000000,
    import: 56700000000,
    balance: 2200000000,
  },
  {
    month: "2024-07",
    export: 57800000000,
    import: 58900000000,
    balance: -1100000000,
  },
  {
    month: "2024-08",
    export: 59400000000,
    import: 57200000000,
    balance: 2200000000,
  },
  {
    month: "2024-09",
    export: 61900000000,
    import: 58800000000,
    balance: 3100000000,
  },
  {
    month: "2024-10",
    export: 64200000000,
    import: 61400000000,
    balance: 2800000000,
  },
  {
    month: "2024-11",
    export: 65300000000,
    import: 62700000000,
    balance: 2600000000,
  },
];

// 무역 통계 Mock 데이터
export const mockTradeStatistics: TradeStatistics[] = [
  {
    hsCode: "8517.12",
    period: "2024-Q4",
    exportValue: 25800000,
    importValue: 8900000,
    exportGrowthRate: 15.2,
    importGrowthRate: -3.8,
    mainExportCountries: [
      { code: "US", name: "미국", flag: "🇺🇸" },
      { code: "CN", name: "중국", flag: "🇨🇳" },
      { code: "JP", name: "일본", flag: "🇯🇵" },
    ],
    mainImportCountries: [
      { code: "CN", name: "중국", flag: "🇨🇳" },
      { code: "VN", name: "베트남", flag: "🇻🇳" },
      { code: "TH", name: "태국", flag: "🇹🇭" },
    ],
  },
  {
    hsCode: "3304.99",
    period: "2024-Q4",
    exportValue: 156000000,
    importValue: 45000000,
    exportGrowthRate: 28.5,
    importGrowthRate: 12.3,
    mainExportCountries: [
      { code: "CN", name: "중국", flag: "🇨🇳" },
      { code: "US", name: "미국", flag: "🇺🇸" },
      { code: "JP", name: "일본", flag: "🇯🇵" },
    ],
    mainImportCountries: [
      { code: "FR", name: "프랑스", flag: "🇫🇷" },
      { code: "IT", name: "이탈리아", flag: "🇮🇹" },
      { code: "US", name: "미국", flag: "🇺🇸" },
    ],
  },
  {
    hsCode: "8542.31",
    period: "2024-Q4",
    exportValue: 89500000000,
    importValue: 23400000000,
    exportGrowthRate: 8.7,
    importGrowthRate: 15.2,
    mainExportCountries: [
      { code: "CN", name: "중국", flag: "🇨🇳" },
      { code: "US", name: "미국", flag: "🇺🇸" },
      { code: "JP", name: "일본", flag: "🇯🇵" },
    ],
    mainImportCountries: [
      { code: "TW", name: "대만", flag: "🇹🇼" },
      { code: "JP", name: "일본", flag: "🇯🇵" },
      { code: "NL", name: "네덜란드", flag: "🇳🇱" },
    ],
  },
];

// 주요 수출 대상국 통계
export const mockTopExportCountries: CountryStatsData[] = [
  {
    rank: 1,
    countryCode: "CN",
    countryName: "중국",
    flag: "🇨🇳",
    exportValue: 124800000000,
    importValue: 129600000000,
    tradeBalance: -4800000000,
    exportGrowth: 5.2,
    importGrowth: 8.9,
    tradeShare: 20.6,
  },
  {
    rank: 2,
    countryCode: "US",
    countryName: "미국",
    flag: "🇺🇸",
    exportValue: 109200000000,
    importValue: 67800000000,
    tradeBalance: 41400000000,
    exportGrowth: 12.4,
    importGrowth: 6.7,
    tradeShare: 18.1,
  },
  // ... 더 많은 통계 데이터
];

// 주요 수출 품목 통계
export const mockTopExportProducts: ProductStatsData[] = [
  {
    hsCode: "8542",
    productName: "반도체",
    category: "전자제품",
    exportValue: 129800000000,
    importValue: 67200000000,
    tradeBalance: 62600000000,
    exportGrowth: 14.2,
    importGrowth: 8.7,
    globalRank: 1,
    marketShare: 21.8,
  },
  {
    hsCode: "8703",
    productName: "승용차",
    category: "운송기계",
    exportValue: 42600000000,
    importValue: 8900000000,
    tradeBalance: 33700000000,
    exportGrowth: 18.5,
    importGrowth: 12.3,
    globalRank: 2,
    marketShare: 7.2,
  },
  // ... 더 많은 제품 통계
];

// 유틸리티 함수들
export const getTradeStatisticsByHSCode = (
  hsCode: string,
): TradeStatistics | undefined => {
  return mockTradeStatistics.find((stat) => stat.hsCode === hsCode);
};

export const getStatisticsSummary = (): StatisticsSummaryData => {
  return mockStatisticsSummary;
};

export const getTradeBalanceChart = (): TradeBalanceData[] => {
  return mockTradeBalanceChart;
};

export const getTopExportCountries = (
  limit: number = 6,
): CountryStatsData[] => {
  return mockTopExportCountries.slice(0, limit);
};

export const getTopExportProducts = (limit: number = 6): ProductStatsData[] => {
  return mockTopExportProducts.slice(0, limit);
};
