import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, Bell, Search, TrendingUp } from "lucide-react";
import {
  mockDashboardSummary,
  getActiveBookmarks,
} from "@/data/mock/dashboard";
import { getUnreadNotifications } from "@/data/mock/notifications";

/**
 * 대시보드 요약 통계 컴포넌트
 *
 * 사용자의 활동 현황을 한눈에 보여주는 통계 카드들
 * 북마크, 알림, 검색 통계 등의 핵심 지표를 표시
 */
export function DashboardSummary() {
  const dashboardSummary = mockDashboardSummary;
  const unreadNotifications = getUnreadNotifications();
  const activeBookmarks = getActiveBookmarks();

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            총 북마크
          </CardTitle>
          <Bookmark className="h-4 w-4 text-success-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            {dashboardSummary.bookmarks.total}
          </div>
          <p className="text-xs text-neutral-500">
            활성 모니터링: {dashboardSummary.bookmarks.activeMonitoring}개
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            읽지 않은 알림
          </CardTitle>
          <Bell className="h-4 w-4 text-warning-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            {unreadNotifications.length}
          </div>
          <p className="text-xs text-neutral-500">
            오늘: {dashboardSummary.feeds.todayCount}개
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            검색 횟수
          </CardTitle>
          <Search className="h-4 w-4 text-info-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            {dashboardSummary.quickStats.searchCount}
          </div>
          <p className="text-xs text-neutral-500">
            정확도: {dashboardSummary.quickStats.accuracyRate}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            절약 시간
          </CardTitle>
          <TrendingUp className="text-brand-600 h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            {dashboardSummary.quickStats.totalSavedTime}
          </div>
          <p className="text-xs text-success-600">효율성 개선</p>
        </CardContent>
      </Card>
    </div>
  );
}
