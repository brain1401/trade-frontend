import { QueryClient } from "@tanstack/react-query";
import {
  bookmarkQueryKeys,
  dashboardQueryKeys,
  dashboardNotificationQueryKeys,
} from "@/lib/api";
import type { User } from "@/types/auth";

/**
 * 대시보드 캐싱 전략 구현
 * Requirements: 4.1, 4.2, 4.3 - 캐싱을 활용한 데이터 일관성, 캐시 무효화, 오프라인 지원
 */

export interface CacheConfig {
  staleTime: number;
  gcTime: number;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  retry?: boolean | number;
}

/**
 * 대시보드 데이터 타입별 캐시 설정
 */
export const DASHBOARD_CACHE_CONFIG = {
  // 북마크 데이터 - 자주 변경되지 않으므로 긴 캐시 시간
  bookmarks: {
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 15, // 15분
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3,
  } as CacheConfig,

  // 대시보드 메트릭 - 실시간성이 중요하므로 짧은 캐시 시간
  metrics: {
    staleTime: 1000 * 60 * 1, // 1분
    gcTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2,
  } as CacheConfig,

  // 채팅 히스토리 - 중간 정도의 캐시 시간
  chatHistory: {
    staleTime: 1000 * 60 * 3, // 3분
    gcTime: 1000 * 60 * 10, // 10분
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 2,
  } as CacheConfig,

  // 알림 설정 - 자주 변경되지 않으므로 긴 캐시 시간
  notifications: {
    staleTime: 1000 * 60 * 10, // 10분
    gcTime: 1000 * 60 * 30, // 30분
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  } as CacheConfig,
} as const;

/**
 * 대시보드 캐시 관리자 클래스
 */
export class DashboardCacheManager {
  private queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  /**
   * 모든 대시보드 관련 캐시를 무효화
   * Requirements: 4.2 - 캐시 무효화 시 모든 컴포넌트 동시 업데이트
   */
  async invalidateAllDashboardData(): Promise<void> {
    await Promise.all([
      this.queryClient.invalidateQueries({
        queryKey: bookmarkQueryKeys.all(),
      }),
      this.queryClient.invalidateQueries({
        queryKey: dashboardQueryKeys.all(),
      }),
      this.queryClient.invalidateQueries({
        queryKey: dashboardNotificationQueryKeys.all(),
      }),
    ]);
  }

  /**
   * 특정 데이터 타입의 캐시만 무효화
   */
  async invalidateDataType(
    dataType: "bookmarks" | "dashboard" | "notifications",
  ): Promise<void> {
    switch (dataType) {
      case "bookmarks":
        await this.queryClient.invalidateQueries({
          queryKey: bookmarkQueryKeys.all(),
        });
        break;
      case "dashboard":
        await this.queryClient.invalidateQueries({
          queryKey: dashboardQueryKeys.all(),
        });
        break;
      case "notifications":
        await this.queryClient.invalidateQueries({
          queryKey: dashboardNotificationQueryKeys.all(),
        });
        break;
    }
  }

  /**
   * 캐시된 데이터 존재 여부 확인
   * Requirements: 4.3 - 오프라인 상태에서 캐시된 데이터 사용
   */
  hasCachedData(queryKey: readonly unknown[]): boolean {
    const data = this.queryClient.getQueryData(queryKey);
    return data !== undefined;
  }

  /**
   * 캐시된 데이터 직접 가져오기 (오프라인 시 사용)
   */
  getCachedData<T>(queryKey: readonly unknown[]): T | undefined {
    return this.queryClient.getQueryData<T>(queryKey);
  }

  /**
   * 캐시에 데이터 직접 설정 (오프라인 복구 시 사용)
   */
  setCachedData<T>(queryKey: readonly unknown[], data: T): void {
    this.queryClient.setQueryData(queryKey, data);
  }

  /**
   * 모든 대시보드 데이터를 프리페치
   * Requirements: 4.1 - 데이터 일관성 보장을 위한 사전 로딩
   */
  async prefetchAllDashboardData(user?: User | null): Promise<void> {
    const prefetchPromises = [
      this.queryClient.prefetchQuery({
        queryKey: bookmarkQueryKeys.list(),
        staleTime: DASHBOARD_CACHE_CONFIG.bookmarks.staleTime,
      }),
      this.queryClient.prefetchQuery({
        queryKey: dashboardQueryKeys.data(),
        staleTime: DASHBOARD_CACHE_CONFIG.metrics.staleTime,
      }),
    ];

    // 사용자가 있을 때만 알림 데이터 프리페치
    if (user) {
      prefetchPromises.push(
        this.queryClient.prefetchQuery({
          queryKey: dashboardNotificationQueryKeys.settings(user),
          staleTime: DASHBOARD_CACHE_CONFIG.notifications.staleTime,
        }),
      );
    }

    await Promise.all(prefetchPromises);
  }

  /**
   * 캐시 상태 정보 가져오기 (디버깅 및 모니터링용)
   */
  getCacheStatus() {
    const cache = this.queryClient.getQueryCache();
    const queries = cache.getAll();

    return {
      totalQueries: queries.length,
      activeQueries: queries.filter((q) => q.getObserversCount() > 0).length,
      staleQueries: queries.filter((q) => q.isStale()).length,
      cachedQueries: queries.filter((q) => q.state.data !== undefined).length,
      dashboardQueries: queries.filter((q) =>
        q.queryKey.some(
          (key) =>
            typeof key === "string" &&
            ["bookmarks", "dashboard", "dashboardNotification"].includes(key),
        ),
      ).length,
    };
  }

  /**
   * 오래된 캐시 정리 (메모리 최적화)
   */
  cleanupStaleCache(): void {
    this.queryClient.getQueryCache().clear();
  }

  /**
   * 특정 쿼리의 캐시 상태 확인
   */
  getQueryCacheInfo(queryKey: readonly unknown[]) {
    const query = this.queryClient.getQueryCache().find({ queryKey });

    if (!query) {
      return null;
    }

    return {
      isStale: query.isStale(),
      hasData: query.state.data !== undefined,
      lastUpdated: query.state.dataUpdatedAt,
      observersCount: query.getObserversCount(),
      status: query.state.status,
    };
  }
}

/**
 * 오프라인 상태 감지 및 캐시 전략 조정
 * Requirements: 4.3 - 오프라인 상태에서 캐시된 데이터 사용
 */
export class OfflineCacheStrategy {
  private cacheManager: DashboardCacheManager;
  private isOnline: boolean;
  private onlineListeners: Set<() => void> = new Set();
  private offlineListeners: Set<() => void> = new Set();

  constructor(cacheManager: DashboardCacheManager) {
    this.cacheManager = cacheManager;
    this.isOnline = navigator.onLine;
    this.setupOnlineListeners();
  }

  private setupOnlineListeners(): void {
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.onlineListeners.forEach((listener) => listener());
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.offlineListeners.forEach((listener) => listener());
    });
  }

  /**
   * 온라인 상태 확인
   */
  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  /**
   * 오프라인 시 캐시된 데이터 사용 전략
   */
  getOfflineCacheConfig(): Partial<CacheConfig> {
    if (!this.isOnline) {
      return {
        staleTime: Infinity, // 오프라인 시 캐시를 무한정 유지
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
      };
    }
    return {};
  }

  /**
   * 온라인 복구 시 캐시 동기화
   */
  async syncCacheOnReconnect(): Promise<void> {
    if (this.isOnline) {
      await this.cacheManager.invalidateAllDashboardData();
    }
  }

  /**
   * 온라인/오프라인 상태 변경 리스너 등록
   */
  onOnline(callback: () => void): () => void {
    this.onlineListeners.add(callback);
    return () => this.onlineListeners.delete(callback);
  }

  onOffline(callback: () => void): () => void {
    this.offlineListeners.add(callback);
    return () => this.offlineListeners.delete(callback);
  }

  /**
   * 오프라인 상태에서 사용 가능한 캐시된 데이터 목록
   */
  getAvailableOfflineData() {
    return {
      bookmarks: this.cacheManager.hasCachedData(bookmarkQueryKeys.list()),
      dashboard: this.cacheManager.hasCachedData(dashboardQueryKeys.data()),
      // 알림은 사용자별로 다르므로 별도 처리 필요
    };
  }
}

/**
 * 전역 캐시 관리자 인스턴스 생성 함수
 */
export function createDashboardCacheManager(queryClient: QueryClient) {
  const cacheManager = new DashboardCacheManager(queryClient);
  const offlineStrategy = new OfflineCacheStrategy(cacheManager);

  return {
    cacheManager,
    offlineStrategy,
  };
}

/**
 * 캐시 설정을 쿼리 옵션에 적용하는 헬퍼 함수
 */
export function applyCacheConfig(
  baseConfig: any,
  cacheType: keyof typeof DASHBOARD_CACHE_CONFIG,
  offlineOverrides?: Partial<CacheConfig>,
) {
  const config = DASHBOARD_CACHE_CONFIG[cacheType];
  const finalConfig = { ...config, ...offlineOverrides };

  return {
    ...baseConfig,
    ...finalConfig,
  };
}
