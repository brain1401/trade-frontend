import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { authService, tokenStore } from "@/lib/auth";
import type { User } from "@/types/auth";
import { router } from "@/main";

// 초기화 상태 타입
type InitializationState = "idle" | "initializing" | "completed" | "failed";

// 인증 스토어 상태
type AuthStoreState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
  tokenExpiresAt: Date | null;
  initializationState: InitializationState;
};

// 인증 스토어 액션
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
  resetInitialization: () => void;
};

type AuthStore = AuthStoreState & AuthActions;

// Zustand 5.0.5 최적화된 인증 스토어
export const useAuthStore = create<AuthStore>((set, get) => ({
  // 초기 상태
  user: null,
  isAuthenticated: false,
  isLoading: false,
  rememberMe: false,
  tokenExpiresAt: null,
  initializationState: "idle",

  // 개선된 앱 시작 시 인증 상태 초기화
  initialize: async () => {
    const currentState = get().initializationState;

    // 이미 초기화 중이거나 완료된 경우 중복 실행 방지
    if (currentState === "initializing" || currentState === "completed") {
      if (import.meta.env.DEV) {
        console.log(`⚠️ 인증 초기화 건너뜀 (현재 상태: ${currentState})`);
      }
      return;
    }

    // 초기화 시작
    set({
      isLoading: true,
      initializationState: "initializing",
    });

    if (import.meta.env.DEV) {
      console.log("🔐 인증 초기화 프로세스 시작...");
    }

    try {
      // 1단계: 기존 Access Token이 유효한지 확인
      if (tokenStore.isAuthenticated()) {
        try {
          if (import.meta.env.DEV) {
            console.log("✅ 기존 Access Token으로 사용자 정보 조회 시도");
          }
          const user = await authService.getCurrentUser();
          set({
            user,
            isAuthenticated: true,
            tokenExpiresAt: tokenStore.getTokenExpiryDate(),
            initializationState: "completed",
            isLoading: false,
          });

          if (import.meta.env.DEV) {
            console.log("✅ 기존 토큰으로 인증 초기화 완료");
          }
          return;
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn("⚠️ 기존 토큰으로 사용자 정보 조회 실패:", error);
          }
        }
      }

      // 2단계: HttpOnly 쿠키의 리프레시 토큰으로 갱신 시도
      try {
        if (import.meta.env.DEV) {
          console.log("🔄 HttpOnly 리프레시 토큰으로 액세스 토큰 갱신 시도");
        }

        await authService.refreshToken();

        // 토큰 갱신 성공 시 사용자 정보 조회
        const user = await authService.getCurrentUser();
        set({
          user,
          isAuthenticated: true,
          tokenExpiresAt: tokenStore.getTokenExpiryDate(),
          initializationState: "completed",
          isLoading: false,
        });

        if (import.meta.env.DEV) {
          console.log("🎉 HttpOnly 리프레시 토큰을 통한 자동 로그인 성공");
        }
        return;
      } catch {
        if (import.meta.env.DEV) {
          console.info("ℹ️ 리프레시 토큰 갱신 실패 - 로그아웃 상태로 전환");
        }
      }

      // 3단계: 모든 토큰이 유효하지 않은 경우 로그아웃 상태로 설정
      set({
        user: null,
        isAuthenticated: false,
        tokenExpiresAt: null,
        initializationState: "completed",
        isLoading: false,
      });

      if (import.meta.env.DEV) {
        console.log("🚪 로그아웃 상태로 초기화 완료");
      }
    } catch (error) {
      console.error("❌ 인증 상태 초기화 중 예상치 못한 오류:", error);
      set({
        user: null,
        isAuthenticated: false,
        tokenExpiresAt: null,
        initializationState: "failed",
        isLoading: false,
      });
    }
  },

  login: async (email: string, password: string, rememberMe = false) => {
    set({ isLoading: true });

    try {
      const user = await authService.login({
        email,
        password,
        rememberMe,
      });
      set({
        user,
        isAuthenticated: true,
        rememberMe,
        tokenExpiresAt: tokenStore.getTokenExpiryDate(),
        isLoading: false,
      });

      if (import.meta.env.DEV) {
        console.log("✅ 로그인 성공:", { email, rememberMe });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });

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
        isLoading: false,
      });

      if (import.meta.env.DEV) {
        console.log("🚪 클라이언트 로그아웃 상태 정리 완료");
      }

      await router.navigate({
        to: "/auth/login",
        replace: true,
      });
    }
  },

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

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setRememberMe: (rememberMe: boolean) => {
    set({ rememberMe });
  },

  handleOAuthCallback: async (): Promise<boolean> => {
    set({ isLoading: true });

    try {
      const result = authService.handleOAuthCallback();

      if (result.success) {
        const user = await authService.getCurrentUser();
        set({
          user,
          isAuthenticated: true,
          tokenExpiresAt: tokenStore.getTokenExpiryDate(),
          isLoading: false,
        });

        if (import.meta.env.DEV) {
          console.log("✅ OAuth 콜백 처리 성공");
        }
        return true;
      }

      if (import.meta.env.DEV) {
        console.warn("⚠️ OAuth 콜백 실패:", result.error);
      }
      set({ isLoading: false });
      return false;
    } catch (error) {
      console.error("❌ OAuth 콜백 처리 중 오류:", error);
      set({ isLoading: false });
      return false;
    }
  },

  clearClientAuthState: () => {
    set({
      user: null,
      isAuthenticated: false,
      rememberMe: false,
      tokenExpiresAt: null,
      initializationState: "idle",
      isLoading: false,
    });

    if (import.meta.env.DEV) {
      console.log("🧹 클라이언트 인증 상태 정리 완료");
    }
  },

  resetInitialization: () => {
    set({
      initializationState: "idle",
      isLoading: false,
    });

    if (import.meta.env.DEV) {
      console.log("🔄 초기화 상태 리셋");
    }
  },
}));

// ✅ 기존 API와 호환되는 개별 상태 선택자들 (원자적 선택자)
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useInitializationState = () =>
  useAuthStore((state) => state.initializationState);
export const useIsInitialized = () =>
  useAuthStore((state) => state.initializationState === "completed");
export const useInitializationFailed = () =>
  useAuthStore((state) => state.initializationState === "failed");
export const useTokenExpiresAt = () =>
  useAuthStore((state) => state.tokenExpiresAt);
export const useRememberMe = () => useAuthStore((state) => state.rememberMe);

// ✅ 기존 API와 호환되는 개별 액션 선택자들 (성능 최적화)
export const useInitialize = () => useAuthStore((state) => state.initialize);
export const useLogin = () => useAuthStore((state) => state.login);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useRefreshToken = () =>
  useAuthStore((state) => state.refreshToken);
export const useSetUser = () => useAuthStore((state) => state.setUser);
export const useSetLoading = () => useAuthStore((state) => state.setLoading);
export const useSetRememberMe = () =>
  useAuthStore((state) => state.setRememberMe);
export const useHandleOAuthCallback = () =>
  useAuthStore((state) => state.handleOAuthCallback);
export const useClearClientAuthState = () =>
  useAuthStore((state) => state.clearClientAuthState);
export const useResetInitialization = () =>
  useAuthStore((state) => state.resetInitialization);

// ✅ 기존 API와 호환되는 액션들을 한 번에 가져오는 훅 (useShallow로 최적화)
export const useAuthActions = () =>
  useAuthStore(
    useShallow((state) => ({
      initialize: state.initialize,
      login: state.login,
      logout: state.logout,
      refreshToken: state.refreshToken,
      setUser: state.setUser,
      setLoading: state.setLoading,
      setRememberMe: state.setRememberMe,
      handleOAuthCallback: state.handleOAuthCallback,
      clearClientAuthState: state.clearClientAuthState,
      resetInitialization: state.resetInitialization,
    })),
  );

// ✅ 기존 API와 호환되는 여러 상태가 필요한 경우 (useShallow로 최적화)
export const useAuthState = () =>
  useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      initializationState: state.initializationState,
      isInitialized: state.initializationState === "completed",
      initializationFailed: state.initializationState === "failed",
      tokenExpiresAt: state.tokenExpiresAt,
      rememberMe: state.rememberMe,
    })),
  );

// ✅ 기존 API와 완전히 호환되는 useAuth 훅 (개별 훅들 사용으로 최적화)
export const useAuth = () => {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useIsLoading();
  const isInitialized = useIsInitialized();
  const initializationState = useInitializationState();
  const initializationFailed = useInitializationFailed();
  const tokenExpiresAt = useTokenExpiresAt();
  const rememberMe = useRememberMe();

  // 개별 액션 훅들 사용 (성능 최적화)
  const initialize = useInitialize();
  const login = useLogin();
  const logout = useLogout();
  const refreshToken = useRefreshToken();
  const setUser = useSetUser();
  const setLoading = useSetLoading();
  const setRememberMe = useSetRememberMe();
  const handleOAuthCallback = useHandleOAuthCallback();
  const clearClientAuthState = useClearClientAuthState();
  const resetInitialization = useResetInitialization();

  return {
    // 상태
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    initializationState,
    initializationFailed,
    tokenExpiresAt,
    rememberMe,
    // 액션들
    initialize,
    login,
    logout,
    refreshToken,
    setUser,
    setLoading,
    setRememberMe,
    handleOAuthCallback,
    clearClientAuthState,
    resetInitialization,
  };
};

// 토큰 변경 리스너 (기존과 동일)
let isUpdatingFromTokenStore = false;

tokenStore.onTokenChange((token) => {
  if (isUpdatingFromTokenStore) {
    return;
  }

  try {
    isUpdatingFromTokenStore = true;
    const state = useAuthStore.getState();

    if (!token) {
      if (state.isAuthenticated) {
        state.setUser(null);
        if (import.meta.env.DEV) {
          console.log("🔄 토큰 삭제로 인한 로그아웃 상태 전환");
        }
      }
    } else {
      const currentExpiresAt = state.tokenExpiresAt?.getTime();
      const newExpiresAt = tokenStore.getTokenExpiryDate()?.getTime();

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

// 개발 환경에서만 전역 상태 변경 감지 (기존과 동일)
if (import.meta.env.DEV) {
  useAuthStore.subscribe((state) => {
    console.log("🔄 Auth Store 변경:", {
      user: state.user ? `${state.user.name} (${state.user.email})` : null,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      initializationState: state.initializationState,
      timestamp: new Date().toISOString(),
    });
  });
}
