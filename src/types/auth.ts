/**
 * 사용자 정보 타입 (API v6.1)
 *
 * 프론트엔드에서 실제로 필요한 최소한의 사용자 정보만 포함합니다.
 * 보안상 민감한 정보(ID, 권한 등)는 서버에서 이메일 기반으로 관리합니다.
 */
export type User = {
  /** 사용자 이메일 (Primary Key로 사용) */
  email: string;
  /** 사용자 표시명 (환영 메시지 등에 사용) */
  name: string;
  /** 프로필 이미지 URL (OAuth 제공업체에서 제공, 선택적) */
  profileImage: string | null;
  /** 🆕 휴대폰 인증 완료 여부 (v6.1 신규) */
  phoneVerified?: boolean;
  /** 🆕 Remember me 설정 상태 (v6.1 신규) */
  rememberMe?: boolean;
};

/**
 * JWT 페이로드 타입
 */
export type JwtPayload = {
  /** 토큰 발급자 (issuer) */
  iss?: string;
  /** 토큰 주체 (subject) */
  sub?: string;
  /** 토큰 대상자 (audience) */
  aud?: string | string[];
  /** 만료 시간 (expiration time, Unix timestamp) */
  exp?: number;
  /** 활성 시간 (not before, Unix timestamp) */
  nbf?: number;
  /** 발급 시간 (issued at, Unix timestamp) */
  iat?: number;
  /** JWT ID (JWT-ID) */
  jti?: string;
  /** 기타 클레임 */
  [key: string]: unknown;
};

/**
 * 인증 상태 타입 (통합 인증 시스템용)
 */
export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** @deprecated v6.1 - AuthManager에서 토큰 관리됨 */
  accessToken?: string | null;
};

/**
 * 라우터 컨텍스트용 인증 타입
 *
 * 라우터에서 사용하는 인증 상태 정보입니다.
 * 라우터 생성 시에는 placeholder로 사용되고, 실제 컴포넌트에서 진짜 값이 주입됩니다.
 */
export type RouterAuthContext = AuthState;

/**
 * 로그인 요청 타입
 */
export type LoginRequest = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

/**
 * 회원가입 요청 타입
 */
export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
};

/**
 * 🆕 v6.1 로그인 응답 데이터 타입 (JWT 세부화)
 */
export type LoginResponse = {
  /** JWT Access Token (30분, 헤더&Zustand 저장용) */
  accessToken: string;
  /** 토큰 타입 ("Bearer") */
  tokenType: string;
  /** Access Token 만료 시간 (초, 1800) */
  expiresIn: number;
  /** 사용자 정보 */
  user: User;
};

/**
 * 🆕 토큰 갱신 응답 타입 (v6.1 세부화)
 */
export type RefreshTokenResponse = {
  /** 새로 발급된 Access Token (30분) */
  accessToken: string;
  /** 토큰 타입 ("Bearer") */
  tokenType: string;
  /** Access Token 만료 시간 (초, 1800) */
  expiresIn: number;
  /** 현재 Remember Me 설정 상태 */
  rememberMe: boolean;
};

/**
 * OAuth 제공업체 타입
 */
export type OAuthProvider = "google" | "naver" | "kakao";

/**
 * API v6.1 에러 코드 타입 (확장된 에러 코드 체계)
 */
export type ApiErrorCode =
  // 인증 관련 (AUTH_xxx)
  | "AUTH_001" // 이메일 또는 비밀번호가 올바르지 않습니다
  | "AUTH_002" // 계정 접근 제한
  | "AUTH_003" // 인증 만료
  | "AUTH_004" // 인증 오류
  | "AUTH_005" // 접근 권한 없음
  // 사용자 관련 (USER_xxx)
  | "USER_001" // 이미 사용 중인 이메일입니다
  | "USER_002" // 입력 정보가 올바르지 않습니다
  | "USER_003" // 사용자 정보 없음
  | "USER_004" // 비밀번호가 정책에 맞지 않습니다
  // OAuth 관련 (OAUTH_xxx) - 새로 추가
  | "OAUTH_001" // 지원하지 않는 OAuth 제공자입니다
  | "OAUTH_002" // 소셜 로그인에 실패했습니다
  | "OAUTH_003" // 사용자가 인증을 취소했습니다
  // Rate Limiting (RATE_LIMIT_xxx) - 새로 추가
  | "RATE_LIMIT_001" // 로그인 시도 한도를 초과했습니다
  | "RATE_LIMIT_002" // 검색 요청 한도를 초과했습니다
  // 외부 시스템 연동 에러 (EXTERNAL_xxx) - 새로 추가
  | "EXTERNAL_001" // 외부 시스템 연결 실패 (502)
  | "EXTERNAL_002" // 외부 시스템 타임아웃 (504)
  // 공통 에러 (COMMON_xxx)
  | "COMMON_001" // 요청 형식이 올바르지 않습니다
  | "COMMON_002" // 서버에서 오류가 발생했습니다
  | "COMMON_003" // 요청 크기 초과
  | "COMMON_004" // 요청 한도 초과
  // 기존 호환성 유지를 위한 레거시 코드
  | "UNAUTHORIZED" // 401: 토큰 만료, 유효하지 않은 토큰
  | "FORBIDDEN" // 403: 사용자 삭제, 비활성화, 권한 없음
  | "USER_NOT_FOUND" // 사용자가 데이터베이스에서 삭제됨
  | "TOKEN_EXPIRED" // JWT 토큰 만료
  | "INVALID_TOKEN" // 잘못된 토큰 형식
  | "VALIDATION_ERROR" // 입력 데이터 검증 실패
  | "SERVER_ERROR"; // 서버 내부 오류

/**
 * 인증 상태 변경 이유 타입
 */
export type AuthChangeReason =
  | "LOGIN_SUCCESS" // 로그인 성공
  | "LOGOUT" // 사용자 직접 로그아웃
  | "TOKEN_EXPIRED" // 토큰 만료로 인한 자동 로그아웃
  | "USER_DELETED" // 사용자 계정 삭제로 인한 로그아웃
  | "INVALID_TOKEN" // 유효하지 않은 토큰으로 인한 로그아웃
  | "INITIALIZATION" // 앱 초기화
  | "ERROR"; // 기타 오류

/**
 * 인증 관련 에러 정보 타입
 */
export type AuthError = {
  code: ApiErrorCode;
  message: string;
  statusCode?: number;
  reason?: AuthChangeReason;
};

/**
 * OAuth 콜백 처리 타입
 *
 * 🚨 임시 수정: 백엔드가 실제로 전달하는 형태에 맞게 확장
 */
export type OAuthCallbackResult = {
  success: boolean;
  error?: string;
  user?: User;
  /** 🚨 임시: 백엔드가 URL에 직접 전달하는 accessToken (보안 문제) */
  accessToken?: string;
  /** 🚨 임시: 백엔드가 URL에 직접 전달하는 email */
  email?: string;
  /** 🚨 임시: 백엔드가 URL에 직접 전달하는 name */
  name?: string;
};

/**
 * 🆕 v6.1 보안 정책 상수 (JWT 세부화)
 */
export const AUTH_SECURITY_POLICIES = {
  /** Access Token 만료 시간 (30분) */
  ACCESS_TOKEN_EXPIRES_IN: 1800,
  /** Remember Me 체크시 Refresh Token 만료 시간 (30일) */
  REFRESH_TOKEN_REMEMBER_MAX_AGE: 2592000,
  /** Remember Me 미체크시 Refresh Token 만료 시간 (1일) */
  REFRESH_TOKEN_SESSION_MAX_AGE: 86400,
  /** HttpOnly 쿠키 속성 */
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: import.meta.env.PROD, // HTTPS에서만 전송
    sameSite: "strict" as const, // CSRF 공격 방지
    path: "/auth/refresh", // Refresh 엔드포인트에서만 전송
  },
} as const;

// [1단계] 이메일 찾기
export type FindPasswordRequest = {
  email: string;
};
export type FindPasswordResponse = {
  maskedPhoneNumber: string;
};

// [2단계] 인증 코드 발송
export type SendPasswordCodeRequest = {
  email: string;
  method: "phone" | "email";
  name?: string;
  phoneNumber?: string;
};

// [3단계] 코드 검증
export type VerifyPasswordCodeRequest = {
  email: string;
  code: string;
  method: "phone" | "email";
};
export type VerifyPasswordCodeResponse = {
  resetToken: string;
};

// [4단계] 비밀번호 재설정
export type ResetPasswordRequest = {
  resetToken: string;
  newPassword?: string;
};
