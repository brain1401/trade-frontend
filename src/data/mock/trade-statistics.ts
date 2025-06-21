import type { TradeStatistics } from "@/types";
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
 * 무역 통계 요약 정보의 구조
 *
 * 특정 기간의 전체 무역 실적을 요약한 핵심 지표들을 포함합니다.
 * 대시보드나 보고서의 요약 섹션에서 사용됩니다.
 */
export type StatisticsSummaryData = {
  /** 총 무역액 (수출+수입, 달러) */
  totalTradeValue: number;
  /** 총 수출액 (달러) */
  exportValue: number;
  /** 총 수입액 (달러) */
  importValue: number;
  /** 무역수지 (달러) */
  tradeBalance: number;
  /** 수출 증가율 (%) */
  exportGrowth: number;
  /** 수입 증가율 (%) */
  importGrowth: number;
  /** 통계 기준 기간 */
  period: string;
};

/**
 * 무역 통계 요약 Mock 데이터
 *
 * 2024년 1-11월 한국의 전체 무역 실적 요약 정보입니다.
 * 총 무역규모, 수출입 현황, 성장률 등 핵심 지표를 포함합니다.
 *
 * @example
 * ```typescript
 * const summary = mockStatisticsSummary;
 * console.log(`무역수지: ${summary.tradeBalance > 0 ? '흑자' : '적자'}`);
 * console.log(`수출 증가율: ${summary.exportGrowth}%`);
 * ```
 */
export const mockStatisticsSummary: StatisticsSummaryData = {
  totalTradeValue: 1328000000000, // 1.328조 달러
  exportValue: 683400000000, // 6,834억 달러
  importValue: 644600000000, // 6,446억 달러
  tradeBalance: 38800000000, // 388억 달러 흑자
  exportGrowth: 8.3,
  importGrowth: 7.1,
  period: "2024년 1-11월",
};

/**
 * 월별 무역 수지 추이 Mock 데이터
 *
 * 2024년 각 월별 수출입 실적과 무역수지 변화를 보여주는 시계열 데이터입니다.
 * 무역수지 차트 생성이나 월별 트렌드 분석에 사용됩니다.
 *
 * @example
 * ```typescript
 * const chartData = mockTradeBalanceChart;
 * const surplusMonths = chartData.filter(data => data.balance > 0);
 * console.log(`흑자 달: ${surplusMonths.length}개월`);
 *
 * // 차트 라이브러리에서 사용
 * const chartConfig = {
 *   data: chartData,
 *   xField: 'month',
 *   yField: 'balance'
 * };
 * ```
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
 *
 * @example
 * ```typescript
 * const smartphoneStats = mockTradeStatistics.find(stat => stat.hsCode === "8517.12");
 * if (smartphoneStats) {
 *   console.log(`스마트폰 수출액: $${smartphoneStats.exportValue.toLocaleString()}`);
 *   console.log(`주요 수출국: ${smartphoneStats.mainExportCountries.map(c => c.name).join(", ")}`);
 * }
 * ```
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
];

/**
 * HS Code별 무역 통계 조회
 *
 * 특정 HS Code에 해당하는 무역 통계 정보를 반환합니다.
 * 품목별 상세 분석 페이지에서 사용됩니다.
 *
 * @param hsCode - 조회할 HS Code (예: "8517.12")
 * @returns 해당 HS Code의 무역 통계, 없으면 undefined
 *
 * @example
 * ```typescript
 * const stats = getTradeStatisticsByHSCode("8517.12");
 * if (stats) {
 *   const tradeBalance = stats.exportValue - stats.importValue;
 *   console.log(`HS Code 8517.12 무역수지: $${tradeBalance.toLocaleString()}`);
 * }
 * ```
 */
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
