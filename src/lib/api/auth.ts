/**
 * 사용자 인증 관련 API 함수 모음
 *
 * 로그인, 회원가입, 토큰 갱신, SNS 연동 등의 인증 기능을 제공함
 * 스프링부트 서버의 /api/v1/auth/* 엔드포인트와 연동
 *
 * @module AuthApi
 * @since 1.0.0
 */

import { publicApiClient, type ApiResponse, API_ENDPOINTS } from "./client";

/**
 * 로그인 요청 데이터 타입
 */
export type LoginRequest = {
  /** 사용자 이메일 */
  email: string;
  /** 비밀번호 */
  password: string;
  /** 로그인 유지 여부 */
  rememberMe?: boolean;
};

/**
 * 로그인 응답 데이터 타입
 */
export type LoginResponse = {
  /** JWT 액세스 토큰 */
  accessToken: string;
  /** JWT 리프레시 토큰 */
  refreshToken: string;
  /** 사용자 기본 정보 */
  user: {
    id: string;
    email: string;
    name: string;
    roles: string[];
  };
};

/**
 * 회원가입 요청 데이터 타입
 */
export type SignupRequest = {
  /** 사용자 이메일 */
  email: string;
  /** 비밀번호 */
  password: string;
  /** 비밀번호 확인 */
  passwordConfirm: string;
  /** 사용자 이름 */
  name: string;
  /** 이용약관 동의 */
  agreeToTerms: boolean;
  /** 개인정보 처리방침 동의 */
  agreeToPrivacy: boolean;
};

/**
 * 토큰 갱신 요청 데이터 타입
 */
export type RefreshTokenRequest = {
  /** 리프레시 토큰 */
  refreshToken: string;
};

/**
 * 토큰 갱신 응답 데이터 타입
 */
export type RefreshTokenResponse = {
  /** 새로운 액세스 토큰 */
  accessToken: string;
  /** 새로운 리프레시 토큰 (필요 시) */
  refreshToken?: string;
};

/**
 * 사용자 로그인 API 함수
 *
 * @param loginData - 로그인 요청 데이터
 * @returns 로그인 응답 데이터
 *
 * @example
 * ```typescript
 * const result = await loginUser({
 *   email: "user@example.com",
 *   password: "password123",
 *   rememberMe: true
 * });
 *
 * if (result.success) {
 *   console.log("로그인 성공:", result.data.user.name);
 * }
 * ```
 */
export const loginUser = async (
  loginData: LoginRequest,
): Promise<ApiResponse<LoginResponse>> => {
  const response = await publicApiClient.post<ApiResponse<LoginResponse>>(
    API_ENDPOINTS.AUTH.LOGIN,
    loginData,
  );
  return response.data;
};

/**
 * 사용자 회원가입 API 함수
 *
 * @param signupData - 회원가입 요청 데이터
 * @returns 회원가입 응답 데이터
 *
 * @example
 * ```typescript
 * const result = await signupUser({
 *   email: "newuser@example.com",
 *   password: "securePassword123",
 *   passwordConfirm: "securePassword123",
 *   name: "김철수",
 *   agreeToTerms: true,
 *   agreeToPrivacy: true
 * });
 * ```
 */
export const signupUser = async (
  signupData: SignupRequest,
): Promise<ApiResponse<LoginResponse>> => {
  const response = await publicApiClient.post<ApiResponse<LoginResponse>>(
    API_ENDPOINTS.AUTH.SIGNUP,
    signupData,
  );
  return response.data;
};

/**
 * 토큰 갱신 API 함수
 *
 * @param refreshData - 토큰 갱신 요청 데이터
 * @returns 갱신된 토큰 데이터
 *
 * @example
 * ```typescript
 * const result = await refreshAccessToken({
 *   refreshToken: "refresh_token_here"
 * });
 *
 * if (result.success) {
 *   // 새 토큰으로 업데이트
 *   updateTokens(result.data.accessToken);
 * }
 * ```
 */
export const refreshAccessToken = async (
  refreshData: RefreshTokenRequest,
): Promise<ApiResponse<RefreshTokenResponse>> => {
  const response = await publicApiClient.post<
    ApiResponse<RefreshTokenResponse>
  >(API_ENDPOINTS.AUTH.REFRESH, refreshData);
  return response.data;
};

/**
 * 토큰 유효성 검증 API 함수
 *
 * @param token - 검증할 JWT 토큰
 * @returns 토큰 유효성 검증 결과
 *
 * @example
 * ```typescript
 * const isValid = await validateToken("jwt_token_here");
 * if (isValid.success && isValid.data.valid) {
 *   console.log("토큰이 유효합니다");
 * }
 * ```
 */
export const validateToken = async (
  token: string,
): Promise<ApiResponse<{ valid: boolean; user?: unknown }>> => {
  const response = await publicApiClient.post<
    ApiResponse<{ valid: boolean; user?: unknown }>
  >(API_ENDPOINTS.AUTH.VALIDATE, { token });
  return response.data;
};

/**
 * 사용자 로그아웃 API 함수
 *
 * @returns 로그아웃 처리 결과
 *
 * @example
 * ```typescript
 * const result = await logoutUser();
 * if (result.success) {
 *   console.log("로그아웃이 완료되었습니다");
 * }
 * ```
 */
export const logoutUser = async (): Promise<ApiResponse<null>> => {
  const response = await publicApiClient.post<ApiResponse<null>>(
    API_ENDPOINTS.AUTH.LOGOUT,
  );
  return response.data;
};
