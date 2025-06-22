/**
 * 사용자 정보 타입
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
  profileImage?: string;
};

/**
 * 인증 상태 타입
 */
export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

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
 * API 응답 래퍼 타입
 */
export type ApiResponse<T> = {
  success: "SUCCESS" | "ERROR";
  message: string;
  data: T | null;
};

/**
 * 로그인 응답 데이터 타입
 */
export type LoginResponse = {
  user: User;
};

/**
 * OAuth 제공업체 타입
 */
export type OAuthProvider = "google" | "naver" | "kakao";

/**
 * API 에러 코드 타입
 */
export type ApiErrorCode =
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
