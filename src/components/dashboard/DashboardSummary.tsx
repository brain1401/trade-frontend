import { useDashboardSummaryData } from "@/hooks/useDashboardMetrics";
import { MetricCard } from "./MetricCard";
import { DashboardErrorDisplay } from "./DashboardErrorDisplay";

/**
 * 대시보드 요약 통계 컴포넌트
 * 사용자의 활동 현황을 한눈에 보여줌
 *
 * 개선사항
 * - 통합 데이터 훅 사용으로 데이터 일관성 보장
 * - 데이터 변환 로직을 유틸리티 함수로 분리
 * - 통합된 에러 처리 및 상태 관리 (Requirements: 3.1, 3.2, 3.3)
 * - 접근성 개선 (ARIA 라벨, 키보드 네비게이션)
 * - 일관된 색상 스키마 사용
 * - 일관된 에러 표시 및 재시도 기능
 *
 * Requirements: 1.1, 1.2, 3.1, 3.2, 3.3
 */
export default function DashboardSummary() {
  const {
    metricsData,
    isLoading,
    isError,
    hasPartialError,
    error,
    refetch,
    canRetry,
    isRecurringError,
    errorCount,
  } = useDashboardSummaryData();

  // 전체 실패 시 통합 에러 표시 (Requirements: 3.1, 3.2)
  if (isError && error) {
    return (
      <div className="col-span-full">
        <DashboardErrorDisplay
          error={error}
          onRetry={canRetry ? refetch : undefined}
          title="대시보드 요약"
          canRetry={canRetry}
          isRecurringError={isRecurringError}
          errorCount={errorCount}
          compact={false}
        />
      </div>
    );
  }

  // 부분 에러가 있는 경우 경고 표시 (Requirements: 3.1)
  if (hasPartialError && error && !isError) {
    console.warn("Dashboard partial error:", error.message);
  }

  return (
    <>
      {/* 부분 에러 알림 (선택적) */}
      {hasPartialError && error && !isError && (
        <div className="col-span-full mb-4">
          <DashboardErrorDisplay
            error={error}
            onRetry={canRetry ? refetch : undefined}
            title="일부 데이터"
            canRetry={canRetry}
            isRecurringError={isRecurringError}
            errorCount={errorCount}
            compact={true}
          />
        </div>
      )}

      {/* 메트릭 카드들 */}
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
          onClick={metric.error && canRetry ? refetch : undefined}
        />
      ))}
    </>
  );
}
