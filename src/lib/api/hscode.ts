import apiClient from "./client";
import type {
  AnalysisStartResult,
  AnalysisSession,
  AnswerSubmissionResult,
  AnalysisResult,
  SimilarAnalysis,
} from "@/types/api/hscode";

export const hsCodeApi = {
  // 새로운 HS Code 분석 세션 시작
  startAnalysis: async (
    sessionId: string,
    query: string,
  ): Promise<AnalysisStartResult> => {
    return apiClient.post("/hscode/analyze", {
      sessionId,
      productDescription: query,
      timestamp: new Date().toISOString(),
    });
  },

  // AI 생성 질문에 대한 답변 제출
  submitAnswer: async (
    sessionId: string,
    questionId: string,
    answer: string,
  ): Promise<AnswerSubmissionResult> => {
    return apiClient.post(`/hscode/analyze/${sessionId}/answer`, {
      questionId,
      answer,
      timestamp: new Date().toISOString(),
    });
  },

  // 분석 세션 상태 조회 (장시간 작업 폴링용)
  getSessionStatus: async (sessionId: string): Promise<AnalysisSession> => {
    return apiClient.get(`/hscode/analyze/${sessionId}/status`);
  },

  // 완료된 분석 결과 조회
  getResult: async (resultId: string): Promise<AnalysisResult> => {
    return apiClient.get(`/hscode/result/${resultId}`);
  },

  // 유사한 이전 분석 검색
  searchSimilar: async (hsCode: string): Promise<SimilarAnalysis[]> => {
    return apiClient.get(`/hscode/similar/${hsCode}`);
  },

  // 분석 결과에 대한 피드백 제출
  submitFeedback: async (
    resultId: string,
    feedback: {
      rating: number;
      comment?: string;
      isAccurate: boolean;
    },
  ): Promise<void> => {
    return apiClient.post(`/hscode/result/${resultId}/feedback`, feedback);
  },

  // 분석 세션 취소
  cancelSession: async (sessionId: string): Promise<void> => {
    return apiClient.delete(`/hscode/analyze/${sessionId}`);
  },

  // 사용자의 분석 히스토리 조회
  getAnalysisHistory: async (
    userId: string,
    page: number = 0,
    size: number = 10,
  ): Promise<{
    content: AnalysisResult[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
  }> => {
    return apiClient.get(`/hscode/history/${userId}`, {
      params: { page, size },
    });
  },

  // 북마크된 분석 결과 조회
  getBookmarkedResults: async (userId: string): Promise<AnalysisResult[]> => {
    return apiClient.get(`/hscode/bookmarks/${userId}`);
  },

  // 분석 결과 북마크 추가/제거
  toggleBookmark: async (
    resultId: string,
    userId: string,
  ): Promise<{ bookmarked: boolean }> => {
    return apiClient.post(`/hscode/result/${resultId}/bookmark`, { userId });
  },

  // 분석 결과 공유 링크 생성
  generateShareLink: async (
    resultId: string,
  ): Promise<{ shareUrl: string; expiresAt: string }> => {
    return apiClient.post(`/hscode/result/${resultId}/share`);
  },

  // HS Code 관련 규정 조회
  getRegulations: async (
    hsCode: string,
  ): Promise<{
    importRegulations: string[];
    exportRegulations: string[];
    restrictions: string[];
  }> => {
    return apiClient.get(`/hscode/${hsCode}/regulations`);
  },

  // 무역 통계 조회
  getTradeStatistics: async (
    hsCode: string,
    year?: number,
  ): Promise<{
    importValue: number;
    exportValue: number;
    topImportCountries: Array<{ country: string; value: number }>;
    topExportCountries: Array<{ country: string; value: number }>;
  }> => {
    const params = year ? { year } : {};
    return apiClient.get(`/hscode/${hsCode}/statistics`, { params });
  },
};
