import { Bell, Bookmark, MessageSquare, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { bookmarkQueries } from "@/lib/api";
import { dashboardQueries } from "@/lib/api/dashboard/queries";
import { MetricCard } from "./MetricCard";

/**
 * 대시보드 요약 통계 컴포넌트
 * 사용자의 활동 현황을 한눈에 보여줌
 *
 * 개선사항
 * - 과도한 그라데이션과 애니메이션 제거
 * - 접근성 개선 (ARIA 라벨, 키보드 네비게이션)
 * - 일관된 색상 스키마 사용
 * - 로딩 및 에러 상태 처리
 */
export default function DashboardSummary() {
  const {
    data: paginatedData,
    isLoading: bookmarksLoading,
    isError: bookmarksError,
  } = useQuery(bookmarkQueries.list());

  const {
    data: dashboardSummaryResponse,
    isLoading: dashboardLoading,
    isError: dashboardError,
  } = useQuery(dashboardQueries.data());

  const bookmarks = paginatedData?.content ?? [];
  const activeBookmarks = bookmarks.filter(
    (bookmark) => bookmark.monitoringActive,
  );

  const totalSessions =
    dashboardSummaryResponse?.chatHistory.totalSessions ?? 0;
  const recentSessions30d =
    dashboardSummaryResponse?.chatHistory.recentSessions30d ?? 0;
  const totalMessages =
    dashboardSummaryResponse?.chatHistory.totalMessages ?? 0;
  const unreadFeeds = dashboardSummaryResponse?.notifications.unreadFeeds ?? 0;

  // Calculate change percentages based on meaningful data
  const getBookmarkChange = () => {
    if (activeBookmarks.length === 0)
      return { value: "0%", trend: "neutral" as const };
    const percentage = Math.round(
      (activeBookmarks.length / bookmarks.length) * 100,
    );
    return { value: `${percentage}% 활성`, trend: "up" as const };
  };

  const getSessionChange = () => {
    if (recentSessions30d === 0)
      return { value: "0%", trend: "neutral" as const };
    return { value: `최근 30일`, trend: "up" as const };
  };

  const getFeedChange = () => {
    if (unreadFeeds === 0)
      return { value: "모두 읽음", trend: "neutral" as const };
    return {
      value: `${unreadFeeds}개 신규`,
      trend: unreadFeeds > 5 ? ("up" as const) : ("neutral" as const),
    };
  };

  const getMessageChange = () => {
    if (totalMessages === 0) return { value: "0%", trend: "neutral" as const };
    const avgPerSession =
      totalSessions > 0 ? Math.round(totalMessages / totalSessions) : 0;
    return { value: `평균 ${avgPerSession}개/세션`, trend: "neutral" as const };
  };

  const metricsData = [
    {
      title: "총 북마크",
      value: bookmarks.length,
      description: `활성 모니터링: ${activeBookmarks.length}개`,
      icon: Bookmark,
      change: getBookmarkChange(),
      loading: bookmarksLoading,
      error: bookmarksError,
    },
    {
      title: "읽지 않은 피드",
      value: unreadFeeds,
      description: "새로운 업데이트",
      icon: Bell,
      change: getFeedChange(),
      loading: dashboardLoading,
      error: dashboardError,
    },
    {
      title: "총 채팅 세션",
      value: totalSessions,
      description: `최근 30일: ${recentSessions30d}건`,
      icon: Search,
      change: getSessionChange(),
      loading: dashboardLoading,
      error: dashboardError,
    },
    {
      title: "총 메시지",
      value: totalMessages,
      description: `전체 채팅 세션: ${totalSessions}건`,
      icon: MessageSquare,
      change: getMessageChange(),
      loading: dashboardLoading,
      error: dashboardError,
    },
  ];

  return (
    <>
      {metricsData.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          description={metric.description}
          icon={metric.icon}
          change={metric.change}
          loading={metric.loading}
          error={metric.error}
        />
      ))}
    </>
  );
}
