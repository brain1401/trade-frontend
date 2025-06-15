import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AnalysisResult } from "@/types/api/hscode";

// 결과 상태 타입 정의 (데이터만 포함)
type ResultState = {
  // 캐시된 결과들
  results: Record<string, AnalysisResult>;

  // 최근 조회한 결과 ID들
  recentResults: string[];

  // 북마크된 결과 ID들
  bookmarkedResults: string[];

  // 로딩 상태
  loadingResults: string[];

  // 에러 상태
  resultErrors: Record<string, string>;
};

// 결과 액션 타입 정의 (함수들만 포함)
type ResultActions = {
  // 결과 관리
  saveResult: (resultId: string, result: AnalysisResult) => void;
  getResult: (resultId: string) => AnalysisResult | null;
  deleteResult: (resultId: string) => void;

  // 북마크 관리
  toggleBookmark: (resultId: string) => void;
  isBookmarked: (resultId: string) => boolean;
  getBookmarkedResults: () => AnalysisResult[];

  // 최근 결과 관리
  addToRecent: (resultId: string) => void;
  getRecentResults: (limit?: number) => AnalysisResult[];
  clearRecentResults: () => void;

  // 상태 관리
  setLoading: (resultId: string, loading: boolean) => void;
  setError: (resultId: string, error: string | null) => void;
  clearError: (resultId: string) => void;

  // 정리
  reset: () => void;
};

// 전체 Store 타입 조합
type ResultStore = ResultState & ResultActions;

// 초기 상태
const initialState: ResultState = {
  results: {},
  recentResults: [],
  bookmarkedResults: [],
  loadingResults: [],
  resultErrors: {},
};

// Zustand 스토어 생성
export const useResultStore = create<ResultStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      saveResult: (resultId: string, result: AnalysisResult) => {
        const { results } = get();

        set({
          results: {
            ...results,
            [resultId]: result,
          },
        });

        // 최근 결과에 추가
        get().addToRecent(resultId);
      },

      getResult: (resultId: string) => {
        const { results } = get();
        return results[resultId] || null;
      },

      deleteResult: (resultId: string) => {
        const { results, recentResults, bookmarkedResults } = get();

        const newResults = { ...results };
        delete newResults[resultId];

        set({
          results: newResults,
          recentResults: recentResults.filter((id) => id !== resultId),
          bookmarkedResults: bookmarkedResults.filter((id) => id !== resultId),
        });

        get().clearError(resultId);
      },

      toggleBookmark: (resultId: string) => {
        const { bookmarkedResults } = get();

        if (bookmarkedResults.includes(resultId)) {
          set({
            bookmarkedResults: bookmarkedResults.filter(
              (id) => id !== resultId,
            ),
          });
        } else {
          set({
            bookmarkedResults: [...bookmarkedResults, resultId],
          });
        }
      },

      isBookmarked: (resultId: string) => {
        return get().bookmarkedResults.includes(resultId);
      },

      getBookmarkedResults: () => {
        const { results, bookmarkedResults } = get();
        return bookmarkedResults.map((id) => results[id]).filter(Boolean);
      },

      addToRecent: (resultId: string) => {
        const { recentResults } = get();
        const filtered = recentResults.filter((id) => id !== resultId);

        set({
          recentResults: [resultId, ...filtered].slice(0, 10), // 최대 10개
        });
      },

      getRecentResults: (limit = 10) => {
        const { results, recentResults } = get();
        return recentResults
          .slice(0, limit)
          .map((id) => results[id])
          .filter(Boolean);
      },

      clearRecentResults: () => {
        set({ recentResults: [] });
      },

      setLoading: (resultId: string, loading: boolean) => {
        const { loadingResults } = get();

        if (loading) {
          if (!loadingResults.includes(resultId)) {
            set({
              loadingResults: [...loadingResults, resultId],
            });
          }
        } else {
          set({
            loadingResults: loadingResults.filter((id) => id !== resultId),
          });
        }
      },

      setError: (resultId: string, error: string | null) => {
        const { resultErrors } = get();

        if (error) {
          set({
            resultErrors: {
              ...resultErrors,
              [resultId]: error,
            },
          });
        } else {
          const newErrors = { ...resultErrors };
          delete newErrors[resultId];
          set({ resultErrors: newErrors });
        }
      },

      clearError: (resultId: string) => {
        get().setError(resultId, null);
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "result-storage",
      partialize: (state) => ({
        results: state.results,
        recentResults: state.recentResults,
        bookmarkedResults: state.bookmarkedResults,
      }),
    },
  ),
);
