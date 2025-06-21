import type { User, UserStats, UserPreferences } from "@/types";

// 현재 사용자 Mock 데이터
export const mockCurrentUser: User = {
  id: "user-001",
  name: "Aiden",
  email: "brain1401@tradegenie.com",
  avatar: "https://placehold.co/48x48/FFFFFF/004E98?text=A",
  role: "trader",
  createdAt: "2024-03-15T09:00:00Z",
  lastLoginAt: "2025-01-12T08:30:00Z",
  preferences: {
    notifications: {
      email: true,
      browser: true,
      sms: false,
    },
    language: "ko",
    timezone: "Asia/Seoul",
    defaultView: "dashboard",
  },
  stats: {
    analysisCount: 3,
    bookmarkCount: 12,
    searchCount: 47,
    accuracyRate: 0.85,
    lastActiveDate: "2025-01-12T08:30:00Z",
    analysisHistory: [],
  },
};

// 유틸리티 함수들
export const getCurrentUser = (): User => {
  return mockCurrentUser;
};

export const getUserStats = (_userId?: string): UserStats => {
  return mockCurrentUser.stats;
};

export const getUserPreferences = (_userId?: string): UserPreferences => {
  return mockCurrentUser.preferences;
};

export const hasUnreadMessages = (): boolean => {
  return mockCurrentUser.stats.searchCount > 0;
};

export const hasBookmarks = (): boolean => {
  return mockCurrentUser.stats.bookmarkCount > 0;
};
