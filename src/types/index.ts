// 공통 기본 타입
export type ImportanceLevel = "high" | "medium" | "low";
export type NewsCategory = "무역" | "규제" | "관세" | "인증";

// 국가 정보 타입
export type CountryInfo = {
  code: string;
  name: string;
  flag: string;
};

// 환율 관련 타입
export type ExchangeRate = {
  currency: string;
  currencyName: string;
  rate: number;
  change: number;
  symbol: string;
  lastUpdated: string;
};

// 뉴스 관련 타입
export type BaseNews = {
  uuid: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  category: NewsCategory;
  tags: string[];
  importance: ImportanceLevel;
  date: string;
  url: string;
};

export type TradeNews = BaseNews & {
  published_at: string;
  type: "규제" | "뉴스" | "관세";
};

export type HSCodeNews = BaseNews & {
  hscode: string;
  publishedAt: string;
  bookmarked: boolean;
};

export type HSCodeInfo = BaseNews & {
  hsCode: string;
  type: "tariff" | "certification" | "regulation";
  published_at: string;
  effectiveDate: string;
  relatedRegulations: string[];
};

// 검색 관련 타입
export type PopularKeyword = {
  keyword: string;
  searchCount: number;
  trending: boolean;
};

export type RecentSearchItem = {
  text: string;
  hscode: string;
  searchedAt: Date;
};

export type SearchResult = {
  id: string;
  title: string;
  description: string;
  type: "hscode" | "regulation" | "news";
  relevanceScore: number;
  highlightedText: string;
  metadata: Record<string, any>;
};

// HS Code 분석 관련 타입
export type AnalysisMessage = {
  id: string;
  type: "user" | "assistant" | "smart_question";
  content: string;
  timestamp: string;
  options?: string[];
  analysisResult?: {
    hscode: string;
    confidence: number;
    category: string;
    description: string;
  };
};

// 화물 추적 관련 타입
export type TrackingStatus = "completed" | "current" | "pending";

export type TimelineStep = {
  step: number;
  title: string;
  description: string;
  status: TrackingStatus;
  timestamp?: string;
  estimatedTime?: string;
  location: string;
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

// 사용자 관련 타입
export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  createdAt: string;
  lastLoginAt: string;
  preferences: UserPreferences;
  stats: UserStats;
};

export type UserPreferences = {
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    browser: boolean;
    sms: boolean;
  };
  defaultView: string;
};

export type UserStats = {
  analysisCount: number;
  bookmarkCount: number;
  searchCount: number;
  accuracyRate: number;
  lastActiveDate: string;
  analysisHistory: any[];
};
