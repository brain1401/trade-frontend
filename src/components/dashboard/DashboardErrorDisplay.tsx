import React from "react";
import {
  AlertTriangle,
  RefreshCw,
  WifiOff,
  ServerCrash,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { ErrorState } from "@/types/dashboard";

/**
 * 통합 대시보드 에러 표시 컴포넌트
 * 모든 대시보드 컴포넌트에서 일관된 에러 UI를 제공
 * Requirements: 3.1, 3.2 - 일관된 에러 표시 및 재시도 기능
 */

interface DashboardErrorDisplayProps {
  error: ErrorState;
  onRetry?: () => void;
  title?: string;
  compact?: boolean;
  showDetails?: boolean;
  className?: string;
  canRetry?: boolean;
  isRecurringError?: boolean;
  errorCount?: number;
}

/**
 * 에러 타입에 따른 아이콘을 반환하는 함수
 */
const getErrorIcon = (type: ErrorState["type"]) => {
  switch (type) {
    case "network":
      return WifiOff;
    case "server":
      return ServerCrash;
    case "permission":
      return Lock;
    case "unknown":
    default:
      return AlertTriangle;
  }
};

/**
 * 에러 타입에 따른 색상 클래스를 반환하는 함수
 */
const getErrorColorClass = (type: ErrorState["type"]) => {
  switch (type) {
    case "network":
      return "text-orange-600 border-orange-200 bg-orange-50";
    case "server":
      return "text-red-600 border-red-200 bg-red-50";
    case "permission":
      return "text-purple-600 border-purple-200 bg-purple-50";
    case "unknown":
    default:
      return "text-destructive border-destructive/20 bg-destructive/5";
  }
};

/**
 * 에러 타입에 따른 제목을 반환하는 함수
 */
const getErrorTitle = (type: ErrorState["type"]) => {
  switch (type) {
    case "network":
      return "네트워크 연결 오류";
    case "server":
      return "서버 오류";
    case "permission":
      return "권한 오류";
    case "unknown":
    default:
      return "알 수 없는 오류";
  }
};

/**
 * 컴팩트 에러 표시 컴포넌트
 */
export function CompactErrorDisplay({
  error,
  onRetry,
  title,
  canRetry = true,
  isRecurringError = false,
  errorCount = 0,
  className,
}: DashboardErrorDisplayProps) {
  const ErrorIcon = getErrorIcon(error.type);
  const colorClass = getErrorColorClass(error.type);

  return (
    <div
      className={cn("rounded-lg border p-3", colorClass, className)}
      role="alert"
      aria-label={`${title || "섹션"} 오류`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ErrorIcon className="h-4 w-4" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <span className="text-sm font-medium">
              {title ? `${title} 로딩 실패` : "데이터 로딩 실패"}
            </span>
            {isRecurringError && errorCount > 1 && (
              <span className="ml-2 text-xs opacity-75">
                ({errorCount}회 반복)
              </span>
            )}
          </div>
        </div>
        {onRetry && canRetry && error.retryable && (
          <Button
            onClick={onRetry}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            aria-label="다시 시도"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
      <p className="mt-1 text-xs opacity-75">{error.message}</p>
    </div>
  );
}

/**
 * 전체 에러 표시 컴포넌트
 */
export function FullErrorDisplay({
  error,
  onRetry,
  title,
  showDetails = false,
  canRetry = true,
  isRecurringError = false,
  errorCount = 0,
  className,
}: DashboardErrorDisplayProps) {
  const ErrorIcon = getErrorIcon(error.type);
  const errorTitle = getErrorTitle(error.type);

  return (
    <Card className={cn("", className)} role="alert">
      <CardHeader className="pb-4 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <ErrorIcon className="h-6 w-6 text-destructive" aria-hidden="true" />
        </div>
        <CardTitle className="text-lg text-destructive">
          {title ? `${title} ${errorTitle}` : errorTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>오류 발생</AlertTitle>
          <AlertDescription>
            {error.message}
            {isRecurringError && errorCount > 1 && (
              <div className="mt-2 text-sm text-muted-foreground">
                이 오류가 {errorCount}회 반복되었습니다.
              </div>
            )}
          </AlertDescription>
        </Alert>

        {showDetails && error.section && (
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              자세한 정보
            </summary>
            <div className="mt-2 text-xs text-muted-foreground">
              <p>섹션: {error.section}</p>
              <p>타입: {error.type}</p>
              <p>재시도 가능: {error.retryable ? "예" : "아니오"}</p>
              {errorCount > 0 && <p>오류 횟수: {errorCount}</p>}
            </div>
          </details>
        )}

        {onRetry && canRetry && error.retryable && (
          <div className="flex justify-center space-x-2">
            <Button onClick={onRetry} variant="default" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              다시 시도
            </Button>
          </div>
        )}

        {!error.retryable && (
          <p className="text-sm text-muted-foreground">
            이 오류는 자동으로 해결할 수 없습니다. 관리자에게 문의해주세요.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * 메인 대시보드 에러 표시 컴포넌트
 * compact prop에 따라 적절한 표시 방식을 선택
 */
export function DashboardErrorDisplay(props: DashboardErrorDisplayProps) {
  if (props.compact) {
    return <CompactErrorDisplay {...props} />;
  }
  return <FullErrorDisplay {...props} />;
}

/**
 * 메트릭 카드용 에러 표시 컴포넌트
 */
export function MetricCardError({
  error,
  onRetry,
  title,
  canRetry = true,
  className,
}: Pick<
  DashboardErrorDisplayProps,
  "error" | "onRetry" | "title" | "canRetry" | "className"
>) {
  const ErrorIcon = getErrorIcon(error.type);

  return (
    <Card
      className={cn("border-destructive/20 bg-destructive/5", className)}
      role="alert"
      aria-label={`${title} 데이터 로딩 오류`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-destructive">
          {title}
        </CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
          <ErrorIcon className="h-4 w-4 text-destructive" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-destructive">{error.message}</p>
        {onRetry && canRetry && error.retryable && (
          <button
            onClick={onRetry}
            className="rounded text-xs text-destructive underline hover:no-underline focus:ring-2 focus:ring-destructive focus:ring-offset-1 focus:outline-none"
            aria-label={`${title} 데이터 다시 시도`}
          >
            다시 시도
          </button>
        )}
      </CardContent>
    </Card>
  );
}

export default DashboardErrorDisplay;
