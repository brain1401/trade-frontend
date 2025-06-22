import { create } from "zustand";
import { authApi, setupApiInterceptor, ApiError } from "@/lib/api/apiClient";
import type { User, AuthState } from "@/types/auth";

/**
 * 인증 스토어의 액션들
 */
type AuthActions = {
  // 초기화
  initialize: () => Promise<void>;

  // 로그인
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;

  // 로그아웃
  logout: () => Promise<void>;

  // 사용자 정보 설정
  setUser: (user: User | null) => void;

  // 로딩 상태 설정
  setLoading: (loading: boolean) => void;

  // 인증 상태 초기화 (401 에러 시)
  clearAuth: () => void;

  // 강제 쿠키 삭제 (문제 해결용)
  clearAuthCookies: () => void;
};

/**
 * 인증 상태와 액션들을 포함한 스토어 타입
 */
type AuthStore = AuthState & AuthActions;

/**
 * 인증 상태 관리 스토어
 *
 * 보안 우선 설계 원칙:
 * - JWT 토큰은 HttpOnly 쿠키에서만 관리 (클라이언트 접근 불가)
 * - 프론트엔드 필요 최소 정보만 저장 (email, name, profileImage)
 * - 권한 검증은 서버에서 이메일 기반으로 수행
 * - 민감한 정보(ID, roles 등)는 클라이언트에 노출 금지
 * - 사용자가 삭제되거나 토큰이 유효하지 않으면 자동으로 쿠키 정리
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  // 초기 상태
  user: null,
  isAuthenticated: false,
  isLoading: true,

  /**
   * 앱 시작 시 인증 상태 초기화
   *
   * HttpOnly 쿠키가 존재하면 서버에서 사용자 정보를 가져와 상태 설정
   * 쿠키가 없거나 만료되었으면 익명 상태로 초기화
   *
   * 추가된 기능:
   * - 사용자가 데이터베이스에서 삭제된 경우 자동 쿠키 삭제
   * - 토큰이 유효하지 않은 경우 자동 쿠키 삭제
   */
  initialize: async () => {
    try {
      set({ isLoading: true });

      // 서버에서 인증 상태 확인
      const response = await authApi.verify();

      if (response.success === "SUCCESS" && response.data) {
        // 인증 성공: 사용자 정보 설정
        set({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
        });
        console.log("인증 상태 확인 완료:", response.data.email);
      } else {
        // 인증 실패: 익명 상태로 설정
        console.warn("인증 실패 - 익명 모드로 전환");
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.warn("인증 상태 확인 실패:", error);

      // API 에러인 경우 (401, 403 등) 이미 쿠키가 삭제됨
      if (error instanceof ApiError) {
        if (error.statusCode === 401) {
          console.warn("토큰이 만료되었거나 유효하지 않습니다");
        } else if (error.statusCode === 403) {
          console.warn("사용자가 삭제되었거나 비활성화되었습니다");
        }
      }

      // 모든 경우에 대해 익명 상태로 초기화
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  /**
   * 로그인 처리
   *
   * 성공 시 서버에서 HttpOnly 쿠키 자동 설정
   * 클라이언트는 사용자 정보만 상태에 저장
   */
  login: async (email: string, password: string, rememberMe = false) => {
    try {
      const response = await authApi.login({
        email,
        password,
        rememberMe,
      });

      if (response.success === "SUCCESS" && response.data) {
        // 로그인 성공: 사용자 정보 설정
        set({
          user: response.data.user,
          isAuthenticated: true,
        });
        console.log("로그인 성공:", response.data.user.email);
      } else {
        throw new Error(response.message || "로그인에 실패했습니다");
      }
    } catch (error) {
      console.error("로그인 실패:", error);

      // 로그인 실패 시 기존 쿠키가 있다면 정리
      if (
        error instanceof ApiError &&
        (error.statusCode === 401 || error.statusCode === 403)
      ) {
        authApi.clearAuthCookies();
      }

      throw error; // 컴포넌트에서 에러 처리하도록 재던짐
    }
  },

  /**
   * 로그아웃 처리
   *
   * 서버에서 HttpOnly 쿠키 삭제
   * 클라이언트 상태 초기화
   */
  logout: async () => {
    try {
      await authApi.logout();
      console.log("로그아웃 완료");
    } catch (error) {
      console.warn("로그아웃 API 호출 실패:", error);
    } finally {
      // API 호출 성공 여부와 관계없이 클라이언트 상태 초기화
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  /**
   * 사용자 정보 직접 설정 (OAuth 콜백 등에서 사용)
   */
  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  /**
   * 로딩 상태 설정
   */
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  /**
   * 인증 상태 초기화 (401/403 에러 등에서 사용)
   *
   * 토큰 만료나 인증 실패, 사용자 삭제 시 자동으로 호출되어
   * 사용자를 익명 상태로 전환
   */
  clearAuth: () => {
    console.log("인증 상태 초기화 - 익명 모드로 전환");
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  /**
   * 강제로 인증 쿠키 삭제 (문제 해결용)
   */
  clearAuthCookies: () => {
    console.log("수동으로 인증 쿠키 삭제");
    authApi.clearAuthCookies();
    // 상태도 함께 초기화
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));

/**
 * API 인터셉터 설정
 * 401/403 응답 시 자동으로 인증 상태 초기화
 */
setupApiInterceptor(() => {
  console.log("API 인터셉터: 인증 실패 감지 - 상태 초기화");
  useAuthStore.getState().clearAuth();
});

/**
 * 인증 상태 선택자들 (리렌더링 최적화)
 */
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
