import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "@/lib/utils/authGuard";
import { Search, Bookmark, Bell, User } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import {
  bookmarkQueries,
  chatHistoryQueries,
  dashboardNotificationQueries,
} from "@/lib/api";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import DashboardCard from "@/components/dashboard/DashboardCard";
import RecentUpdatesFeed from "@/components/dashboard/RecentUpdatesFeed";
import { useAuth } from "@/stores/authStore";

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
    title: "최근 대화",
    description: "최근 대화를 확인할 수 있습니다.",
    icon: Search,
    href: "/dashboard/history" as const,
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
    id: "profile",
    title: "프로필 관리",
    description: "계정 정보와 설정을 관리할 수 있습니다.",
    icon: User,
    href: "/dashboard/profile" as const,
    color: "neutral" as const,
  },
];

/**
 * 보호된 대시보드 페이지
 *
 * 인증된 사용자만 접근 가능
 * beforeLoad에서 인증을 확인하고 미인증 사용자는 로그인 페이지로 리디렉션됨
 */
function DashboardPage() {
  const { user } = useAuth();
  // 북마크 상세페이지 들어가기 전에 미리 dashboard에서 데이터를 가져와서 캐싱 해놓음.
  useQuery(bookmarkQueries.list());
  useQuery(chatHistoryQueries.list());
  useQuery(dashboardNotificationQueries.settings(user));
  return (
    <div className="container mx-auto space-y-8 py-8">
      {/* 헤더 섹션 - 사용자 환영 메시지 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          대시보드
        </h1>
        <p className="mt-2 text-neutral-600">
          {/* {user?.name}님, 개인화된 무역 정보를 확인해보세요. */}
          {user?.name}님, 개인화된 무역 정보를 확인해보세요.
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
              {dashboardCards.map((card) => (
                <DashboardCard
                  key={card.id}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  href={card.href}
                  color={card.color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽 컬럼 - 업데이트와 환율 정보 */}
        <div className="space-y-6">
          <RecentUpdatesFeed />
          {/* <ExchangeRatesWidget /> */}
        </div>
      </div>
    </div>
  );
}
