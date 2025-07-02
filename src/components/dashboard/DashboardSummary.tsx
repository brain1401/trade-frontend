import { mockDashboardSummary } from "@/data/mock/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bell, Bookmark, MessageSquare, Search } from "lucide-react";

/**
 * 대시보드 요약 통계 컴포넌트
 * 사용자의 활동 현황을 한눈에 보여줌
 */
export default function DashboardSummary() {
  const dashboardSummary = mockDashboardSummary;

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
            활성 모니터링: {dashboardSummary.bookmarks.monitoringActive}개
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            읽지 않은 피드
          </CardTitle>
          <Bell className="h-4 w-4 text-warning-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            {dashboardSummary.notifications.unreadFeeds}
          </div>
          <p className="text-xs text-neutral-500">
            오늘 발송: SMS {dashboardSummary.notifications.dailySms}건
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            총 채팅 세션
          </CardTitle>
          <Search className="h-4 w-4 text-info-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            {dashboardSummary.chatHistory.totalSessions}
          </div>
          <p className="text-xs text-neutral-500">
            최근 30일: {dashboardSummary.chatHistory.sessionsLast30Days}개
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            총 메시지
          </CardTitle>
          <MessageSquare className="text-brand-600 h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            {dashboardSummary.chatHistory.totalMessages}
          </div>
          <p className="text-xs text-neutral-500">
            최근 30일: {dashboardSummary.chatHistory.messagesLast30Days}개
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
