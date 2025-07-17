import React from "react";
import {
  SectionError,
  createErrorInfo,
  type ErrorInfo,
} from "./error-boundary";
import {
  useComponentLoadingState,
  type LoadingStateConfig,
} from "@/hooks/useLoadingStates";

/**
 * 로딩 래퍼 컴포넌트 Props
 */
interface LoadingWrapperProps {
  loading: boolean;
  error?: unknown;
  onRetry?: () => void;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  className?: string;
  compact?: boolean;
}

/**
 * 로딩 상태, 에러 상태, 성공 상태를 통합 관리하는 래퍼 컴포넌트
 */
export function LoadingWrapper({
  loading,
  error,
  onRetry,
  skeleton,
  children,
  title = "콘텐츠",
  className = "",
  compact = false,
}: LoadingWrapperProps) {
  const loadingState = useComponentLoadingState({
    isLoading: loading,
    isError: !!error,
    isSuccess: !loading && !error,
    error: error as Error,
  });

  if (loadingState.shouldShowLoading) {
    return <div className={className}>{skeleton}</div>;
  }

  if (loadingState.shouldShowError && error) {
    const errorInfo = createErrorInfo(error);
    return (
      <SectionError
        title={title}
        error={errorInfo}
        onRetry={onRetry}
        compact={compact}
        className={className}
      />
    );
  }

  return <div className={className}>{children}</div>;
}

/**
 * 섹션별 로딩 래퍼 컴포넌트
 */
interface SectionLoadingWrapperProps {
  title: string;
  loadingConfig: LoadingStateConfig;
  onRetry?: () => void;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function SectionLoadingWrapper({
  title,
  loadingConfig,
  onRetry,
  skeleton,
  children,
  className = "",
  compact = false,
}: SectionLoadingWrapperProps) {
  return (
    <LoadingWrapper
      loading={loadingConfig.isLoading || false}
      error={loadingConfig.error}
      onRetry={onRetry}
      skeleton={skeleton}
      title={title}
      className={className}
      compact={compact}
    >
      {children}
    </LoadingWrapper>
  );
}

/**
 * 조건부 렌더링을 위한 로딩 상태 체크 훅
 */
export function useLoadingWrapper(config: LoadingStateConfig) {
  const loadingState = useComponentLoadingState(config);

  const renderWithLoading = (
    skeleton: React.ReactNode,
    content: React.ReactNode,
    errorFallback?: (error: ErrorInfo, onRetry?: () => void) => React.ReactNode,
    onRetry?: () => void,
  ) => {
    if (loadingState.shouldShowLoading) {
      return skeleton;
    }

    if (loadingState.shouldShowError && loadingState.error) {
      const errorInfo = createErrorInfo(loadingState.error);
      if (errorFallback) {
        return errorFallback(errorInfo, onRetry);
      }
      return (
        <SectionError title="콘텐츠" error={errorInfo} onRetry={onRetry} />
      );
    }

    return content;
  };

  return {
    ...loadingState,
    renderWithLoading,
  };
}

/**
 * 다중 섹션 로딩 상태 관리 컴포넌트
 */
interface MultiSectionLoadingProps {
  sections: Array<{
    key: string;
    title: string;
    config: LoadingStateConfig;
    skeleton: React.ReactNode;
    content: React.ReactNode;
    onRetry?: () => void;
    className?: string;
  }>;
  className?: string;
}

export function MultiSectionLoading({
  sections,
  className = "",
}: MultiSectionLoadingProps) {
  return (
    <div className={className}>
      {sections.map((section) => (
        <SectionLoadingWrapper
          key={section.key}
          title={section.title}
          loadingConfig={section.config}
          onRetry={section.onRetry}
          skeleton={section.skeleton}
          className={section.className}
        >
          {section.content}
        </SectionLoadingWrapper>
      ))}
    </div>
  );
}
