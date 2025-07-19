import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { requireAuth } from "@/lib/utils/authGuard";

import DashboardSummary from "@/components/dashboard/DashboardSummary";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import { CategorySummary } from "@/components/dashboard/CategorySummary";
import { IntegratedQuickStats } from "@/components/dashboard/IntegratedQuickStats";
import {
  CacheStatusIndicator,
  OfflineDataStatus,
} from "@/components/dashboard/CacheStatusIndicator";
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
 * 개선사항
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

  // 통합 로딩 상태 관리 (메트릭 데이터는 각 컴포넌트에서 개별 처리)
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

  // 통합 메트릭 데이터는 이제 IntegratedQuickStats 컴포넌트에서 직접 처리됨
  // Requirements: 1.1, 2.1, 2.2, 3.1, 3.2, 3.3 - 모든 통계 컴포넌트가 동일한 데이터 소스와 에러 처리 사용

  // 통합 메트릭 데이터를 기반으로 일관된 mock 데이터 생성
  const mockActivities = generateMockActivities(15);
  const mockCategories = generateMockCategoryData();
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

          {/* 캐시 상태 및 오프라인 알림 (Requirements: 4.1, 4.2, 4.3) */}
          <div className="col-span-full">
            <OfflineDataStatus />
            <CacheStatusIndicator compact className="ml-auto w-fit" />
          </div>

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
                {/* 빠른 통계 요약 - 사이드바 상단 (통합 에러 처리) */}
                <section aria-labelledby="quick-stats-heading">
                  <ErrorBoundary>
                    <IntegratedQuickStats
                      onStatClick={(stat) => {
                        // TODO: Implement stat click handler
                        console.log("Stat clicked:", stat);
                      }}
                    />
                  </ErrorBoundary>
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
