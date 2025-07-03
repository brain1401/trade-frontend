import { feedApi } from './api';  
import type { ApiError } from '../common/ApiError';
import { useQuery } from '@tanstack/react-query';
import type { RecentUpdatesFeedData } from './types';

export const feedQueryKeys = {
  all: () => ['feed'] as const,
  recentUpdates: () => [...feedQueryKeys.all(), 'recent-updates'] as const,
};

export const feedQueries = {
  recentUpdates: () =>
    useQuery<RecentUpdatesFeedData, ApiError>({
      queryKey: feedQueryKeys.recentUpdates(),
      queryFn: () => feedApi.getRecentUpdatesFeed(),
      retry: false,
      refetchOnWindowFocus: true,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 5, // 5분
    }),
};

