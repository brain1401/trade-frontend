import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { isTokenExpired } from "../lib/utils/tokenUtils";
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
  rememberMe: boolean; // 로그인 정보 유지 옵션
};

export type AuthActions = {
  login: (
    user: User,
    tokens: { accessToken: string; refreshToken: string },
    rememberMe?: boolean,
  ) => void;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  refreshAccessToken: () => Promise<boolean>;
  checkAuthStatus: () => Promise<void>;
  setInitialized: () => void;
  setRememberMe: (rememberMe: boolean) => void;
};

export type AuthStore = AuthState & AuthActions;

// 동적 스토리지 생성 함수
const createDynamicStorage = () => {
  return {
    getItem: (name: string) => {
      // localStorage 먼저 확인, 없으면 sessionStorage 확인
      const localItem = localStorage.getItem(name);
      if (localItem) return localItem;
      return sessionStorage.getItem(name);
    },
    setItem: (name: string, value: string) => {
      const parsed = JSON.parse(value);
      const shouldPersist = parsed.state?.rememberMe ?? false;

      if (shouldPersist) {
        localStorage.setItem(name, value);
        sessionStorage.removeItem(name); // 중복 방지
      } else {
        sessionStorage.setItem(name, value);
        localStorage.removeItem(name); // 중복 방지
      }
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name);
      sessionStorage.removeItem(name);
    },
  };
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isInitialized: false,
      rememberMe: false,

      // 로그인 함수 - rememberMe 옵션 추가
      login: (user, tokens, rememberMe = false) => {
        set({
          isAuthenticated: true,
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isLoading: false,
          rememberMe,
        });
      },

      // 로그아웃 함수
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
          rememberMe: false,
        });
      },

      // 토큰 설정 함수
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },

      // 로그인 정보 유지 옵션 설정
      setRememberMe: (rememberMe) => {
        set({ rememberMe });
      },

      // 액세스 토큰 갱신 함수
      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        try {
          set({ isLoading: true });
          const result = await mockRefreshToken(refreshToken);

          if (result) {
            set({
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
              isLoading: false,
            });
            return true;
          } else {
            // 리프레시 토큰도 만료된 경우 로그아웃 처리
            get().logout();
            return false;
          }
        } catch (error) {
          console.error("토큰 갱신 실패:", error);
          get().logout();
          return false;
        }
      },

      // 인증 상태 확인 함수 (앱 시작 시 호출)
      checkAuthStatus: async () => {
        const { accessToken, refreshToken, isAuthenticated } = get();

        // 이미 persist된 상태에서 인증됨이 확인되고 토큰이 있으면 빠른 복원
        if (isAuthenticated && accessToken && refreshToken) {
          // 토큰 유효성만 빠르게 확인
          if (!isTokenExpired(accessToken)) {
            set({ isInitialized: true });
            return;
          }
        }

        if (!accessToken || !refreshToken) {
          set({ isInitialized: true });
          return;
        }

        try {
          set({ isLoading: true });

          // 액세스 토큰이 유효한지 확인
          if (!isTokenExpired(accessToken)) {
            const user = await mockValidateToken(accessToken);
            if (user) {
              set({
                isAuthenticated: true,
                user,
                isLoading: false,
                isInitialized: true,
              });
              return;
            }
          }

          // 액세스 토큰이 만료되었다면 리프레시 토큰으로 갱신 시도
          const refreshSuccess = await get().refreshAccessToken();
          if (refreshSuccess) {
            const { accessToken: newToken } = get();
            const user = await mockValidateToken(newToken!);
            if (user) {
              set({
                isAuthenticated: true,
                user,
                isLoading: false,
                isInitialized: true,
              });
              return;
            }
          }

          // 모든 시도가 실패하면 로그아웃 처리
          get().logout();
        } catch (error) {
          console.error("인증 상태 확인 실패:", error);
          get().logout();
        } finally {
          set({ isInitialized: true });
        }
      },

      // 초기화 완료 설정
      setInitialized: () => set({ isInitialized: true }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => createDynamicStorage()),
      // 중요한 상태들을 모두 persist하되, 민감한 정보는 암호화 권장
      partialize: ({
        accessToken,
        refreshToken,
        user,
        isAuthenticated,
        rememberMe,
      }) => ({
        accessToken,
        refreshToken,
        user,
        isAuthenticated,
        rememberMe,
      }),
      // 데이터 복원 시 초기화 상태 확인
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 복원된 상태가 있으면 아직 초기화되지 않은 것으로 표시
          state.isInitialized = false;
          state.isLoading = false;
        }
      },
    },
  ),
);
