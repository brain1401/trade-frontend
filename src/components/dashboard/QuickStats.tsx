import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils/cn";
import {
  getDashboardTrendColor,
  getDashboardTrendIcon,
} from "@/lib/utils/dashboard";
import { roles, aria, createKeyboardHandler } from "@/lib/utils/accessibility";
import type { QuickStatsProps, StatItem } from "@/types/dashboard";

/**
 * 빠른 통계 요약 컴포넌트
 * 사이드바에 표시되는 간결한 통계 정보를 제공
 * - 트렌드 정보 포함
 * - 클릭 시 상세 정보 모달 또는 페이지 이동
 * - 로딩 및 에러 상태 지원
 * - 접근성 고려사항 포함
 */
export function QuickStats({
  stats,
  loading = false,
  error = false,
  onStatClick,
  className,
}: QuickStatsProps) {
  // 로딩 상태
  if (loading) {
    return (
      <Card
        className={cn("", className)}
        role="status"
        aria-label="통계 데이터 로딩 중"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">빠른 통계</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <QuickStatSkeleton key={index} />
          ))}
        </CardContent>
      </Card>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Card
        className={cn("border-destructive/20 bg-destructive/5", className)}
        role="alert"
        aria-label="통계 데이터 로딩 오류"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-destructive">
            빠른 통계
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            통계 데이터를 불러올 수 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  // 빈 상태
  if (!stats || stats.length === 0) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">빠른 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            표시할 통계 데이터가 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">빠른 통계</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.map((stat) => (
          <QuickStatItem
            key={stat.id}
            stat={stat}
            onClick={onStatClick ? () => onStatClick(stat) : undefined}
          />
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * 개별 통계 항목 컴포넌트
 */
function QuickStatItem({
  stat,
  onClick,
}: {
  stat: StatItem;
  onClick?: () => void;
}) {
  const isClickable = onClick || stat.href;
  const Component = stat.href ? "a" : isClickable ? "button" : "div";

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Component
      {...(stat.href ? { href: stat.href } : {})}
      {...(onClick && !stat.href ? { onClick } : {})}
      {...(onClick && !stat.href ? { onKeyDown: handleKeyDown } : {})}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? "button" : undefined}
      aria-labelledby={`stat-${stat.id}-label`}
      aria-describedby={stat.description ? `stat-${stat.id}-desc` : undefined}
      className={cn(
        "flex items-center justify-between rounded-lg p-3 transition-colors",
        "hover:bg-muted/50 focus:bg-muted/50",
        isClickable &&
          "cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:outline-none",
        "group",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* 아이콘 */}
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-muted"
          aria-hidden="true"
        >
          <stat.icon className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* 라벨과 설명 */}
        <div className="min-w-0 flex-1">
          <div
            id={`stat-${stat.id}-label`}
            className="truncate text-sm font-medium text-foreground"
          >
            {stat.label}
          </div>
          {stat.description && (
            <div
              id={`stat-${stat.id}-desc`}
              className="truncate text-xs text-muted-foreground"
            >
              {stat.description}
            </div>
          )}
        </div>
      </div>

      {/* 값과 트렌드 */}
      <div className="flex flex-shrink-0 items-center gap-2">
        <div className="text-right">
          <div className="text-sm font-semibold text-foreground">
            {typeof stat.value === "number"
              ? stat.value.toLocaleString()
              : stat.value}
          </div>
          {stat.trend && (
            <div
              className={cn(
                "flex items-center justify-end gap-1 text-xs font-medium",
                getDashboardTrendColor(stat.trend.direction),
              )}
              aria-label={`변화량: ${stat.trend.value}, 추세: ${
                stat.trend.direction === "up"
                  ? "상승"
                  : stat.trend.direction === "down"
                    ? "하락"
                    : "변화없음"
              }`}
            >
              <span aria-hidden="true">
                {getDashboardTrendIcon(stat.trend.direction)}
              </span>
              <span>{stat.trend.value}</span>
            </div>
          )}
        </div>
      </div>
    </Component>
  );
}

/**
 * 로딩 상태용 스켈레톤 컴포넌트
 */
function QuickStatSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg p-3">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="h-8 w-8 flex-shrink-0 animate-pulse rounded-md bg-muted" />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="flex-shrink-0 space-y-1">
        <div className="ml-auto h-4 w-12 animate-pulse rounded bg-muted" />
        <div className="ml-auto h-3 w-8 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

/**
 * 전체 QuickStats 컴포넌트의 스켈레톤
 */
export function QuickStatsSkeleton({ className }: { className?: string }) {
  return (
    <Card
      className={cn("", className)}
      role="status"
      aria-label="통계 데이터 로딩 중"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">빠른 통계</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <QuickStatSkeleton key={index} />
        ))}
      </CardContent>
    </Card>
  );
}
