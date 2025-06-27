import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { authService, tokenStore } from "@/lib/auth";
import type { User } from "@/types/auth";

/**
 * v6.1 인증 스토어 상태
 */
type AuthStoreState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
  tokenExpiresAt: Date | null;
  isInitialized: boolean;
};

/**
 * v6.1 인증 스토어 액션
 */
type AuthActions = {
  initialize: () => Promise<void>;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setRememberMe: (rememberMe: boolean) => void;
  handleOAuthCallback: () => Promise<boolean>;
  clearClientAuthState: () => void;
};

type AuthStore = AuthStoreState & AuthActions;

/**
 * v6.1 JWT 세부화 인증 스토어
 * - Access Token: 30분 (tokenStore에서 메모리 관리)
 * - Refresh Token: HttpOnly 쿠키로 서버에서 자동 관리
 * - API 요청 시 401 응답 받을 때 자동 토큰 갱신
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  // 초기 상태
  user: null,
  isAuthenticated: false,
  isLoading: true,
  rememberMe: false,
  tokenExpiresAt: null,
  isInitialized: false,

  /**
   * 앱 시작 시 인증 상태 초기화
   * v6.1: HttpOnly 쿠키 환경에서 리프레시 토큰 상태 확인
   */
  initialize: async () => {
    const currentState = get();

    // 이미 초기화되었다면 건너뛰기 (중복 실행 방지)
    if (currentState.isInitialized) {
      if (import.meta.env.DEV) {
        console.log("⚠️ 인증 초기화 이미 완료됨 - 중복 실행 방지");
      }
      return;
    }

    try {
      set({ isLoading: true });

      if (import.meta.env.DEV) {
        console.log("🔐 인증 초기화 시작");
      }

      // 1단계: 기존 Access Token이 유효한지 확인
      if (tokenStore.isAuthenticated()) {
        try {
          if (import.meta.env.DEV) {
            console.log("✅ 기존 Access Token으로 사용자 정보 조회 시도");
            console.log(tokenStore.getToken());
          }
          const user = await authService.getCurrentUser();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
            tokenExpiresAt: tokenStore.getTokenExpiryDate(),
          });

          if (import.meta.env.DEV) {
            console.log("✅ 기존 토큰으로 인증 초기화 완료");
          }
          return;
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn("⚠️ 기존 토큰으로 사용자 정보 조회 실패:", error);
          }
          // Access Token이 만료되었을 수 있으므로 다음 단계로 진행
        }
      }

      // 2단계: HttpOnly 쿠키의 리프레시 토큰으로 갱신 시도
      // 주의: HttpOnly 쿠키는 JavaScript로 확인할 수 없으므로 API 호출로 간접 확인
      try {
        if (import.meta.env.DEV) {
          console.log("🔄 HttpOnly 리프레시 토큰으로 액세스 토큰 갱신 시도");
        }

        const token = await authService.refreshToken();
        console.log(token);

        // 토큰 갱신 성공 시 사용자 정보 조회
        const user = await authService.getCurrentUser();
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
          tokenExpiresAt: tokenStore.getTokenExpiryDate(),
        });

        if (import.meta.env.DEV) {
          console.log("🎉 HttpOnly 리프레시 토큰을 통한 자동 로그인 성공");
        }
        return;
      } catch (refreshError) {
        if (import.meta.env.DEV) {
          console.info(
            "ℹ️ 리프레시 토큰 갱신 실패 - 로그아웃 상태로 전환:",
            refreshError,
          );
        }
        // 리프레시 토큰이 없거나 만료된 경우 (정상적인 로그아웃 상태)
      }

      // 3단계: 모든 토큰이 유효하지 않은 경우 로그아웃 상태로 설정
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        tokenExpiresAt: null,
      });

      if (import.meta.env.DEV) {
        console.log("🚪 로그아웃 상태로 초기화 완료");
      }
    } catch (error) {
      console.error("❌ 인증 상태 초기화 중 예상치 못한 오류:", error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        tokenExpiresAt: null,
      });
    }
  },

  /**
   * v6.1: JWT 세부화 로그인 처리
   */
  login: async (email: string, password: string, rememberMe = false) => {
    const user = await authService.login({ email, password, rememberMe });
    set({
      user,
      isAuthenticated: true,
      rememberMe,
      tokenExpiresAt: tokenStore.getTokenExpiryDate(),
    });

    if (import.meta.env.DEV) {
      console.log("✅ 로그인 성공:", { email, rememberMe });
    }
  },

  /**
   * 로그아웃 처리
   * HttpOnly 쿠키는 서버에서 삭제됨
   */
  logout: async () => {
    try {
      await authService.logout();
      if (import.meta.env.DEV) {
        console.log("✅ 서버 로그아웃 완료");
      }
    } catch (error) {
      console.warn("⚠️ 서버 로그아웃 실패 (클라이언트 상태는 정리됨):", error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        rememberMe: false,
        tokenExpiresAt: null,
      });

      if (import.meta.env.DEV) {
        console.log("🚪 클라이언트 로그아웃 상태 정리 완료");
      }
    }
  },

  /**
   * v6.1: 토큰 갱신
   */
  refreshToken: async () => {
    try {
      await authService.refreshToken();
      set({
        tokenExpiresAt: tokenStore.getTokenExpiryDate(),
      });

      if (import.meta.env.DEV) {
        console.log("🔄 토큰 갱신 성공");
      }
    } catch (error) {
      console.error("❌ 토큰 갱신 실패:", error);
      await get().logout();
    }
  },

  /**
   * 사용자 정보 설정
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
   * v6.1: Remember Me 설정
   */
  setRememberMe: (rememberMe: boolean) => {
    set({ rememberMe });
  },

  /**
   * OAuth 콜백 처리
   */
  handleOAuthCallback: async (): Promise<boolean> => {
    try {
      const result = authService.handleOAuthCallback();

      if (result.success) {
        const user = await authService.getCurrentUser();
        set({
          user,
          isAuthenticated: true,
          tokenExpiresAt: tokenStore.getTokenExpiryDate(),
        });

        if (import.meta.env.DEV) {
          console.log("✅ OAuth 콜백 처리 성공");
        }
        return true;
      }

      if (import.meta.env.DEV) {
        console.warn("⚠️ OAuth 콜백 실패:", result.error);
      }
      return false;
    } catch (error) {
      console.error("❌ OAuth 콜백 처리 중 오류:", error);
      return false;
    }
  },

  /**
   * 클라이언트 인증 상태 정리
   * HttpOnly 쿠키는 서버에서만 관리 가능
   */
  clearClientAuthState: () => {
    set({
      user: null,
      isAuthenticated: false,
      rememberMe: false,
      tokenExpiresAt: null,
      isInitialized: false,
    });

    if (import.meta.env.DEV) {
      console.log("🧹 클라이언트 인증 상태 정리 완료");
    }
  },
}));

/**
 * v6.1 간편 인증 상태 훅
 */
export const useAuth = () =>
  useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      rememberMe: state.rememberMe,
      tokenExpiresAt: state.tokenExpiresAt,
      isInitialized: state.isInitialized,
      initialize: state.initialize,
      login: state.login,
      logout: state.logout,
      refreshToken: state.refreshToken,
      handleOAuthCallback: state.handleOAuthCallback,
      clearClientAuthState: state.clearClientAuthState,
    })),
  );

/**
 * v6.1 토큰 변경 리스너 - 무한루프 방지 개선
 * tokenStore의 토큰 변경을 authStore에 반영
 */
let isUpdatingFromTokenStore = false;

tokenStore.onTokenChange((token) => {
  // 이미 업데이트 중이면 무한루프 방지
  if (isUpdatingFromTokenStore) {
    return;
  }

  try {
    isUpdatingFromTokenStore = true;
    const state = useAuthStore.getState();

    if (!token) {
      // 토큰이 없으면 로그아웃 상태로 변경 (사용자 정보만 삭제)
      if (state.isAuthenticated) {
        state.setUser(null);

        if (import.meta.env.DEV) {
          console.log("🔄 토큰 삭제로 인한 로그아웃 상태 전환");
        }
      }
    } else {
      // 토큰이 있으면 만료 시간 업데이트
      const currentExpiresAt = state.tokenExpiresAt?.getTime();
      const newExpiresAt = tokenStore.getTokenExpiryDate()?.getTime();

      // 만료 시간이 실제로 변경된 경우에만 업데이트
      if (currentExpiresAt !== newExpiresAt) {
        useAuthStore.setState({
          tokenExpiresAt: tokenStore.getTokenExpiryDate(),
        });

        if (import.meta.env.DEV) {
          console.log("🔄 토큰 만료 시간 업데이트");
        }
      }
    }
  } finally {
    isUpdatingFromTokenStore = false;
  }
});
