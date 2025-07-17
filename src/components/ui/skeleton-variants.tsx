import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * 대시보드 섹션별 스켈레톤 UI 컴포넌트들
 */

/**
 * 메트릭 카드 스켈레톤
 */
export function MetricCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

/**
 * 활동 피드 아이템 스켈레톤
 */
export function ActivityItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-start space-x-3 p-4", className)}>
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}

/**
 * 활동 피드 스켈레톤
 */
export function ActivityFeedSkeleton({
  itemCount = 5,
  className,
}: {
  itemCount?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      {Array.from({ length: itemCount }).map((_, i) => (
        <ActivityItemSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * 카테고리 요약 스켈레톤
 */
export function CategorySummarySkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-8" />
              </div>
              <Skeleton className="h-6 w-6 rounded" />
            </div>
            <div className="mt-3">
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 빠른 통계 스켈레톤
 */
export function QuickStatsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <Skeleton className="h-6 w-24" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border bg-card p-3"
          >
            <div className="flex items-center space-x-3">
              <Skeleton className="h-6 w-6 rounded" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-3 w-3 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 관리 액션 스켈레톤
 */
export function ManagementActionsSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <Skeleton className="h-6 w-28" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border bg-card p-3"
          >
            <div className="flex items-center space-x-3">
              <Skeleton className="h-5 w-5 rounded" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 알림 요약 스켈레톤
 */
export function NotificationSummarySkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <div className="flex space-x-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="space-y-1">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="flex items-start space-x-2 rounded p-2">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 대시보드 헤더 스켈레톤
 */
export function DashboardHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-between p-6", className)}>
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}
