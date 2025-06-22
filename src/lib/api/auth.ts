import type { ApiResponse } from "@/types/common";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  OAuthProvider,
  OAuthCallbackResult,
} from "@/types/auth";
import { apiClient, ApiError, API_BASE_URL } from "./client";
import { cookieUtils } from "@/lib/utils/cookies";

/**
 * 인증 API 클라이언트 (API v2.4 대응)
 *
 * 주요 변경사항:
 * - 로그아웃 응답: 200 OK -> 204 No Content
 * - OAuth 프로필 이미지 지원
 * - 확장된 에러 코드 체계
 * - 보안 정책 강화 (사용자 열거 공격 방지)
 */
export const authApi = {
  /**
   * 로그인
   *
   * 성공 시 HttpOnly 쿠키가 자동으로 설정됩니다.
   * rememberMe가 true면 7일간, false면 세션 쿠키로 설정됩니다.
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        credentials,
      );

      // 로그인 성공 시 사용자 정보 검증
      if (response.data.success === "SUCCESS" && response.data.data?.user) {
        console.log("로그인 성공:", {
          email: response.data.data.user.email,
          name: response.data.data.user.name,
          hasProfileImage: !!response.data.data.user.profileImage,
        });
      }

      return response.data;
    } catch (error) {
      // 로그인 실패 시 기존 쿠키 정리 (보안 강화)
      if (error instanceof ApiError && error.isAuthenticationError()) {
        cookieUtils.clearAuthCookies();
      }
      throw error;
    }
  },

  /**
   * 회원가입
   *
   * 계정 생성 후 즉시 로그인 가능한 상태가 됩니다.
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    const response = await apiClient.post<ApiResponse<User>>(
      "/auth/register",
      userData,
    );

    if (response.data.success === "SUCCESS" && response.data.data) {
      console.log("회원가입 성공:", {
        email: response.data.data.email,
        name: response.data.data.name,
      });
    }

    return response.data;
  },

  /**
   * 인증 상태 확인
   *
   * 유저가 존재하지 않거나 토큰이 유효하지 않으면
   * 자동으로 쿠키를 삭제하고 에러를 발생시킵니다.
   */
  async verify(): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get<ApiResponse<User>>("/auth/verify");

      // 인증 성공 시 사용자 정보 로깅
      if (response.data.success === "SUCCESS" && response.data.data) {
        console.log("인증 확인 성공:", {
          email: response.data.data.email,
          name: response.data.data.name,
          hasProfileImage: !!response.data.data.profileImage,
        });
      }

      return response.data;
    } catch (error) {
      // verify 실패 시 (토큰 무효, 사용자 삭제 등) 쿠키 정리
      if (error instanceof ApiError && error.isAuthenticationError()) {
        console.warn("인증 확인 실패 - 쿠키를 정리합니다:", {
          statusCode: error.statusCode,
          errorCode: error.errorCode,
          message: error.message,
        });
        cookieUtils.clearAuthCookies();
      }
      throw error;
    }
  },

  /**
   * 로그아웃 (API v2.4 - 204 No Content 응답)
   *
   * 성공 시 204 No Content를 반환하며 응답 본문이 없습니다.
   * 실패해도 클라이언트 쿠키는 항상 정리됩니다.
   */
  async logout(): Promise<void> {
    try {
      const response = await apiClient.post("/auth/logout");

      // 204 No Content 응답 확인
      if (response.status === 204) {
        console.log("로그아웃 성공 (204 No Content)");
      } else if (response.status === 200) {
        // 이미 로그아웃 상태인 경우
        console.log("이미 로그아웃 상태");
      }
    } catch (error) {
      // 로그아웃 API 실패는 로깅만 하고 에러를 던지지 않음
      console.warn(
        "로그아웃 API 호출 실패:",
        error instanceof ApiError
          ? {
              statusCode: error.statusCode,
              errorCode: error.errorCode,
              message: error.message,
            }
          : error,
      );
    } finally {
      // API 호출 성공 여부와 관계없이 항상 쿠키 정리
      cookieUtils.clearAuthCookies();
      console.log("로그아웃 완료 - 쿠키 정리됨");
    }
  },

  /**
   * OAuth 로그인 URL 생성
   *
   * 지원하는 제공업체: google, naver, kakao
   * 각 제공업체별로 프로필 이미지도 함께 획득됩니다.
   */
  getOAuthUrl(provider: OAuthProvider, rememberMe: boolean = false): string {
    const params = new URLSearchParams();
    if (rememberMe) {
      params.append("rememberMe", "true");
    }

    const url = `${API_BASE_URL}/oauth2/authorization/${provider}?${params.toString()}`;
    console.log("OAuth URL 생성:", { provider, rememberMe, url });

    return url;
  },

  /**
   * OAuth 콜백 처리 결과 확인
   *
   * OAuth 로그인 완료 후 프론트엔드로 리디렉션된 상태에서
   * URL 파라미터를 통해 성공/실패 여부를 확인합니다.
   */
  parseOAuthCallback(): OAuthCallbackResult {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success") === "true";
    const error = urlParams.get("error");

    if (success) {
      console.log("OAuth 콜백 성공");
      return { success: true };
    } else if (error) {
      console.warn("OAuth 콜백 실패:", error);

      // 에러 코드별 처리
      let errorMessage = "소셜 로그인에 실패했습니다";
      switch (error) {
        case "oauth_failed":
          errorMessage = "소셜 로그인 처리 중 오류가 발생했습니다";
          break;
        case "oauth_cancelled":
          errorMessage = "소셜 로그인이 취소되었습니다";
          break;
        case "unsupported_provider":
          errorMessage = "지원하지 않는 소셜 로그인 방식입니다";
          break;
      }

      return { success: false, error: errorMessage };
    }

    return { success: false, error: "알 수 없는 OAuth 오류" };
  },

  /**
   * 수동으로 인증 쿠키 삭제 (비상용)
   *
   * 인증 문제 발생 시 사용자가 직접 쿠키를 삭제할 수 있습니다.
   */
  clearAuthCookies(): void {
    cookieUtils.clearAuthCookies();
    console.log("인증 쿠키 수동 삭제 완료");
  },

  /**
   * 에러 메시지 파싱 도우미
   *
   * API 에러를 사용자 친화적 메시지로 변환합니다.
   */
  parseErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
      return error.getUserFriendlyMessage();
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "알 수 없는 오류가 발생했습니다";
  },
};
