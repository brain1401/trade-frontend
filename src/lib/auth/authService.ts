import type { ApiResponse } from "../../types/common";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  OAuthProvider,
} from "../../types/auth";
import { httpClient } from "../api/common/httpClient";
import { tokenStore } from "./tokenStore";

/**
 * 인증 서비스 - API 호출 및 토큰 관리
 * v6.1: JWT 세부화 정책 지원 (HttpOnly 쿠키 환경)
 */
class AuthService {
  async login(credentials: LoginRequest): Promise<User> {
    const response = await httpClient.postRaw<LoginResponse>(
      "/auth/login",
      credentials,
    );

    if (response.success === "SUCCESS" && response.data) {
      // v6.1: Access Token은 tokenStore에서 메모리 관리
      tokenStore.setToken(response.data.accessToken);

      if (import.meta.env.DEV) {
        console.log("🔐 로그인 응답 처리 완료 - Access Token 저장됨");
      }

      return response.data.user;
    }

    throw new Error(response.message || "로그인에 실패했습니다");
  }

  async register(userData: RegisterRequest): Promise<User> {
    return httpClient.post<User>("/auth/register", userData);
  }

  async logout(): Promise<void> {
    try {
      // 서버에 로그아웃 요청. API 명세에 따라 서버는 이 요청에 대한 응답으로
      // HttpOnly 속성의 리프레시 토큰 쿠키를 삭제해야 함 (Max-Age=0).
      await httpClient.postRaw("/auth/logout");

      if (import.meta.env.DEV) {
        console.log(
          "🔐 서버 로그아웃 요청 성공. 브라우저의 네트워크 탭에서 /api/auth/logout 요청의 응답 헤더를 확인하여 'Set-Cookie' 헤더가 올바르게 전송되었는지 확인하세요.",
        );
      }
    } catch (error) {
      console.warn(
        "⚠️ 서버 로그아웃 API 호출 실패. 그러나 클라이언트 측 데이터는 계속해서 정리합니다.",
        error,
      );
    } finally {
      // API 호출 성공 여부와 관계없이 클라이언트 상태를 확실하게 정리
      tokenStore.clearToken();
      this.clearClientAuthData();

      if (import.meta.env.DEV) {
        console.log("🧹 클라이언트 인증 데이터 정리 완료.");
      }
    }
  }

  async getCurrentUser(): Promise<User> {
    return httpClient.get<User>("/auth/verify");
  }

  /**
   * v6.1: OAuth URL 생성 (remember me 지원)
   */
  getOAuthUrl(provider: OAuthProvider, rememberMe = false): string {
    const params = new URLSearchParams();
    if (rememberMe) {
      params.append("rememberMe", "true");
    }
    return `http://localhost:8081/api/oauth2/authorization/${provider}?${params.toString()}`;
  }

  /**
   * v6.1: OAuth 콜백 처리
   */
  handleOAuthCallback(): { success: boolean; error?: string } {
    const urlParams = new URLSearchParams(window.location.search);

    const status = urlParams.get("status");
    const accessToken = urlParams.get("accessToken");
    const error = urlParams.get("error");

    if (status === "success" && accessToken) {
      tokenStore.setToken(accessToken);
      this.clearCallbackUrl();

      if (import.meta.env.DEV) {
        console.log("🔐 OAuth 콜백 - Access Token 저장 완료");
      }

      return { success: true };
    }

    if (error) {
      return {
        success: false,
        error: this.getOAuthErrorMessage(error),
      };
    }

    return { success: false, error: "알 수 없는 OAuth 오류가 발생했습니다" };
  }

  /**
   * v6.1: 토큰 갱신 (httpClient에서 자동 처리되지만 수동 호출도 지원)
   */
  async refreshToken(): Promise<string> {
    try {
      const response = await httpClient.postRaw<{ accessToken: string }>(
        "/auth/refresh",
      );

      if (response.success === "SUCCESS" && response.data) {
        tokenStore.setToken(response.data.accessToken);

        if (import.meta.env.DEV) {
          console.log("🔄 토큰 갱신 성공 - 새 Access Token 저장됨");
        }

        return response.data.accessToken;
      }

      throw new Error(response.message || "토큰 갱신에 실패했습니다");
    } catch (error) {
      tokenStore.clearToken();

      if (import.meta.env.DEV) {
        console.warn("❌ 토큰 갱신 실패 - Access Token 삭제됨:", error);
      }

      throw error;
    }
  }

  /**
   * 클라이언트 사이드 인증 데이터 정리
   * 참고: HttpOnly 쿠키는 JavaScript로 삭제할 수 없으므로, 서버 API를 통해서만 삭제 가능합니다.
   * 이 함수는 로컬/세션 스토리지의 다른 민감한 정보를 제거합니다.
   */
  private clearClientAuthData(): void {
    // 로컬 스토리지나 세션 스토리지의 인증 관련 데이터 정리
    if (typeof window !== "undefined") {
      try {
        // 일반적인 인증 관련 스토리지 키들 정리
        const authKeys = [
          "auth_token",
          "access_token",
          "user_data",
          "user_preferences",
          "remember_me",
        ];

        authKeys.forEach((key) => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });

        if (import.meta.env.DEV) {
          console.log("🧹 로컬/세션 스토리지 인증 데이터 정리 완료");
        }
      } catch (error) {
        console.warn("⚠️ 스토리지 정리 중 오류:", error);
      }
    }
  }

  private getOAuthErrorMessage(error: string): string {
    const errorMessages: Record<string, string> = {
      oauth_failed: "소셜 로그인 처리 중 오류가 발생했습니다",
      oauth_cancelled: "소셜 로그인이 취소되었습니다",
      unsupported_provider: "지원하지 않는 소셜 로그인 제공업체입니다",
    };

    return errorMessages[error] || "소셜 로그인에 실패했습니다";
  }

  private clearCallbackUrl(): void {
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }

  /**
   * @deprecated HttpOnly 쿠키는 JavaScript로 삭제할 수 없습니다.
   * 대신 `logout()` 메서드를 사용하여 서버를 통해 쿠키를 삭제해야 합니다.
   */
  clearAuthCookies(): void {
    console.warn(
      "⚠️ clearAuthCookies()는 deprecated되었습니다. HttpOnly 쿠키는 JavaScript로 삭제할 수 없습니다. `logout()` 메서드를 사용하세요.",
    );
    this.clearClientAuthData();
  }

  /**
   * 에러 메시지 파싱
   */
  parseErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "알 수 없는 오류가 발생했습니다";
  }
}

export const authService = new AuthService();
