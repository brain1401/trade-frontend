import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import {
  AlertCircle,
  Bell,
  CheckCircle,
  Loader2,
  Clock,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  useMarkFeedAsRead,
  useRecentUpdatesFeed,
  feedQueryKeys,
} from "@/lib/api/feed";
import type { RecentUpdatesFeedData } from "@/lib/api/feed/types";

interface ActivitySidebarProps {
  className?: string;
}

export default function ActivitySidebar({
  className = "",
}: ActivitySidebarProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const markAsReadMutation = useMarkFeedAsRead();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useRecentUpdatesFeed();

  const unreadUpdates =
    data?.pages.flatMap((page) =>
      page.content.filter((item) => !item.isRead),
    ) ?? [];

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const getImportanceConfig = (importance: string) => {
    switch (importance) {
      case "HIGH":
        return {
          icon: <AlertCircle className="h-4 w-4 text-red-600" />,
          badge: (
            <Badge variant="destructive" className="text-xs">
              높음
            </Badge>
          ),
        };
      case "MEDIUM":
        return {
          icon: <AlertCircle className="h-4 w-4 text-amber-600" />,
          badge: (
            <Badge
              variant="secondary"
              className="bg-amber-100 text-xs text-amber-800"
            >
              보통
            </Badge>
          ),
        };
      default:
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-600" />,
          badge: (
            <Badge
              variant="secondary"
              className="bg-green-100 text-xs text-green-800"
            >
              낮음
            </Badge>
          ),
        };
    }
  };

  const handleFeedClick = (feed: (typeof unreadUpdates)[0]) => {
    markAsReadMutation.mutate(feed.id, {
      onSuccess: () => {
        queryClient.setQueryData<InfiniteData<RecentUpdatesFeedData>>(
          feedQueryKeys.recentUpdates(),
          (oldData) => {
            if (!oldData) return undefined;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                content: page.content.map((item) =>
                  item.id === feed.id ? { ...item, isRead: true } : item,
                ),
              })),
            };
          },
        );

        navigate({
          to: "/feed/$feedId",
          params: { feedId: String(feed.id) },
          search: { feed },
        });
      },
      onError: (error) => {
        toast.error("피드를 읽음 처리하는 중 오류가 발생했습니다.", {
          description: error.message,
        });
      },
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    feed: (typeof unreadUpdates)[0],
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFeedClick(feed);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <aside
      className={`w-full rounded-lg border bg-card md:w-80 ${className}`}
      role="complementary"
      aria-label="최근 활동 피드"
    >
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                최근 활동
              </h2>
              <p className="text-sm text-muted-foreground">
                {unreadUpdates.length}개의 새로운 업데이트
              </p>
            </div>
          </div>
          {status === "error" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              aria-label="다시 시도"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <ScrollArea className="h-[400px] md:h-[500px]">
          <div className="space-y-3">
            {status === "pending" ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">로딩 중...</p>
              </div>
            ) : status === "error" ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-8">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <div className="text-center">
                  <p className="text-sm font-medium text-destructive">
                    피드를 불러오는 데 실패했습니다.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    className="mt-2"
                  >
                    다시 시도
                  </Button>
                </div>
              </div>
            ) : unreadUpdates.length > 0 ? (
              unreadUpdates.map((update) => {
                const config = getImportanceConfig(update.importance);
                return (
                  <div
                    key={update.id}
                    onClick={() => handleFeedClick(update)}
                    onKeyDown={(e) => handleKeyDown(e, update)}
                    className="group cursor-pointer rounded-lg border p-3 transition-all duration-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:scale-[1.02] hover:shadow-md"
                    role="button"
                    tabIndex={0}
                    aria-label={`${update.title} - ${update.importance} 중요도`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">{config.icon}</div>

                      <div className="flex-1 space-y-2 overflow-hidden">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
                            {update.title}
                          </h3>
                          {config.badge}
                        </div>

                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {update.content}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(update.createdAt).toLocaleDateString(
                                "ko-KR",
                              )}
                            </span>
                          </div>
                          <span>•</span>
                          <span>
                            {update.sourceUrl ? "공식 발표" : "업데이트"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3 py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Bell className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    모든 업데이트를 확인했습니다
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    새로운 소식이 있으면 알려드릴게요
                  </p>
                </div>
              </div>
            )}

            <div
              ref={loadMoreRef}
              className="flex items-center justify-center p-4"
            >
              {isFetchingNextPage && (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    더 불러오는 중...
                  </span>
                </div>
              )}
              {!hasNextPage && unreadUpdates.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  모든 피드를 불러왔습니다
                </span>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
