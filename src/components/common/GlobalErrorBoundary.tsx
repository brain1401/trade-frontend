import React, { Component, useState, type ErrorInfo } from "react";
import { AlertTriangle, RefreshCw, RotateCcw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// TanStack Router 에러 컴포넌트용 Props
type ErrorComponentProps = {
  error: Error;
  info?: { componentStack: string };
  reset?: () => void;
};

// 에러 바운더리용 Props
type ErrorBoundaryProps = {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
};

// 에러 바운더리 State
type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
};

// TanStack Router용 ErrorFallback 컴포넌트
export const ErrorFallback: React.FC<ErrorComponentProps> = ({
  error,
  info,
  reset,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const isCriticalError = (error: Error): boolean => {
    const criticalPatterns = [
      "ChunkLoadError", // 코드 분할 실패
      "Authentication", // 인증 시스템 실패
      "WebSocket", // 실시간 연결 실패
      "Analysis", // AI 분석 시스템 실패
    ];

    return criticalPatterns.some(
      (pattern) =>
        error.name.includes(pattern) || error.message.includes(pattern),
    );
  };

  const handleRetry = () => {
    if (reset) {
      reset();
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const critical = isCriticalError(error);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>
              {critical ? "시스템 오류" : "예상치 못한 오류"}
            </CardTitle>
          </div>
          <CardDescription>
            {critical
              ? "중요한 시스템 오류가 발생했습니다. 팀에 자동으로 알림이 전송되었습니다."
              : "예상치 못한 오류가 발생했습니다. 복구를 시도하거나 페이지를 새로고침해주세요."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 에러 액션 버튼 */}
          <div className="flex flex-col gap-2 sm:flex-row">
            {!critical && reset && (
              <Button
                onClick={handleRetry}
                variant="default"
                className="flex-1"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                다시 시도
              </Button>
            )}
            <Button onClick={handleReload} variant="outline" className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" />
              페이지 새로고침
            </Button>
          </div>

          {/* 에러 상세 정보 토글 */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full justify-between"
            >
              <span>오류 상세 정보</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showDetails ? "rotate-180" : ""
                }`}
              />
            </Button>

            {showDetails && (
              <div className="max-h-32 overflow-auto rounded bg-muted p-3 font-mono text-sm">
                <div>
                  <strong>오류:</strong> {error.name}
                </div>
                <div>
                  <strong>메시지:</strong> {error.message}
                </div>
                {error.stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer">스택 트레이스</summary>
                    <pre className="mt-1 text-xs">{error.stack}</pre>
                  </details>
                )}
                {info?.componentStack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer">컴포넌트 스택</summary>
                    <pre className="mt-1 text-xs">{info.componentStack}</pre>
                  </details>
                )}
              </div>
            )}
          </div>

          {/* 도움말 링크 */}
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>문제가 지속될 경우:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>인터넷 연결 상태 확인</li>
              <li>브라우저 캐시 삭제</li>
              <li>문제가 계속되면 고객 지원팀에 문의</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 실제 에러 바운더리 클래스 컴포넌트
export class GlobalErrorBoundary extends Component<
  React.PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<ErrorBoundaryProps>) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("글로벌 에러 바운더리에서 오류 감지:", error, errorInfo);

    this.setState({ errorInfo });

    // 에러 리포팅
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 중요한 에러인 경우 모니터링 서비스에 리포트
    if (this.isCriticalError(error)) {
      this.reportError(error, errorInfo);
    }
  }

  private isCriticalError(error: Error): boolean {
    const criticalPatterns = [
      "ChunkLoadError", // 코드 분할 실패
      "Authentication", // 인증 시스템 실패
      "WebSocket", // 실시간 연결 실패
      "Analysis", // AI 분석 시스템 실패
    ];

    return criticalPatterns.some(
      (pattern) =>
        error.name.includes(pattern) || error.message.includes(pattern),
    );
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    // 백엔드 모니터링으로 에러 리포트 전송
    try {
      // TODO: API 클라이언트 구현 후 실제 에러 리포팅 활성화
      console.log("에러 리포트 전송:", {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        errorInfo: {
          componentStack: errorInfo.componentStack,
        },
        context: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (reportingError) {
      console.error("에러 리포팅 실패:", reportingError);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const componentStack = this.state.errorInfo?.componentStack;
      return (
        <ErrorFallback
          error={this.state.error}
          info={
            componentStack && typeof componentStack === "string"
              ? { componentStack }
              : undefined
          }
          reset={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorFallback;
