import apiClient, { ApiError } from "./client";
import type {
  AIFeature,
  ChatMessage,
  ChatAttachment,
  ExtractedEntity,
  ConversationContext,
  UserFeedback,
} from "../../types/domain/ai";

// Claude AI 분석 요청 타입
export type ClaudeAnalysisRequest = {
  text: string;
  images?: ClaudeImage[];
  context?: Partial<ConversationContext>;
  feature: AIFeature;
  sessionId?: string;
  userId?: string;
};

export type ClaudeImage = {
  data: string; // base64 encoded
  mimeType: string;
  filename?: string;
};

// Claude AI 응답 타입
export type ClaudeAnalysisResponse = {
  sessionId: string;
  result: {
    content: string;
    confidence: number;
    reasoning: string[];
    sources: TrustedSource[];
    followUpQuestions?: SmartQuestion[];
    entities?: ExtractedEntity[];
  };
  metadata: {
    processingTime: number;
    tokensUsed: number;
    modelVersion: string;
    feature: AIFeature;
  };
};

export type TrustedSource = {
  id: string;
  title: string;
  url: string;
  type: "regulation" | "customs" | "legal" | "news" | "official";
  credibilityScore: number;
  relevance: number;
  publishedAt?: string;
  organization?: string;
};

export type SmartQuestion = {
  id: string;
  question: string;
  type: "single_choice" | "multiple_choice" | "text" | "number" | "date";
  required: boolean;
  options?: SmartQuestionOption[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
};

export type SmartQuestionOption = {
  value: string;
  label: string;
  description?: string;
};

// 의도 감지 응답
export type IntentDetectionResponse = {
  intent: string;
  confidence: number;
  entities: ExtractedEntity[];
  suggestedAction: SuggestedAction;
  alternativeIntents?: AlternativeIntent[];
};

export type SuggestedAction = {
  type: "route" | "search" | "analyze" | "track";
  target: string;
  parameters?: Record<string, any>;
  confidence: number;
};

export type AlternativeIntent = {
  intent: string;
  confidence: number;
  action: SuggestedAction;
};

// 이미지 분석 응답
export type ImageAnalysisResponse = {
  description: string;
  detectedProducts: DetectedProduct[];
  suggestedHSCodes: SuggestedHSCode[];
  confidence: number;
  metadata: {
    processingTime: number;
    imageQuality: "low" | "medium" | "high";
    recognizedText?: string;
  };
};

export type DetectedProduct = {
  name: string;
  category: string;
  confidence: number;
  attributes: ProductAttribute[];
  boundingBox?: BoundingBox;
};

export type ProductAttribute = {
  key: string;
  value: string;
  confidence: number;
};

export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SuggestedHSCode = {
  code: string;
  description: string;
  confidence: number;
  reasoning: string[];
};

// Claude AI API 클라이언트 클래스
export class ClaudeAPIClient {
  private baseUrl = "/claude-ai";

  // 멀티스텝 분석 (HS Code 분류용)
  async analyzeWithSteps(
    request: ClaudeAnalysisRequest,
  ): Promise<ClaudeAnalysisResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/analyze`, request);
      return response as unknown as ClaudeAnalysisResponse;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        "HS Code 분석 중 오류가 발생했습니다",
        undefined,
        "AI_ANALYSIS_ERROR",
      );
    }
  }

  // 의도 감지
  async detectIntent(
    query: string,
    context?: Partial<ConversationContext>,
  ): Promise<IntentDetectionResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/intent`, {
        query,
        context,
        feature: "intent_detection" as AIFeature,
      });
      return response as unknown as IntentDetectionResponse;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        "의도 감지 중 오류가 발생했습니다",
        undefined,
        "INTENT_DETECTION_ERROR",
      );
    }
  }

  // 이미지 분석 (멀티모달)
  async analyzeImage(
    image: ClaudeImage,
    context?: string,
  ): Promise<ImageAnalysisResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/image-analysis`, {
        image,
        context,
        feature: "image_analysis" as AIFeature,
      });
      return response as unknown as ImageAnalysisResponse;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        "이미지 분석 중 오류가 발생했습니다",
        undefined,
        "IMAGE_ANALYSIS_ERROR",
      );
    }
  }

  // 스마트 질문 생성
  async generateSmartQuestions(
    sessionId: string,
    currentContext: Partial<ConversationContext>,
  ): Promise<SmartQuestion[]> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/smart-questions`, {
        sessionId,
        context: currentContext,
        feature: "smart_questions" as AIFeature,
      });
      return response as unknown as SmartQuestion[];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        "추가 질문 생성 중 오류가 발생했습니다",
        undefined,
        "SMART_QUESTIONS_ERROR",
      );
    }
  }

  // 스마트 질문 응답 처리
  async submitQuestionAnswers(
    sessionId: string,
    answers: Record<string, any>,
  ): Promise<ClaudeAnalysisResponse> {
    try {
      const response = await apiClient.post(
        `${this.baseUrl}/question-answers`,
        {
          sessionId,
          answers,
          feature: "smart_questions" as AIFeature,
        },
      );
      return response as unknown as ClaudeAnalysisResponse;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        "답변 처리 중 오류가 발생했습니다",
        undefined,
        "QUESTION_SUBMIT_ERROR",
      );
    }
  }

  // 신뢰할 수 있는 출처 확인
  async verifySource(url: string, context: string): Promise<TrustedSource> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/verify-source`, {
        url,
        context,
        feature: "source_verification" as AIFeature,
      });
      return response as unknown as TrustedSource;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        "출처 확인 중 오류가 발생했습니다",
        undefined,
        "SOURCE_VERIFICATION_ERROR",
      );
    }
  }

  // 뉴스 요약 및 분석
  async summarizeNews(
    newsContent: string,
    context?: string,
  ): Promise<{
    summary: string;
    keyPoints: string[];
    businessImpact: string;
    affectedHSCodes: string[];
    sources: TrustedSource[];
  }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/news-summary`, {
        content: newsContent,
        context,
        feature: "news_summarization" as AIFeature,
      });
      return response as unknown as {
        summary: string;
        keyPoints: string[];
        businessImpact: string;
        affectedHSCodes: string[];
        sources: TrustedSource[];
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        "뉴스 요약 중 오류가 발생했습니다",
        undefined,
        "NEWS_SUMMARY_ERROR",
      );
    }
  }

  // 비즈니스 영향 분석
  async analyzeBusinessImpact(
    content: string,
    businessContext?: Record<string, any>,
  ): Promise<{
    impactLevel: "low" | "medium" | "high" | "critical";
    affectedAreas: string[];
    actionItems: string[];
    timeline: string;
    riskAssessment: string;
  }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/business-impact`, {
        content,
        businessContext,
        feature: "business_impact_analysis" as AIFeature,
      });
      return response as unknown as {
        impactLevel: "low" | "medium" | "high" | "critical";
        affectedAreas: string[];
        actionItems: string[];
        timeline: string;
        riskAssessment: string;
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        "비즈니스 영향 분석 중 오류가 발생했습니다",
        undefined,
        "BUSINESS_IMPACT_ERROR",
      );
    }
  }

  // 분석 세션 재개
  async resumeSession(sessionId: string): Promise<ConversationContext> {
    try {
      const response = await apiClient.get(
        `${this.baseUrl}/sessions/${sessionId}`,
      );
      return response as unknown as ConversationContext;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        "세션 복구 중 오류가 발생했습니다",
        undefined,
        "SESSION_RESUME_ERROR",
      );
    }
  }

  // 사용자 피드백 제출
  async submitFeedback(feedback: UserFeedback): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/feedback`, feedback);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        "피드백 전송 중 오류가 발생했습니다",
        undefined,
        "FEEDBACK_SUBMIT_ERROR",
      );
    }
  }

  // 채팅 메시지를 컨텍스트 메시지로 변환
  static chatToContextMessage(message: ChatMessage): {
    role: "user" | "assistant";
    content: string;
    timestamp: string;
    metadata?: Record<string, any>;
  } {
    return {
      role: message.role,
      content: message.content,
      timestamp: message.timestamp.toISOString(),
      metadata: {
        id: message.id,
        attachments: message.attachments,
        ...message.metadata,
      },
    };
  }

  // 첨부파일을 Claude 이미지 형식으로 변환
  static attachmentToClaudeImage(
    attachment: ChatAttachment,
  ): ClaudeImage | null {
    if (attachment.type !== "image") return null;

    // URL에서 base64 데이터 추출 (실제로는 파일 처리 로직 필요)
    return {
      data: attachment.url, // 실제로는 base64 변환 필요
      mimeType: attachment.mimeType || "image/jpeg",
      filename: attachment.name,
    };
  }
}

// 기본 인스턴스 내보내기
export const claudeApi = new ClaudeAPIClient();
