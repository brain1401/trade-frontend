import type { ImportanceLevel } from "./base";

/**
 * v6.1 API 명세서 기준, 알림 타입
 */
export type NotificationType =
  | "HS_CODE_TARIFF_CHANGE" // HS Code 관세율 변경
  | "HS_CODE_REGULATION_UPDATE" // HS Code 규제 변경
  | "CARGO_STATUS_UPDATE" // 화물 상태 업데이트
  | "TRADE_NEWS" // 무역 관련 뉴스
  | "POLICY_UPDATE" // 정책 변경 사항
  | "SYSTEM"; // 시스템 공지

/**
 * v6.1 API 명세서 기준, 알림 액션 타입
 */
export type NotificationAction = {
  label: string;
  url: string;
};

/**
 * v6.1 API 명세서 기준, 알림 객체 타입
 */
export type Notification = {
  id: string;
  feedType: NotificationType;
  title: string;
  content: string;
  sourceUrl: string | null;
  importance: ImportanceLevel;
  isRead: boolean;
  createdAt: string;
  actions: NotificationAction[];
};

/**
 * v6.1 API 명세서 기준, 통합 알림 설정 타입
 */
export type NotificationSettings = {
  globalSettings: {
    smsNotificationEnabled: boolean;
    emailNotificationEnabled: boolean;
    notificationFrequency: "DAILY" | "WEEKLY";
    notificationTime: string; // HH:mm:ss
  };
  bookmarkSettings: {
    bookmarkId: string;
    displayName: string;
    type: "HS_CODE" | "CARGO";
    smsNotificationEnabled: boolean;
    emailNotificationEnabled: boolean;
  }[];
  notificationStats: {
    totalBookmarks: number;
    smsEnabledBookmarks: number;
    emailEnabledBookmarks: number;
    dailyNotificationsSent: number;
  };
};
