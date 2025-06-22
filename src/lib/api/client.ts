import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/common";
import type { ApiErrorCode } from "@/types/auth";
import { cookieUtils } from "@/lib/utils/cookies";

/**
 * API 기본 설정
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";

/**
 * API v2.4 오류 처리 클래스
 *
 * 새로운 에러 코드 체계와 보안 정책을 반영한 에러 처리
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorCode?: ApiErrorCode,
    public originalError?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }

  /**
   * 에러 코드별 사용자 친화적 메시지 반환
   */
  getUserFriendlyMessage(): string {
    switch (this.errorCode) {
      // 인증 관련 에러
      case "AUTH_001":
        return "이메일 또는 비밀번호가 올바르지 않습니다";
      case "AUTH_002":
        return "현재 계정에 일시적인 접근 제한이 적용되었습니다";
      case "AUTH_003":
        return "인증이 만료되었습니다. 다시 로그인해주세요";
      case "AUTH_004":
        return "인증 정보가 올바르지 않습니다";
      case "AUTH_005":
        return "해당 리소스에 접근할 권한이 없습니다";

      // OAuth 관련 에러
      case "OAUTH_001":
        return "지원하지 않는 소셜 로그인 방식입니다";
      case "OAUTH_002":
        return "소셜 로그인에 실패했습니다. 다시 시도해주세요";
      case "OAUTH_003":
        return "소셜 로그인이 취소되었습니다";

      // Rate Limiting 에러
      case "RATE_LIMIT_001":
        return "로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요";
      case "RATE_LIMIT_002":
        return "요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요";

      // 외부 시스템 연동 에러
      case "EXTERNAL_001":
        return "외부 시스템 연결에 실패했습니다. 잠시 후 다시 시도해주세요";
      case "EXTERNAL_002":
        return "외부 시스템 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요";

      // 사용자 관련 에러
      case "USER_001":
        return "이미 사용 중인 이메일입니다";
      case "USER_002":
        return "입력 정보가 올바르지 않습니다";
      case "USER_004":
        return "비밀번호가 정책에 맞지 않습니다";

      // 레거시 에러 코드 호환성
      case "UNAUTHORIZED":
        return "인증이 필요하거나 만료되었습니다";
      case "FORBIDDEN":
        return "접근 권한이 없습니다";
      case "TOKEN_EXPIRED":
        return "인증이 만료되었습니다. 다시 로그인해주세요";
      case "INVALID_TOKEN":
        return "인증 정보가 올바르지 않습니다";

      default:
        return this.message || "알 수 없는 오류가 발생했습니다";
    }
  }

  /**
   * 인증 관련 에러인지 확인
   */
  isAuthenticationError(): boolean {
    return (
      this.statusCode === 401 ||
      this.statusCode === 403 ||
      this.errorCode?.startsWith("AUTH_") ||
      this.errorCode === "UNAUTHORIZED" ||
      this.errorCode === "FORBIDDEN"
    );
  }
}

/**
 * 인증이 필요 없는 엔드포인트들
 */
const publicEndpoints = [
  "/auth/login",
  "/auth/register",
  "/auth/verify", // 이것도 public으로 처리 (쿠키 존재 여부 확인용)
  "/oauth2/authorization/", // OAuth 관련 엔드포인트
];

/**
 * Axios 인스턴스 생성
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // HttpOnly 쿠키 포함
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10초 타임아웃
});

/**
 * 응답 인터셉터 설정 (API v2.4 대응)
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // 성공적인 응답은 그대로 반환
    return response;
  },
  (error) => {
    // 응답 에러 처리
    if (error.response) {
      const { status, data } = error.response;
      const errorCode = data?.errorCode as ApiErrorCode;
      const message = data?.message;

      // 401 Unauthorized 처리
      if (status === 401) {
        cookieUtils.clearAuthCookies();

        const apiError = new ApiError(
          message || "인증이 필요합니다",
          401,
          errorCode || "AUTH_003",
          error,
        );

        console.error("API 요청 실패 (401):", {
          errorCode: apiError.errorCode,
          message: apiError.message,
          url: error.config?.url,
        });
        return Promise.reject(apiError);
      }

      // 403 Forbidden 처리
      if (status === 403) {
        cookieUtils.clearAuthCookies();

        const apiError = new ApiError(
          message || "접근 권한이 없습니다",
          403,
          errorCode || "AUTH_005",
          error,
        );

        console.error("API 요청 실패 (403):", {
          errorCode: apiError.errorCode,
          message: apiError.message,
          url: error.config?.url,
        });
        return Promise.reject(apiError);
      }

      // 423 Locked (계정 잠김) 처리
      if (status === 423) {
        const apiError = new ApiError(
          message || "계정이 일시적으로 잠겼습니다",
          423,
          errorCode || "AUTH_002",
          error,
        );

        console.error("API 요청 실패 (423):", {
          errorCode: apiError.errorCode,
          message: apiError.message,
          url: error.config?.url,
        });
        return Promise.reject(apiError);
      }

      // 429 Too Many Requests 처리
      if (status === 429) {
        const apiError = new ApiError(
          message || "요청 횟수를 초과했습니다",
          429,
          errorCode || "RATE_LIMIT_002",
          error,
        );

        console.warn("API 요청 실패 (429):", {
          errorCode: apiError.errorCode,
          message: apiError.message,
          url: error.config?.url,
        });
        return Promise.reject(apiError);
      }

      // 502 Bad Gateway (외부 시스템 연결 실패)
      if (status === 502) {
        const apiError = new ApiError(
          message || "외부 시스템 연결에 실패했습니다",
          502,
          "EXTERNAL_001" as ApiErrorCode,
          error,
        );

        console.error("API 요청 실패 (502):", {
          errorCode: apiError.errorCode,
          message: apiError.message,
          url: error.config?.url,
        });
        return Promise.reject(apiError);
      }

      // 504 Gateway Timeout (외부 시스템 타임아웃)
      if (status === 504) {
        const apiError = new ApiError(
          message || "외부 시스템 응답 시간이 초과되었습니다",
          504,
          "EXTERNAL_002" as ApiErrorCode,
          error,
        );

        console.error("API 요청 실패 (504):", {
          errorCode: apiError.errorCode,
          message: apiError.message,
          url: error.config?.url,
        });
        return Promise.reject(apiError);
      }

      // 기타 HTTP 에러
      const apiError = new ApiError(
        message || `HTTP error! status: ${status}`,
        status,
        errorCode,
        error,
      );

      console.error("API 요청 실패:", {
        status,
        errorCode: apiError.errorCode,
        message: apiError.message,
        url: error.config?.url,
      });
      return Promise.reject(apiError);
    }

    // 네트워크 에러 등
    const networkError = new ApiError(
      error.message || "네트워크 오류가 발생했습니다",
      0,
      "COMMON_002",
      error,
    );

    console.error("API 요청 실패 (네트워크):", networkError);
    return Promise.reject(networkError);
  },
);

/**
 * 401/403 Unauthorized 응답 처리를 위한 인터셉터
 * 스토어와 연동하여 인증 상태 초기화
 */
export function setupApiInterceptor(onUnauthorized: () => void) {
  // 응답 인터셉터에 인증 실패 시 콜백 추가
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error instanceof ApiError && error.isAuthenticationError()) {
        // 인증 상태 초기화 콜백 실행
        onUnauthorized();
      }
      return Promise.reject(error);
    },
  );
}

/**
 * API 기본 URL 내보내기
 */
export { API_BASE_URL };
