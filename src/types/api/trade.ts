// 무역 정보 API 요청/응답 타입들

// 한국 관세청 API 관련 타입들
export type KoreaCustomsExchangeRate = {
  currency: string;
  currencyCode: string;
  rate: number;
  change: number;
  changePercent: number;
  date: string;
  source: "korea_customs";
};

export type ExchangeRateRequest = {
  currencies?: string[];
  date?: string;
};

export type ExchangeRateResponse = {
  rates: KoreaCustomsExchangeRate[];
  lastUpdated: string;
  source: string;
};

// 수출입 통계 API
export type TradeStatisticsRequest = {
  hsCode?: string;
  country?: string;
  startDate: string;
  endDate: string;
  tradeType: "import" | "export" | "both";
  page?: number;
  limit?: number;
};

export type TradeStatisticsResponse = {
  statistics: TradeStatistic[];
  summary: TradeSummary;
  pagination: PaginationInfo;
};

export type TradeStatistic = {
  hsCode: string;
  hsCodeName: string;
  country: string;
  countryCode: string;
  year: number;
  month: number;
  importValue: number;
  exportValue: number;
  importQuantity: number;
  exportQuantity: number;
  unit: string;
  tradeBalance: number;
};

export type TradeSummary = {
  totalImportValue: number;
  totalExportValue: number;
  tradeBalance: number;
  topImportCountries: CountryTrade[];
  topExportCountries: CountryTrade[];
  monthlyTrend: MonthlyTrend[];
};

export type CountryTrade = {
  country: string;
  countryCode: string;
  value: number;
  percentage: number;
};

export type MonthlyTrend = {
  year: number;
  month: number;
  importValue: number;
  exportValue: number;
  tradeBalance: number;
};

// 규제 정보 API
export type RegulationSearchRequest = {
  keyword?: string;
  category?: RegulationCategory;
  country?: string;
  hsCode?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

export type RegulationCategory =
  | "import_requirement"
  | "export_requirement"
  | "tariff"
  | "quota"
  | "certification"
  | "general";

export type RegulationSearchResponse = {
  regulations: Regulation[];
  totalCount: number;
  pagination: PaginationInfo;
  facets: RegulationFacets;
};

export type Regulation = {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: RegulationCategory;
  applicableCountries: string[];
  applicableHsCodes: string[];
  effectiveDate: string;
  expiryDate?: string;
  authority: string;
  sourceUrl: string;
  lastUpdated: string;
  tags: string[];
  aiSummary?: RegulationAISummary;
};

export type RegulationAISummary = {
  keyRequirements: string[];
  complianceSteps: string[];
  requiredDocuments: string[];
  estimatedCost?: string;
  processingTime?: string;
  difficultyLevel: "low" | "medium" | "high";
};

export type RegulationFacets = {
  categories: FacetCount[];
  countries: FacetCount[];
  authorities: FacetCount[];
};

export type FacetCount = {
  key: string;
  label: string;
  count: number;
};

// 화물 추적 API (한국 관세청)
export type CargoTrackingRequest = {
  trackingNumber: string;
  type: "bl_number" | "cargo_number";
};

export type CargoTrackingResponse = {
  trackingInfo: CargoTrackingInfo;
  statusHistory: CargoStatus[];
  estimatedCompletion?: string;
};

export type CargoTrackingInfo = {
  trackingNumber: string;
  blNumber?: string;
  cargoNumber?: string;
  currentStatus: CargoStatusType;
  vessel?: string;
  portOfLoading?: string;
  portOfDischarge?: string;
  consignee?: string;
  goods?: string;
  declarationNumber?: string;
};

export type CargoStatusType =
  | "arrival_notice"
  | "customs_clearance_pending"
  | "inspection_required"
  | "customs_clearance_completed"
  | "delivery_ready"
  | "delivered";

export type CargoStatus = {
  status: CargoStatusType;
  statusDescription: string;
  timestamp: string;
  location?: string;
  remarks?: string;
};

// 공통 타입들
export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
