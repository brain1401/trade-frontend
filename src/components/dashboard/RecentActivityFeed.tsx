import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils/cn";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import {
  roles,
  aria,
  createKeyboardHandler,
  useScreenReaderAnnouncement,
} from "@/lib/utils/accessibility";
import {
  type LucideIcon,
  MessageSquare,
  Bookmark,
  Bell,
  Rss,
  Settings,
  User,
  Clock,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type {
  ActivityItem,
  ActivityType,
  RecentActivityFeedProps,
} from "@/types/dashboard";

/**
 * 활동 타입별 아이콘과 색상 매핑
 */
const ACTIVITY_TYPE_CONFIG: Record<
  ActivityType,
  {
    icon: LucideIcon;
    color: string;
    bgColor: string;
    label: string;
  }
> = {
  chat: {
    icon: MessageSquare,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    label: "채팅",
  },
  bookmark: {
    icon: Bookmark,
    color: "text-green-600",
    bgColor: "bg-green-50",
    label: "북마크",
  },
  notification: {
    icon: Bell,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    label: "알림",
  },
  feed: {
    icon: Rss,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    label: "피드",
  },
  system: {
    icon: Settings,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    label: "시스템",
  },
};

/**
 * 시간 포맷팅 유틸리티 함수
 * 한국어 상대 시간 표시를 위한 개선된 함수
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // 미래 시간 처리
  if (diffInSeconds < 0) {
    return "곧";
  }

  if (diffInSeconds < 60) {
    return "방금 전";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  }

  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks}주 전`;
  }

  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months}개월 전`;
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * 개별 활동 항목 컴포넌트
 * 접근성: 키보드 네비게이션, ARIA 지원, 스크린 리더 호환성
 */
function ActivityItemComponent({
  activity,
  onClick,
}: {
  activity: ActivityItem;
  onClick?: (activity: ActivityItem) => void;
}) {
  const config = ACTIVITY_TYPE_CONFIG[activity.type];
  const Icon = config.icon;
  const isClickable = onClick || activity.href;
  const announce = useScreenReaderAnnouncement();

  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (onClick) {
        onClick(activity);
        announce(`${activity.title} 활동 선택됨`, "polite");
      } else if (activity.href) {
        // 더 나은 네비게이션 처리
        if (
          activity.href.startsWith("http") ||
          activity.href.startsWith("//")
        ) {
          // 외부 링크는 새 탭에서 열기
          window.open(activity.href, "_blank", "noopener,noreferrer");
          announce(`${activity.title} 외부 링크로 이동`, "polite");
        } else {
          // 내부 링크는 현재 탭에서 이동
          window.location.href = activity.href;
          announce(`${activity.title} 페이지로 이동`, "polite");
        }
      }
    },
    [activity, onClick, announce],
  );

  const handleKeyDown = createKeyboardHandler(() =>
    handleClick({} as React.MouseEvent),
  );

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 rounded-lg p-3 transition-colors",
        isClickable &&
          "cursor-pointer focus-within:bg-muted/50 hover:bg-muted/50",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1",
      )}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? "button" : "article"}
      aria-label={
        isClickable
          ? `${activity.title} - ${config.label} 활동 보기`
          : `${activity.title} - ${config.label} 활동`
      }
    >
      {/* 활동 타입 아이콘 */}
      <div
        className={cn(
          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
          config.bgColor,
        )}
        aria-hidden="true"
      >
        <Icon className={cn("h-4 w-4", config.color)} />
      </div>

      {/* 활동 내용 */}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="line-clamp-2 text-sm font-medium text-foreground">
            {activity.title}
          </h4>
          {isClickable && (
            <ExternalLink className="h-3 w-3 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {activity.description}
        </p>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <time dateTime={activity.timestamp.toISOString()}>
              {formatRelativeTime(activity.timestamp)}
            </time>
          </div>
          <Badge variant="secondary" className="text-xs">
            {config.label}
          </Badge>
          {activity.user && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{activity.user.name}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 최근 활동 피드 컴포넌트
 * Requirements: 2.1, 2.2, 2.3, 2.4를 충족하는 구현
 */
export function RecentActivityFeed({
  activities,
  loading = false,
  error = false,
  onLoadMore,
  hasMore = false,
  className,
}: RecentActivityFeedProps) {
  // 무한 스크롤 훅 사용
  const infiniteScrollRef = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: onLoadMore || (() => {}),
    threshold: 0.1,
    rootMargin: "50px",
  });
  // 로딩 상태
  if (loading && activities.length === 0) {
    return (
      <Card
        className={cn("", className)}
        role="status"
        aria-label="활동 로딩 중"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rss className="h-5 w-5" />
            최근 활동
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              활동을 불러오는 중...
            </p>
          </div>
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
        aria-label="활동 로딩 오류"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            최근 활동
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="mt-2 text-sm text-destructive">
              활동을 불러올 수 없습니다
            </p>
            {onLoadMore && (
              <button
                onClick={onLoadMore}
                className="mt-2 rounded text-xs text-destructive underline hover:no-underline focus:ring-2 focus:ring-destructive focus:ring-offset-1 focus:outline-none"
              >
                다시 시도
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // 빈 상태
  if (activities.length === 0) {
    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rss className="h-5 w-5" />
            최근 활동
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Rss className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-foreground">
                아직 활동이 없습니다
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                새로운 활동이 있으면 여기에 표시됩니다
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rss className="h-5 w-5" />
            최근 활동
          </div>
          <Badge variant="secondary" className="text-xs">
            {activities.length}개
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-6 pt-0">
            {activities.map((activity) => (
              <ActivityItemComponent
                key={activity.id}
                activity={activity}
                onClick={
                  activity.href
                    ? (activity) => {
                        // 향상된 클릭 핸들러 - 외부/내부 링크 구분 처리
                        if (activity.href) {
                          if (
                            activity.href.startsWith("http") ||
                            activity.href.startsWith("//")
                          ) {
                            window.open(
                              activity.href,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          } else {
                            window.location.href = activity.href;
                          }
                        }
                      }
                    : undefined
                }
              />
            ))}

            {/* 무한 스크롤 트리거 영역 */}
            {hasMore && (
              <div
                ref={infiniteScrollRef}
                className="flex items-center justify-center py-4"
                aria-hidden="true"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      더 불러오는 중...
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                  </div>
                )}
              </div>
            )}

            {/* 수동 더 보기 버튼 (무한 스크롤 실패 시 대체) */}
            {hasMore && !loading && onLoadMore && (
              <div className="flex items-center justify-center py-2">
                <button
                  onClick={onLoadMore}
                  className="rounded-md px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
                  aria-label="더 많은 활동 불러오기"
                >
                  더 보기
                </button>
              </div>
            )}

            {/* 완료 상태 메시지 */}
            {!hasMore && activities.length > 5 && (
              <div className="flex items-center justify-center py-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-px w-8 bg-border" />
                  <span>모든 활동을 불러왔습니다</span>
                  <div className="h-px w-8 bg-border" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default RecentActivityFeed;
