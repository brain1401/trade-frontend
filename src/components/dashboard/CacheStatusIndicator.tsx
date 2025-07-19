import React from "react";
import { Wifi, WifiOff, Database, RefreshCw, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/cn";
import {
  useDashboardCache,
  useCacheMonitor,
  useOfflineDataAvailability,
} from "@/hooks/useDashboardCache";

/**
 * 캐시 상태 및 오프라인 모드 표시 컴포넌트
 * Requirements: 4.1, 4.2, 4.3 - 캐시 상태 시각화 및 오프라인 지원
 */

interface CacheStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
}

export function CacheStatusIndicator({
  className,
  showDetails = false,
  compact = false,
}: CacheStatusIndicatorProps) {
  const { invalidateAll, prefetchAll } = useDashboardCache();
  const cacheStats = useCacheMonitor();
  const { isOnline, availableData, hasAnyOfflineData } =
    useOfflineDataAvailability();

  const handleRefreshCache = async () => {
    await invalidateAll();
    await prefetchAll();
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-orange-600" />
                )}
                {!isOnline && hasAnyOfflineData && (
                  <Database className="h-3 w-3 text-blue-600" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <p>{isOnline ? "온라인" : "오프라인"}</p>
                {!isOnline && hasAnyOfflineData && <p>캐시된 데이터 사용 중</p>}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-card p-3",
        className,
      )}
    >
      {/* 연결 상태 */}
      <div className="flex items-center gap-2">
        {isOnline ? (
          <div className="flex items-center gap-2 text-green-600">
            <Wifi className="h-4 w-4" />
            <span className="text-sm font-medium">온라인</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-orange-600">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">오프라인</span>
          </div>
        )}
      </div>

      {/* 오프라인 데이터 상태 */}
      {!isOnline && (
        <div className="flex items-center gap-2">
          {hasAnyOfflineData ? (
            <Badge variant="secondary" className="text-xs">
              <Database className="mr-1 h-3 w-3" />
              캐시 데이터 사용
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="mr-1 h-3 w-3" />
              데이터 없음
            </Badge>
          )}
        </div>
      )}

      {/* 캐시 통계 (상세 모드) */}
      {showDetails && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            캐시: {cacheStats.cachedQueries}/{cacheStats.totalQueries}
          </span>
          <span>활성: {cacheStats.activeQueries}</span>
          {cacheStats.staleQueries > 0 && (
            <span className="text-orange-600">
              오래됨: {cacheStats.staleQueries}
            </span>
          )}
        </div>
      )}

      {/* 새로고침 버튼 */}
      {isOnline && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefreshCache}
          className="h-6 px-2"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

/**
 * 오프라인 데이터 가용성 표시 컴포넌트
 */
export function OfflineDataStatus({ className }: { className?: string }) {
  const { isOnline, availableData } = useOfflineDataAvailability();

  if (isOnline || !availableData) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-md border border-blue-200 bg-blue-50 p-2",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-blue-800">
        <Database className="h-4 w-4" />
        <span className="text-sm font-medium">오프라인 모드</span>
      </div>
      <div className="mt-1 text-xs text-blue-600">
        사용 가능한 캐시 데이터:
        <ul className="mt-1 ml-4 list-disc">
          {availableData.bookmarks && <li>북마크 데이터</li>}
          {availableData.dashboard && <li>대시보드 메트릭</li>}
        </ul>
      </div>
    </div>
  );
}

/**
 * 캐시 관리 패널 (개발/관리자용)
 */
export function CacheManagementPanel({ className }: { className?: string }) {
  const {
    invalidateAll,
    invalidateBookmarks,
    invalidateDashboard,
    prefetchAll,
    cacheStatus,
  } = useDashboardCache();
  const cacheStats = useCacheMonitor();

  return (
    <div className={cn("space-y-4 rounded-lg border bg-card p-4", className)}>
      <h3 className="text-lg font-semibold">캐시 관리</h3>

      {/* 캐시 통계 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {cacheStats.totalQueries}
          </div>
          <div className="text-xs text-muted-foreground">총 쿼리</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {cacheStats.cachedQueries}
          </div>
          <div className="text-xs text-muted-foreground">캐시됨</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {cacheStats.staleQueries}
          </div>
          <div className="text-xs text-muted-foreground">오래됨</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {cacheStats.activeQueries}
          </div>
          <div className="text-xs text-muted-foreground">활성</div>
        </div>
      </div>

      {/* 캐시 조작 버튼들 */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={invalidateAll}>
          <RefreshCw className="mr-2 h-4 w-4" />
          전체 새로고침
        </Button>
        <Button variant="outline" size="sm" onClick={invalidateBookmarks}>
          북마크 새로고침
        </Button>
        <Button variant="outline" size="sm" onClick={invalidateDashboard}>
          대시보드 새로고침
        </Button>
        <Button variant="outline" size="sm" onClick={prefetchAll}>
          <Database className="mr-2 h-4 w-4" />
          데이터 프리로드
        </Button>
      </div>
    </div>
  );
}

export default CacheStatusIndicator;
