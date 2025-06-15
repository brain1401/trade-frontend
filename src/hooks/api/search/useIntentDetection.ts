import { useMutation } from "@tanstack/react-query";
import { useSearchStore } from "@/stores/searchStore";
import { useNavigate } from "@tanstack/react-router";
import { useAnalysisStore } from "@/stores/analysisStore";
import { useCallback } from "react";

// 의도 감지 결과 타입
export type IntentDetectionResult = {
  intent: "hscode" | "tracking" | "general" | "unknown";
  confidence: number; // 0-100
  extractedData: {
    productDescription?: string;
    cargoNumber?: string;
    hsCode?: string;
    keywords?: string[];
  };
  suggestedActions: Array<{
    type: "navigate" | "search" | "analyze";
    label: string;
    route?: string;
    params?: Record<string, string>;
  }>;
  reasoning: string;
};

// Mock 의도 감지 API 호출
const detectIntentApi = async (
  query: string,
): Promise<IntentDetectionResult> => {
  // 실제로는 백엔드 AI 서비스 호출
  await new Promise((resolve) => setTimeout(resolve, 800));

  const lowerQuery = query.toLowerCase();

  // 간단한 규칙 기반 의도 감지 (실제로는 AI 모델 사용)
  if (
    lowerQuery.includes("분석") ||
    lowerQuery.includes("hscode") ||
    lowerQuery.includes("품목") ||
    lowerQuery.includes("분류")
  ) {
    return {
      intent: "hscode",
      confidence: 85,
      extractedData: {
        productDescription: query,
        keywords: ["분석", "품목분류"],
      },
      suggestedActions: [
        {
          type: "analyze",
          label: "HS Code 분석 시작",
          route: "/hscode/analyze/$sessionId",
          params: { query },
        },
      ],
      reasoning:
        "제품 분석이나 HS Code 관련 키워드가 감지되어 품목 분류 분석을 제안합니다.",
    };
  }

  if (
    lowerQuery.includes("추적") ||
    lowerQuery.includes("cargo") ||
    /[A-Z]{2,}\d{4,}/.test(query)
  ) {
    const cargoNumber = query.match(/[A-Z]{2,}\d{4,}/)?.[0] || query;
    return {
      intent: "tracking",
      confidence: 90,
      extractedData: {
        cargoNumber,
      },
      suggestedActions: [
        {
          type: "navigate",
          label: "화물 추적하기",
          route: "/search-result/$query",
          params: { query: cargoNumber },
        },
      ],
      reasoning:
        "화물 번호 또는 추적 관련 키워드가 감지되어 화물 추적을 제안합니다.",
    };
  }

  if (/^\d{4}\.\d{2}\.\d{2}$/.test(query) || /^\d{6,10}$/.test(query)) {
    return {
      intent: "hscode",
      confidence: 95,
      extractedData: {
        hsCode: query,
      },
      suggestedActions: [
        {
          type: "navigate",
          label: "HS Code 정보 보기",
          route: "/hscode-info/$hscode",
          params: { hscode: query },
        },
        {
          type: "search",
          label: "관련 통계 보기",
          route: "/search-result/$query",
          params: { query: `${query} 통계` },
        },
      ],
      reasoning: "HS Code 형식이 감지되어 관련 정보 및 통계를 제안합니다.",
    };
  }

  return {
    intent: "general",
    confidence: 60,
    extractedData: {
      keywords: query.split(" ").filter((word) => word.length > 1),
    },
    suggestedActions: [
      {
        type: "search",
        label: "일반 검색",
        route: "/search-result/$query",
        params: { query },
      },
    ],
    reasoning: "특정 의도를 명확히 감지할 수 없어 일반 검색을 제안합니다.",
  };
};

// 의도 감지 훅
export const useIntentDetection = () => {
  const searchStore = useSearchStore();
  const navigate = useNavigate();
  const analysisStore = useAnalysisStore();

  return useMutation({
    mutationFn: async (query: string): Promise<IntentDetectionResult> => {
      // 검색 상태 업데이트
      searchStore.setQuery(query);
      searchStore.setIsDetecting(true);

      try {
        const result = await detectIntentApi(query);

        // 감지된 의도를 스토어에 저장
        searchStore.setDetectedIntent(result.intent);

        return result;
      } finally {
        searchStore.setIsDetecting(false);
      }
    },

    onSuccess: (result, query) => {
      // 검색 히스토리에 추가
      searchStore.addToHistory(query, result.intent);

      console.log("Intent detected:", result);
    },

    onError: (error: Error, query) => {
      console.error("Intent detection failed:", error);
      searchStore.setError("의도 감지에 실패했습니다. 다시 시도해주세요.");

      // 실패시 일반 검색으로 폴백
      searchStore.setDetectedIntent("general");
    },
  });
};

// 의도 기반 자동 네비게이션 훅
export const useSmartNavigation = () => {
  const navigate = useNavigate();
  const analysisStore = useAnalysisStore();
  const searchStore = useSearchStore();

  const navigateByIntent = async (
    result: IntentDetectionResult,
    query: string,
  ) => {
    const primaryAction = result.suggestedActions[0];

    if (!primaryAction) {
      console.warn("No suggested actions found");
      return;
    }

    try {
      switch (primaryAction.type) {
        case "analyze": {
          // HS Code 분석 시작
          const sessionId = await analysisStore.createSession(query);
          navigate({
            to: "/hscode/analyze/$sessionId",
            params: { sessionId },
          });
          break;
        }

        case "navigate": {
          // 직접 페이지 이동
          if (
            primaryAction.route === "/hscode-info/$hscode" &&
            primaryAction.params?.hscode
          ) {
            navigate({
              to: "/hscode-info/$hscode",
              params: { hscode: primaryAction.params.hscode },
            });
          } else if (
            primaryAction.route === "/search-result/$query" &&
            primaryAction.params?.query
          ) {
            navigate({
              to: "/search-result/$query",
              params: { query: primaryAction.params.query },
            });
          }
          break;
        }

        case "search": {
          // 검색 결과 페이지로 이동
          if (primaryAction.params?.query) {
            navigate({
              to: "/search-result/$query",
              params: { query: primaryAction.params.query },
            });
          }
          break;
        }

        default:
          console.warn("Unknown action type:", primaryAction.type);
      }
    } catch (error) {
      console.error("Navigation failed:", error);
      searchStore.setError("페이지 이동에 실패했습니다.");
    }
  };

  return { navigateByIntent };
};

// 통합 인텔리전트 검색 훅
export const useIntelligentSearch = () => {
  const intentDetection = useIntentDetection();
  const smartNavigation = useSmartNavigation();

  // performSearch 함수를 useCallback으로 memoize
  const performSearch = useCallback(
    async (query: string, autoNavigate: boolean = true) => {
      try {
        const result = await intentDetection.mutateAsync(query);

        if (autoNavigate && result.confidence > 70) {
          // 신뢰도가 높으면 자동 네비게이션
          await smartNavigation.navigateByIntent(result, query);
        }

        return result;
      } catch (error) {
        console.error("Intelligent search failed:", error);
        throw error;
      }
    },
    [intentDetection, smartNavigation],
  );

  return {
    performSearch,
    isDetecting: intentDetection.isPending,
    error: intentDetection.error,
  };
};
