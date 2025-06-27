import type { ImportanceLevel } from "@/types/base";

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

/**
 * 알림 Mock 데이터 (v6.1)
 */
export const mockNotifications: Notification[] = [
  {
    id: "feed_001",
    feedType: "HS_CODE_TARIFF_CHANGE",
    title: "스마트폰 관세율 변경 알림",
    content: "HS Code 8517.12.00의 기본 관세율이 8%에서 6%로 인하되었습니다.",
    sourceUrl: "https://unipass.customs.go.kr/...",
    importance: "HIGH",
    isRead: false,
    createdAt: "2024-01-16T08:15:00Z",
    actions: [{ label: "상세보기", url: "/feeds/feed_001" }],
  },
  {
    id: "feed_002",
    feedType: "CARGO_STATUS_UPDATE",
    title: "화물 상태 업데이트",
    content: "수입신고가 완료되어 통관 절차가 진행 중입니다.",
    sourceUrl: null,
    importance: "MEDIUM",
    isRead: true,
    createdAt: "2024-01-15T16:30:00Z",
    actions: [{ label: "추적보기", url: "/tracking/KRPU1234567890" }],
  },
  {
    id: "notif-5",
    feedType: "SYSTEM",
    title: "시스템 점검 공지",
    content:
      "1월 20일 새벽 2시-4시 시스템 점검이 예정되어 있습니다. 서비스 이용에 참고하세요.",
    sourceUrl: "/notices/system-check-20240120",
    importance: "LOW",
    isRead: true,
    createdAt: "2024-01-13T18:00:00Z",
    actions: [{ label: "공지 확인", url: "/notices/system-check-20240120" }],
  },
];

/**
 * 알림 설정 Mock 데이터 (v6.1)
 */
export const mockNotificationSettings: NotificationSettings = {
  globalSettings: {
    smsNotificationEnabled: true,
    emailNotificationEnabled: true,
    notificationFrequency: "DAILY",
    notificationTime: "09:00:00",
  },
  bookmarkSettings: [
    {
      bookmarkId: "bm_001",
      displayName: "스마트폰 HS Code",
      type: "HS_CODE",
      smsNotificationEnabled: true,
      emailNotificationEnabled: true,
    },
    {
      bookmarkId: "bm_002",
      displayName: "1월 수입 화물",
      type: "CARGO",
      smsNotificationEnabled: false,
      emailNotificationEnabled: true,
    },
  ],
  notificationStats: {
    totalBookmarks: 5,
    smsEnabledBookmarks: 3,
    emailEnabledBookmarks: 5,
    dailyNotificationsSent: 2,
  },
};

/**
 * 휴대폰 인증 코드 발송 응답 Mock 데이터 (v6.1)
 */
export const mockSendCodeResponse = {
  verificationId: "verify_123456789",
  expiresAt: "2024-01-16T10:35:00Z",
  cooldownUntil: "2024-01-16T10:33:00Z",
  autoActivationWarning:
    "휴대폰 인증 완료 시 기존 북마크의 SMS/이메일 알림이 자동으로 활성화됩니다",
};

/**
 * 휴대폰 인증 코드 확인 응답 Mock 데이터 (v6.1)
 */
export const mockVerifyCodeResponse = {
  phoneNumber: "010-****-5678",
  verifiedAt: "2024-01-16T10:32:00Z",
  smsNotificationEnabled: true,
  emailNotificationEnabled: true,
  activatedBookmarksCount: 5,
};
