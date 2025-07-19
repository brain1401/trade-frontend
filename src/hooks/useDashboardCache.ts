import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/stores/authStore";
import {
  DashboardCacheManager,
  OfflineCacheStrategy,
  createDashboardCacheManager,
  DASHBOARD_CACHE_CONFIG,
} from "@/lib/cache/dashboard-cache-strategy";

/**
 * 대시보드 캐시 관리 훅
 * Requirements: 4.1, 4.2, 4.3 - 캐싱 전략 통합 관리
 */
export function useDashboardCache() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // 캐시 관리자 인스턴스 생성
  const { cacheManager, offlineStrategy } = useMemo(
    () => createDashboardCacheManager(queryClient),
    [queryClient],
  );

  // 온라인 상태 추적
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const unsubscribeOnline = offlineStrategy.onOnline(() => {
      setIsOnline(true);
      // 온라인 복구 시 캐시 동기화
      offlineStrategy.syncCacheOnReconnect();
    });

    const unsubscribeOffline = offlineStrategy.onOffline(() => {
      setIsOnline(false);
    });

    return () => {
      unsubscribeOnline();
      unsubscribeOffline();
    };
  }, [offlineStrategy]);

  return {
    // 캐시 관리 기능
    cacheManager,
    offlineStrategy,

    // 상태 정보
    isOnline,
    cacheStatus: cacheManager.getCacheStatus(),

    // 캐시 조작 함수들
    invalidateAll: () => cacheManager.invalidateAllDashboardData(),
    invalidateBookmarks: () => cacheManager.invalidateDataType("bookmarks"),
    invalidateDashboard: () => cacheManager.invalidateDataType("dashboard"),
    invalidateNotifications: () =>
      cacheManager.invalidateDataType("notifications"),

    // 프리페치 기능
    prefetchAll: () => cacheManager.prefetchAllDashboardData(user),

    // 오프라인 데이터 확인
    availableOfflineData: offlineStrategy.getAvailableOfflineData(),

    // 캐시 설정
    getCacheConfig: (type: keyof typeof DASHBOARD_CACHE_CONFIG) => {
      const baseConfig = DASHBOARD_CACHE_CONFIG[type];
      const offlineOverrides = offlineStrategy.getOfflineCacheConfig();
      return { ...baseConfig, ...offlineOverrides };
    },
  };
}

/**
 * 캐시 상태를 모니터링하는 훅 (개발/디버깅용)
 */
export function useCacheMonitor() {
  const { cacheManager } = useDashboardCache();
  const [cacheStats, setCacheStats] = useState(cacheManager.getCacheStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setCacheStats(cacheManager.getCacheStatus());
    }, 5000); // 5초마다 캐시 상태 업데이트

    return () => clearInterval(interval);
  }, [cacheManager]);

  return cacheStats;
}

/**
 * 특정 쿼리의 캐시 상태를 추적하는 훅
 */
export function useQueryCacheStatus(queryKey: readonly unknown[]) {
  const { cacheManager } = useDashboardCache();
  const [cacheInfo, setCacheInfo] = useState(
    cacheManager.getQueryCacheInfo(queryKey),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCacheInfo(cacheManager.getQueryCacheInfo(queryKey));
    }, 1000); // 1초마다 업데이트

    return () => clearInterval(interval);
  }, [cacheManager, queryKey]);

  return cacheInfo;
}

/**
 * 오프라인 상태에서의 데이터 가용성을 확인하는 훅
 */
export function useOfflineDataAvailability() {
  const { offlineStrategy, isOnline } = useDashboardCache();

  const availableData = useMemo(() => {
    if (isOnline) {
      return null; // 온라인 상태에서는 확인 불필요
    }

    return offlineStrategy.getAvailableOfflineData();
  }, [offlineStrategy, isOnline]);

  return {
    isOnline,
    availableData,
    hasAnyOfflineData: availableData
      ? Object.values(availableData).some(Boolean)
      : false,
  };
}
