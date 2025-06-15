// HS Code 분석 세션 상태
export type AnalysisSessionStatus =
  | "initializing"
  | "awaiting_questions"
  | "processing"
  | "completed"
  | "error"
  | "cancelled";

// AI 생성 질문 타입
export type AnalysisQuestion = {
  id: string;
  text: string;
  type: "text" | "multiple_choice" | "number" | "boolean";
  options?: string[];
  required: boolean;
  explanation?: string;
};

// 분석 세션 타입
export type AnalysisSession = {
  id: string;
  query: string;
  status:
    | "initializing"
    | "awaiting_questions"
    | "processing"
    | "completed"
    | "error";
  progress: number;
  questions: AnalysisQuestion[];
  answers: Record<string, string>;
  resultId?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
  lastViewedAt?: string;
  currentStep?: string;
};

// 분석 시작 결과 타입
export type AnalysisStartResult = {
  sessionId: string;
  needsQuestions: boolean;
  questions?: AnalysisQuestion[];
  estimatedTime?: number;
  message: string;
};

// 답변 제출 결과 타입
export type AnswerSubmissionResult = {
  completed: boolean;
  result?: AnalysisResult;
  additionalQuestions?: AnalysisQuestion[];
  progress: number;
  message: string;
};

// 요구사항 타입
export type Requirement = {
  id: string;
  type: "document" | "certification" | "inspection" | "license";
  title: string;
  description: string;
  mandatory: boolean;
  authority: string;
  estimatedTime?: string;
  cost?: string;
};

// 분석 결과 타입
export type AnalysisResult = {
  id: string;
  sessionId: string;
  recommendedHsCode: string;
  confidence: number;
  reasoning: string;
  alternativeHsCodes: Array<{
    code: string;
    confidence: number;
    reasoning: string;
  }>;
  exportRequirements: ComplianceRequirement[];
  importRequirements: ComplianceRequirement[];
  relatedRegulations: RegulationInfo[];
  tradeStatistics?: TradeStatistics;
  createdAt: string;
  isBookmarked?: boolean;
};

// 유사 분석 타입
export type SimilarAnalysis = {
  id: string;
  productDescription: string;
  hsCode: string;
  confidence: number;
  createdAt: string;
  similarity: number;
};

// 분석 히스토리 아이템 타입
export type AnalysisHistoryItem = {
  sessionId: string;
  resultId?: string;
  productDescription: string;
  hsCode?: string;
  status: AnalysisSessionStatus;
  createdAt: string;
  completedAt?: string;
};

export type ComplianceRequirement = {
  id: string;
  title: string;
  description: string;
  country: string;
  type: "certificate" | "inspection" | "license" | "document" | "other";
  mandatory: boolean;
  authority: string;
  validityPeriod?: string;
  cost?: string;
  processingTime?: string;
  documents: string[];
  notes?: string;
};

export type RegulationInfo = {
  id: string;
  title: string;
  description: string;
  country: string;
  category:
    | "safety"
    | "environment"
    | "quality"
    | "customs"
    | "trade"
    | "other";
  effectiveDate: string;
  lastUpdated: string;
  source: string;
  url?: string;
  impact: "high" | "medium" | "low";
};

export type TradeStatistics = {
  hsCode: string;
  period: string;
  exportData: {
    totalValue: number;
    totalQuantity: number;
    topDestinations: Array<{
      country: string;
      value: number;
      share: number;
    }>;
  };
  importData: {
    totalValue: number;
    totalQuantity: number;
    topOrigins: Array<{
      country: string;
      value: number;
      share: number;
    }>;
  };
  trends: {
    exportGrowth: number;
    importGrowth: number;
    priceIndex: number;
  };
};

// API 요청/응답 타입들
export type AnalysisStartRequest = {
  sessionId: string;
  productDescription: string;
  productImage?: string;
  intendedUse?: "import" | "export" | "classification";
  targetCountry?: string;
  urgency: "low" | "normal" | "high";
  timestamp: string;
};

export type AnswerSubmissionRequest = {
  questionId: string;
  answer: string;
  timestamp: string;
};
