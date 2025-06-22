import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  OAuthProvider,
} from "@/types/auth";

/**
 * API 기본 설정
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";

/**
 * 쿠키 유틸리티 함수들
 */
const cookieUtils = {
  /**
   * 특정 쿠키 삭제
   */
  deleteCookie(name: string) {
    // 현재 도메인과 경로에서 쿠키 삭제
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    // 루트 도메인에서도 쿠키 삭제 시도
    const domain = window.location.hostname;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
    if (domain.includes(".")) {
      const rootDomain = "." + domain.split(".").slice(-2).join(".");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${rootDomain};`;
    }
  },

  /**
   * 모든 인증 관련 쿠키 삭제
   */
  clearAuthCookies() {
    // 일반적인 JWT 쿠키 이름들을 삭제
    const commonCookieNames = [
      "accessToken",
      "access_token",
      "jwt",
      "JWT",
      "authToken",
      "auth_token",
      "token",
      "session",
    ];

    commonCookieNames.forEach((name) => {
      this.deleteCookie(name);
    });

    console.log("모든 인증 쿠키가 삭제되었습니다");
  },
};

/**
 * HTTP 요청을 위한 기본 설정
 */
const defaultOptions: RequestInit = {
  credentials: "include", // HttpOnly 쿠키 포함
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * 인증이 필요 없는 엔드포인트들
 */
const publicEndpoints = [
  "/auth/login",
  "/auth/register",
  "/auth/verify", // 이것도 public으로 처리 (쿠키 존재 여부 확인용)
];

/**
 * API 요청 헬퍼 함수
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  try {
    // 인증이 필요한 요청인지 확인
    const isPublicEndpoint = publicEndpoints.some((path) =>
      endpoint.startsWith(path),
    );

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    const data: ApiResponse<T> = await response.json();

    // 401 Unauthorized 처리
    if (response.status === 401) {
      // 인증 쿠키 삭제
      cookieUtils.clearAuthCookies();

      throw new ApiError(
        data.message || "인증이 만료되었습니다. 다시 로그인해주세요.",
        401,
        "UNAUTHORIZED",
      );
    }

    // 403 Forbidden (사용자가 삭제되었거나 비활성화된 경우)
    if (response.status === 403) {
      // 인증 쿠키 삭제
      cookieUtils.clearAuthCookies();

      throw new ApiError(
        data.message || "접근 권한이 없습니다.",
        403,
        "FORBIDDEN",
      );
    }

    if (!response.ok) {
      throw new ApiError(
        data.message || `HTTP error! status: ${response.status}`,
        response.status,
      );
    }

    return data;
  } catch (error) {
    console.error("API 요청 실패:", error);
    throw error;
  }
}

/**
 * 인증 API 클라이언트
 */
export const authApi = {
  /**
   * 로그인
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  /**
   * 회원가입
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return apiRequest<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  /**
   * 인증 상태 확인
   *
   * 유저가 존재하지 않거나 토큰이 유효하지 않으면
   * 자동으로 쿠키를 삭제하고 에러를 발생시킵니다.
   */
  async verify(): Promise<ApiResponse<User>> {
    try {
      return await apiRequest<User>("/auth/verify", {
        method: "GET",
      });
    } catch (error) {
      // verify 실패 시 (토큰 무효, 사용자 삭제 등) 쿠키 정리
      if (
        error instanceof ApiError &&
        (error.statusCode === 401 || error.statusCode === 403)
      ) {
        console.warn("인증 확인 실패 - 쿠키를 정리합니다:", error.message);
        cookieUtils.clearAuthCookies();
      }
      throw error;
    }
  },

  /**
   * 로그아웃
   */
  async logout(): Promise<ApiResponse<null>> {
    try {
      return await apiRequest<null>("/auth/logout", {
        method: "POST",
      });
    } finally {
      // 로그아웃 후 항상 쿠키 정리
      cookieUtils.clearAuthCookies();
    }
  },

  /**
   * OAuth 로그인 URL 생성
   */
  getOAuthUrl(provider: OAuthProvider, rememberMe: boolean = false): string {
    const params = new URLSearchParams();
    if (rememberMe) {
      params.append("rememberMe", "true");
    }
    return `${API_BASE_URL}/oauth2/authorization/${provider}?${params.toString()}`;
  },

  /**
   * 수동으로 인증 쿠키 삭제 (비상용)
   */
  clearAuthCookies(): void {
    cookieUtils.clearAuthCookies();
  },
};

/**
 * 일반적인 API 오류 처리
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorCode?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * 401/403 Unauthorized 응답 처리를 위한 인터셉터
 */
export function setupApiInterceptor(onUnauthorized: () => void) {
  // 원래 fetch 함수를 저장
  const originalFetch = window.fetch;

  // fetch 함수를 오버라이드
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await originalFetch(input, init);

    // 401/403 응답 시 자동 로그아웃 처리
    if (response.status === 401 || response.status === 403) {
      // 쿠키 삭제
      cookieUtils.clearAuthCookies();
      // 인증 상태 초기화
      onUnauthorized();
    }

    return response;
  };
}
