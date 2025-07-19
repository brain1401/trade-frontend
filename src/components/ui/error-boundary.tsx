import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * 에러 타입 정의
 */
export type ErrorType = "network" | "server" | "client" | "unknown";

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  details?: string;
  statusCode?: number;
}

/**
 * 에러 상태 컴포넌트 Props
 */
interface ErrorStateProps {
  error: ErrorInfo;
  onRetry?: () => void;
  onGoHome?: () => void;
  className?: string;
  showDetails?: boolean;
}

/**
 * 에러 상태 표시 컴포넌트
 */
export function ErrorState({
  error,
  onRetry,
  onGoHome,
  className = "",
  showDetails = false,
}: ErrorStateProps) {
  const getErrorIcon = (type: ErrorType) => {
    switch (type) {
      case "network":
        return <AlertTriangle className="h-8 w-8 text-orange-500" />;
      case "server":
        return <AlertTriangle className="h-8 w-8 text-red-500" />;
      default:
        return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getErrorTitle = (type: ErrorType) => {
    switch (type) {
      case "network":
        return "네트워크 연결 오류";
      case "server":
        return "서버 오류";
      case "client":
        return "클라이언트 오류";
      default:
        return "알 수 없는 오류";
    }
  };

  const getErrorDescription = (error: ErrorInfo) => {
    switch (error.type) {
      case "network":
        return "인터넷 연결을 확인하고 다시 시도해주세요.";
      case "server":
        return "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      case "client":
        return "요청을 처리하는 중 문제가 발생했습니다.";
      default:
        return error.message || "예상치 못한 오류가 발생했습니다.";
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="mb-4">{getErrorIcon(error.type)}</div>

      <Alert className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{getErrorTitle(error.type)}</AlertTitle>
        <AlertDescription className="mt-2">
          {getErrorDescription(error)}
          {showDetails && error.details && (
            <details className="mt-2 text-sm text-muted-foreground">
              <summary className="cursor-pointer">자세한 정보</summary>
              <pre className="mt-1 text-xs whitespace-pre-wrap">
                {error.details}
              </pre>
            </details>
          )}
        </AlertDescription>
      </Alert>

      <div className="mt-6 flex space-x-3">
        {onRetry && (
          <Button onClick={onRetry} variant="default" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
        )}
        {onGoHome && (
          <Button onClick={onGoHome} variant="outline" size="sm">
            <Home className="mr-2 h-4 w-4" />
            홈으로
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * 섹션별 에러 표시 컴포넌트
 */
interface SectionErrorProps {
  title: string;
  error: ErrorInfo;
  onRetry?: () => void;
  compact?: boolean;
  className?: string;
}

export function SectionError({
  title,
  error,
  onRetry,
  compact = false,
  className = "",
}: SectionErrorProps) {
  if (compact) {
    return (
      <div
        className={`rounded-lg border border-destructive/20 bg-destructive/5 p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">
              {title} 로딩 실패
            </span>
          </div>
          {onRetry && (
            <Button onClick={onRetry} variant="ghost" size="sm">
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border bg-card p-6 ${className}`}>
      <div className="text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
        <h3 className="mt-2 text-sm font-semibold text-destructive">
          {title} 로딩 실패
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {getErrorDescription(error)}
        </p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            다시 시도
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * React Error Boundary 컴포넌트
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 개발 환경에서 에러 로깅
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      return (
        <ErrorState
          error={{
            type: "client",
            message: this.state.error.message,
            details: this.state.errorInfo?.componentStack || undefined,
          }}
          onRetry={this.resetError}
          showDetails={process.env.NODE_ENV === "development"}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * 에러 정보를 ErrorInfo 타입으로 변환하는 유틸리티 함수
 */
export function createErrorInfo(error: unknown): ErrorInfo {
  if (error instanceof Error) {
    // HTTP 에러 처리
    if ("status" in error || "statusCode" in error) {
      const statusCode = (error as any).status || (error as any).statusCode;
      return {
        type:
          statusCode >= 500
            ? "server"
            : statusCode >= 400
              ? "client"
              : "unknown",
        message: error.message,
        statusCode,
      };
    }

    // 네트워크 에러 처리
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return {
        type: "network",
        message: error.message,
      };
    }

    return {
      type: "client",
      message: error.message,
    };
  }

  return {
    type: "unknown",
    message: String(error) || "알 수 없는 오류가 발생했습니다.",
  };
}

// 에러 설명을 가져오는 헬퍼 함수
function getErrorDescription(error: ErrorInfo): string {
  switch (error.type) {
    case "network":
      return "인터넷 연결을 확인하고 다시 시도해주세요.";
    case "server":
      return "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
    case "client":
      return "요청을 처리하는 중 문제가 발생했습니다.";
    default:
      return error.message || "예상치 못한 오류가 발생했습니다.";
  }
}
