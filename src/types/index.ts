// 공통 타입 정의
export type ContentCardProps = {
  title: string;
  titleRightElement?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export type QuickLinkItem = {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
  isExternal?: boolean;
};

export type FilterOption = {
  value: string;
  label: string;
  count?: number;
};

export type NewsCategory = "규제" | "관세" | "무역" | "기타";

// 무역 뉴스 관련 타입
export type TradeNews = {
  uuid: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  published_at: string;
  date: string;
  category: NewsCategory;
  tags: string[];
  importance: "high" | "medium" | "low";
  hscode?: string;
  type: string;
  url: string;
};

export type HSCodeNews = {
  uuid: string;
  hscode: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  bookmarked: boolean;
  content: string;
  category: NewsCategory;
  publishedAt: string;
  impact?: "high" | "medium" | "low";
  url: string;
};

// 검색 관련 타입
export type PopularKeyword = string;

export type RecentSearchItem = {
  hscode: string;
  text: string;
  timestamp?: string;
};

export type SearchResult = {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  relevance: number;
  category: string;
};

// 무역 관련 타입
export type ExchangeRate = {
  currency: string;
  currencyName?: string;
  symbol?: string;
  rate: number;
  change: number;
  changePercent?: number;
  lastUpdated: string;
};

export type TradeStatistics = {
  hsCode?: string;
  country?: string;
  exportValue: number;
  importValue: number;
  tradeBalance?: number;
  exportGrowthRate: number;
  importGrowthRate: number;
  growthRate?: number;
  period: string;
  mainExportCountries?: CountryInfo[];
  mainImportCountries?: CountryInfo[];
};

export type CountryInfo = {
  code: string;
  name: string;
  flag?: string;
};

// 사용자 관련 타입
export type User = {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: "trader" | "analyst" | "admin";
  avatar?: string;
  preferences: UserPreferences;
  stats: UserStats;
  createdAt: string;
  lastLoginAt: string;
};

export type UserPreferences = {
  notifications: {
    browser: boolean;
    email: boolean;
    sms: boolean;
  };
  language: "ko" | "en";
  timezone: string;
  defaultView: string;
};

export type UserStats = {
  totalAnalyses: number;
  totalBookmarks: number;
  totalSearches: number;
  accuracyRate: number;
  lastActiveDate: string;
};

// 추적 관련 타입
export type TrackingStatus =
  | "pending"
  | "current"
  | "in_transit"
  | "customs"
  | "completed"
  | "delayed"
  | "error";

export type TimelineStep = {
  step: number;
  title: string;
  description: string;
  status: TrackingStatus;
  timestamp?: string;
  location: string;
  estimatedTime?: string;
};

// HS Code 관련 타입
export type HSCodeAnalysis = {
  id: string;
  title: string;
  description: string;
  hsCode: string;
  confidence: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
};

// 대시보드 관련 타입
export type FeedItem = {
  id: string;
  title: string;
  summary: string;
  importance: "high" | "medium" | "low";
  timestamp: string;
  changes: string[];
  source: string;
  category: string;
};

export type Bookmark = {
  id: string;
  title: string;
  type: "hscode" | "tracking" | "regulation";
  description: string;
  hsCode?: string;
  trackingNumber?: string;
  url?: string;
  isMonitoring: boolean;
  createdAt: string;
  lastChecked?: string;
  changes: number;
};

// HS Code 최신 정보 타입
export type HSCodeInfo = {
  uuid: string;
  hsCode: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  type: "regulation" | "tariff" | "certification" | "news";
  source: string;
  published_at: string;
  tags: string[];
  importance: "high" | "medium" | "low";
  effectiveDate?: string;
  relatedRegulations?: string[];
  url: string;
};

// 알림 관련 타입
export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: "hscode" | "tracking" | "system" | "regulation";
  importance: "high" | "medium" | "low";
  timestamp: string;
  isRead: boolean;
  data?: any;
  actions?: NotificationAction[];
};

export type NotificationAction = {
  label: string;
  action: string;
  style?: "primary" | "secondary" | "danger";
};
