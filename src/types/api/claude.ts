// Claude AI API 관련 타입들

// 의도 감지 (Intent Detection)
export type IntentDetectionRequest = {
  query: string;
  context?: string;
  userHistory?: string[];
};

export type IntentDetectionResponse = {
  intent: DetectedIntent;
  confidence: number;
  parameters: Record<string, any>;
  suggestions: string[];
  routingInfo: RoutingInfo;
};

export type DetectedIntent =
  | "hscode_analysis"
  | "cargo_tracking"
  | "regulation_search"
  | "trade_statistics"
  | "general_search"
  | "news_search";

export type RoutingInfo = {
  targetRoute: string;
  parameters: Record<string, string>;
  autoRedirect: boolean;
};

// HS Code 분석 관련
export type HSCodeAnalysisRequest = {
  sessionId?: string;
  description: string;
  images?: AnalysisImage[];
  additionalInfo?: Record<string, any>;
  context?: AnalysisContext;
};

export type AnalysisImage = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  description?: string;
};

export type AnalysisContext = {
  previousAnalyses?: string[];
  userPreferences?: Record<string, any>;
  businessInfo?: {
    industry?: string;
    tradingCountries?: string[];
    experienceLevel?: "beginner" | "intermediate" | "expert";
  };
};

export type HSCodeAnalysisResponse = {
  sessionId: string;
  status: AnalysisStatus;
  result?: AnalysisResult;
  smartQuestions?: SmartQuestion[];
  progress?: AnalysisProgress;
  error?: string;
};

export type AnalysisStatus =
  | "initializing"
  | "analyzing_text"
  | "analyzing_images"
  | "generating_questions"
  | "awaiting_user_input"
  | "completing_analysis"
  | "completed"
  | "error";

export type AnalysisResult = {
  recommendedHSCode: string;
  confidence: number;
  reasoning: string[];
  alternativeHSCodes: AlternativeHSCode[];
  complianceInfo: ComplianceInfo;
  tradeInfo: TradeInfo;
  sources: TrustedSource[];
};

export type AlternativeHSCode = {
  hsCode: string;
  confidence: number;
  reasoning: string;
  applicableScenarios: string[];
};

export type ComplianceInfo = {
  importRequirements: RequirementItem[];
  exportRequirements: RequirementItem[];
  certifications: CertificationItem[];
  restrictions: RestrictionItem[];
  tariffInfo: TariffInfo;
};

export type RequirementItem = {
  type: string;
  description: string;
  authority: string;
  isRequired: boolean;
  documentation: string[];
  estimatedTime?: string;
  estimatedCost?: string;
};

export type CertificationItem = {
  name: string;
  authority: string;
  description: string;
  validityPeriod?: string;
  renewalRequired: boolean;
  costRange?: string;
};

export type RestrictionItem = {
  type: "prohibition" | "quota" | "license_required" | "special_condition";
  description: string;
  applicableCountries: string[];
  exceptions?: string[];
  contact?: string;
};

export type TariffInfo = {
  generalRate: number;
  preferentialRates: PreferentialRate[];
  additionalTaxes: AdditionalTax[];
  currency: string;
  lastUpdated: string;
};

export type PreferentialRate = {
  country: string;
  rate: number;
  agreement: string;
  conditions?: string[];
};

export type AdditionalTax = {
  type: string;
  rate: number;
  description: string;
};

export type TradeInfo = {
  majorExportCountries: CountryTradeInfo[];
  majorImportCountries: CountryTradeInfo[];
  recentTrends: TradeTrend[];
  marketInsights: string[];
};

export type CountryTradeInfo = {
  country: string;
  countryCode: string;
  volume: number;
  value: number;
  marketShare: number;
  trend: "increasing" | "decreasing" | "stable";
};

export type TradeTrend = {
  period: string;
  description: string;
  impact: "positive" | "negative" | "neutral";
  factors: string[];
};

// 스마트 질문 시스템
export type SmartQuestion = {
  id: string;
  type: QuestionType;
  question: string;
  options?: QuestionOption[];
  required: boolean;
  helpText?: string;
  category: string;
};

export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "text_input"
  | "number_input"
  | "image_upload"
  | "yes_no";

export type QuestionOption = {
  value: string;
  label: string;
  description?: string;
};

export type SmartQuestionResponse = {
  questionId: string;
  answer: string | string[] | number | boolean;
  additionalInfo?: string;
};

export type AnalysisProgress = {
  currentStep: number;
  totalSteps: number;
  stepDescription: string;
  timeElapsed: number;
  estimatedTimeRemaining?: number;
};

// 신뢰할 수 있는 소스
export type TrustedSource = {
  id: string;
  name: string;
  url: string;
  type: SourceType;
  credibilityScore: number;
  lastVerified: string;
  excerpt?: string;
};

export type SourceType =
  | "korea_customs"
  | "government_official"
  | "legal_document"
  | "industry_standard"
  | "international_organization"
  | "verified_database";

// 이미지 분석
export type ImageAnalysisRequest = {
  imageId: string;
  analysisType:
    | "product_identification"
    | "packaging_analysis"
    | "label_reading";
  additionalContext?: string;
};

export type ImageAnalysisResponse = {
  imageId: string;
  extractedText: string[];
  identifiedProducts: IdentifiedProduct[];
  visualFeatures: VisualFeature[];
  suggestions: string[];
  confidence: number;
};

export type IdentifiedProduct = {
  name: string;
  category: string;
  confidence: number;
  boundingBox?: BoundingBox;
  attributes: Record<string, string>;
};

export type VisualFeature = {
  type: string;
  value: string;
  confidence: number;
  location?: BoundingBox;
};

export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// 세션 관리
export type AnalysisSession = {
  sessionId: string;
  userId?: string;
  status: AnalysisStatus;
  startedAt: string;
  lastActivity: string;
  description: string;
  images: AnalysisImage[];
  questionResponses: SmartQuestionResponse[];
  result?: AnalysisResult;
  metadata: SessionMetadata;
};

export type SessionMetadata = {
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  language: string;
  timezone: string;
};
