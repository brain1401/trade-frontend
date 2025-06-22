import type {
  TradeStatistics,
  DetailedTradeStatistics,
  TradeStatisticsSummary,
  TimeSeriesTradeStats,
} from "@/types/trade";
import { getCountriesByCodes } from "@/data/common";

/**
 * 월별 무역 수지 데이터의 구조
 *
 * 특정 월의 수출입 실적과 무역수지를 나타내는 데이터 타입입니다.
 * 차트 및 통계 분석에 사용됩니다.
 */
export type TradeBalanceData = {
  /** 기준 월 (YYYY-MM 형식) */
  month: string;
  /** 수출액 (달러) */
  export: number;
  /** 수입액 (달러) */
  import: number;
  /** 무역수지 (수출-수입, 달러) */
  balance: number;
};

/**
 * 무역 통계 요약 Mock 데이터
 *
 * 2024년 1-11월 한국의 전체 무역 실적 요약 정보입니다.
 * 총 무역규모, 수출입 현황, 성장률 등 핵심 지표를 포함합니다.
 */
export const mockTradeStatisticsSummary: TradeStatisticsSummary = {
  period: "2024년 1-11월",
  overallTrade: {
    totalExport: 683400000000, // 6,834억 달러
    totalImport: 644600000000, // 6,446억 달러
    tradeBalance: 38800000000, // 388억 달러 흑자
    tradeVolume: 1328000000000, // 1.328조 달러
  },
  growthRates: {
    exportGrowth: 8.3,
    importGrowth: 7.1,
    volumeGrowth: 7.7,
  },
  topExportItems: [
    {
      hsCode: "8542.31",
      itemName: "반도체",
      value: 89500000000,
      share: 13.1,
      growthRate: 8.7,
    },
    {
      hsCode: "8703.23",
      itemName: "자동차",
      value: 65200000000,
      share: 9.5,
      growthRate: 12.4,
    },
    {
      hsCode: "8517.12",
      itemName: "스마트폰",
      value: 45800000000,
      share: 6.7,
      growthRate: 15.2,
    },
  ],
  topImportItems: [
    {
      hsCode: "2709.00",
      itemName: "원유",
      value: 89500000000,
      share: 13.9,
      growthRate: 5.2,
    },
    {
      hsCode: "8542.39",
      itemName: "집적회로",
      value: 67200000000,
      share: 10.4,
      growthRate: 18.7,
    },
    {
      hsCode: "8471.30",
      itemName: "디지털처리장치",
      value: 34500000000,
      share: 5.4,
      growthRate: 22.1,
    },
  ],
  majorTradingPartners: [
    {
      country: getCountriesByCodes(["CN"])[0],
      exportStats: {
        value: 124800000000,
        share: 18.3,
        growthRate: 6.8,
        topItems: [
          {
            hsCode: "8542.31",
            itemName: "반도체",
            value: 34500000000,
            share: 27.6,
          },
          {
            hsCode: "2710.19",
            itemName: "석유제품",
            value: 12300000000,
            share: 9.9,
          },
        ],
      },
      importStats: {
        value: 145600000000,
        share: 22.6,
        growthRate: 8.9,
        topItems: [
          {
            hsCode: "8471.30",
            itemName: "디지털처리장치",
            value: 23400000000,
            share: 16.1,
          },
          {
            hsCode: "8542.39",
            itemName: "집적회로",
            value: 18700000000,
            share: 12.8,
          },
        ],
      },
      tradeBalance: -20800000000,
      tariffInfo: {
        averageRate: "8.2%",
        applicableAgreements: ["한중FTA", "RCEP"],
      },
    },
  ],
};

/**
 * 월별 무역 수지 추이 Mock 데이터
 *
 * 2024년 각 월별 수출입 실적과 무역수지 변화를 보여주는 시계열 데이터입니다.
 * 무역수지 차트 생성이나 월별 트렌드 분석에 사용됩니다.
 */
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

/**
 * HS Code별 무역 통계 Mock 데이터
 *
 * 주요 HS Code 품목들의 수출입 실적과 성장률, 주요 거래국 정보를 제공합니다.
 * 특정 품목의 무역 동향 분석에 활용됩니다.
 */
export const mockTradeStatistics: TradeStatistics[] = [
  {
    hsCode: "8517.12",
    period: "2024-Q4",
    exportValue: 25800000,
    importValue: 8900000,
    exportGrowthRate: 15.2,
    importGrowthRate: -3.8,
    mainExportCountries: getCountriesByCodes(["US", "CN", "JP"]),
    mainImportCountries: getCountriesByCodes(["CN", "VN", "TH"]),
  },
  {
    hsCode: "3304.99",
    period: "2024-Q4",
    exportValue: 156000000,
    importValue: 45000000,
    exportGrowthRate: 28.5,
    importGrowthRate: 12.3,
    mainExportCountries: getCountriesByCodes(["CN", "US", "JP"]),
    mainImportCountries: getCountriesByCodes(["FR", "IT", "US"]),
  },
  {
    hsCode: "8542.31",
    period: "2024-Q4",
    exportValue: 89500000000,
    importValue: 23400000000,
    exportGrowthRate: 8.7,
    importGrowthRate: 15.2,
    mainExportCountries: getCountriesByCodes(["CN", "US", "JP"]),
    mainImportCountries: getCountriesByCodes(["TW", "JP", "NL"]),
  },
  {
    hsCode: "9018.90",
    period: "2024-Q4",
    exportValue: 45600000,
    importValue: 23100000,
    exportGrowthRate: 12.8,
    importGrowthRate: 8.9,
    mainExportCountries: getCountriesByCodes(["US", "DE", "JP"]),
    mainImportCountries: getCountriesByCodes(["DE", "US", "CH"]),
  },
  {
    hsCode: "6203.42",
    period: "2024-Q4",
    exportValue: 234000000,
    importValue: 89500000,
    exportGrowthRate: 18.7,
    importGrowthRate: 5.4,
    mainExportCountries: getCountriesByCodes(["US", "EU", "JP"]),
    mainImportCountries: getCountriesByCodes(["VN", "BD", "IN"]),
  },
];

/**
 * 시계열 무역 통계 Mock 데이터
 */
export const mockTimeSeriesStats: TimeSeriesTradeStats[] = [
  {
    hsCode: "8517.12",
    dataPoints: [
      {
        period: "2024-Q1",
        exportValue: 22400000,
        importValue: 9200000,
        tradeBalance: 13200000,
        exportGrowthRate: 12.5,
        importGrowthRate: -2.1,
      },
      {
        period: "2024-Q2",
        exportValue: 24100000,
        importValue: 8700000,
        tradeBalance: 15400000,
        exportGrowthRate: 7.6,
        importGrowthRate: -5.4,
      },
      {
        period: "2024-Q3",
        exportValue: 23900000,
        importValue: 9100000,
        tradeBalance: 14800000,
        exportGrowthRate: -0.8,
        importGrowthRate: 4.6,
      },
      {
        period: "2024-Q4",
        exportValue: 25800000,
        importValue: 8900000,
        tradeBalance: 16900000,
        exportGrowthRate: 7.9,
        importGrowthRate: -2.2,
      },
    ],
    trendAnalysis: {
      exportTrend: "증가",
      importTrend: "감소",
      seasonality: true,
      majorFactors: ["5G 스마트폰 수요 증가", "중국 제조업체 경쟁 심화"],
    },
  },
];

/**
 * HS Code별 무역 통계 조회
 */
export const getTradeStatisticsByHSCode = (
  hsCode: string,
): TradeStatistics | undefined => {
  return mockTradeStatistics.find((stat) => stat.hsCode === hsCode);
};

/**
 * 무역 통계 요약 정보 조회
 */
export const getTradeStatisticsSummary = (): TradeStatisticsSummary => {
  return mockTradeStatisticsSummary;
};

/**
 * 월별 무역 수지 차트 데이터 조회
 */
export const getTradeBalanceChart = (): TradeBalanceData[] => {
  return mockTradeBalanceChart;
};

/**
 * 시계열 무역 통계 조회
 */
export const getTimeSeriesStatsByHSCode = (
  hsCode: string,
): TimeSeriesTradeStats | undefined => {
  return mockTimeSeriesStats.find((stat) => stat.hsCode === hsCode);
};
