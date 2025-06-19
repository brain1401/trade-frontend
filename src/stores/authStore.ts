import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  isTokenExpired,
  secureTokenStorage,
  getTokenStorageStrategy,
} from "../lib/utils/tokenUtils";
import { mockRefreshToken, mockValidateToken } from "../data/mock/auth";

/**
 * 알림 통계 정보를 나타내는 타입
 *
 * @remarks
 * 사용자의 다양한 알림 유형별 개수를 추적하여 UI에서 뱃지 표시에 활용
 *
 * @public
 */
export type NotificationStats = {
  /** 메시지 알림 개수 */
  messageCount: number;
  /** 북마크 관련 알림 개수 */
  bookmarkCount: number;
  /** HS Code 분석 완료 알림 개수 */
  analysisCount: number;
};

/**
 * 사용자 정보를 나타내는 타입
 *
 * @remarks
 * 인증된 사용자의 기본 정보와 알림 통계를 포함하여 관리
 * JWT 토큰에서 추출된 정보를 바탕으로 구성됨
 *
 * @public
 */
export type User = {
  /** 사용자 고유 식별자 */
  id: string;
  /** 사용자 이름 (표시명) */
  name: string;
  /** 사용자 이메일 주소 */
  email: string;
  /** 프로필 이미지 URL (없을 경우 null) */
  avatar: string | null;
  /** 알림 통계 정보 */
  notificationStats: NotificationStats;
};

/**
 * 인증 상태를 나타내는 타입
 *
 * @remarks
 * Zustand 스토어의 상태 부분을 정의하며, 모든 인증 관련 정보를 포함
 * 환경별 토큰 저장 전략(localStorage vs HttpOnly 쿠키)을 지원
 *
 * @public
 */
export type AuthState = {
  /** 현재 사용자가 인증되었는지 여부 */
  isAuthenticated: boolean;
  /** 현재 로그인된 사용자 정보 (미인증 시 null) */
  user: User | null;
  /** JWT 액세스 토큰 (환경별 저장 위치 상이) */
  accessToken: string | null;
  /** JWT 리프레시 토큰 (환경별 저장 위치 상이) */
  refreshToken: string | null;
  /** 현재 인증 관련 작업이 진행 중인지 여부 */
  isLoading: boolean;
  /** 인증 시스템이 초기화되었는지 여부 */
  isInitialized: boolean;
  /** 로그인 유지 옵션 (30일 vs 2시간 세션) */
  rememberMe: boolean;
  /** 세션 시작 시간 (만료 체크용) */
  sessionStartTime: number | null;
};

/**
 * 인증 관련 액션들을 정의하는 타입
 *
 * @remarks
 * Zustand 스토어의 액션 부분을 정의하며, 모든 인증 흐름을 관리
 * 환경별 토큰 저장 전략과 자동 세션 관리 기능을 포함
 *
 * @public
 */
export type AuthActions = {
  /**
   * 사용자 로그인 처리
   *
   * @param user - 로그인할 사용자 정보
   * @param tokens - JWT 토큰 쌍 (액세스 + 리프레시)
   * @param rememberMe - 로그인 유지 옵션 (기본값: false)
   *
   * @remarks
   * 환경에 따라 localStorage 또는 HttpOnly 쿠키에 토큰을 안전하게 저장
   * 로그인 유지 선택 시 30일, 미선택 시 2시간 세션 유지
   *
   * @example
   * ```typescript
   * await login(userData, { accessToken, refreshToken }, true);
   * ```
   */
  login: (
    user: User,
    tokens: { accessToken: string; refreshToken: string },
    rememberMe?: boolean,
  ) => Promise<void>;

  /**
   * 사용자 로그아웃 처리
   *
   * @remarks
   * 모든 토큰을 안전하게 삭제하고 인증 상태를 초기화
   * 환경별 저장 위치(localStorage/HttpOnly 쿠키)에서 모두 제거
   *
   * @example
   * ```typescript
   * await logout();
   * ```
   */
  logout: () => Promise<void>;

  /**
   * 액세스 토큰 갱신 처리
   *
   * @returns 토큰 갱신 성공 여부
   *
   * @remarks
   * 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받음
   * 세션 만료 시간도 함께 체크하여 안전성 확보
   * 갱신 실패 시 자동으로 로그아웃 처리
   *
   * @example
   * ```typescript
   * const success = await refreshAccessToken();
   * if (!success) {
   *   // 자동 로그아웃되어 로그인 페이지로 이동 필요
   * }
   * ```
   */
  refreshAccessToken: () => Promise<boolean>;

  /**
   * 현재 세션 유효성 검증
   *
   * @returns 세션 유효성 여부
   *
   * @remarks
   * 토큰 만료 여부와 세션 시간 제한을 모두 체크
   * 토큰 만료 시 자동으로 리프레시 토큰으로 갱신 시도
   * 모든 검증 실패 시 자동 로그아웃 처리
   *
   * @example
   * ```typescript
   * const isValid = await validateSession();
   * if (isValid) {
   *   // 세션이 유효함 - 보호된 페이지 접근 허용
   * }
   * ```
   */
  validateSession: () => Promise<boolean>;

  /**
   * 인증 시스템 초기화
   *
   * @remarks
   * 앱 시작 시 기존 세션 복원을 시도하며 인증 상태를 설정
   * 환경별 토큰 저장 전략을 확인하고 적절한 방식으로 복원
   * 복원 실패 시 안전하게 초기 상태로 설정
   *
   * @example
   * ```typescript
   * // 앱 시작 시 호출
   * await initializeAuth();
   * ```
   */
  initializeAuth: () => Promise<void>;

  /**
   * 사용자 정보 업데이트
   *
   * @param user - 업데이트할 사용자 정보 (부분 업데이트 지원)
   *
   * @remarks
   * 현재 로그인된 사용자의 정보를 부분적으로 업데이트
   * 프로필 수정, 알림 통계 갱신 등에 활용
   *
   * @example
   * ```typescript
   * updateUser({ name: "새로운 이름" });
   * updateUser({ notificationStats: { messageCount: 5, bookmarkCount: 2, analysisCount: 1 } });
   * ```
   */
  updateUser: (user: Partial<User>) => void;

  /**
   * 인증 상태 완전 초기화
   *
   * @remarks
   * 모든 인증 관련 상태를 초기값으로 재설정
   * 오류 복구나 강제 로그아웃 시 사용
   * 토큰 삭제는 별도로 처리해야 함
   */
  clearAuth: () => void;
};

/**
 * 환경별 스토리지 전략을 적용한 커스텀 스토리지 생성
 *
 * @remarks
 * 개발 환경에서는 localStorage 사용 (편의성 우선)
 * 프로덕션 환경에서는 HttpOnly 쿠키 사용 (보안 우선)
 * 세션 만료 시간도 자동으로 체크하여 안전성 확보
 *
 * @returns Zustand persist 미들웨어에서 사용할 스토리지 객체
 *
 * @internal
 * @example
 * ```typescript
 * // Zustand persist 미들웨어에서 사용
 * persist(storeConfig, {
 *   storage: createJSONStorage(() => createAuthStorage())
 * })
 * ```
 */
const createAuthStorage = () => {
  const storageStrategy = getTokenStorageStrategy();

  return {
    /**
     * 저장된 인증 데이터 조회
     *
     * @param name - 스토리지 키 이름
     * @returns 저장된 JSON 문자열 또는 null
     *
     * @remarks
     * 환경별로 다른 저장소에서 데이터를 조회
     * 세션 만료 시간도 함께 체크하여 자동 만료 처리
     */
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

    /**
     * 인증 데이터 저장
     *
     * @param name - 스토리지 키 이름
     * @param value - 저장할 JSON 문자열
     *
     * @remarks
     * 환경별로 적절한 저장소에 안전하게 저장
     * 프로덕션에서는 HttpOnly 쿠키로 보안 강화
     */
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

    /**
     * 저장된 인증 데이터 삭제
     *
     * @param name - 삭제할 스토리지 키 이름
     *
     * @remarks
     * 환경별로 적절한 저장소에서 완전히 삭제
     * 로그아웃 시 모든 토큰 정보를 안전하게 제거
     */
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

/**
 * 인증 관리를 위한 Zustand 스토어
 *
 * @remarks
 *
 * 현업 베스트 프랙티스를 적용한 인증 상태 관리:
 * - 환경별 토큰 저장 전략 (개발: localStorage, 프로덕션: HttpOnly 쿠키)
 * - 자동 토큰 갱신 및 세션 관리
 * - 보안 중심 설계와 사용자 경험 최적화
 * - 타입 안전성과 에러 핸들링 강화
 *
 * @public
 *
 * @example
 * ```typescript
 * // 컴포넌트에서 사용
 * const { isAuthenticated, user, login, logout } = useAuthStore();
 *
 * // 로그인 처리
 * await login(userData, tokens, rememberMe);
 *
 * // 인증 상태 확인
 * if (isAuthenticated && user) {
 *   // 인증된 사용자 UI 표시
 * }
 * ```
 */
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
      /**
       * Zustand persist 미들웨어에서 저장할 상태 필드 선택
       *
       * @param state - 전체 스토어 상태
       * @returns 저장할 상태 부분만 선별하여 반환
       *
       * @remarks
       * 민감하지 않은 상태만 선별하여 저장하고,
       * 로딩 상태나 초기화 상태는 세션마다 새로 시작
       */
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
