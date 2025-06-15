import { create } from "zustand";
import type { User, UserStats, UserPreferences } from "@/types";
import {
  mockCurrentUser,
  mockUserStats,
  mockUserPreferences,
} from "@/data/mock/user";

// 사용자 관련 상태 타입 정의
type UserState = {
  // 현재 사용자 정보
  currentUser: User | null;
  isAuthenticated: boolean;

  // 사용자 통계
  userStats: UserStats;

  // 사용자 설정
  preferences: UserPreferences;

  // 로딩 상태
  isLoading: boolean;
  isUpdating: boolean;

  // 에러 상태
  error: string | null;

  // 액션들
  setCurrentUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  updateUserStats: (stats: Partial<UserStats>) => void;
  incrementStat: (statType: keyof UserStats, amount?: number) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setLoading: (isLoading: boolean) => void;
  setUpdating: (isUpdating: boolean) => void;
  setError: (error: string | null) => void;

  // 사용자 데이터 관리
  loadUserData: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  logout: () => void;

  // 유틸리티 함수들
  hasUnreadMessages: () => boolean;
  hasBookmarks: () => boolean;
  getDisplayName: () => string;

  // 초기화
  reset: () => void;
};

// 초기 상태
const initialState = {
  currentUser: null,
  isAuthenticated: false,
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
  isUpdating: false,
  error: null,
};

// Zustand 스토어 생성
export const useUserStore = create<UserState>()((set, get) => ({
  ...initialState,

  setCurrentUser: (user) => {
    set({
      currentUser: user,
      isAuthenticated: user !== null,
    });
  },

  setAuthenticated: (isAuthenticated) => {
    set({ isAuthenticated });
  },

  updateUserStats: (stats) => {
    const { userStats } = get();
    set({
      userStats: { ...userStats, ...stats },
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

  updatePreferences: (newPreferences) => {
    const { preferences } = get();
    set({
      preferences: { ...preferences, ...newPreferences },
    });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setUpdating: (isUpdating) => {
    set({ isUpdating });
  },

  setError: (error) => {
    set({ error });
  },

  loadUserData: async (userId) => {
    set({ isLoading: true, error: null });

    try {
      // Mock 데이터 로드 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 실제로는 API 호출해서 사용자 데이터를 가져와야 함
      if (userId === mockCurrentUser.id) {
        set({
          currentUser: mockCurrentUser,
          userStats: mockUserStats,
          preferences: mockUserPreferences,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load user data";
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  updateProfile: async (updates) => {
    set({ isUpdating: true, error: null });

    try {
      // Mock 업데이트 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 500));

      const { currentUser } = get();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        set({
          currentUser: updatedUser,
          isUpdating: false,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      set({
        error: errorMessage,
        isUpdating: false,
      });
    }
  },

  logout: () => {
    set({
      currentUser: null,
      isAuthenticated: false,
      userStats: initialState.userStats,
      preferences: initialState.preferences,
      error: null,
    });
  },

  hasUnreadMessages: () => {
    const { userStats } = get();
    return userStats.messageCount > 0;
  },

  hasBookmarks: () => {
    const { userStats } = get();
    return userStats.bookmarkCount > 0;
  },

  getDisplayName: () => {
    const { currentUser } = get();
    return currentUser?.name || "Guest";
  },

  reset: () => {
    set(initialState);
  },
}));

// Mock 데이터로 초기 사용자 로그인 시뮬레이션
export const initializeMockUser = () => {
  const userStore = useUserStore.getState();
  userStore.loadUserData(mockCurrentUser.id);
};
