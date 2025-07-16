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
import ActionCard from "@/components/dashboard/ActionCard";
import ActivitySidebar from "@/components/dashboard/ActivitySidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/stores/authStore";
import {
  DashboardLayout,
  DashboardGrid,
  MetricsGrid,
  MainContentGrid,
  MainContent,
  Sidebar,
  ActionGrid,
  TouchContainer,
} from "@/components/dashboard/DashboardLayout";

/**
 * 대시보드 라우트 정의 (TanStack Router 공식 방식)
 *
 * 모듈화된 인증 가드 사용으로 코드 재사용성 향상
 * @see https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes
 */
export const Route = createFileRoute("/dashboard/")({
  beforeLoad: ({ location }) => {
    requireAuth(location);
  },
  component: DashboardPage,
});

/**
 * 대시보드 액션 카드 데이터 정의
 * 각 카드는 아이콘, 제목, 설명, 라우트 정보를 포함
 * 새로운 ActionCard 컴포넌트와 호환되는 구조
 */
const dashboardActions = [
  {
    id: "recent-search",
    title: "최근 대화",
    description: "최근 대화를 확인할 수 있습니다.",
    icon: Search,
    href: "/dashboard/history" as const,
    variant: "primary" as const,
  },
  {
    id: "bookmarks",
    title: "북마크",
    description: "관심 있는 상품과 규제 정보를 저장하고 관리할 수 있습니다.",
    icon: Bookmark,
    href: "/dashboard/bookmarks" as const,
    variant: "default" as const,
  },
  {
    id: "notifications",
    title: "알림 설정",
    description: "중요한 규제 변경사항에 대한 알림을 받을 수 있습니다.",
    icon: Bell,
    href: "/dashboard/settings" as const,
    variant: "default" as const,
  },
  {
    id: "profile",
    title: "프로필 관리",
    description: "계정 정보와 설정을 관리할 수 있습니다.",
    icon: User,
    href: "/dashboard/profile" as const,
    variant: "default" as const,
  },
];

/**
 * 보호된 대시보드 페이지
 *
 * 인증된 사용자만 접근 가능
 * beforeLoad에서 인증을 확인하고 미인증 사용자는 로그인 페이지로 리디렉션됨
 */
/**
 * 보호된 대시보드 페이지
 *
 * 개선사항:
 * - 새로운 DashboardHeader 컴포넌트 사용
 * - ActionCard로 기존 DashboardCard 교체
 * - 과도한 배경 장식과 그라데이션 제거
 * - 깔끔한 컨테이너 구조 (max-w-7xl)
 * - 적절한 시맨틱 HTML 구조와 ARIA 랜드마크
 * - 키보드 네비게이션을 위한 논리적 탭 순서
 * - 불필요한 애니메이션과 전환 효과 제거
 * - 안전한 auth 훅 사용으로 수동 초기화 상태 확인 제거
 * - 간소화된 로직으로 enhanced hooks의 안전한 기본 동작에 의존
 *
 * Requirements: 1.1, 2.1, 2.2, 2.3, 3.3, 5.1, 6.1
 */
export default function DashboardPage() {
  const { user } = useAuth();

  // 데이터 프리페칭 - React Hook 규칙 준수를 위해 조건부 렌더링 전에 호출
  // Enhanced hooks ensure user is only available when initialization is completed
  useQuery(bookmarkQueries.list());
  useQuery(chatHistoryQueries.list());
  useQuery(dashboardNotificationQueries.settings(user));

  return (
    <DashboardLayout>
      <div role="main" aria-label="대시보드 메인 콘텐츠">
        <DashboardGrid>
          {/* 새로운 DashboardHeader 컴포넌트 사용 */}
          <DashboardHeader user={user} />

          {/* 메트릭 그리드 - 깔끔한 통계 표시 */}
          <section aria-labelledby="metrics-heading">
            <h2 id="metrics-heading" className="sr-only">
              대시보드 주요 지표
            </h2>
            <MetricsGrid>
              <DashboardSummary />
            </MetricsGrid>
          </section>

          {/* 메인 콘텐츠 그리드 - 8+4 데스크톱, 스택 모바일 */}
          <MainContentGrid>
            {/* 주요 기능 섹션 */}
            <MainContent>
              <section aria-labelledby="actions-heading">
                <div className="space-y-6">
                  {/* 섹션 헤더 - 간소화된 디자인 */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <Search
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <h2
                      id="actions-heading"
                      className="text-2xl font-bold text-foreground"
                    >
                      주요 기능
                    </h2>
                  </div>

                  {/* 액션 카드 그리드 - 터치 친화적 */}
                  <TouchContainer>
                    <div role="list" aria-label="대시보드 주요 기능">
                      <ActionGrid>
                        {dashboardActions.map((action) => (
                          <div key={action.id} role="listitem">
                            <ActionCard
                              title={action.title}
                              description={action.description}
                              icon={action.icon}
                              href={action.href}
                              variant={action.variant}
                            />
                          </div>
                        ))}
                      </ActionGrid>
                    </div>
                  </TouchContainer>
                </div>
              </section>
            </MainContent>

            {/* 활동 사이드바 */}
            <Sidebar>
              <ActivitySidebar />
            </Sidebar>
          </MainContentGrid>
        </DashboardGrid>
      </div>
    </DashboardLayout>
  );
}
