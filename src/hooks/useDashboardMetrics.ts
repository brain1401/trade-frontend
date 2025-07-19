import { useQuery } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";
import { bookmarkQueries, dashboardQueries } from "@/lib/api";
import {
  generateMockQuickStats,
  generateUnifiedMockMetrics,
} from "@/lib/utils/mock-data";
import {
  transformApiDataToMetrics,
  transformMetricsToCardData,
  transformMetricsToStatItems,
  createMetricsWithSource,
} from "@/lib/utils/dashboard-transformers";
import {
  createErrorState,
  isRetryableError,
  logError,
  globalErrorTracker,
} from "@/lib/utils/error-handling";
import { useDashboardCache } from "./useDashboardCache";
import { applyCacheConfig } from "@/lib/cache/dashboard-cache-strategy";
import type { DashboardMetrics, StatItem, ErrorState } from "@/types/dashboard";
import type { MetricCardData } from "@/components/dashboard/MetricCard";

/**
 * 통합 대시보드 메트릭 데이터 훅
 *
 * API 데이터를 우선 사용하고, 실패 시 mock 데이터로 fallback하는 로직을 제공
 * 모든 대시보드 통계 컴포넌트가 동일한 데이터 소스를 사용하도록 통합 관리
 * 향상된 캐싱 전략으로 데이터 일관성과 오프라인 지원 제공
 *
 * Requirements: 1.1, 2.1, 3.1, 4.1, 4.2, 4.3
 */
export function useDashboardMetrics() {
  // 캐시 관리 훅 사용
  const { getCacheConfig, isOnline, availableOfflineData } =
    useDashboardCache();

  // 북마크 데이터 쿼리 (향상된 캐싱 적용)
  const {
    data: bookmarksData,
    isLoading: bookmarksLoading,
    isError: bookmarksError,
    error: bookmarksErrorDetails,
    refetch: refetchBookmarks,
  } = useQuery(
    applyCacheConfig(
      bookmarkQueries.list(),
      "bookmarks",
      getCacheConfig("bookmarks"),
    ),
  );

  // 대시보드 데이터 쿼리 (향상된 캐싱 적용)
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    isError: dashboardError,
    error: dashboardErrorDetails,
    refetch: refetchDashboard,
  } = useQuery(
    applyCacheConfig(
      dashboardQueries.data(),
      "metrics",
      getCacheConfig("metrics"),
    ),
  );

  // 통합 로딩 상태
  const isLoading = bookmarksLoading || dashboardLoading;
  const isError = bookmarksError && dashboardError; // 모든 API가 실패했을 때만 에러로 처리
  const hasPartialError = bookmarksError || dashboardError;

  // 통합 메트릭 데이터 생성 (캐싱 및 오프라인 지원 포함)
  const { metrics, source: dataSource } = useMemo(() => {
    if (isLoading) {
      // 로딩 중일 때는 빈 데이터와 로딩 소스 반환
      return {
        metrics: {
          totalBookmarks: 0,
          activeMonitoring: 0,
          unreadFeeds: 0,
          totalSessions: 0,
          totalMessages: 0,
          recentSessions30d: 0,
        },
        source: "loading" as const,
      };
    }

    // 오프라인 상태에서 캐시된 데이터 사용 (Requirements: 4.3)
    if (!isOnline && (bookmarksError || dashboardError)) {
      const hasOfflineBookmarks = availableOfflineData.bookmarks;
      const hasOfflineDashboard = availableOfflineData.dashboard;

      if (hasOfflineBookmarks || hasOfflineDashboard) {
        // 캐시된 데이터가 있으면 사용 (실제 캐시된 데이터는 React Query가 자동으로 제공)
        return createMetricsWithSource(
          bookmarksData,
          dashboardData,
          true,
          "offline",
        );
      }
    }

    return createMetricsWithSource(bookmarksData, dashboardData, true);
  }, [bookmarksData, dashboardData, isLoading, isOnline, availableOfflineData]);

  // 통합 에러 상태 생성 (Requirements: 3.1, 3.2)
  const error = useMemo((): ErrorState | null => {
    if (!hasPartialError) return null;

    const errors: ErrorState[] = [];

    // 북마크 API 에러 처리
    if (bookmarksError && bookmarksErrorDetails) {
      const errorState = createErrorState(bookmarksErrorDetails, "북마크");
      errors.push(errorState);
      globalErrorTracker.recordError("dashboard-bookmarks", errorState);
    }

    // 대시보드 API 에러 처리
    if (dashboardError && dashboardErrorDetails) {
      const errorState = createErrorState(dashboardErrorDetails, "대시보드");
      errors.push(errorState);
      globalErrorTracker.recordError("dashboard-metrics", errorState);
    }

    // 통합 에러 상태 반환
    if (errors.length === 1) {
      return errors[0];
    } else if (errors.length > 1) {
      // 여러 에러가 있는 경우 가장 심각한 에러 타입을 선택
      const severityOrder = ["permission", "server", "network", "unknown"];
      const mostSevereError = errors.sort((a, b) => {
        return severityOrder.indexOf(a.type) - severityOrder.indexOf(b.type);
      })[0];

      return {
        type: mostSevereError.type,
        message: `일부 데이터를 불러올 수 없습니다. (${errors.length}개 오류)`,
        retryable: errors.some((e) => e.retryable),
        section: "대시보드",
      };
    }

    return null;
  }, [
    hasPartialError,
    bookmarksError,
    dashboardError,
    bookmarksErrorDetails,
    dashboardErrorDetails,
  ]);

  // 향상된 재시도 함수 (Requirements: 3.2)
  const refetch = useCallback(async () => {
    try {
      // 에러 로깅
      if (error) {
        logError(error, {
          action: "retry",
          timestamp: new Date().toISOString(),
          retryCount: globalErrorTracker.getErrorCount("dashboard-retry") + 1,
        });
      }

      // 병렬로 모든 쿼리 재시도
      const results = await Promise.allSettled([
        refetchBookmarks(),
        refetchDashboard(),
      ]);

      // 재시도 결과 확인
      const failures = results.filter((result) => result.status === "rejected");
      if (failures.length === 0) {
        // 성공 시 에러 카운터 리셋
        globalErrorTracker.reset();
      }

      return results;
    } catch (retryError) {
      // 재시도 실패 로깅
      const retryErrorState = createErrorState(retryError, "재시도");
      globalErrorTracker.recordError("dashboard-retry", retryErrorState);
      logError(retryErrorState, { originalError: error });
      throw retryError;
    }
  }, [refetchBookmarks, refetchDashboard, error]);

  return {
    data: metrics,
    isLoading,
    isError,
    hasPartialError,
    error,
    dataSource,
    refetch,
    // 에러 상태 관련 추가 정보 (Requirements: 3.1, 3.3)
    canRetry: error ? isRetryableError(error) : false,
    isRecurringError: error
      ? globalErrorTracker.isRecurringError("dashboard-metrics")
      : false,
    errorCount: globalErrorTracker.getErrorCount("dashboard-metrics"),
    // 캐싱 및 오프라인 상태 정보 (Requirements: 4.1, 4.2, 4.3)
    isOnline,
    isOfflineMode: dataSource === "offline",
    hasOfflineData:
      availableOfflineData.bookmarks || availableOfflineData.dashboard,
    // 개별 쿼리 상태도 제공 (디버깅용)
    _internal: {
      bookmarks: {
        isLoading: bookmarksLoading,
        isError: bookmarksError,
        error: bookmarksErrorDetails,
      },
      dashboard: {
        isLoading: dashboardLoading,
        isError: dashboardError,
        error: dashboardErrorDetails,
      },
    },
  };
}

/**
 * DashboardSummary 컴포넌트용 데이터 변환 훅 (새로운 변환 유틸리티 사용)
 * Requirements: 3.1, 3.2 - 일관된 에러 처리 및 재시도 기능
 */
export function useDashboardSummaryData() {
  const {
    data: metrics,
    isLoading,
    isError,
    hasPartialError,
    error,
    refetch,
    canRetry,
    isRecurringError,
    errorCount,
  } = useDashboardMetrics();

  const metricsData = useMemo((): MetricCardData[] => {
    return transformMetricsToCardData(
      metrics,
      isLoading,
      isError || hasPartialError,
    );
  }, [metrics, isLoading, isError, hasPartialError]);

  return {
    metricsData,
    isLoading,
    isError,
    hasPartialError,
    error,
    refetch,
    canRetry,
    isRecurringError,
    errorCount,
  };
}

/**
 * QuickStats 컴포넌트용 데이터 변환 훅 (새로운 변환 유틸리티 사용)
 * Requirements: 3.1, 3.2 - 일관된 에러 처리 및 재시도 기능
 */
export function useDashboardQuickStats() {
  const {
    data: metrics,
    isLoading,
    isError,
    hasPartialError,
    error,
    refetch,
    dataSource,
    canRetry,
    isRecurringError,
    errorCount,
  } = useDashboardMetrics();

  const statsData = useMemo((): StatItem[] => {
    // API 데이터나 부분 API 데이터가 있으면 변환 유틸리티 사용
    if (dataSource === "api" || dataSource === "partial") {
      return transformMetricsToStatItems(metrics);
    }

    // Mock 데이터 사용 (로딩 중이거나 API 완전 실패 시)
    // 통합된 mock 메트릭을 사용하여 일관성 보장
    const unifiedMockMetrics = generateUnifiedMockMetrics({
      totalBookmarks: metrics.totalBookmarks || undefined,
      activeMonitoring: metrics.activeMonitoring || undefined,
      unreadFeeds: metrics.unreadFeeds || undefined,
      totalSessions: metrics.totalSessions || undefined,
      totalMessages: metrics.totalMessages || undefined,
      recentSessions30d: metrics.recentSessions30d || undefined,
    });

    return generateMockQuickStats(unifiedMockMetrics);
  }, [metrics, dataSource]);

  return {
    statsData,
    isLoading,
    isError,
    hasPartialError,
    error,
    refetch,
    dataSource,
    canRetry,
    isRecurringError,
    errorCount,
  };
}
