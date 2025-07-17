import { useQuery, useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  bookmarkQueries,
  chatHistoryQueries,
  dashboardNotificationQueries,
  dashboardQueries,
} from "@/lib/api";
import { useAuth } from "@/stores/authStore";
import type { User } from "@/types/auth";

/**
 * 대시보드 데이터 로딩 최적화 훅
 *
 * 기능:
 * - 병렬 데이터 로딩으로 성능 향상
 * - 조건부 쿼리 실행으로 불필요한 요청 방지
 * - 통합된 로딩 상태 관리
 * - 에러 처리 및 재시도 로직
 */
export function useDashboardData() {
  const { user } = useAuth();

  // 병렬로 실행할 쿼리들을 정의
  const queries = useMemo(
    () => [
      // 북마크 목록 쿼리
      {
        ...bookmarkQueries.list(),
        staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
        gcTime: 1000 * 60 * 10, // 10분간 가비지 컬렉션 방지
      },
      // 채팅 히스토리 쿼리
      {
        ...chatHistoryQueries.list(),
        staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
        gcTime: 1000 * 60 * 5, // 5분간 가비지 컬렉션 방지
      },
      // 대시보드 데이터 쿼리
      {
        ...dashboardQueries.data(),
        staleTime: 1000 * 60 * 1, // 1분간 캐시 유지
        gcTime: 1000 * 60 * 3, // 3분간 가비지 컬렉션 방지
      },
      // 알림 설정 쿼리 (사용자가 있을 때만 실행)
      {
        ...dashboardNotificationQueries.settings(user),
        enabled: !!user,
        staleTime: 1000 * 60 * 10, // 10분간 캐시 유지
        gcTime: 1000 * 60 * 20, // 20분간 가비지 컬렉션 방지
      },
    ],
    [user],
  );

  // useQueries를 사용하여 병렬 실행
  const results = useQueries({
    queries,
    combine: (results) => {
      return {
        // 개별 쿼리 결과
        bookmarks: results[0],
        chatHistory: results[1],
        dashboardData: results[2],
        notifications: results[3],

        // 통합 상태
        isLoading: results.some((result) => result.isLoading),
        isError: results.some((result) => result.isError),
        isFetching: results.some((result) => result.isFetching),

        // 에러 정보
        errors: results
          .filter((result) => result.error)
          .map((result) => result.error),

        // 성공 여부
        isSuccess: results.every(
          (result) => result.isSuccess || result.isError,
        ),
      };
    },
  });

  return results;
}

/**
 * 개별 대시보드 섹션을 위한 최적화된 데이터 훅
 */
export function useDashboardSection(
  section: "bookmarks" | "chat" | "notifications" | "dashboard",
) {
  const { user } = useAuth();

  const queryMap = {
    bookmarks: () =>
      useQuery({
        ...bookmarkQueries.list(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
      }),
    chat: () =>
      useQuery({
        ...chatHistoryQueries.list(),
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5,
      }),
    notifications: () =>
      useQuery({
        ...dashboardNotificationQueries.settings(user),
        enabled: !!user,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 20,
      }),
    dashboard: () =>
      useQuery({
        ...dashboardQueries.data(),
        staleTime: 1000 * 60 * 1,
        gcTime: 1000 * 60 * 3,
      }),
  };

  return queryMap[section]();
}

/**
 * 대시보드 데이터 프리페칭 훅
 * 사용자가 대시보드에 접근하기 전에 데이터를 미리 로드
 */
export function useDashboardPrefetch() {
  const { user } = useAuth();

  return useMemo(
    () => ({
      prefetchBookmarks: () => bookmarkQueries.list(),
      prefetchChatHistory: () => chatHistoryQueries.list(),
      prefetchDashboardData: () => dashboardQueries.data(),
      prefetchNotifications: user
        ? () => dashboardNotificationQueries.settings(user)
        : null,
    }),
    [user],
  );
}
