import type { ExchangeRate, TradeStatistics, CountryInfo } from "@/types";

// 환율 정보 Mock 데이터
export const mockExchangeRates: ExchangeRate[] = [
  {
    currency: "USD",
    rate: 1359.4,
    change: -2.78,
    symbol: "$",
    lastUpdated: "2025-01-12T09:00:00Z",
  },
  {
    currency: "EUR",
    rate: 1421.5,
    change: -1.52,
    symbol: "€",
    lastUpdated: "2025-01-12T09:00:00Z",
  },
  {
    currency: "JPY",
    rate: 9.43,
    change: -0.08,
    symbol: "¥",
    lastUpdated: "2025-01-12T09:00:00Z",
  },
  {
    currency: "CNY",
    rate: 188.2,
    change: -0.85,
    symbol: "¥",
    lastUpdated: "2025-01-12T09:00:00Z",
  },
];

// 국가 정보 Mock 데이터
export const mockCountries: CountryInfo[] = [
  { code: "US", name: "미국", flag: "🇺🇸" },
  { code: "CN", name: "중국", flag: "🇨🇳" },
  { code: "JP", name: "일본", flag: "🇯🇵" },
  { code: "DE", name: "독일", flag: "🇩🇪" },
  { code: "GB", name: "영국", flag: "🇬🇧" },
  { code: "VN", name: "베트남", flag: "🇻🇳" },
  { code: "TH", name: "태국", flag: "🇹🇭" },
  { code: "IN", name: "인도", flag: "🇮🇳" },
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

// 유틸리티 함수들
export const getExchangeRateByCurrency = (
  currency: string,
): ExchangeRate | undefined => {
  return mockExchangeRates.find((rate) => rate.currency === currency);
};

export const getTradeStatisticsByHSCode = (
  hsCode: string,
): TradeStatistics | undefined => {
  return mockTradeStatistics.find((stat) => stat.hsCode === hsCode);
};

export const getCountryByCode = (code: string): CountryInfo | undefined => {
  return mockCountries.find((country) => country.code === code);
};

export const getTopExportCountries = (limit: number = 5): CountryInfo[] => {
  // 실제로는 무역 통계를 기반으로 계산해야 하지만, Mock에서는 임의로 반환
  return mockCountries.slice(0, limit);
};

export const getTopImportCountries = (limit: number = 5): CountryInfo[] => {
  // 실제로는 무역 통계를 기반으로 계산해야 하지만, Mock에서는 임의로 반환
  return mockCountries.slice(2, 2 + limit);
};
