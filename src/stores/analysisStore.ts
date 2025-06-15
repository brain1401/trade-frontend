import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type {
  AnalysisSession,
  AnalysisQuestion,
  AnalysisResult,
} from "@/types/api/hscode";

// 세션 ID 생성 함수
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 분석 상태 타입 정의 (데이터만 포함)
type AnalysisState = {
  // 활성 세션들 (동시에 여러 분석 가능)
  activeSessions: Map<string, AnalysisSession>;

  // 현재 보고 있는 세션
  currentSessionId: string | null;

  // 전역 로딩 상태
  isGlobalLoading: boolean;

  // 에러 상태
  globalError: string | null;
};

// 분석 액션 타입 정의 (함수들만 포함)
type AnalysisActions = {
  // 세션 관리 액션들
  createSession: (initialQuery: string) => Promise<string>;
  updateSession: (sessionId: string, update: Partial<AnalysisSession>) => void;
  deleteSession: (sessionId: string) => void;
  setCurrentSession: (sessionId: string | null) => void;

  // 답변 제출
  submitAnswer: (
    sessionId: string,
    questionId: string,
    answer: string,
  ) => Promise<void>;

  // 세션 완료
  completeSession: (sessionId: string, result: AnalysisResult) => void;

  // 세션 취소
  cancelSession: (sessionId: string) => void;

  // 유틸리티 함수들
  getCurrentSession: () => AnalysisSession | null;
  getSessionProgress: (sessionId: string) => number;
  hasActiveSession: (sessionId: string) => boolean;
  getActiveSessions: () => AnalysisSession[];

  // 상태 관리
  setGlobalLoading: (loading: boolean) => void;
  setGlobalError: (error: string | null) => void;

  // 초기화
  reset: () => void;
};

// 전체 Store 타입 조합
type AnalysisStore = AnalysisState & AnalysisActions;

// 초기 상태
const initialState: AnalysisState = {
  activeSessions: new Map(),
  currentSessionId: null,
  isGlobalLoading: false,
  globalError: null,
};

// Zustand 스토어 생성
export const useAnalysisStore = create<AnalysisStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    createSession: async (initialQuery: string) => {
      const sessionId = generateSessionId();

      const session: AnalysisSession = {
        id: sessionId,
        query: initialQuery,
        status: "initializing",
        questions: [],
        answers: {},
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      // 세션 추가
      set((state) => ({
        activeSessions: new Map(state.activeSessions).set(sessionId, session),
        currentSessionId: sessionId,
      }));

      // AI 분석 시작 시뮬레이션
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock 질문 생성
        const mockQuestions: AnalysisQuestion[] = [
          {
            id: "q1",
            text: "제품의 주요 재료는 무엇인가요?",
            type: "multiple_choice",
            options: ["플라스틱", "금속", "섬유", "기타"],
            required: true,
            explanation: "제품의 가장 큰 비중을 차지하는 재료를 선택해주세요.",
          },
          {
            id: "q2",
            text: "제품의 주요 용도를 설명해주세요.",
            type: "text",
            required: true,
            explanation: "구체적인 사용 목적을 자세히 설명해주세요.",
          },
        ];

        get().updateSession(sessionId, {
          status: "awaiting_questions",
          questions: mockQuestions,
          progress: 25,
        });
      } catch (error) {
        get().updateSession(sessionId, {
          status: "error",
          error: error instanceof Error ? error.message : "분석 시작 실패",
        });
      }

      return sessionId;
    },

    updateSession: (sessionId: string, update: Partial<AnalysisSession>) => {
      set((state) => {
        const session = state.activeSessions.get(sessionId);
        if (!session) return state;

        return {
          activeSessions: new Map(state.activeSessions).set(sessionId, {
            ...session,
            ...update,
          }),
        };
      });
    },

    deleteSession: (sessionId: string) => {
      set((state) => {
        const newSessions = new Map(state.activeSessions);
        newSessions.delete(sessionId);

        return {
          activeSessions: newSessions,
          currentSessionId:
            state.currentSessionId === sessionId
              ? null
              : state.currentSessionId,
        };
      });
    },

    setCurrentSession: (sessionId: string | null) => {
      set({ currentSessionId: sessionId });
    },

    submitAnswer: async (
      sessionId: string,
      questionId: string,
      answer: string,
    ) => {
      const session = get().activeSessions.get(sessionId);
      if (!session) return;

      // 답변 업데이트
      const updatedAnswers = { ...session.answers, [questionId]: answer };
      get().updateSession(sessionId, {
        answers: updatedAnswers,
        progress: Math.min(session.progress + 25, 90),
      });

      // AI 처리 시뮬레이션
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // 모든 질문에 답변했는지 확인
        const allAnswered = session.questions.every((q) =>
          q.required ? updatedAnswers[q.id] : true,
        );

        if (allAnswered) {
          // Mock 결과 생성
          const mockResult: AnalysisResult = {
            id: `result_${Date.now()}`,
            sessionId,
            recommendedHsCode: "8517.12.00",
            confidence: 92,
            reasoning:
              "스마트폰은 무선 전화기의 범주에 속하며, 터치스크린과 다양한 기능을 포함하고 있어 해당 HS Code로 분류됩니다.",
            alternativeHsCodes: [],
            exportRequirements: [],
            importRequirements: [],
            relatedRegulations: [],

            createdAt: new Date().toISOString(),
          };

          get().completeSession(sessionId, mockResult);
        }
      } catch (error) {
        get().updateSession(sessionId, {
          status: "error",
          error:
            error instanceof Error ? error.message : "답변 처리 중 오류 발생",
        });
      }
    },

    completeSession: (sessionId: string, result: AnalysisResult) => {
      get().updateSession(sessionId, {
        status: "completed",
        resultId: result.id,
        progress: 100,
        completedAt: new Date().toISOString(),
      });

      // 결과 스토어에 저장 (실제로는 useResultStore 사용)
      // useResultStore.getState().saveResult(result.id, result);
    },

    cancelSession: (sessionId: string) => {
      const session = get().activeSessions.get(sessionId);
      if (!session) return;

      // 진행 중인 세션만 취소 가능
      if (
        ["initializing", "awaiting_questions", "processing"].includes(
          session.status,
        )
      ) {
        get().updateSession(sessionId, {
          status: "error",
          error: "분석이 취소되었습니다",
        });
      }
    },

    getCurrentSession: () => {
      const { currentSessionId, activeSessions } = get();
      return currentSessionId
        ? activeSessions.get(currentSessionId) || null
        : null;
    },

    getSessionProgress: (sessionId: string) => {
      return get().activeSessions.get(sessionId)?.progress || 0;
    },

    hasActiveSession: (sessionId: string) => {
      return get().activeSessions.has(sessionId);
    },

    getActiveSessions: () => {
      return Array.from(get().activeSessions.values());
    },

    setGlobalLoading: (loading: boolean) => {
      set({ isGlobalLoading: loading });
    },

    setGlobalError: (error: string | null) => {
      set({ globalError: error });
    },

    reset: () => {
      set(initialState);
    },
  })),
);

// 세션 상태 변화 구독 (WebSocket 등과 연동)
useAnalysisStore.subscribe(
  (state) => state.activeSessions,
  (activeSessions, prevActiveSessions) => {
    // 세션 상태 변화 처리 로직
    console.log("Sessions updated:", {
      current: activeSessions.size,
      previous: prevActiveSessions.size,
    });
  },
);
