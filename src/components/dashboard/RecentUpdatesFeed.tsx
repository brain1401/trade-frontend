import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { AlertCircle, Bell, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { feedQueries, feedQueryKeys } from "@/lib/api/feed";
import type { RecentUpdatesFeedData } from "@/lib/api/feed/types";

export default function RecentUpdatesFeed() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const markAsReadMutation = feedQueries.useMarkFeedAsRead();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    feedQueries.recentUpdates();

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

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case "HIGH":
        return <AlertCircle className="text-danger-600 h-4 w-4" />;
      case "MEDIUM":
        return <AlertCircle className="h-4 w-4 text-warning-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-success-600" />;
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "HIGH":
        return (
          <Badge variant="destructive" className="text-xs">
            높음
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge
            variant="default"
            className="bg-warning-100 text-xs text-warning-800"
          >
            보통
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            낮음
          </Badge>
        );
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary-600" />
          업데이트 피드
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {status === "pending" ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                로딩 중...
              </p>
            ) : status === "error" ? (
              <p className="py-4 text-center text-sm text-destructive">
                피드를 불러오는 데 실패했습니다.
              </p>
            ) : unreadUpdates.length > 0 ? (
              unreadUpdates.map((update) => (
                <div
                  key={update.id}
                  onClick={() => handleFeedClick(update)}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-neutral-50"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    handleFeedClick(update)
                  }
                >
                  {getImportanceIcon(update.importance)}
                  <div className="flex-1 space-y-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h4 className="truncate text-sm font-medium text-neutral-900">
                        {update.title}
                      </h4>
                      {getImportanceBadge(update.importance)}
                    </div>
                    <p className="line-clamp-2 text-xs text-neutral-600">
                      {update.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>{update.sourceUrl ? "공식 발표" : "업데이트"}</span>
                      <span>•</span>
                      <span>
                        {new Date(update.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-sm text-muted-foreground">
                새로운 업데이트가 없습니다.
              </div>
            )}
            <div
              ref={loadMoreRef}
              className="flex items-center justify-center p-2"
            >
              {isFetchingNextPage && (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              )}
              {!hasNextPage && unreadUpdates.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  모든 피드를 불러왔습니다.
                </span>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
