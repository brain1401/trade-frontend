import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/stores/authStore";
import { requireAuth } from "@/lib/utils/authGuard";
import {
  Search,
  Bookmark,
  Bell,
  BarChart3,
  User,
  Zap,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import {
  mockDashboardSummary,
  getRecentFeedItems,
} from "@/data/mock/dashboard";
import { mockExchangeRates } from "@/data/mock/exchange-rates";

/**
 * 대시보드 라우트 정의 (TanStack Router 공식 방식)
 *
 * 모듈화된 인증 가드 사용으로 코드 재사용성 향상
 * @see https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes
 */
export const Route = createFileRoute("/dashboard/")({
  beforeLoad: ({ context, location }) => {
    requireAuth(context, location);
  },
  component: DashboardPage,
});

/**
 * 대시보드 카드 데이터 정의
 * 각 카드는 아이콘, 제목, 설명, 라우트 정보를 포함
 */
const dashboardCards = [
  {
    id: "recent-search",
    title: "최근 검색",
    description: "최근 검색한 HS코드와 상품정보를 확인할 수 있습니다.",
    icon: Search,
    href: "/search" as const,
    color: "primary" as const,
  },
  {
    id: "bookmarks",
    title: "북마크",
    description: "관심 있는 상품과 규제 정보를 저장하고 관리할 수 있습니다.",
    icon: Bookmark,
    href: "/dashboard/bookmarks" as const,
    color: "success" as const,
  },
  {
    id: "notifications",
    title: "알림 설정",
    description: "중요한 규제 변경사항에 대한 알림을 받을 수 있습니다.",
    icon: Bell,
    href: "/dashboard/settings" as const,
    color: "warning" as const,
  },
  {
    id: "trade-stats",
    title: "무역 통계",
    description: "개인화된 무역 통계와 트렌드를 확인할 수 있습니다.",
    icon: BarChart3,
    href: "/statistics" as const,
    color: "info" as const,
  },
  {
    id: "profile",
    title: "프로필 관리",
    description: "계정 정보와 설정을 관리할 수 있습니다.",
    icon: User,
    href: "/dashboard/profile" as const,
    color: "neutral" as const,
  },
];

/**
 * 대시보드 카드 컴포넌트
 * 클릭 가능한 링크 카드로 구현하여 사용자 경험 개선
 */
type DashboardCardProps = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: "primary" | "success" | "warning" | "info" | "neutral" | "brand";
  badge?: string;
};

function DashboardCard({
  title,
  description,
  icon: Icon,
  href,
  color,
  badge,
}: DashboardCardProps) {
  // 색상별 스타일 매핑 (커스텀 색상 시스템 활용)
  const colorStyles = {
    primary:
      "hover:border-primary-200 hover:bg-primary-50/50 focus-within:ring-primary-500",
    success:
      "hover:border-success-200 hover:bg-success-50/50 focus-within:ring-success-500",
    warning:
      "hover:border-warning-200 hover:bg-warning-50/50 focus-within:ring-warning-500",
    info: "hover:border-info-200 hover:bg-info-50/50 focus-within:ring-info-500",
    neutral:
      "hover:border-neutral-200 hover:bg-neutral-50/50 focus-within:ring-neutral-500",
    brand:
      "hover:border-brand-200 hover:bg-brand-50/50 focus-within:ring-brand-500",
  };

  const iconColors = {
    primary: "text-primary-600",
    success: "text-success-600",
    warning: "text-warning-600",
    info: "text-info-600",
    neutral: "text-neutral-600",
    brand: "text-brand-600",
  };

  return (
    <Link to={href} className="group block">
      <Card
        className={`cursor-pointer transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-2 hover:-translate-y-1 hover:shadow-md ${colorStyles[color]} `}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Icon
              className={`h-6 w-6 ${iconColors[color]} transition-transform duration-200 group-hover:scale-110`}
            />
            <div className="flex items-center gap-2">
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
              <ChevronRight className="h-4 w-4 text-neutral-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-neutral-600" />
            </div>
          </div>
          <CardTitle className="text-lg font-semibold text-neutral-800 group-hover:text-neutral-900">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-neutral-600">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * 대시보드 요약 통계 컴포넌트
 * 사용자의 활동 현황을 한눈에 보여줌
 */
function DashboardSummary() {
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

/**
 * 최근 업데이트 피드 컴포넌트
 * 사용자가 관심있어하는 항목들의 최신 변경사항 표시
 */
function RecentUpdatesFeed() {
  const recentUpdates = getRecentFeedItems(5);

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case "HIGH":
        return <AlertCircle className="text-danger-600 h-4 w-4" />;
      case "MEDIUM":
        return <AlertCircle className="h-4 w-4 text-warning-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-success-600" />;
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "HIGH":
        return (
          <Badge variant="destructive" className="text-xs">
            높음
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge
            variant="default"
            className="bg-warning-100 text-xs text-warning-800"
          >
            보통
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            낮음
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary-600" />
          최근 업데이트
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentUpdates.map((update) => (
          <div
            key={update.id}
            className="flex items-start gap-3 rounded-lg border border-neutral-200 p-3 transition-colors hover:bg-neutral-50"
          >
            {getImportanceIcon(update.importance)}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-neutral-900">
                  {update.title}
                </h4>
                {getImportanceBadge(update.importance)}
              </div>
              <p className="text-xs text-neutral-600">{update.content}</p>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>{update.sourceUrl ? "공식 발표" : "업데이트"}</span>
                <span>•</span>
                <span>
                  {new Date(update.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * 주요 환율 정보 컴포넌트
 * 무역에 중요한 주요 통화의 환율 정보 표시
 */
function ExchangeRatesWidget() {
  const exchangeRates = mockExchangeRates.slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-info-600" />
          주요 환율
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {exchangeRates.map((rate) => (
          <div
            key={rate.currencyCode}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-900">
                {rate.currencyCode}
              </span>
              <span className="text-xs text-neutral-500">
                {rate.currencyName}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-900">
                {rate.exchangeRate.toLocaleString()}원
              </p>
              <p
                className={`text-xs ${
                  rate.changeAmount && rate.changeAmount > 0
                    ? "text-danger-600"
                    : rate.changeAmount && rate.changeAmount < 0
                      ? "text-success-600"
                      : "text-neutral-500"
                }`}
              >
                {rate.changeAmount
                  ? `${rate.changeAmount > 0 ? "+" : ""}${rate.changeAmount.toFixed(2)}`
                  : "변동 없음"}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * 보호된 대시보드 페이지
 *
 * 인증된 사용자만 접근 가능
 * beforeLoad에서 인증을 확인하고 미인증 사용자는 로그인 페이지로 리디렉션됨
 */
function DashboardPage() {
  // const { user } = useAuth();
  const dashboardSummary = mockDashboardSummary;

  // 카드별 뱃지 추가
  const enhancedCards = dashboardCards.map((card) => ({
    ...card,
    badge:
      card.id === "bookmarks"
        ? `${dashboardSummary.bookmarks.monitoringActive}개 활성`
        : card.id === "notifications"
          ? `${dashboardSummary.notifications.unreadFeeds}개 미읽음`
          : undefined,
  }));

  return (
    <div className="container mx-auto space-y-8 py-8">
      {/* 헤더 섹션 - 사용자 환영 메시지 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          대시보드
        </h1>
        <p className="mt-2 text-neutral-600">
          {/* {user?.name}님, 개인화된 무역 정보를 확인해보세요. */}
          김철수님, 개인화된 무역 정보를 확인해보세요.
        </p>
      </div>

      {/* 요약 통계 */}
      <DashboardSummary />

      {/* 메인 콘텐츠 그리드 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 왼쪽 컬럼 - 주요 기능 카드 */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold text-neutral-900">
              주요 기능
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {enhancedCards.map((card) => (
                <DashboardCard
                  key={card.id}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  href={card.href}
                  color={card.color}
                  badge={card.badge}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽 컬럼 - 업데이트와 환율 정보 */}
        <div className="space-y-6">
          <RecentUpdatesFeed />
          <ExchangeRatesWidget />
        </div>
      </div>
    </div>
  );
}
