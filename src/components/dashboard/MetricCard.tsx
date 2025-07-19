import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

export type MetricCardData = {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  icon: LucideIcon;
  description?: string;
  loading?: boolean;
  error?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
};

type MetricCardProps = MetricCardData;

/**
 * 접근성과 디자인 모범 사례를 따르는 간소화된 메트릭 카드 컴포넌트
 * - 과도한 그라데이션, 애니메이션, 장식 요소 제거
 * - ARIA 레이블을 포함한 적절한 시맨틱 HTML 구조 구현
 * - 기존 CSS 변수를 기반으로 한 일관된 색상 체계 사용
 * - 적절한 키보드 네비게이션 및 포커스 관리 보장
 * - 스켈레톤 UI를 통한 로딩 및 에러 상태 제공
 */
export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  description,
  loading = false,
  error = false,
  onClick,
  href,
  className,
}: MetricCardProps) {
  // 스켈레톤 UI를 사용한 로딩 상태
  if (loading) {
    return (
      <Card
        className={cn("relative", className)}
        role="status"
        aria-label={`${title} 데이터 로딩 중`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-8 w-16 animate-pulse rounded bg-muted" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  // 명확한 메시지를 포함한 에러 상태
  if (error) {
    return (
      <Card
        className={cn(
          "relative border-destructive/20 bg-destructive/5",
          className,
        )}
        role="alert"
        aria-label={`${title} 데이터 로딩 오류`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-destructive">
            {title}
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
            <Icon className="h-4 w-4 text-destructive" aria-hidden="true" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-destructive">
            데이터를 불러올 수 없습니다
          </p>
          {onClick && (
            <button
              onClick={onClick}
              className="rounded text-xs text-destructive underline hover:no-underline focus:ring-2 focus:ring-destructive focus:ring-offset-1 focus:outline-none"
              aria-label={`${title} 데이터 다시 시도`}
            >
              다시 시도
            </button>
          )}
        </CardContent>
      </Card>
    );
  }

  // 시맨틱 색상을 사용한 트렌드 스타일링 헬퍼 함수
  const getTrendColor = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "text-success-600";
      case "down":
        return "text-destructive";
      case "neutral":
      default:
        return "text-muted-foreground";
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      case "neutral":
      default:
        return "→";
    }
  };

  const isClickable = onClick || href;
  const CardComponent = href ? "a" : isClickable ? "button" : "div";

  return (
    <Card
      className={cn(
        // 최소한의 그림자와 미묘한 호버 효과를 가진 깔끔한 디자인
        "relative transition-shadow duration-200 hover:shadow-md",
        // 포커스 링을 통한 키보드 네비게이션 지원
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        // 클릭 가능한 경우 커서와 호버 효과 추가
        isClickable && "cursor-pointer hover:shadow-lg",
        className,
      )}
    >
      <CardComponent
        {...(href ? { href } : {})}
        {...(onClick && !href ? { onClick } : {})}
        tabIndex={isClickable ? 0 : undefined}
        role={isClickable ? "button" : "region"}
        aria-labelledby={`metric-${title.replace(/\s+/g, "-").toLowerCase()}-title`}
        aria-describedby={
          description
            ? `metric-${title.replace(/\s+/g, "-").toLowerCase()}-desc`
            : undefined
        }
        className={isClickable ? "block w-full text-left" : undefined}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle
            id={`metric-${title.replace(/\s+/g, "-").toLowerCase()}-title`}
            className="text-sm font-medium text-foreground sm:text-base"
          >
            {title}
          </CardTitle>
          {/* 일관된 스타일링을 가진 아이콘 - 그라데이션이나 과도한 장식 없음 */}
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted sm:h-10 sm:w-10"
            aria-hidden="true"
          >
            <Icon className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />
          </div>
        </CardHeader>

        <CardContent className="space-y-1">
          <div className="flex items-baseline gap-2">
            {/* 적절한 포매팅과 접근성을 가진 메인 값 */}
            <div
              className="text-2xl font-bold text-foreground"
              aria-label={`${title}: ${typeof value === "number" ? value.toLocaleString() : value}`}
            >
              {typeof value === "number" ? value.toLocaleString() : value}
            </div>
            {/* 시맨틱 색상만 사용한 변화 지표 */}
            {change && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  getTrendColor(change.trend),
                )}
                aria-label={`변화량: ${change.value}, 추세: ${change.trend === "up" ? "상승" : change.trend === "down" ? "하락" : "변화없음"}`}
              >
                <span aria-hidden="true">{getTrendIcon(change.trend)}</span>
                {change.value}
              </div>
            )}
          </div>
          {/* 적절한 시맨틱 구조를 가진 설명 */}
          {description && (
            <p
              id={`metric-${title.replace(/\s+/g, "-").toLowerCase()}-desc`}
              className="text-sm text-muted-foreground"
            >
              {description}
            </p>
          )}
        </CardContent>
      </CardComponent>
    </Card>
  );
}

/**
 * 로딩 상태용 스켈레톤 컴포넌트
 */
export function MetricCardSkeleton({ className }: { className?: string }) {
  return (
    <Card
      className={cn("relative", className)}
      role="status"
      aria-label="메트릭 데이터 로딩 중"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}
