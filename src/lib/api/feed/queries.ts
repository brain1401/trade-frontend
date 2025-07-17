import { feedApi } from "./api";
import type { ApiError } from "../common/ApiError";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const feedQueryKeys = {
  all: () => ["feed"] as const,
  recentUpdates: () => [...feedQueryKeys.all(), "recent-updates"] as const,
};

// 커스텀 Hook으로 변경
export const useRecentUpdatesFeed = () =>
  useInfiniteQuery({
    queryKey: feedQueryKeys.recentUpdates(),

    queryFn: ({ pageParam }) => {
      const pageNumber = typeof pageParam === "number" ? pageParam : 0;
      return feedApi.getRecentUpdatesFeed({ pageParam: pageNumber });
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      if (lastPage.last) {
        return undefined;
      }
      return lastPage.number + 1;
    },
    staleTime: 1000 * 60 * 5, // 5분
  });

export const useMarkFeedAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number>({
    mutationFn: (feedId: number) => feedApi.markFeedAsRead(feedId),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: feedQueryKeys.recentUpdates(),
      });
    },
  });
};
