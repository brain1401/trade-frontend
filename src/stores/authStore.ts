import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  isTokenExpired,
  secureTokenStorage,
  getTokenStorageStrategy,
} from "../lib/utils/tokenUtils";
import { mockRefreshToken, mockValidateToken } from "../data/mock/auth";

export type NotificationStats = {
  messageCount: number;
  bookmarkCount: number;
  analysisCount: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  notificationStats: NotificationStats;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  rememberMe: boolean;
  sessionStartTime: number | null;
};

export type AuthActions = {
  login: (
    user: User,
    tokens: { accessToken: string; refreshToken: string },
    rememberMe?: boolean,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  validateSession: () => Promise<boolean>;
  initializeAuth: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  clearAuth: () => void;
};

// 현업 베스트 프랙티스 적용: 환경별 스토리지 전략
const createAuthStorage = () => {
  const storageStrategy = getTokenStorageStrategy();

  return {
    getItem: async (name: string) => {
      if (storageStrategy === "httponly-cookie") {
        // 프로덕션: HttpOnly 쿠키에서 토큰 조회
        try {
          const response = await fetch("/api/auth/session", {
            credentials: "include",
          });

          if (response.ok) {
            const sessionData = await response.json();
            return JSON.stringify({ state: sessionData });
          }
        } catch (error) {
          console.error("세션 조회 실패:", error);
        }
        return null;
      } else {
        // 개발: localStorage 사용 (보안 취약하지만 편의성)
        const item = localStorage.getItem(name);
        if (!item) return null;

        try {
          const parsed = JSON.parse(item);
          const { state } = parsed;

          // 세션 만료 확인
          if (state?.sessionStartTime && state?.rememberMe !== undefined) {
            const now = Date.now();
            const sessionAge = now - state.sessionStartTime;
            const maxAge = state.rememberMe
              ? 30 * 24 * 60 * 60 * 1000 // 30일
              : 2 * 60 * 60 * 1000; // 2시간

            if (sessionAge > maxAge) {
              localStorage.removeItem(name);
              console.log(
                `⏰ 세션 만료 (${state.rememberMe ? "30일" : "2시간"} 초과)`,
              );
              return null;
            }
          }

          return item;
        } catch {
          return item;
        }
      }
    },

    setItem: async (name: string, value: string) => {
      if (storageStrategy === "httponly-cookie") {
        // 프로덕션: 서버에 보안 쿠키 설정 요청
        try {
          const parsed = JSON.parse(value);
          const { accessToken, refreshToken, rememberMe } = parsed.state || {};

          if (accessToken && refreshToken) {
            await secureTokenStorage.setSecureCookie(
              "access",
              accessToken,
              rememberMe,
            );
            await secureTokenStorage.setSecureCookie(
              "refresh",
              refreshToken,
              rememberMe,
            );
          }
        } catch (error) {
          console.error("보안 쿠키 설정 실패:", error);
        }
      } else {
        // 개발: localStorage 사용
        localStorage.setItem(name, value);

        // 보안 경고 표시 (개발 환경에서만)
        if (
          typeof window !== "undefined" &&
          !window.location.href.includes("localhost")
        ) {
          console.warn(
            "⚠️ 보안 경고: localStorage 사용 중. 프로덕션에서는 HttpOnly 쿠키 사용 권장",
          );
        }
      }
    },

    removeItem: async (name: string) => {
      if (storageStrategy === "httponly-cookie") {
        // 프로덕션: 서버에 쿠키 삭제 요청
        await secureTokenStorage.clearTokens();
      } else {
        // 개발: localStorage 삭제
        localStorage.removeItem(name);
      }
    },
  };
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // 상태
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isInitialized: false,
      rememberMe: false,
      sessionStartTime: null,

      // 액션
      login: async (user, tokens, rememberMe = false) => {
        const currentTime = Date.now();

        set({
          isAuthenticated: true,
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          rememberMe,
          sessionStartTime: currentTime,
          isLoading: false,
        });

        // 현업 베스트 프랙티스: 환경별 토큰 저장
        const strategy = getTokenStorageStrategy();

        if (strategy === "httponly-cookie") {
          // 프로덕션: HttpOnly 쿠키로 보안 저장
          try {
            await secureTokenStorage.setSecureCookie(
              "access",
              tokens.accessToken,
              rememberMe,
            );
            await secureTokenStorage.setSecureCookie(
              "refresh",
              tokens.refreshToken,
              rememberMe,
            );
            console.log(
              `🔒 보안 쿠키 저장 완료 - ${rememberMe ? "로그인 유지 (30일)" : "세션 쿠키"}`,
            );
          } catch (error) {
            console.error("보안 쿠키 저장 실패:", error);
          }
        } else {
          // 개발: localStorage 저장 (보안 취약)
          secureTokenStorage.setLocalStorage(
            "access",
            tokens.accessToken,
            rememberMe,
          );
          secureTokenStorage.setLocalStorage(
            "refresh",
            tokens.refreshToken,
            rememberMe,
          );
          console.log(
            `📝 로컬 저장 완료 - ${rememberMe ? "로그인 유지 (30일)" : "기본 세션 (2시간)"}`,
          );
          console.warn(
            "⚠️ 개발 환경: localStorage 사용 중 (프로덕션에서는 HttpOnly 쿠키 사용)",
          );
        }
      },

      logout: async () => {
        // 현업 베스트 프랙티스: 환경별 토큰 삭제
        await secureTokenStorage.clearTokens();

        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          rememberMe: false,
          sessionStartTime: null,
          isLoading: false,
        });

        console.log("🚪 로그아웃 완료 (모든 토큰 삭제)");
      },

      refreshAccessToken: async () => {
        try {
          const { sessionStartTime, rememberMe } = get();

          // 환경별 리프레시 토큰 조회
          const refreshToken = await secureTokenStorage.getToken("refresh");

          if (!refreshToken) {
            throw new Error("리프레시 토큰이 없습니다");
          }

          // 세션 만료 확인
          if (sessionStartTime) {
            const now = Date.now();
            const sessionAge = now - sessionStartTime;
            const maxAge = rememberMe
              ? 30 * 24 * 60 * 60 * 1000 // 30일
              : 2 * 60 * 60 * 1000; // 2시간

            if (sessionAge > maxAge) {
              throw new Error("세션이 만료되었습니다");
            }
          }

          // 토큰 갱신 요청
          const newTokens = await mockRefreshToken(refreshToken);

          if (!newTokens) {
            throw new Error("토큰 갱신에 실패했습니다");
          }

          // 새 토큰 저장
          const strategy = getTokenStorageStrategy();

          if (strategy === "httponly-cookie") {
            await secureTokenStorage.setSecureCookie(
              "access",
              newTokens.accessToken,
              rememberMe,
            );
            await secureTokenStorage.setSecureCookie(
              "refresh",
              newTokens.refreshToken,
              rememberMe,
            );
          } else {
            secureTokenStorage.setLocalStorage(
              "access",
              newTokens.accessToken,
              rememberMe,
            );
            secureTokenStorage.setLocalStorage(
              "refresh",
              newTokens.refreshToken,
              rememberMe,
            );
          }

          set({
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
          });

          console.log("🔄 토큰 갱신 성공");
          return true;
        } catch (error) {
          console.error("❌ 토큰 갱신 실패:", error);
          get().logout();
          return false;
        }
      },

      validateSession: async () => {
        try {
          // 환경별 액세스 토큰 조회
          const accessToken = await secureTokenStorage.getToken("access");
          const { sessionStartTime, rememberMe } = get();

          if (!accessToken) {
            return false;
          }

          // 세션 만료 확인
          if (sessionStartTime) {
            const now = Date.now();
            const sessionAge = now - sessionStartTime;
            const maxAge = rememberMe
              ? 30 * 24 * 60 * 60 * 1000 // 30일
              : 2 * 60 * 60 * 1000; // 2시간

            if (sessionAge > maxAge) {
              console.log("⏰ 세션 만료로 인한 자동 로그아웃");
              await get().logout();
              return false;
            }
          }

          // 토큰 유효성 검증
          if (isTokenExpired(accessToken)) {
            return await get().refreshAccessToken();
          }

          const isValid = await mockValidateToken(accessToken);
          if (!isValid) {
            throw new Error("토큰이 유효하지 않습니다");
          }

          return true;
        } catch (error) {
          console.error("❌ 세션 검증 실패:", error);
          await get().logout();
          return false;
        }
      },

      initializeAuth: async () => {
        set({ isLoading: true });

        try {
          const isValid = await get().validateSession();

          if (isValid) {
            console.log("✅ 기존 세션 복원 성공");
          } else {
            console.log("ℹ️ 유효한 세션이 없습니다");
          }

          // 보안 전략 로그
          const strategy = getTokenStorageStrategy();
          console.log(
            `🔐 토큰 저장 전략: ${strategy === "httponly-cookie" ? "HttpOnly 쿠키 (보안)" : "localStorage (개발)"}`,
          );
        } catch (error) {
          console.error("❌ 인증 초기화 실패:", error);
          get().clearAuth();
        } finally {
          set({ isLoading: false, isInitialized: true });
        }
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      clearAuth: () => {
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          rememberMe: false,
          sessionStartTime: null,
          isLoading: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => createAuthStorage()),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        rememberMe: state.rememberMe,
        sessionStartTime: state.sessionStartTime,
      }),
    },
  ),
);
