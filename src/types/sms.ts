/**
 * SMS 알림 시스템 타입 정의 (API v4.0 신규)
 *
 * 휴대폰 인증 및 문자 알림 기능을 위한 타입 정의
 */

/**
 * 휴대폰 인증 코드 발송 요청 (POST /api/sms/verification/send)
 */
export type SmsVerificationSendRequest = {
  /** 휴대폰 번호 (010-0000-0000 또는 01000000000 형식) */
  phoneNumber: string;
};

/**
 * 휴대폰 인증 코드 발송 응답
 */
export type SmsVerificationSendResponse = {
  /** 인증 세션 ID */
  verificationId: string;
  /** 인증 코드 만료 시간 (ISO 8601) */
  expiresAt: string;
  /** 다음 발송 가능 시간 (ISO 8601) */
  cooldownUntil: string;
};

/**
 * 휴대폰 인증 코드 확인 요청 (POST /api/sms/verification/verify)
 */
export type SmsVerificationVerifyRequest = {
  /** 인증 세션 ID */
  verificationId: string;
  /** 6자리 인증 코드 */
  verificationCode: string;
};

/**
 * 휴대폰 인증 코드 확인 응답
 */
export type SmsVerificationVerifyResponse = {
  /** 인증된 휴대폰 번호 (마스킹 처리) */
  phoneNumber: string;
  /** 인증 완료 시간 (ISO 8601) */
  verifiedAt: string;
};

/**
 * 휴대폰 번호 등록 요청 (POST /api/sms/phone/register)
 */
export type SmsPhoneRegisterRequest = {
  /** 인증 세션 ID */
  verificationId: string;
};

/**
 * 휴대폰 번호 등록 응답
 */
export type SmsPhoneRegisterResponse = {
  /** 등록된 휴대폰 번호 (마스킹 처리) */
  phoneNumber: string;
  /** 등록 완료 시간 (ISO 8601) */
  registeredAt: string;
  /** 기본 문자 알림 설정 상태 */
  smsNotificationEnabled: boolean;
};

/**
 * 문자 알림 설정 조회 응답 (GET /api/sms/settings)
 */
export type SmsSettingsResponse = {
  /** 등록된 휴대폰 번호 (마스킹 처리) */
  phoneNumber: string;
  /** 전체 문자 알림 ON/OFF */
  globalEnabled: boolean;
  /** 북마크별 알림 설정 */
  bookmarkSettings: Record<string, BookmarkNotificationSetting>;
  /** 알림 유형별 설정 */
  notificationTypes: Record<NotificationType, NotificationTypeSetting>;
};

/**
 * 북마크별 알림 설정
 */
export type BookmarkNotificationSetting = {
  /** 해당 북마크 알림 활성화 여부 */
  enabled: boolean;
  /** 북마크 표시명 */
  displayName: string;
};

/**
 * 알림 유형별 설정
 */
export type NotificationTypeSetting = {
  /** 해당 유형 알림 활성화 여부 */
  enabled: boolean;
  /** 알림 유형 한글명 */
  name: string;
};

/**
 * 지원하는 알림 유형
 */
export type NotificationType =
  | "TARIFF_CHANGE" // 관세율 변경
  | "REGULATION_UPDATE" // 규제 정보 업데이트
  | "CARGO_STATUS_UPDATE" // 화물 상태 변경
  | "TRADE_NEWS"; // 중요 무역 뉴스

/**
 * 문자 알림 설정 수정 요청 (PUT /api/sms/settings)
 */
export type SmsSettingsUpdateRequest = {
  /** 전체 문자 알림 ON/OFF */
  globalEnabled?: boolean;
  /** 북마크별 알림 설정 */
  bookmarkSettings?: Record<string, boolean>;
  /** 알림 유형별 설정 */
  notificationTypes?: Record<NotificationType, boolean>;
};

/**
 * 문자 알림 설정 수정 응답
 */
export type SmsSettingsUpdateResponse = {
  /** 설정 수정 시간 (ISO 8601) */
  updatedAt: string;
  /** 활성화된 북마크 수 */
  totalEnabledBookmarks: number;
  /** 활성화된 알림 유형 수 */
  totalEnabledTypes: number;
};

/**
 * SMS 발송 이력 조회 응답 (GET /api/sms/logs) 🆕
 */
export type SmsLogsResponse = {
  /** SMS 발송 이력 목록 */
  content: SmsLogItem[];
  /** 페이지네이션 정보 */
  pagination: {
    offset: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
  /** 발송 통계 요약 */
  summary: SmsLogSummary;
};

/**
 * SMS 발송 이력 아이템
 */
export type SmsLogItem = {
  /** 발송 이력 ID */
  id: number;
  /** 메시지 타입 */
  messageType: SmsMessageType;
  /** 수신 번호 (마스킹 처리) */
  phoneNumber: string;
  /** 발송 내용 */
  content: string;
  /** 발송 상태 */
  status: SmsDeliveryStatus;
  /** 발송 비용 (원) */
  costKrw: number;
  /** 발송 시간 (ISO 8601) */
  sentAt: string;
  /** 전달 완료 시간 (ISO 8601, 선택적) */
  deliveredAt: string | null;
  /** 생성 시간 (ISO 8601) */
  createdAt: string;
};

/**
 * SMS 메시지 타입
 */
export type SmsMessageType =
  | "VERIFICATION" // 인증 코드
  | "NOTIFICATION"; // 알림 메시지

/**
 * SMS 발송 상태
 */
export type SmsDeliveryStatus =
  | "SENT" // 발송됨
  | "FAILED" // 발송 실패
  | "DELIVERED"; // 전달 완료

/**
 * SMS 발송 통계 요약
 */
export type SmsLogSummary = {
  /** 총 발송 수 */
  totalSent: number;
  /** 총 발송 비용 (원) */
  totalCost: number;
  /** 이번 달 발송 비용 (원) */
  thisMonthCost: number;
  /** 전달 성공률 (백분율 문자열) */
  deliveryRate: string;
};

/**
 * SMS 발송 이력 조회 필터 옵션
 */
export type SmsLogsQueryOptions = {
  /** 페이지 오프셋 (기본값: 0) */
  offset?: number;
  /** 페이지 크기 (기본값: 20, 최대: 100) */
  limit?: number;
  /** 메시지 타입 필터 */
  type?: SmsMessageType;
  /** 발송 상태 필터 */
  status?: SmsDeliveryStatus;
};

/**
 * 휴대폰 인증 상태 타입
 */
export type PhoneVerificationStatus =
  | "NOT_VERIFIED" // 미인증
  | "VERIFIED" // 인증 완료
  | "PENDING" // 인증 진행 중
  | "EXPIRED" // 인증 만료
  | "FAILED"; // 인증 실패

/**
 * 클라이언트 사이드 SMS 상태 관리용 타입
 */
export type SmsState = {
  /** 휴대폰 인증 상태 */
  verificationStatus: PhoneVerificationStatus;
  /** 등록된 휴대폰 번호 (마스킹) */
  phoneNumber: string | null;
  /** 인증 세션 ID */
  verificationId: string | null;
  /** 인증 코드 만료 시간 */
  expiresAt: string | null;
  /** 다음 발송 가능 시간 */
  cooldownUntil: string | null;
  /** 문자 알림 설정 */
  settings: SmsSettingsResponse | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 정보 */
  error: string | null;
};

/**
 * SMS 인증 UI에서 사용하는 상태 타입
 */
export type SmsVerificationUIState = {
  /** 현재 단계 */
  step: "PHONE_INPUT" | "CODE_INPUT" | "REGISTRATION" | "COMPLETED";
  /** 입력된 휴대폰 번호 */
  phoneNumber: string;
  /** 입력된 인증 코드 */
  verificationCode: string;
  /** 재발송 가능 여부 */
  canResend: boolean;
  /** 남은 시간 (초) */
  remainingTime: number;
};
