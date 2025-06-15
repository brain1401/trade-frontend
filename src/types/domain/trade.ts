// 환율 정보 타입
export type ExchangeRate = {
  currency: string;
  rate: number;
  change: number;
  symbol: string;
  lastUpdated?: string;
};

// 국가 정보 타입
export type CountryInfo = {
  code: string;
  name: string;
  flag?: string;
};

// 무역 통계 타입
export type TradeStatistics = {
  hsCode: string;
  period: string;
  exportValue: number;
  importValue: number;
  exportGrowthRate: number;
  importGrowthRate: number;
  mainExportCountries: CountryInfo[];
  mainImportCountries: CountryInfo[];
};

// 무역 데이터 요청 타입
export type TradeDataRequest = {
  hsCode?: string;
  country?: string;
  period: "monthly" | "quarterly" | "yearly";
  startDate: string;
  endDate: string;
};
