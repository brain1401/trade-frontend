import type { User, UserStats, UserPreferences } from "@/types";
import { MessageSquare, Bookmark, Briefcase, Settings } from "lucide-react";

// 현재 사용자 Mock 데이터
export const mockCurrentUser: User = {
  id: "user-001",
  name: "Aiden",
  email: "brain1401@tradegenie.com",
  avatar: "https://placehold.co/48x48/FFFFFF/004E98?text=A",
  role: "user",
  createdAt: "2024-03-15T09:00:00Z",
  lastLoginAt: "2025-01-12T08:30:00Z",
};

// 사용자 통계 Mock 데이터
export const mockUserStats: UserStats = {
  messageCount: 3,
  bookmarkCount: 12,
  analysisCount: 8,
  searchCount: 47,
};

// 사용자 설정 Mock 데이터
export const mockUserPreferences: UserPreferences = {
  language: "ko",
  timezone: "Asia/Seoul",
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  theme: "light",
};

// 사용자 퀵 링크 버튼 정보
export const mockUserQuickLinks = [
  {
    name: "메시지",
    icon: MessageSquare,
    count: mockUserStats.messageCount,
    path: "/user/messages",
  },
  {
    name: "북마크",
    icon: Bookmark,
    count: mockUserStats.bookmarkCount,
    path: "/user/bookmarks",
  },
  {
    name: "분석이력",
    icon: Briefcase,
    count: mockUserStats.analysisCount,
    path: "/user/analysis-history",
  },
  {
    name: "계정설정",
    icon: Settings,
    path: "/user/settings",
  },
];

// 유틸리티 함수들
export const getCurrentUser = (): User => {
  return mockCurrentUser;
};

export const getUserStats = (userId?: string): UserStats => {
  // 실제 구현에서는 userId로 특정 사용자의 통계를 가져와야 함
  return mockUserStats;
};

export const getUserPreferences = (userId?: string): UserPreferences => {
  // 실제 구현에서는 userId로 특정 사용자의 설정을 가져와야 함
  return mockUserPreferences;
};

export const updateUserStats = (
  statType: keyof UserStats,
  increment: number = 1,
): UserStats => {
  // Mock에서는 메모리상에서 업데이트
  mockUserStats[statType] += increment;
  return { ...mockUserStats };
};

export const hasUnreadMessages = (): boolean => {
  return mockUserStats.messageCount > 0;
};

export const hasBookmarks = (): boolean => {
  return mockUserStats.bookmarkCount > 0;
};
