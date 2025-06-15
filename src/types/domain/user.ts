// 사용자 기본 정보 타입
export type User = {
  id: string;
  name: string;
  email: string;
  displayName?: string;
  avatar?: string | null;
  role: "user" | "admin";
  permissions?: string[];
  createdAt: string;
  lastLoginAt?: string;
};

// 사용자 통계 타입
export type UserStats = {
  messageCount: number;
  bookmarkCount: number;
  analysisCount: number;
  searchCount: number;
};

// 사용자 프로필 업데이트 요청 타입
export type UpdateUserProfileRequest = {
  name?: string;
  avatar?: string;
  preferences?: UserPreferences;
};

// 사용자 설정 타입
export type UserPreferences = {
  language: "ko" | "en";
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  theme: "light" | "dark" | "system";
};

// 퀵 링크 아이템 타입 (UserInfoCard에서 사용)
export type QuickLinkItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
  count?: number;
};
