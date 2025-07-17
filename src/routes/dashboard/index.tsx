import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "@/lib/utils/authGuard";

import DashboardSummary from "@/components/dashboard/DashboardSummary";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import { CategorySummary } from "@/components/dashboard/CategorySummary";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { ManagementActions } from "@/components/dashboard/ManagementActions";
import NotificationSummary from "@/components/dashboard/NotificationSummary";
import { useAuth } from "@/stores/authStore";
import {
  DashboardLayout,
  DashboardGrid,
  MetricsGrid,
  MainContentGrid,
  MainContent,
  Sidebar,
} from "@/components/dashboard/DashboardLayout";
import {
  generateMockActivities,
  generateMockCategoryData,
  generateMockQuickStats,
  generateMockManagementActions,
  generateMockNotificationGroups,
} from "@/lib/utils/mock-data";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useLoadingStates } from "@/hooks/useLoadingStates";
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
import { SectionLoadingWrapper } from "@/components/ui/loading-wrapper";
import {
  ActivityFeedSkeleton,
  CategorySummarySkeleton,
  QuickStatsSkeleton,
  NotificationSummarySkeleton,
  DashboardHeaderSkeleton,
} from "@/components/ui/skeleton-variants";
import { ErrorBoundary } from "@/components/ui/error-boundary";

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
 */
export default function DashboardPage() {
  const { user } = useAuth();

  // 성능 모니터링 시작
  const performance = usePerformanceMonitoring("DashboardPage");

  // 최적화된 데이터 로딩
  const dashboardData = useDashboardData();

  // 통합 로딩 상태 관리
  const loadingStates = useLoadingStates([
    {
      isLoading: dashboardData.bookmarks.isLoading,
      isError: dashboardData.bookmarks.isError,
      isSuccess: dashboardData.bookmarks.isSuccess,
      error: dashboardData.bookmarks.error,
    },
    {
      isLoading: dashboardData.chatHistory.isLoading,
      isError: dashboardData.chatHistory.isError,
      isSuccess: dashboardData.chatHistory.isSuccess,
      error: dashboardData.chatHistory.error,
    },
    {
      isLoading: dashboardData.notifications.isLoading,
      isError: dashboardData.notifications.isError,
      isSuccess: dashboardData.notifications.isSuccess,
      error: dashboardData.notifications.error,
    },
  ]);

  // Generate mock data for new components
  const mockActivities = generateMockActivities(15);
  const mockCategories = generateMockCategoryData();
  const mockQuickStats = generateMockQuickStats();
  const mockManagementActions = generateMockManagementActions();
  const mockNotificationGroups = generateMockNotificationGroups();

  // 성능 로깅 (개발 환경에서만)
  if (process.env.NODE_ENV === "development" && loadingStates.isSuccess) {
    performance.logPerformance();
  }

  return (
    <ErrorBoundary>
      <DashboardLayout>
        <DashboardGrid>
          {/* DashboardHeader를 상단에 배치 */}
          <SectionLoadingWrapper
            title="대시보드 헤더"
            loadingConfig={{
              isLoading: loadingStates.isLoading,
              isError: false, // 헤더는 에러 상태 없음
              isSuccess: true,
            }}
            skeleton={<DashboardHeaderSkeleton />}
          >
            <DashboardHeader user={user} />
          </SectionLoadingWrapper>

          {/* 메트릭 그리드 - 핵심 요약 지표들을 시각적으로 강조 */}
          <section aria-labelledby="metrics-heading">
            <h2 id="metrics-heading" className="sr-only">
              대시보드 주요 지표
            </h2>
            <MetricsGrid>
              <ErrorBoundary>
                <DashboardSummary />
              </ErrorBoundary>
            </MetricsGrid>
          </section>

          {/* 메인 콘텐츠 그리드 - 8+4 데스크톱, 스택 모바일 */}
          <MainContentGrid>
            {/* 메인 콘텐츠 영역 (2/3 너비) - RecentActivityFeed와 CategorySummary 배치 */}
            <MainContent>
              <div className="space-y-6">
                {/* 최근 활동 피드 - 좌측 메인 영역에 배치 */}
                <section aria-labelledby="recent-activity-heading">
                  <SectionLoadingWrapper
                    title="최근 활동"
                    loadingConfig={{
                      isLoading: dashboardData.chatHistory.isLoading,
                      isError: dashboardData.chatHistory.isError,
                      isSuccess: dashboardData.chatHistory.isSuccess,
                      error: dashboardData.chatHistory.error,
                    }}
                    onRetry={() => dashboardData.chatHistory.refetch?.()}
                    skeleton={<ActivityFeedSkeleton />}
                  >
                    <RecentActivityFeed
                      activities={mockActivities}
                      loading={dashboardData.chatHistory.isLoading}
                      error={dashboardData.chatHistory.isError}
                      hasMore
                      onLoadMore={() => {
                        // TODO: Implement load more functionality
                        console.log("Loading more activities...");
                      }}
                    />
                  </SectionLoadingWrapper>
                </section>

                {/* 카테고리별 요약 - 메인 콘텐츠 영역에 배치 */}
                <section aria-labelledby="category-summary-heading">
                  <SectionLoadingWrapper
                    title="카테고리 요약"
                    loadingConfig={{
                      isLoading: dashboardData.bookmarks.isLoading,
                      isError: dashboardData.bookmarks.isError,
                      isSuccess: dashboardData.bookmarks.isSuccess,
                      error: dashboardData.bookmarks.error,
                    }}
                    onRetry={() => dashboardData.bookmarks.refetch?.()}
                    skeleton={<CategorySummarySkeleton />}
                  >
                    <CategorySummary
                      categories={mockCategories}
                      title="카테고리별 북마크 요약"
                      loading={dashboardData.bookmarks.isLoading}
                      error={dashboardData.bookmarks.isError}
                    />
                  </SectionLoadingWrapper>
                </section>
              </div>
            </MainContent>

            {/* 사이드바 (1/3 너비) - QuickStats, ManagementActions, NotificationSummary 배치 */}
            <Sidebar collapsible defaultCollapsed={false}>
              <div className="space-y-6">
                {/* 빠른 통계 요약 - 사이드바 상단 */}
                <section aria-labelledby="quick-stats-heading">
                  <SectionLoadingWrapper
                    title="빠른 통계"
                    loadingConfig={{
                      isLoading: dashboardData.dashboardData.isLoading,
                      isError: dashboardData.dashboardData.isError,
                      isSuccess: dashboardData.dashboardData.isSuccess,
                      error: dashboardData.dashboardData.error,
                    }}
                    onRetry={() => dashboardData.dashboardData.refetch?.()}
                    skeleton={<QuickStatsSkeleton />}
                    compact
                  >
                    <QuickStats
                      stats={mockQuickStats}
                      loading={dashboardData.dashboardData.isLoading}
                      error={dashboardData.dashboardData.isError}
                      onStatClick={(stat) => {
                        // TODO: Implement stat click handler
                        console.log("Stat clicked:", stat);
                      }}
                    />
                  </SectionLoadingWrapper>
                </section>

                {/* 주요 관리 기능 - 사이드바 중간 */}
                <section aria-labelledby="management-actions-heading">
                  <ErrorBoundary>
                    <ManagementActions actions={mockManagementActions} />
                  </ErrorBoundary>
                </section>

                {/* 알림 요약 - 사이드바 하단 */}
                <section aria-labelledby="notification-summary-heading">
                  <SectionLoadingWrapper
                    title="알림 요약"
                    loadingConfig={{
                      isLoading: dashboardData.notifications.isLoading,
                      isError: dashboardData.notifications.isError,
                      isSuccess: dashboardData.notifications.isSuccess,
                      error: dashboardData.notifications.error,
                    }}
                    onRetry={() => dashboardData.notifications.refetch?.()}
                    skeleton={<NotificationSummarySkeleton />}
                    compact
                  >
                    <NotificationSummary
                      groups={mockNotificationGroups}
                      onMarkAllRead={() => {
                        // TODO: Implement mark all read functionality
                        console.log("Marking all notifications as read...");
                      }}
                      onViewAll={() => {
                        // TODO: Implement view all notifications functionality
                        console.log("Viewing all notifications...");
                      }}
                      onNotificationClick={(notification) => {
                        // TODO: Implement notification click handler
                        console.log("Notification clicked:", notification);
                      }}
                    />
                  </SectionLoadingWrapper>
                </section>
              </div>
            </Sidebar>
          </MainContentGrid>
        </DashboardGrid>
      </DashboardLayout>
    </ErrorBoundary>
  );
}
