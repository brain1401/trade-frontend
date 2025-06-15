// 뉴스 API 요청/응답 타입들

export type NewsCategory =
  | "regulations"
  | "market"
  | "industry"
  | "policy"
  | "all";

export type NewsListRequest = {
  category?: NewsCategory;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
};

export type NewsListResponse = {
  articles: NewsArticle[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type NewsArticle = {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  source: string;
  sourceUrl: string;
  author?: string;
  publishedAt: string;
  updatedAt: string;
  imageUrl?: string;
  tags: string[];
  relatedHsCodes: string[];
  businessImpact: BusinessImpactLevel;
  aiSummary?: AISummary;
};

export type BusinessImpactLevel = "low" | "medium" | "high" | "critical";

export type AISummary = {
  keyPoints: string[];
  businessImplications: string[];
  affectedIndustries: string[];
  actionItems: string[];
  confidenceScore: number;
  sourceCredibility: number;
};

export type NewsDetailRequest = {
  newsId: string;
};

export type NewsDetailResponse = {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
  aiAnalysis: AISummary;
};

export type NewsSubscriptionRequest = {
  categories: NewsCategory[];
  frequency: "realtime" | "daily" | "weekly";
  email: string;
  keywords?: string[];
};

export type NewsSubscriptionResponse = {
  subscriptionId: string;
  status: "active" | "pending" | "inactive";
  preferences: NewsSubscriptionRequest;
};
