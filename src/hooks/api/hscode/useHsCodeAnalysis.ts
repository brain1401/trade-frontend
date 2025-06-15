import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAnalysisStore } from "@/stores/analysisStore";
import { useResultStore } from "@/stores/resultStore";
import { hsCodeApi } from "@/lib/api/hscode";
import type { AnalysisStartResult } from "@/types/api/hscode";
import { useErrorHandler } from "@/hooks/common/useErrorHandler";

type SubmitAnswerRequest = {
  sessionId: string;
  question: string;
  context: Array<{ role: "user" | "assistant"; content: string }>;
};

type SubmitAnswerResponse = {
  message: string;
  needsMoreInfo: boolean;
  completed: boolean;
  resultId?: string;
};

type HsCodeAnalysisRequest = {
  sessionId: string;
  query: string;
};

// HS Code 분석 시작 훅
export const useHsCodeAnalysis = () => {
  const analysisStore = useAnalysisStore();
  const errorHandler = useErrorHandler();
  const queryClient = useQueryClient();

  return useMutation<SubmitAnswerResponse, Error, SubmitAnswerRequest>({
    mutationFn: async ({ sessionId, question, context }) => {
      // 임시 응답 - 실제로는 hsCodeApi 호출
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return {
        message: `"${question}"에 대한 답변을 받았습니다. 추가적으로 제품의 크기와 무게는 어떻게 되나요?`,
        needsMoreInfo: true,
        completed: false,
      };
    },

    onError: (error: Error) => {
      errorHandler(error, "HS Code 분석");
    },

    onSuccess: (data, variables) => {
      // 관련 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["hscode", "recent"],
      });
    },
  });
};

export const useStartAnalysis = () => {
  const analysisStore = useAnalysisStore();
  const errorHandler = useErrorHandler();

  return useMutation<string, Error, HsCodeAnalysisRequest>({
    mutationFn: async ({ sessionId, query }) => {
      // 분석 시작 로직
      return analysisStore.createSession(query);
    },

    onError: (error: Error) => {
      errorHandler(error, "분석 시작");
    },
  });
};

// 분석 답변 제출 훅
export const useSubmitAnswer = () => {
  const analysisStore = useAnalysisStore();
  const resultStore = useResultStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      questionId,
      answer,
    }: {
      sessionId: string;
      questionId: string;
      answer: string;
    }) => {
      // 로컬 상태 먼저 업데이트 (낙관적 업데이트)
      analysisStore.submitAnswer(sessionId, questionId, answer);

      // API 호출
      const result = await hsCodeApi.submitAnswer(
        sessionId,
        questionId,
        answer,
      );

      if (result.completed && result.result) {
        // 분석 완료시 결과 저장
        analysisStore.completeSession(sessionId, result.result);
        resultStore.saveResult(result.result.id, result.result);

        return { ...result, resultId: result.result.id };
      }

      return result;
    },

    onError: (error: Error, variables) => {
      console.error("Answer submission failed:", error);
      analysisStore.updateSession(variables.sessionId, {
        status: "error",
        error: error.message,
      });
    },

    onSuccess: (data, variables) => {
      // 분석 완료시 관련 쿼리 업데이트
      if (data.completed) {
        queryClient.invalidateQueries({
          queryKey: ["hscode", "results"],
        });
        queryClient.invalidateQueries({
          queryKey: ["hscode", "recent"],
        });
      }
    },
  });
};

// 분석 세션 취소 훅
export const useCancelAnalysis = () => {
  const analysisStore = useAnalysisStore();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      // API 호출하여 서버에서 취소
      await hsCodeApi.cancelSession(sessionId);

      // 로컬 상태 업데이트
      analysisStore.cancelSession(sessionId);

      return sessionId;
    },

    onError: (error: Error, sessionId) => {
      console.error("Analysis cancellation failed:", error);
      analysisStore.setGlobalError("분석 취소에 실패했습니다");
    },

    onSuccess: (sessionId) => {
      console.log(`Analysis session ${sessionId} cancelled successfully`);
    },
  });
};

// 분석 히스토리 조회 훅
export const useAnalysisHistory = (
  userId: string,
  page: number = 0,
  size: number = 10,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => hsCodeApi.getAnalysisHistory(userId, page, size),

    onSuccess: (data) => {
      // 결과를 쿼리 캐시에 저장
      queryClient.setQueryData(["hscode", "history", userId, page, size], data);
    },

    onError: (error: Error) => {
      console.error("Failed to load analysis history:", error);
    },
  });
};

// 분석 진행 상황 추적 훅
export const useAnalysisProgress = (sessionId: string) => {
  const analysisStore = useAnalysisStore();

  // 현재 세션 정보 가져오기
  const session = sessionId
    ? analysisStore.activeSessions.get(sessionId)
    : null;

  return {
    session,
    progress: session?.progress || 0,
    status: session?.status || "initializing",
    error: session?.error || null,
    isLoading:
      session?.status === "initializing" || session?.status === "processing",
    isCompleted: session?.status === "completed",
    hasError: session?.status === "error",
    canCancel:
      session?.status === "initializing" ||
      session?.status === "awaiting_questions" ||
      session?.status === "processing",
  };
};

// 여러 세션의 상태를 한번에 추적하는 훅
export const useMultipleAnalysisProgress = (sessionIds: string[]) => {
  const analysisStore = useAnalysisStore();

  const sessionsData = sessionIds.map((sessionId) => {
    const session = analysisStore.activeSessions.get(sessionId);
    return {
      sessionId,
      session,
      progress: session?.progress || 0,
      status: session?.status || "initializing",
      error: session?.error || null,
    };
  });

  const totalProgress =
    sessionsData.reduce((sum, { progress }) => sum + progress, 0) /
    sessionIds.length;
  const hasAnyError = sessionsData.some(({ error }) => error !== null);
  const allCompleted = sessionsData.every(
    ({ status }) => status === "completed",
  );

  return {
    sessions: sessionsData,
    totalProgress,
    hasAnyError,
    allCompleted,
    activeCount: sessionsData.filter(
      ({ status }) => status !== "completed" && status !== "error",
    ).length,
  };
};
