// AI 관련 비즈니스 로직 타입들

// AI 분석 기능별 설정
export type AIFeature =
  | "intent_detection"
  | "hscode_analysis"
  | "smart_questions"
  | "image_analysis"
  | "source_verification"
  | "news_summarization"
  | "business_impact_analysis";

export type AIConfiguration = {
  feature: AIFeature;
  enabled: boolean;
  confidenceThreshold: number;
  maxRetries: number;
  timeoutMs: number;
  modelVersion?: string;
  parameters?: Record<string, any>;
};

// AI 성능 지표
export type AIPerformanceMetrics = {
  feature: AIFeature;
  totalRequests: number;
  successfulRequests: number;
  averageResponseTime: number;
  averageConfidence: number;
  userSatisfactionScore: number;
  lastUpdated: string;
};

// AI 학습 및 개선
export type UserFeedback = {
  sessionId: string;
  feature: AIFeature;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  isAccurate: boolean;
  suggestions?: string[];
  timestamp: string;
  userId?: string;
};

export type AIModelUpdate = {
  version: string;
  feature: AIFeature;
  improvements: string[];
  releaseDate: string;
  migrationRequired: boolean;
  backwardCompatible: boolean;
};

// 지능형 캐싱
export type IntelligentCache = {
  key: string;
  feature: AIFeature;
  data: any;
  confidence: number;
  accessCount: number;
  lastAccessed: string;
  expiryDate: string;
  tags: string[];
};

// AI 사용 통계
export type AIUsageStats = {
  userId?: string;
  period: "daily" | "weekly" | "monthly";
  featureUsage: FeatureUsage[];
  totalTokensUsed: number;
  averageSessionDuration: number;
  mostUsedFeatures: AIFeature[];
  peakUsageHours: number[];
};

export type FeatureUsage = {
  feature: AIFeature;
  requestCount: number;
  successRate: number;
  averageConfidence: number;
  userSatisfaction: number;
};

// AI 에러 및 로깅
export type AIError = {
  id: string;
  feature: AIFeature;
  errorCode: string;
  message: string;
  context: Record<string, any>;
  timestamp: string;
  sessionId?: string;
  userId?: string;
  resolved: boolean;
  severity: "low" | "medium" | "high" | "critical";
};

// 컨텍스트 관리
export type ConversationContext = {
  sessionId: string;
  userId?: string;
  history: ContextMessage[];
  currentIntent?: string;
  entities: ExtractedEntity[];
  preferences: UserPreferences;
  businessContext?: BusinessContext;
};

export type ContextMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
};

// UI용 채팅 메시지 타입 (ContextMessage 확장)
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: ChatAttachment[];
  metadata?: Record<string, any>;
};

export type ChatAttachment = {
  type: "image" | "document";
  url: string;
  name: string;
  size?: number;
  mimeType?: string;
};

export type ExtractedEntity = {
  type: EntityType;
  value: string;
  confidence: number;
  source: "user_input" | "ai_inference" | "context";
};

export type EntityType =
  | "hscode"
  | "product_name"
  | "country"
  | "company"
  | "date"
  | "amount"
  | "currency"
  | "regulation_number";

export type UserPreferences = {
  language: "ko" | "en";
  timezone: string;
  experienceLevel: "beginner" | "intermediate" | "expert";
  preferredDetailLevel: "basic" | "detailed" | "comprehensive";
  industryFocus?: string[];
  tradingCountries?: string[];
};

export type BusinessContext = {
  industry: string;
  companySize: "small" | "medium" | "large";
  tradingExperience: number; // years
  mainProducts: string[];
  targetMarkets: string[];
  complianceRequirements: string[];
};
