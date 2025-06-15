import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserStats, UserPreferences } from "@/types/domain/user";

// 인증 상태 타입 정의 (데이터만 포함)
type AuthState = {
  // 인증 정보
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;

  // 현재 사용자 정보
  user: User | null;
  userStats: UserStats;
  preferences: UserPreferences;

  // 로딩 상태
  isLoading: boolean;
  isRefreshing: boolean;

  // 에러 상태
  error: string | null;
};

// 인증 액션 타입 정의 (함수들만 포함)
type AuthActions = {
  // 인증 액션들
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (userData: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;

  // 추가된 인증 메서드들
  initialize: () => void;
  checkTokenValidity: (token: string) => Promise<boolean>;
  refreshAuthToken: (refreshToken: string) => Promise<void>;

  // 사용자 정보 관리
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  incrementStat: (statType: keyof UserStats, amount?: number) => void;

  // 상태 관리
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // 유틸리티
  hasPermission: (permission: string) => boolean;
  getDisplayName: () => string;
  isTokenExpired: () => boolean;
  hasUnreadMessages: () => boolean;
  hasBookmarks: () => boolean;
  loadUserData: (userId: string) => Promise<void>;
};

// 전체 Store 타입 조합
type AuthStore = AuthState & AuthActions;

// 초기 상태
const initialState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  user: null,
  userStats: {
    messageCount: 0,
    bookmarkCount: 0,
    analysisCount: 0,
    searchCount: 0,
  },
  preferences: {
    language: "ko" as const,
    timezone: "Asia/Seoul",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    theme: "light" as const,
  },
  isLoading: false,
  isRefreshing: false,
  error: null,
};

// 토큰 만료 확인 함수
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

// Zustand 스토어 생성 (persist 미들웨어 사용)
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          // Mock 로그인 - 실제로는 API 호출
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Mock 응답 데이터
          const mockUser: User = {
            id: "1",
            email: credentials.email,
            name: "김분석",
            displayName: "김분석",
            avatar: null,
            role: "user",
            permissions: ["read", "write"],
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          };

          const mockTokens = {
            token: "mock-jwt-token",
            refreshToken: "mock-refresh-token",
          };

          set({
            isAuthenticated: true,
            token: mockTokens.token,
            refreshToken: mockTokens.refreshToken,
            user: mockUser,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "로그인에 실패했습니다";
          set({
            isAuthenticated: false,
            token: null,
            refreshToken: null,
            user: null,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      signup: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          // Mock 회원가입 - 실제로는 API 호출
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              // 이미 사용 중인 이메일 체크
              if (userData.email === "test@example.com") {
                reject(new Error("이미 사용 중인 이메일입니다"));
              } else {
                resolve(true);
              }
            }, 1500);
          });

          set({
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "회원가입에 실패했습니다";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          ...initialState,
        });
        // 로컬 스토리지 정리는 persist 미들웨어가 처리
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().logout();
          return;
        }

        set({ isRefreshing: true });

        try {
          // Mock refresh - 실제로는 API 호출
          await new Promise((resolve) => setTimeout(resolve, 500));

          const newToken = "new-mock-jwt-token";

          set({
            token: newToken,
            isRefreshing: false,
            error: null,
          });
        } catch (error) {
          set({
            isRefreshing: false,
            error: "토큰 갱신에 실패했습니다",
          });
          get().logout();
          throw error;
        }
      },

      updateProfile: async (updates) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true, error: null });

        try {
          // Mock API 호출
          await new Promise((resolve) => setTimeout(resolve, 500));

          const updatedUser = { ...user, ...updates };
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "프로필 업데이트에 실패했습니다";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      updatePreferences: (newPreferences) => {
        const { preferences } = get();
        set({
          preferences: { ...preferences, ...newPreferences },
        });
      },

      updateStats: (newStats) => {
        const { userStats } = get();
        set({
          userStats: { ...userStats, ...newStats },
        });
      },

      incrementStat: (statType, amount = 1) => {
        const { userStats } = get();
        set({
          userStats: {
            ...userStats,
            [statType]: userStats[statType] + amount,
          },
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      hasPermission: (permission) => {
        const { user } = get();
        return user?.permissions?.includes(permission) ?? false;
      },

      getDisplayName: () => {
        const { user } = get();
        return user?.displayName || user?.name || user?.email || "익명 사용자";
      },

      isTokenExpired: () => {
        const { token } = get();
        return isTokenExpired(token);
      },

      // 추가된 메서드들 구현
      initialize: () => {
        // 앱 시작시 토큰 유효성 검사
        const { token, isTokenExpired } = get();
        if (token && isTokenExpired()) {
          get().logout();
        }
      },

      checkTokenValidity: async (token: string): Promise<boolean> => {
        try {
          // Mock validation - 실제로는 API 호출
          await new Promise((resolve) => setTimeout(resolve, 200));
          return !isTokenExpired(token);
        } catch (error) {
          console.error("Token validation failed:", error);
          return false;
        }
      },

      refreshAuthToken: async (refreshToken: string): Promise<void> => {
        set({ isRefreshing: true });

        try {
          // Mock token refresh - 실제로는 API 호출
          await new Promise((resolve) => setTimeout(resolve, 500));

          const newToken = "new-refreshed-jwt-token";
          const newRefreshToken = "new-refresh-token";

          set({
            token: newToken,
            refreshToken: newRefreshToken,
            isRefreshing: false,
            error: null,
          });
        } catch (error) {
          set({
            isRefreshing: false,
            error: "토큰 갱신에 실패했습니다",
          });
          throw error;
        }
      },

      hasUnreadMessages: () => {
        const { userStats } = get();
        return userStats.messageCount > 0;
      },

      hasBookmarks: () => {
        const { userStats } = get();
        return userStats.bookmarkCount > 0;
      },

      loadUserData: async (userId: string) => {
        set({ isLoading: true, error: null });

        try {
          // Mock 데이터 로드 시뮬레이션
          await new Promise((resolve) => setTimeout(resolve, 300));

          // Mock 사용자 데이터
          const mockUser: User = {
            id: userId,
            email: "user@example.com",
            name: "김분석",
            displayName: "김분석",
            avatar: null,
            role: "user",
            permissions: ["read", "write"],
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          };

          const mockStats = {
            messageCount: 3,
            bookmarkCount: 12,
            analysisCount: 8,
            searchCount: 25,
          };

          set({
            user: mockUser,
            userStats: mockStats,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "사용자 데이터 로드에 실패했습니다";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        // 민감한 정보는 제외하고 필요한 것만 persist
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        preferences: state.preferences,
      }),
    },
  ),
);

// Mock 사용자 초기화 함수
export const initializeMockUser = () => {
  const authStore = useAuthStore.getState();
  authStore.loadUserData("mock-user-id");
};
