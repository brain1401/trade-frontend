import { Bell, Bookmark, MessageSquare, Search } from "lucide-react";
import type { MetricCardData } from "@/components/dashboard/MetricCard";
import type { StatItem, DashboardMetrics } from "@/types/dashboard";
import type { DashBoardData } from "@/lib/api/dashboard/types";
import type { BookmarkData } from "@/lib/api/bookmark/types";
import { generateUnifiedMockMetrics } from "./mock-data";

/**
 * 데이터 변환 유틸리티 함수들
 * API 응답 데이터를 각 컴포넌트에서 필요한 형태로 변환
 * Requirements: 2.2, 1.2
 */

/**
 * API 응답 데이터를 통합 DashboardMetrics 형태로 변환
 * @param bookmarksData 북마크 API 응답 데이터
 * @param dashboardData 대시보드 API 응답 데이터
 * @returns DashboardMetrics
 */
export function transformApiDataToMetrics(
  bookmarksData?: BookmarkData,
  dashboardData?: DashBoardData,
): DashboardMetrics {
  const bookmarks = bookmarksData?.content ?? [];
  const activeBookmarks = bookmarks.filter(
    (bookmark) => bookmark.monitoringActive,
  );

  return {
    totalBookmarks: bookmarks.length,
    activeMonitoring: activeBookmarks.length,
    unreadFeeds: dashboardData?.notifications?.unreadFeeds ?? 0,
    totalSessions: dashboardData?.chatHistory?.totalSessions ?? 0,
    totalMessages: dashboardData?.chatHistory?.totalMessages ?? 0,
    recentSessions30d: dashboardData?.chatHistory?.recentSessions30d ?? 0,
  };
}

/**
 * DashboardMetrics를 MetricCardData 배열로 변환 (DashboardSummary용)
 * @param metrics DashboardMetrics 데이터
 * @param loading 로딩 상태
 * @param error 에러 상태
 * @returns MetricCardData 배열
 */
export function transformMetricsToCardData(
  metrics: DashboardMetrics,
  loading = false,
  error = false,
): MetricCardData[] {
  const getBookmarkChange = () => {
    if (metrics.activeMonitoring === 0)
      return { value: "0%", trend: "neutral" as const };
    const percentage = Math.round(
      (metrics.activeMonitoring / metrics.totalBookmarks) * 100,
    );
    return { value: `${percentage}% 활성`, trend: "up" as const };
  };

  const getSessionChange = () => {
    if (metrics.recentSessions30d === 0)
      return { value: "0%", trend: "neutral" as const };
    return { value: `최근 30일`, trend: "up" as const };
  };

  const getFeedChange = () => {
    if (metrics.unreadFeeds === 0)
      return { value: "모두 읽음", trend: "neutral" as const };
    return {
      value: `${metrics.unreadFeeds}개 신규`,
      trend: metrics.unreadFeeds > 5 ? ("up" as const) : ("neutral" as const),
    };
  };

  const getMessageChange = () => {
    if (metrics.totalMessages === 0)
      return { value: "0%", trend: "neutral" as const };
    const avgPerSession =
      metrics.totalSessions > 0
        ? Math.round(metrics.totalMessages / metrics.totalSessions)
        : 0;
    return {
      value: `평균 ${avgPerSession}개/세션`,
      trend: "neutral" as const,
    };
  };

  return [
    {
      title: "총 북마크",
      value: metrics.totalBookmarks,
      description: `활성 모니터링: ${metrics.activeMonitoring}개`,
      icon: Bookmark,
      change: getBookmarkChange(),
      loading,
      error,
    },
    {
      title: "읽지 않은 피드",
      value: metrics.unreadFeeds,
      description: "새로운 업데이트",
      icon: Bell,
      change: getFeedChange(),
      loading,
      error,
    },
    {
      title: "총 채팅 세션",
      value: metrics.totalSessions,
      description: `최근 30일: ${metrics.recentSessions30d}건`,
      icon: Search,
      change: getSessionChange(),
      loading,
      error,
    },
    {
      title: "총 메시지",
      value: metrics.totalMessages,
      description: `전체 채팅 세션: ${metrics.totalSessions}건`,
      icon: MessageSquare,
      change: getMessageChange(),
      loading,
      error,
    },
  ];
}

/**
 * DashboardMetrics를 StatItem 배열로 변환 (QuickStats용)
 * @param metrics DashboardMetrics 데이터
 * @returns StatItem 배열
 */
export function transformMetricsToStatItems(
  metrics: DashboardMetrics,
): StatItem[] {
  return [
    {
      id: "total-bookmarks",
      label: "전체 북마크",
      value: metrics.totalBookmarks,
      icon: Bookmark,
      description: "저장된 북마크 수",
      href: "/dashboard/bookmarks",
      trend: {
        value: `활성 ${metrics.activeMonitoring}개`,
        direction: "up",
      },
    },
    {
      id: "active-monitoring",
      label: "활성 모니터링",
      value: metrics.activeMonitoring,
      icon: Search,
      description: "모니터링 중인 항목",
      href: "/dashboard/monitoring",
      trend: {
        value: `${Math.round((metrics.activeMonitoring / Math.max(metrics.totalBookmarks, 1)) * 100)}%`,
        direction: metrics.activeMonitoring > 0 ? "up" : "neutral",
      },
    },
    {
      id: "unread-feeds",
      label: "읽지 않은 피드",
      value: metrics.unreadFeeds,
      icon: Bell,
      description: "새로운 피드 항목",
      href: "/dashboard/feeds",
      trend: {
        value: metrics.unreadFeeds > 0 ? `+${metrics.unreadFeeds}개` : "없음",
        direction: metrics.unreadFeeds > 5 ? "up" : "neutral",
      },
    },
    {
      id: "total-sessions",
      label: "총 채팅 세션",
      value: metrics.totalSessions,
      icon: MessageSquare,
      description: "전체 채팅 세션 수",
      href: "/dashboard/chat",
      trend: {
        value: `최근 30일 ${metrics.recentSessions30d}건`,
        direction: "up",
      },
    },
  ];
}

/**
 * Mock 데이터를 실제 API 구조와 일치하도록 생성
 * generateUnifiedMockMetrics를 사용하여 일관성 보장
 * @param overrides 특정 값들을 오버라이드하기 위한 옵션
 * @returns DashboardMetrics
 */
export function generateEnhancedMockData(
  overrides?: Partial<DashboardMetrics>,
): DashboardMetrics {
  // mock-data.ts의 통합 함수를 사용하여 일관성 보장
  const baseMetrics = generateUnifiedMockMetrics({
    totalBookmarks: overrides?.totalBookmarks,
    activeMonitoring: overrides?.activeMonitoring,
    unreadFeeds: overrides?.unreadFeeds,
    totalSessions: overrides?.totalSessions,
    totalMessages: overrides?.totalMessages,
    recentSessions30d: overrides?.recentSessions30d,
  });

  return {
    totalBookmarks: baseMetrics.totalBookmarks,
    activeMonitoring: baseMetrics.activeMonitoring,
    unreadFeeds: baseMetrics.unreadFeeds,
    totalSessions: baseMetrics.totalSessions,
    totalMessages: baseMetrics.totalMessages,
    recentSessions30d: baseMetrics.recentSessions30d,
  };
}

/**
 * API 데이터 유효성 검증 및 기본값 설정
 * @param bookmarksData 북마크 API 응답
 * @param dashboardData 대시보드 API 응답
 * @returns 검증된 데이터 또는 null
 */
export function validateApiData(
  bookmarksData?: BookmarkData,
  dashboardData?: DashBoardData,
): { isValid: boolean; metrics?: DashboardMetrics } {
  try {
    // 기본적인 데이터 구조 검증
    if (bookmarksData && !Array.isArray(bookmarksData.content)) {
      console.warn("Invalid bookmarks data structure");
      return { isValid: false };
    }

    if (dashboardData) {
      const requiredFields = ["chatHistory", "notifications"];
      const missingFields = requiredFields.filter(
        (field) => !(field in dashboardData),
      );

      if (missingFields.length > 0) {
        console.warn(
          `Missing dashboard data fields: ${missingFields.join(", ")}`,
        );
        return { isValid: false };
      }
    }

    // 데이터가 유효하면 변환하여 반환
    const metrics = transformApiDataToMetrics(bookmarksData, dashboardData);
    return { isValid: true, metrics };
  } catch (error) {
    console.error("Error validating API data:", error);
    return { isValid: false };
  }
}

/**
 * 데이터 소스 정보를 포함한 메트릭 생성
 * @param bookmarksData 북마크 API 응답
 * @param dashboardData 대시보드 API 응답
 * @param fallbackToMock API 실패 시 mock 데이터 사용 여부
 * @param sourceOverride 소스 타입 강제 지정 (오프라인 모드용)
 * @returns 메트릭 데이터와 소스 정보
 */
export function createMetricsWithSource(
  bookmarksData?: BookmarkData,
  dashboardData?: DashBoardData,
  fallbackToMock = true,
  sourceOverride?: "offline",
): {
  metrics: DashboardMetrics;
  source: "api" | "mock" | "partial" | "offline";
  hasApiData: boolean;
  hasMockData: boolean;
} {
  const hasBookmarkData =
    bookmarksData?.content && bookmarksData.content.length >= 0;
  const hasDashboardData =
    dashboardData?.chatHistory && dashboardData?.notifications;

  // 오프라인 모드 처리 (Requirements: 4.3)
  if (sourceOverride === "offline") {
    // 오프라인 상태에서 캐시된 데이터 사용
    if (hasBookmarkData || hasDashboardData) {
      const validation = validateApiData(bookmarksData, dashboardData);
      if (validation.isValid && validation.metrics) {
        return {
          metrics: validation.metrics,
          source: "offline",
          hasApiData: true,
          hasMockData: false,
        };
      }
    }

    // 캐시된 데이터가 없으면 mock 데이터 사용
    if (fallbackToMock) {
      return {
        metrics: generateEnhancedMockData(),
        source: "offline",
        hasApiData: false,
        hasMockData: true,
      };
    }
  }

  // API 데이터가 있으면 우선 사용
  if (hasBookmarkData || hasDashboardData) {
    const validation = validateApiData(bookmarksData, dashboardData);
    if (validation.isValid && validation.metrics) {
      return {
        metrics: validation.metrics,
        source: hasBookmarkData && hasDashboardData ? "api" : "partial",
        hasApiData: true,
        hasMockData: false,
      };
    }
  }

  // API 데이터가 없거나 유효하지 않으면 mock 데이터 사용
  if (fallbackToMock) {
    return {
      metrics: generateEnhancedMockData(),
      source: "mock",
      hasApiData: false,
      hasMockData: true,
    };
  }

  // Fallback이 비활성화된 경우 빈 데이터 반환
  return {
    metrics: {
      totalBookmarks: 0,
      activeMonitoring: 0,
      unreadFeeds: 0,
      totalSessions: 0,
      totalMessages: 0,
      recentSessions30d: 0,
    },
    source: "api",
    hasApiData: false,
    hasMockData: false,
  };
}
