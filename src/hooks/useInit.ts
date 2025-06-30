import { useGetExchangeRates } from "@/lib/api";
import { useAuth } from "@/stores/authStore";
import { useEffect } from "react";

type UseInitReturnType = {
  isLoading: boolean;
};

/**
 * 앱 초기화 커스텀 훅
 *
 * 앱 시작에 필요한 모든 비동기 초기화 작업을 관리함
 *
 * @description
 * - 인증 상태 초기화 (토큰 확인 등)
 * - 공개 데이터 사전 로딩 (환율, 공지사항 등)
 *
 * @example
 * ```tsx
 * function App() {
 *   const { isLoading } = useInit();
 *   if (isLoading) return <SplashScreen />;
 *   return <Router />;
 * }
 * ```
 */
export default function useInit(): UseInitReturnType {
  // 인증 상태 초기화
  const { initialize, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const { isLoading: isExchangeRateLoading } = useGetExchangeRates();

  return {
    isLoading: isAuthLoading || isExchangeRateLoading,
  };
}
