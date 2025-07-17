import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import {
  AlertCircle,
  Bell,
  CheckCircle,
  Loader2,
  Sparkles,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import {
  useMarkFeedAsRead,
  useRecentUpdatesFeed,
  feedQueryKeys,
} from "@/lib/api/feed";
import type { RecentUpdatesFeedData } from "@/lib/api/feed/types";

export default function RecentUpdatesFeed() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const markAsReadMutation = useMarkFeedAsRead();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useRecentUpdatesFeed();

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
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          badge: (
            <Badge className="border-0 bg-gradient-to-r from-red-500 to-pink-600 text-xs text-white">
              높음
            </Badge>
          ),
          gradient: "from-red-50 to-pink-50",
          borderColor: "border-red-200/50",
        };
      case "MEDIUM":
        return {
          icon: <AlertCircle className="h-4 w-4 text-amber-500" />,
          badge: (
            <Badge className="border-0 bg-gradient-to-r from-amber-500 to-orange-600 text-xs text-white">
              보통
            </Badge>
          ),
          gradient: "from-amber-50 to-orange-50",
          borderColor: "border-amber-200/50",
        };
      default:
        return {
          icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
          badge: (
            <Badge className="border-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-xs text-white">
              낮음
            </Badge>
          ),
          gradient: "from-emerald-50 to-teal-50",
          borderColor: "border-emerald-200/50",
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

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-50/80 via-blue-50/60 to-indigo-50/40 backdrop-blur-sm">
      {/* 배경 장식 */}
      <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-600/20 blur-2xl" />

      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800">
              업데이트 피드
            </div>
            <div className="text-sm font-medium text-slate-600">
              {unreadUpdates.length}개의 새로운 업데이트
            </div>
          </div>
          <div className="ml-auto">
            <Sparkles className="h-5 w-5 text-blue-500/60" />
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {status === "pending" ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-sm font-medium text-slate-600">로딩 중...</p>
              </div>
            ) : status === "error" ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-8">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <p className="text-sm font-medium text-red-600">
                  피드를 불러오는 데 실패했습니다.
                </p>
              </div>
            ) : unreadUpdates.length > 0 ? (
              unreadUpdates.map((update, index) => {
                const config = getImportanceConfig(update.importance);
                return (
                  <div
                    key={update.id}
                    onClick={() => handleFeedClick(update)}
                    className={`group relative cursor-pointer overflow-hidden rounded-xl border-0 bg-gradient-to-br ${config.gradient} p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${config.borderColor} `}
                    role="button"
                    tabIndex={0}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      handleFeedClick(update)
                    }
                  >
                    {/* 배경 장식 */}
                    <div className="absolute -top-2 -right-2 h-12 w-12 rounded-full bg-white/30 blur-xl transition-all duration-300 group-hover:scale-110" />

                    <div className="relative flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">{config.icon}</div>

                      <div className="flex-1 space-y-2 overflow-hidden">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="line-clamp-2 text-sm leading-tight font-semibold text-slate-800 transition-colors group-hover:text-slate-900">
                            {update.title}
                          </h4>
                          {config.badge}
                        </div>

                        <p className="line-clamp-2 text-xs leading-relaxed font-medium text-slate-600">
                          {update.content}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(update.createdAt).toLocaleDateString(
                                "ko-KR",
                              )}
                            </span>
                          </div>
                          <span>•</span>
                          <span className="font-medium">
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
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200">
                  <Bell className="h-8 w-8 text-slate-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-600">
                    모든 업데이트를 확인했습니다
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
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
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span className="text-xs font-medium text-slate-600">
                    더 불러오는 중...
                  </span>
                </div>
              )}
              {!hasNextPage && unreadUpdates.length > 0 && (
                <span className="text-xs font-medium text-slate-500">
                  모든 피드를 불러왔습니다
                </span>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
