/**
 * SMS 인증 요청 타입
 */
export type SmsVerificationSendRequest = {
  phoneNumber: string;
  purpose: "SIGNUP" | "LOGIN" | "PASSWORD_RESET";
};

/**
 * SMS 인증 응답 타입
 */
export type SmsVerificationSendResponse = {
  requestId: string;
  expiryTime: string;
};

/**
 * SMS 인증 검증 요청 타입
 */
export type SmsVerificationVerifyRequest = {
  requestId: string;
  verificationCode: string;
};

/**
 * SMS 인증 검증 응답 타입
 */
export type SmsVerificationVerifyResponse = {
  verified: boolean;
  token?: string;
};

/**
 * SMS 설정 요청 타입
 */
export type SmsSettingsUpdateRequest = {
  enabled: boolean;
  marketingConsent?: boolean;
};

/**
 * SMS 설정 응답 타입
 */
export type SmsSettingsResponse = {
  enabled: boolean;
  marketingConsent: boolean;
  phoneNumber?: string;
};
