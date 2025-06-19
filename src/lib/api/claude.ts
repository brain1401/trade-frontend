/**
 * Claude AI 분석 관련 API 함수 모음
 *
 * HS Code 분석, 의도 분석, 스마트 질문 생성 등의 AI 기능을 제공함
 * 스프링부트 서버의 /api/v1/claude/* 엔드포인트와 연동
 *
 * @module ClaudeApi
 * @since 1.0.0
 */

import { apiClient, type ApiResponse, API_ENDPOINTS } from "./client";

/**
 * 검색 의도 분석 요청 데이터 타입
 */
export type IntentAnalysisRequest = {
  /** 사용자 입력 쿼리 */
  query: string;
  /** 추가 컨텍스트 정보 */
  context?: string;
};

/**
 * 검색 의도 분석 응답 데이터 타입
 */
export type IntentAnalysisResponse = {
  /** 분석된 의도 유형 */
  intent: "HSCODE_ANALYSIS" | "CARGO_TRACKING" | "GENERAL_SEARCH";
  /** 의도 분석 신뢰도 (0-1) */
  confidence: number;
  /** 추출된 키워드 목록 */
  keywords: string[];
  /** 제안된 액션 */
  suggestedAction: string;
};

/**
 * HS Code 분석 요청 데이터 타입
 */
export type HSCodeAnalysisRequest = {
  /** 제품 설명 */
  productDescription: string;
  /** 추가 정보 */
  additionalInfo?: string;
  /** 이미지 URL (선택적) */
  imageUrl?: string;
  /** 분석 세션 ID */
  sessionId?: string;
};

/**
 * HS Code 분석 응답 데이터 타입
 */
export type HSCodeAnalysisResponse = {
  /** 분석 세션 ID */
  sessionId: string;
  /** 분석 결과 */
  analysis: {
    /** 추천 HS Code */
    hsCode: string;
    /** HS Code 설명 */
    description: string;
    /** 분석 신뢰도 (0-1) */
    confidence: number;
    /** 관세율 정보 */
    tariffInfo?: {
      basicRate: string;
      preferentialRate?: string;
    };
    /** 수출입 요건 */
    requirements: string[];
    /** 관련 규제 정보 */
    regulations: string[];
  };
  /** 신뢰할 수 있는 출처 목록 */
  sources: Array<{
    title: string;
    url: string;
    snippet: string;
    credibility: "HIGH" | "MEDIUM" | "LOW";
  }>;
  /** 분석 진행률 (0-100) */
  progress: number;
  /** 분석 상태 */
  status: "IN_PROGRESS" | "COMPLETED" | "FAILED";
};

/**
 * 스마트 질문 생성 응답 데이터 타입
 */
export type SmartQuestionsResponse = {
  /** 세션 ID */
  sessionId: string;
  /** 생성된 질문 목록 */
  questions: Array<{
    id: string;
    text: string;
    category: string;
    options?: string[];
  }>;
  /** 질문 생성 이유 */
  reasoning: string;
};

/**
 * 이미지 업로드 응답 데이터 타입
 */
export type ImageUploadResponse = {
  /** 업로드된 이미지 URL */
  imageUrl: string;
  /** 이미지 분석 결과 */
  analysis?: {
    detectedObjects: string[];
    suggestedKeywords: string[];
  };
};

/**
 * 검색 의도 분석 API 함수
 *
 * 사용자의 자연어 입력을 분석하여 적절한 기능으로 라우팅함
 *
 * @param requestData - 의도 분석 요청 데이터
 * @returns 분석된 의도 정보
 *
 * @example
 * ```typescript
 * const result = await analyzeSearchIntent({
 *   query: "스마트폰 수입할 때 필요한 서류"
 * });
 *
 * if (result.data.intent === "HSCODE_ANALYSIS") {
 *   // HS Code 분석으로 라우팅
 * }
 * ```
 */
export const analyzeSearchIntent = async (
  requestData: IntentAnalysisRequest,
): Promise<ApiResponse<IntentAnalysisResponse>> => {
  const response = await apiClient.post<ApiResponse<IntentAnalysisResponse>>(
    API_ENDPOINTS.CLAUDE.ANALYZE_INTENT,
    requestData,
  );
  return response.data;
};

/**
 * HS Code 종합 분석 API 함수
 *
 * Claude AI를 활용한 제품의 HS Code 분석 및 관련 정보 조회
 *
 * @param requestData - HS Code 분석 요청 데이터
 * @returns 종합 분석 결과
 *
 * @example
 * ```typescript
 * const result = await analyzeHSCode({
 *   productDescription: "삼성 갤럭시 스마트폰",
 *   additionalInfo: "5G 지원, 128GB 저장용량"
 * });
 *
 * if (result.success) {
 *   console.log("추천 HS Code:", result.data.analysis.hsCode);
 * }
 * ```
 */
export const analyzeHSCode = async (
  requestData: HSCodeAnalysisRequest,
): Promise<ApiResponse<HSCodeAnalysisResponse>> => {
  const response = await apiClient.post<ApiResponse<HSCodeAnalysisResponse>>(
    API_ENDPOINTS.CLAUDE.ANALYZE_HSCODE,
    requestData,
  );
  return response.data;
};

/**
 * 스마트 질문 생성 API 함수
 *
 * 분석 정확도 향상을 위한 추가 질문을 AI가 생성함
 *
 * @param sessionId - 분석 세션 ID
 * @returns 생성된 스마트 질문 목록
 *
 * @example
 * ```typescript
 * const questions = await generateSmartQuestions("session_123");
 * questions.data.questions.forEach(q => {
 *   console.log(`질문: ${q.text}`);
 * });
 * ```
 */
export const generateSmartQuestions = async (
  sessionId: string,
): Promise<ApiResponse<SmartQuestionsResponse>> => {
  const response = await apiClient.post<ApiResponse<SmartQuestionsResponse>>(
    `${API_ENDPOINTS.CLAUDE.GENERATE_QUESTIONS}/${sessionId}`,
  );
  return response.data;
};

/**
 * 제품 이미지 업로드 및 분석 API 함수
 *
 * @param imageFile - 업로드할 이미지 파일
 * @returns 이미지 업로드 및 분석 결과
 *
 * @example
 * ```typescript
 * const file = new File([blob], "product.jpg", { type: "image/jpeg" });
 * const result = await uploadProductImage(file);
 * if (result.success) {
 *   console.log("이미지 URL:", result.data.imageUrl);
 * }
 * ```
 */
export const uploadProductImage = async (
  imageFile: File,
): Promise<ApiResponse<ImageUploadResponse>> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await apiClient.post<ApiResponse<ImageUploadResponse>>(
    API_ENDPOINTS.CLAUDE.UPLOAD_IMAGE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

/**
 * 분석 세션 조회 API 함수
 *
 * @param sessionId - 조회할 세션 ID
 * @returns 세션 상세 정보
 *
 * @example
 * ```typescript
 * const session = await getAnalysisSession("session_123");
 * if (session.success) {
 *   console.log("분석 상태:", session.data.status);
 * }
 * ```
 */
export const getAnalysisSession = async (
  sessionId: string,
): Promise<ApiResponse<HSCodeAnalysisResponse>> => {
  const response = await apiClient.get<ApiResponse<HSCodeAnalysisResponse>>(
    `${API_ENDPOINTS.CLAUDE.ANALYSIS_SESSION}/${sessionId}`,
  );
  return response.data;
};
