type ErrorConstructorWithStackTrace = ErrorConstructor & {
  captureStackTrace: (
    targetObject: object,
    constructorOpt?: new (...args: any[]) => object,
  ) => void;
};

/**
 * API 통신 중 발생하는 에러를 표현하는 커스텀 에러 클래스
 */
export class ApiError extends Error {
  /**
   * HTTP 상태 코드
   */
  public readonly statusCode: number;

  /**
   * API 서버에서 정의한 에러 코드 (선택 사항)
   */
  public readonly errorCode?: string;

  /**
   * ApiError 인스턴스를 생성
   * @param statusCode HTTP 상태 코드
   * @param errorCode API 서버 정의 에러 코드
   * @param message 에러 메시지
   */
  constructor(statusCode: number, errorCode?: string, message?: string) {
    super(message || "API 요청 중 알 수 없는 오류가 발생했습니다.");
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;

    // V8 엔진(Chrome, Node.js 등)에서 스택 트레이스를 올바르게 복원
    if ((Error as ErrorConstructorWithStackTrace).captureStackTrace) {
      (Error as ErrorConstructorWithStackTrace).captureStackTrace(
        this,
        ApiError,
      );
    }
  }

  /**
   * 에러가 인증 관련 문제인지 확인
   * @returns 401 또는 403 상태 코드인 경우 true
   */
  public get isAuthError(): boolean {
    return this.statusCode === 401 || this.statusCode === 403;
  }
}
