import {
  exchangeRatesQueries,
  newsApi,
  newsQueries,
  statisticsQueries,
} from "@/lib/api";
import { useAuth } from "@/stores/authStore";
import type { User } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { defaultStatsSearchParams } from "@/data/statistics";
import { KOR_REPORTER_CODE } from "@/data/common";

type AuthContext = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  rememberMe: boolean;
  tokenExpiresAt: Date | null;
};

type UseInitReturnType = {
  isLoading: boolean;
  authContext: AuthContext;
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
  const { initialize, isLoading: isAuthLoading, ...auth } = useAuth();

  // auth 컨텍스트를 메모이제이션하여 불필요한 재렌더링 방지
  const authContext = useMemo(
    () => ({
      isAuthenticated: auth.isAuthenticated,
      isLoading: isAuthLoading,
      user: auth.user,
      rememberMe: auth.rememberMe,
      tokenExpiresAt: auth.tokenExpiresAt,
    }),
    [
      auth.isAuthenticated,
      isAuthLoading,
      auth.user,
      auth.rememberMe,
      auth.tokenExpiresAt,
    ],
  );

  useEffect(() => {
    initialize();
  }, [initialize]);

  useQuery(exchangeRatesQueries.list());

  useQuery(newsQueries.list({ offset: 0, limit: 6 }));
  useQuery(newsQueries.list({ offset: 0, limit: 4 }));
  useQuery(newsQueries.list({ offset: 0, limit: 2 }));

  // TODO: 실제 배포때는 주석 해제해서 사용할 것
  // useQuery(
  //   statisticsQueries.detail({
  //     reporterCode: KOR_REPORTER_CODE,
  //     partnerCode: defaultStatsSearchParams.partnerCode,
  //     StartPeriod: defaultStatsSearchParams.startYear,
  //     EndPeriod: defaultStatsSearchParams.endYear,
  //   }),
  // );

  return {
    isLoading: isAuthLoading,
    authContext,
  };
}
