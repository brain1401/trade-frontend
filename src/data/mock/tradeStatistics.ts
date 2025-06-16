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
  {
    rank: 3,
    countryCode: "VN",
    countryName: "베트남",
    flag: "🇻🇳",
    exportValue: 48600000000,
    importValue: 24800000000,
    tradeBalance: 23800000000,
    exportGrowth: 15.3,
    importGrowth: 11.2,
    tradeShare: 8.0,
  },
  {
    rank: 4,
    countryCode: "JP",
    countryName: "일본",
    flag: "🇯🇵",
    exportValue: 29500000000,
    importValue: 51200000000,
    tradeBalance: -21700000000,
    exportGrowth: 3.8,
    importGrowth: 4.2,
    tradeShare: 4.9,
  },
  {
    rank: 5,
    countryCode: "IN",
    countryName: "인도",
    flag: "🇮🇳",
    exportValue: 21700000000,
    importValue: 11800000000,
    tradeBalance: 9900000000,
    exportGrowth: 18.6,
    importGrowth: 14.3,
    tradeShare: 3.6,
  },
  {
    rank: 6,
    countryCode: "TW",
    countryName: "대만",
    flag: "🇹🇼",
    exportValue: 18200000000,
    importValue: 15900000000,
    tradeBalance: 2300000000,
    exportGrowth: 7.1,
    importGrowth: 9.4,
    tradeShare: 3.0,
  },
];

// 주요 수입 대상국 통계
export const mockTopImportCountries: CountryStatsData[] = [
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
    tradeShare: 22.8,
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
    tradeShare: 11.9,
  },
  {
    rank: 3,
    countryCode: "JP",
    countryName: "일본",
    flag: "🇯🇵",
    exportValue: 29500000000,
    importValue: 51200000000,
    tradeBalance: -21700000000,
    exportGrowth: 3.8,
    importGrowth: 4.2,
    tradeShare: 9.0,
  },
  {
    rank: 4,
    countryCode: "SA",
    countryName: "사우디아라비아",
    flag: "🇸🇦",
    exportValue: 6500000000,
    importValue: 36800000000,
    tradeBalance: -30300000000,
    exportGrowth: -2.1,
    importGrowth: 12.8,
    tradeShare: 6.5,
  },
  {
    rank: 5,
    countryCode: "AU",
    countryName: "호주",
    flag: "🇦🇺",
    exportValue: 8900000000,
    importValue: 31200000000,
    tradeBalance: -22300000000,
    exportGrowth: 4.6,
    importGrowth: 8.3,
    tradeShare: 5.5,
  },
  {
    rank: 6,
    countryCode: "VN",
    countryName: "베트남",
    flag: "🇻🇳",
    exportValue: 48600000000,
    importValue: 24800000000,
    tradeBalance: 23800000000,
    exportGrowth: 15.3,
    importGrowth: 11.2,
    tradeShare: 4.4,
  },
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
  {
    hsCode: "8517",
    productName: "스마트폰",
    category: "전자제품",
    exportValue: 31200000000,
    importValue: 18600000000,
    tradeBalance: 12600000000,
    exportGrowth: 8.9,
    importGrowth: -3.2,
    globalRank: 3,
    marketShare: 5.3,
  },
  {
    hsCode: "2710",
    productName: "석유제품",
    category: "화학제품",
    exportValue: 28900000000,
    importValue: 89700000000,
    tradeBalance: -60800000000,
    exportGrowth: 12.6,
    importGrowth: 15.8,
    globalRank: 4,
    marketShare: 4.9,
  },
  {
    hsCode: "8901",
    productName: "선박",
    category: "운송기계",
    exportValue: 26800000000,
    importValue: 2100000000,
    tradeBalance: 24700000000,
    exportGrowth: 22.3,
    importGrowth: 5.7,
    globalRank: 5,
    marketShare: 4.5,
  },
  {
    hsCode: "8471",
    productName: "컴퓨터",
    category: "전자제품",
    exportValue: 18700000000,
    importValue: 12300000000,
    tradeBalance: 6400000000,
    exportGrowth: 6.8,
    importGrowth: 9.2,
    globalRank: 6,
    marketShare: 3.2,
  },
];

// 주요 수입 품목 통계
export const mockTopImportProducts: ProductStatsData[] = [
  {
    hsCode: "2709",
    productName: "원유",
    category: "에너지",
    exportValue: 1200000000,
    importValue: 78900000000,
    tradeBalance: -77700000000,
    exportGrowth: -5.2,
    importGrowth: 18.4,
    globalRank: 1,
    marketShare: 13.9,
  },
  {
    hsCode: "2711",
    productName: "천연가스",
    category: "에너지",
    exportValue: 890000000,
    importValue: 42600000000,
    tradeBalance: -41710000000,
    exportGrowth: 8.3,
    importGrowth: 22.1,
    globalRank: 2,
    marketShare: 7.5,
  },
  {
    hsCode: "8542",
    productName: "반도체",
    category: "전자제품",
    exportValue: 129800000000,
    importValue: 67200000000,
    tradeBalance: 62600000000,
    exportGrowth: 14.2,
    importGrowth: 8.7,
    globalRank: 3,
    marketShare: 11.8,
  },
  {
    hsCode: "8708",
    productName: "자동차 부품",
    category: "운송기계",
    exportValue: 24600000000,
    importValue: 18900000000,
    tradeBalance: 5700000000,
    exportGrowth: 11.2,
    importGrowth: 9.8,
    globalRank: 4,
    marketShare: 3.3,
  },
  {
    hsCode: "1001",
    productName: "곡물",
    category: "농수산",
    exportValue: 240000000,
    importValue: 14800000000,
    tradeBalance: -14560000000,
    exportGrowth: 3.6,
    importGrowth: 12.9,
    globalRank: 5,
    marketShare: 2.6,
  },
  {
    hsCode: "2603",
    productName: "철광석",
    category: "광물",
    exportValue: 180000000,
    importValue: 13200000000,
    tradeBalance: -13020000000,
    exportGrowth: -8.4,
    importGrowth: 6.3,
    globalRank: 6,
    marketShare: 2.3,
  },
];

// 데이터 조회 함수들
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

export const getTopImportCountries = (
  limit: number = 6,
): CountryStatsData[] => {
  return mockTopImportCountries.slice(0, limit);
};

export const getTopExportProducts = (limit: number = 6): ProductStatsData[] => {
  return mockTopExportProducts.slice(0, limit);
};

export const getTopImportProducts = (limit: number = 6): ProductStatsData[] => {
  return mockTopImportProducts.slice(0, limit);
};

// 필터링 기능을 위한 새로운 함수들

// 선택된 국가의 통계 데이터 조회 함수
export const getCountryFilteredData = (
  countryCode: string,
  period: string,
): {
  summary: StatisticsSummaryData;
  balanceChart: TradeBalanceData[];
  exportCountries: CountryStatsData[];
  importCountries: CountryStatsData[];
  exportProducts: ProductStatsData[];
  importProducts: ProductStatsData[];
} => {
  // 기간에 따른 데이터 필터링 (임시 구현)
  const periodMonths =
    periodOptions.find((p) => p.value === period)?.months || 12;
  const filteredBalanceChart = mockTradeBalanceChart.slice(-periodMonths);

  if (countryCode === "ALL") {
    // 전체 국가 데이터 반환
    return {
      summary: mockStatisticsSummary,
      balanceChart: filteredBalanceChart,
      exportCountries: mockTopExportCountries,
      importCountries: mockTopImportCountries,
      exportProducts: mockTopExportProducts,
      importProducts: mockTopImportProducts,
    };
  }

  // 특정 국가로 필터링된 데이터 생성
  const selectedCountry = availableCountries.find(
    (c) => c.code === countryCode,
  );
  const countryStats = [
    ...mockTopExportCountries,
    ...mockTopImportCountries,
  ].find((c) => c.countryCode === countryCode);

  if (!countryStats || !selectedCountry) {
    // 해당 국가 데이터가 없을 경우 기본값 반환
    return {
      summary: {
        ...mockStatisticsSummary,
        totalTradeValue: 0,
        exportValue: 0,
        importValue: 0,
        tradeBalance: 0,
        period: `${selectedCountry?.name || "선택된 국가"} - ${periodOptions.find((p) => p.value === period)?.label || "선택된 기간"}`,
      },
      balanceChart: [],
      exportCountries: [],
      importCountries: [],
      exportProducts: [],
      importProducts: [],
    };
  }

  // 선택된 국가 기준 맞춤형 데이터 생성
  const filteredSummary: StatisticsSummaryData = {
    totalTradeValue: countryStats.exportValue + countryStats.importValue,
    exportValue: countryStats.exportValue,
    importValue: countryStats.importValue,
    tradeBalance: countryStats.tradeBalance,
    exportGrowth: countryStats.exportGrowth,
    importGrowth: countryStats.importGrowth,
    period: `${selectedCountry.name} - ${periodOptions.find((p) => p.value === period)?.label || "선택된 기간"}`,
  };

  // 선택된 국가와 관련된 데이터만 필터링
  const relatedCountries = mockTopExportCountries.filter(
    (c) => c.countryCode !== countryCode,
  );
  const relatedImportCountries = mockTopImportCountries.filter(
    (c) => c.countryCode !== countryCode,
  );

  return {
    summary: filteredSummary,
    balanceChart: filteredBalanceChart,
    exportCountries: relatedCountries,
    importCountries: relatedImportCountries,
    exportProducts: mockTopExportProducts, // 품목은 국가 필터링과 무관하게 표시
    importProducts: mockTopImportProducts,
  };
};

// 날짜 범위 기반 필터링 함수
export const getDateRangeFilteredData = (
  dateRange: DateRange,
): TradeBalanceData[] => {
  return mockTradeBalanceChart.filter((data) => {
    const dataDate = new Date(data.month + "-01");
    return dataDate >= dateRange.from && dataDate <= dateRange.to;
  });
};
