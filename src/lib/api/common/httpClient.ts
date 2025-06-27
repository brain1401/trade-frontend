import axios, { type AxiosInstance, type AxiosError } from "axios";
import type { ApiResponse, ApiErrorCode } from "../../../types/common";
import { tokenStore } from "../../auth/tokenStore";

/**
 * v6.1 HttpOnly 쿠키 환경을 위한 HTTP 클라이언트
 * - Access Token: 메모리 저장 (tokenStore)
 * - Refresh Token: HttpOnly 쿠키 (자동 포함)
 * - 자동 토큰 갱신 및 재시도 지원
 */
class HttpClient {
  private instance: AxiosInstance;
  private refreshing = false;
  private refreshPromise: Promise<void> | null = null;
  private authFailureHandled = false; // 인증 실패 처리 중복 방지

  constructor() {
    this.instance = axios.create({
      baseURL: "http://localhost:8081/api",
      timeout: 30000,
      withCredentials: true, // HttpOnly 쿠키 자동 포함
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 요청 인터셉터: Access Token 추가
    this.instance.interceptors.request.use(
      (config) => {
        const token = tokenStore.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        if (import.meta.env.DEV) {
          console.error("🔴 요청 인터셉터 오류:", error);
        }
        return Promise.reject(error);
      },
    );

    // 응답 인터셉터: 자동 토큰 갱신
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // 401 Unauthorized 및 토큰 갱신이 필요한 경우
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !(originalRequest as any)._retry &&
          !this.refreshing
        ) {
          (originalRequest as any)._retry = true;

          try {
            // 동시 갱신 요청 방지
            if (!this.refreshPromise) {
              this.refreshing = true;
              this.refreshPromise = this.performTokenRefresh();
            }

            await this.refreshPromise;

            // 갱신된 토큰으로 원래 요청 재시도
            const newToken = tokenStore.getToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.instance.request(originalRequest);
            }
          } catch (refreshError) {
            if (import.meta.env.DEV) {
              console.error("❌ 토큰 갱신 및 재시도 실패:", refreshError);
            }
            this.handleAuthFailure();
            throw refreshError;
          } finally {
            this.refreshing = false;
            this.refreshPromise = null;
          }
        }

        // API 에러로 래핑하여 일관된 에러 처리
        throw new ApiError(
          error.response?.status || 0,
          (error.response?.data as any)?.errorCode,
          (error.response?.data as any)?.message || error.message,
        );
      },
    );
  }

  /**
   * 토큰 갱신 수행
   */
  private async performTokenRefresh(): Promise<void> {
    try {
      if (import.meta.env.DEV) {
        console.log("🔄 자동 토큰 갱신 시작");
      }

      const refreshResponse = await axios.post<
        ApiResponse<{ accessToken: string }>
      >("http://localhost:8081/api/auth/refresh", undefined, {
        withCredentials: true, // HttpOnly 쿠키 포함
      });

      if (
        refreshResponse.data.success === "SUCCESS" &&
        refreshResponse.data.data?.accessToken
      ) {
        tokenStore.setToken(refreshResponse.data.data.accessToken);

        if (import.meta.env.DEV) {
          console.log("✅ 자동 토큰 갱신 성공");
        }
      } else {
        throw new Error("토큰 갱신 응답이 올바르지 않습니다");
      }
    } catch (refreshError) {
      if (import.meta.env.DEV) {
        console.warn("⚠️ 토큰 갱신 실패:", refreshError);
      }
      tokenStore.clearToken();
      throw refreshError;
    }
  }

  /**
   * 인증 실패 처리 (무한 새로고침 방지 개선)
   */
  private handleAuthFailure(): void {
    // 중복 처리 방지
    if (this.authFailureHandled) {
      return;
    }

    this.authFailureHandled = true;
    tokenStore.clearToken();

    if (import.meta.env.DEV) {
      console.log("🚪 인증 실패 - 토큰 정리 완료");
    }

    // 리디렉션은 authStore에서 처리하도록 위임
    // window.location.href 사용 중단 -> 무한 새로고침 방지
    if (typeof window !== "undefined") {
      // 현재 페이지 정보 저장 (로그인 후 복귀용)
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== "/auth/login" && !currentPath.startsWith("/auth/")) {
        sessionStorage.setItem("redirect_after_login", currentPath);
      }

      // 토큰 정리만 수행하고 리디렉션은 하지 않음
      // authStore의 토큰 변경 리스너가 상태를 업데이트할 것임
      if (import.meta.env.DEV) {
        console.log("💡 인증 실패 처리 완료 - 라우터가 자동으로 리디렉션 처리");
      }
    }

    // 3초 후 플래그 리셋 (안전장치)
    setTimeout(() => {
      this.authFailureHandled = false;
    }, 3000);
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await this.instance.get<ApiResponse<T>>(endpoint);
    return this.extractData(response.data);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.instance.post<ApiResponse<T>>(endpoint, data);
    return this.extractData(response.data);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.instance.put<ApiResponse<T>>(endpoint, data);
    return this.extractData(response.data);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.instance.delete<ApiResponse<T>>(endpoint);
    return this.extractData(response.data);
  }

  async getRaw<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(endpoint);
    return response.data;
  }

  async postRaw<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(endpoint, data);
    return response.data;
  }

  private extractData<T>(apiResponse: ApiResponse<T>): T {
    if (apiResponse.success === "ERROR") {
      throw new ApiError(
        500,
        undefined,
        apiResponse.message || "API 요청 실패",
      );
    }
    if (!apiResponse.data) {
      throw new ApiError(500, undefined, "응답 데이터 없음");
    }
    return apiResponse.data;
  }
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public errorCode?: ApiErrorCode,
    message?: string,
  ) {
    super(message || "API 요청 중 오류 발생");
    this.name = "ApiError";
  }

  get isAuthError(): boolean {
    return this.statusCode === 401 || this.statusCode === 403;
  }
}

export const httpClient = new HttpClient();
