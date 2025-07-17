import type { ErrorState } from "@/types/dashboard";

/**
 * 대시보드 에러 처리 관련 유틸리티 함수들
 * 에러 분류, 메시지 생성, 재시도 로직 등을 제공
 */

/**
 * 에러 객체를 ErrorState로 변환하는 함수
 *
 * @param error - 원본 에러 객체
 * @param section - 에러가 발생한 섹션 (선택사항)
 * @returns ErrorState 객체
 */
export const createErrorState = (
  error: unknown,
  section?: string,
): ErrorState => {
  // 네트워크 에러 감지
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      type: "network",
      message: "네트워크 연결을 확인해주세요.",
      retryable: true,
      section,
    };
  }

  // HTTP 에러 감지
  if (error && typeof error === "object" && "status" in error) {
    const status = (error as any).status;

    if (status >= 400 && status < 500) {
      return {
        type: status === 403 || status === 401 ? "permission" : "server",
        message:
          status === 403
            ? "접근 권한이 없습니다."
            : status === 404
              ? "요청한 데이터를 찾을 수 없습니다."
              : "클라이언트 요청에 문제가 있습니다.",
        retryable: status === 429, // Rate limit의 경우만 재시도 가능
        section,
      };
    }

    if (status >= 500) {
      return {
        type: "server",
        message: "서버에 일시적인 문제가 발생했습니다.",
        retryable: true,
        section,
      };
    }
  }

  // 일반적인 에러
  const message =
    error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

  return {
    type: "unknown",
    message,
    retryable: true,
    section,
  };
};

/**
 * 재시도 가능한 에러인지 확인하는 함수
 *
 * @param error - ErrorState 객체
 * @returns 재시도 가능 여부
 */
export const isRetryableError = (error: ErrorState): boolean => {
  return error.retryable && error.type !== "permission";
};

/**
 * 에러 타입에 따른 아이콘 이름을 반환하는 함수
 *
 * @param errorType - 에러 타입
 * @returns Lucide 아이콘 이름
 */
export const getErrorIcon = (errorType: ErrorState["type"]): string => {
  switch (errorType) {
    case "network":
      return "WifiOff";
    case "server":
      return "ServerCrash";
    case "permission":
      return "Lock";
    case "unknown":
    default:
      return "AlertCircle";
  }
};

/**
 * 에러 심각도를 반환하는 함수
 *
 * @param error - ErrorState 객체
 * @returns 심각도 레벨 (1-5, 높을수록 심각)
 */
export const getErrorSeverity = (error: ErrorState): number => {
  switch (error.type) {
    case "permission":
      return 5; // 가장 심각 (사용자 액션 필요)
    case "server":
      return 4; // 심각 (서비스 영향)
    case "network":
      return 3; // 보통 (일시적 문제)
    case "unknown":
    default:
      return 2; // 낮음 (예상치 못한 문제)
  }
};

/**
 * 재시도 지연 시간을 계산하는 함수 (지수 백오프)
 *
 * @param attempt - 시도 횟수 (0부터 시작)
 * @param baseDelay - 기본 지연 시간 (밀리초)
 * @param maxDelay - 최대 지연 시간 (밀리초)
 * @returns 지연 시간 (밀리초)
 */
export const calculateRetryDelay = (
  attempt: number,
  baseDelay: number = 1000,
  maxDelay: number = 30000,
): number => {
  const delay = baseDelay * Math.pow(2, attempt);
  return Math.min(delay, maxDelay);
};

/**
 * 에러 로깅을 위한 함수
 *
 * @param error - ErrorState 객체
 * @param context - 추가 컨텍스트 정보
 */
export const logError = (
  error: ErrorState,
  context?: Record<string, any>,
): void => {
  const logData = {
    timestamp: new Date().toISOString(),
    error: {
      type: error.type,
      message: error.message,
      section: error.section,
      retryable: error.retryable,
    },
    context,
    userAgent:
      typeof window !== "undefined" ? window.navigator.userAgent : "server",
    url: typeof window !== "undefined" ? window.location.href : "unknown",
  };

  // 개발 환경에서는 콘솔에 출력
  if (process.env.NODE_ENV === "development") {
    console.error("Dashboard Error:", logData);
  }

  // 프로덕션 환경에서는 에러 추적 서비스로 전송
  // TODO: 실제 에러 추적 서비스 연동 (예: Sentry, LogRocket 등)
};

/**
 * 에러 상태를 사용자 친화적인 메시지로 변환하는 함수
 *
 * @param error - ErrorState 객체
 * @param includeRetryInfo - 재시도 정보 포함 여부
 * @returns 사용자 친화적인 에러 메시지
 */
export const formatErrorMessage = (
  error: ErrorState,
  includeRetryInfo: boolean = true,
): string => {
  let message = error.message;

  if (includeRetryInfo && error.retryable) {
    message += " 잠시 후 다시 시도해주세요.";
  }

  if (error.section) {
    message = `${error.section}: ${message}`;
  }

  return message;
};

/**
 * 여러 에러를 하나의 요약 메시지로 변환하는 함수
 *
 * @param errors - ErrorState 배열
 * @returns 요약된 에러 메시지
 */
export const summarizeErrors = (errors: ErrorState[]): string => {
  if (errors.length === 0) {
    return "오류가 없습니다.";
  }

  if (errors.length === 1) {
    return formatErrorMessage(errors[0]);
  }

  const errorCounts = errors.reduce(
    (acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const summaryParts = Object.entries(errorCounts).map(([type, count]) => {
    const typeLabel =
      {
        network: "네트워크",
        server: "서버",
        permission: "권한",
        unknown: "기타",
      }[type] || "알 수 없음";

    return `${typeLabel} 오류 ${count}개`;
  });

  return `총 ${errors.length}개의 오류가 발생했습니다: ${summaryParts.join(", ")}`;
};

/**
 * 에러 복구 제안을 생성하는 함수
 *
 * @param error - ErrorState 객체
 * @returns 복구 제안 배열
 */
export const getRecoveryActions = (error: ErrorState): string[] => {
  const actions: string[] = [];

  switch (error.type) {
    case "network":
      actions.push("인터넷 연결 상태를 확인해주세요");
      actions.push("VPN 연결을 확인해주세요");
      actions.push("방화벽 설정을 확인해주세요");
      break;

    case "server":
      actions.push("잠시 후 다시 시도해주세요");
      actions.push("페이지를 새로고침해주세요");
      actions.push("문제가 지속되면 관리자에게 문의해주세요");
      break;

    case "permission":
      actions.push("로그인 상태를 확인해주세요");
      actions.push("계정 권한을 확인해주세요");
      actions.push("관리자에게 권한 요청을 해주세요");
      break;

    case "unknown":
    default:
      actions.push("페이지를 새로고침해주세요");
      actions.push("브라우저 캐시를 삭제해주세요");
      actions.push("다른 브라우저에서 시도해주세요");
      break;
  }

  return actions;
};

/**
 * 에러 발생 빈도를 추적하는 클래스
 */
export class ErrorTracker {
  private errorCounts: Map<string, number> = new Map();
  private lastErrors: Map<string, Date> = new Map();

  /**
   * 에러 발생을 기록하는 함수
   *
   * @param errorKey - 에러 식별 키
   * @param error - ErrorState 객체
   */
  recordError(errorKey: string, error: ErrorState): void {
    const currentCount = this.errorCounts.get(errorKey) || 0;
    this.errorCounts.set(errorKey, currentCount + 1);
    this.lastErrors.set(errorKey, new Date());

    // 에러 로깅
    logError(error, {
      errorKey,
      count: currentCount + 1,
      isRecurring: currentCount > 0,
    });
  }

  /**
   * 특정 에러의 발생 횟수를 반환하는 함수
   *
   * @param errorKey - 에러 식별 키
   * @returns 발생 횟수
   */
  getErrorCount(errorKey: string): number {
    return this.errorCounts.get(errorKey) || 0;
  }

  /**
   * 특정 에러의 마지막 발생 시간을 반환하는 함수
   *
   * @param errorKey - 에러 식별 키
   * @returns 마지막 발생 시간 (없으면 null)
   */
  getLastErrorTime(errorKey: string): Date | null {
    return this.lastErrors.get(errorKey) || null;
  }

  /**
   * 에러 통계를 초기화하는 함수
   */
  reset(): void {
    this.errorCounts.clear();
    this.lastErrors.clear();
  }

  /**
   * 반복되는 에러인지 확인하는 함수
   *
   * @param errorKey - 에러 식별 키
   * @param threshold - 반복 임계값 (기본값: 3)
   * @returns 반복 에러 여부
   */
  isRecurringError(errorKey: string, threshold: number = 3): boolean {
    return this.getErrorCount(errorKey) >= threshold;
  }
}

// 전역 에러 트래커 인스턴스
export const globalErrorTracker = new ErrorTracker();
