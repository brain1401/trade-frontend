import { useMemo } from "react";

/**
 * 로딩 상태 타입 정의
 */
export type LoadingState = "idle" | "loading" | "success" | "error";

export interface LoadingStateConfig {
  isLoading?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  isFetching?: boolean;
  error?: Error | null;
}

/**
 * 통합 로딩 상태 관리 훅
 *
 * 여러 쿼리의 로딩 상태를 통합하여 관리하고
 * 사용자에게 적절한 피드백을 제공
 */
export function useLoadingStates(configs: LoadingStateConfig[]) {
  return useMemo(() => {
    const hasLoading = configs.some((config) => config.isLoading);
    const hasError = configs.some((config) => config.isError);
    const hasFetching = configs.some((config) => config.isFetching);
    const allSuccess = configs.every(
      (config) => config.isSuccess || config.isError,
    );

    // 전체 로딩 상태 결정
    let overallState: LoadingState = "idle";
    if (hasLoading) {
      overallState = "loading";
    } else if (hasError) {
      overallState = "error";
    } else if (allSuccess) {
      overallState = "success";
    }

    // 에러 정보 수집
    const errors = configs
      .filter((config) => config.error)
      .map((config) => config.error)
      .filter(Boolean) as Error[];

    return {
      // 개별 상태
      isLoading: hasLoading,
      isError: hasError,
      isFetching: hasFetching,
      isSuccess: allSuccess && !hasError,

      // 통합 상태
      overallState,

      // 에러 정보
      errors,
      hasErrors: errors.length > 0,

      // 진행률 계산 (성공한 쿼리 / 전체 쿼리)
      progress:
        configs.length > 0
          ? configs.filter((config) => config.isSuccess || config.isError)
              .length / configs.length
          : 0,

      // 상태별 개수
      counts: {
        total: configs.length,
        loading: configs.filter((config) => config.isLoading).length,
        success: configs.filter((config) => config.isSuccess).length,
        error: configs.filter((config) => config.isError).length,
        fetching: configs.filter((config) => config.isFetching).length,
      },
    };
  }, [configs]);
}

/**
 * 단일 컴포넌트의 로딩 상태 관리 훅
 */
export function useComponentLoadingState(config: LoadingStateConfig) {
  return useMemo(() => {
    let state: LoadingState = "idle";

    if (config.isLoading) {
      state = "loading";
    } else if (config.isError) {
      state = "error";
    } else if (config.isSuccess) {
      state = "success";
    }

    return {
      state,
      isLoading: config.isLoading || false,
      isError: config.isError || false,
      isSuccess: config.isSuccess || false,
      isFetching: config.isFetching || false,
      error: config.error || null,

      // 상태 체크 헬퍼
      isIdle: state === "idle",
      canShowContent: state === "success",
      shouldShowLoading: state === "loading",
      shouldShowError: state === "error",
    };
  }, [config]);
}

/**
 * 스켈레톤 로딩 상태 관리 훅
 * 컴포넌트별로 다른 스켈레톤 표시 로직 제공
 */
export function useSkeletonState(
  isLoading: boolean,
  options: {
    minLoadingTime?: number; // 최소 로딩 시간 (ms)
    showSkeletonOnRefetch?: boolean; // 재요청 시 스켈레톤 표시 여부
  } = {},
) {
  const { minLoadingTime = 300, showSkeletonOnRefetch = false } = options;

  return useMemo(() => {
    // 최소 로딩 시간을 고려한 스켈레톤 표시 로직
    const shouldShowSkeleton = isLoading;

    return {
      shouldShowSkeleton,
      skeletonProps: {
        "aria-label": "콘텐츠 로딩 중",
        role: "status",
      },
    };
  }, [isLoading, minLoadingTime, showSkeletonOnRefetch]);
}
