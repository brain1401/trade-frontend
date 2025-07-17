import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  OAuthProvider,
  FindPasswordRequest,
  FindPasswordResponse,
  SendPasswordCodeRequest,
  VerifyPasswordCodeRequest,
  VerifyPasswordCodeResponse,
  ResetPasswordRequest,
} from "../../types/auth";
import {
  httpClient,
  rawHttpClient,
  fileUploadUtils,
} from "../api/common/httpClient";
import { tokenStore } from "./tokenStore";

// User 타입 기반 추가 타입 정의
type UpdateUserProfileRequest = {
  name?: string;
  profileImage?: string | null;
};

type UpdateUserProfileResponse = {
  user: User;
};

type PhoneVerificationRequest = {
  phoneNumber: string;
};

type PhoneVerificationCodeRequest = {
  phoneNumber: string;
  code: string;
};

type PhoneVerificationResponse = {
  user: User;
};

type UserActivityResponse = {
  user: User;
};

/**
 * 인증 서비스 - API 호출 및 토큰 관리
 * v6.1: JWT 세부화 정책 지원 (HttpOnly 쿠키 환경)
 * User 타입 기반 확장 기능 포함
 */
class AuthService {
  async login(credentials: LoginRequest): Promise<User> {
    const response = await rawHttpClient.post<LoginResponse>(
      "/auth/login",
      credentials,
    );

    if (response.success === "SUCCESS" && response.data) {
      // v6.1: Access Token은 tokenStore에서 메모리 관리
      tokenStore.setToken(response.data.accessToken);

      if (import.meta.env.DEV) {
        console.log("🔐 로그인 응답 처리 완료 - Access Token 저장됨");
      }

      return response.data.user;
    }

    throw new Error(response.message || "로그인에 실패했습니다");
  }

  async register(userData: RegisterRequest): Promise<User> {
    return httpClient.post<User>("/auth/register", userData);
  }

  async logout(): Promise<void> {
    try {
      // 서버에 로그아웃 요청. API 명세에 따라 서버는 이 요청에 대한 응답으로
      // HttpOnly 속성의 리프레시 토큰 쿠키를 삭제해야 함 (Max-Age=0).
      await rawHttpClient.post("/auth/logout");

      if (import.meta.env.DEV) {
        console.log(
          "🔐 서버 로그아웃 요청 성공. 브라우저의 네트워크 탭에서 /api/auth/logout 요청의 응답 헤더를 확인하여 'Set-Cookie' 헤더가 올바르게 전송되었는지 확인하세요.",
        );
      }
    } catch (error) {
      console.warn(
        "⚠️ 서버 로그아웃 API 호출 실패. 그러나 클라이언트 측 데이터는 계속해서 정리합니다.",
        error,
      );
    } finally {
      // API 호출 성공 여부와 관계없이 클라이언트 상태를 확실하게 정리
      tokenStore.clearToken();
      this.clearClientAuthData();

      if (import.meta.env.DEV) {
        console.log("🧹 클라이언트 인증 데이터 정리 완료.");
      }
    }
  }

  async getCurrentUser(): Promise<User> {
    return httpClient.get<User>("/auth/verify");
  }

  /**
   * 사용자 프로필 정보 업데이트
   *
   * @param userData - 업데이트할 사용자 정보
   * @returns 업데이트된 사용자 정보
   *
   * @example
   * ```typescript
   * const updatedUser = await authService.updateUserProfile({
   *   name: "새로운 이름",
   *   profileImage: "https://example.com/new-avatar.jpg"
   * });
   * ```
   */
  async updateUserProfile(userData: UpdateUserProfileRequest): Promise<User> {
    const response = await httpClient.patch<UpdateUserProfileResponse>(
      "/auth/profile",
      userData,
    );
    return response.user;
  }

  /**
   * 사용자 프로필 이미지 업로드
   *
   * @param imageFile - 업로드할 이미지 파일
   * @returns 업데이트된 사용자 정보
   *
   * @example
   * ```typescript
   * const file = event.target.files[0];
   * const updatedUser = await authService.uploadProfileImage(file);
   * ```
   */
  async uploadProfileImage(imageFile: File): Promise<User> {
    // 파일 유효성 검사
    const validation = fileUploadUtils.validateImageFile(imageFile, 5); // 5MB 제한
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const response = await httpClient.uploadFile<UpdateUserProfileResponse>(
      "/auth/profile/image",
      imageFile,
      "profileImage",
    );

    if (import.meta.env.DEV) {
      console.log(`✅ 프로필 이미지 업로드 완료: ${imageFile.name}`);
    }

    return response.user;
  }

  /**
   * 프로필 이미지 삭제
   *
   * @returns 업데이트된 사용자 정보
   */
  async deleteProfileImage(): Promise<User> {
    const response = await httpClient.delete<UpdateUserProfileResponse>(
      "/auth/profile/image",
    );
    return response.user;
  }

  /**
   * 휴대폰 인증 코드 발송
   *
   * @param phoneNumber - 인증할 휴대폰 번호
   *
   * @example
   * ```typescript
   * await authService.sendPhoneVerificationCode("+82-10-1234-5678");
   * ```
   */
  async sendPhoneVerificationCode(phoneNumber: string): Promise<void> {
    await httpClient.post<void>("/auth/phone/send-code", { phoneNumber });

    if (import.meta.env.DEV) {
      console.log(`📱 휴대폰 인증 코드 발송: ${phoneNumber}`);
    }
  }

  /**
   * 휴대폰 인증 코드 검증
   *
   * @param phoneNumber - 휴대폰 번호
   * @param code - 인증 코드
   * @returns 업데이트된 사용자 정보 (phoneVerified: true)
   *
   * @example
   * ```typescript
   * const verifiedUser = await authService.verifyPhoneCode(
   *   "+82-10-1234-5678",
   *   "123456"
   * );
   * ```
   */
  async verifyPhoneCode(phoneNumber: string, code: string): Promise<User> {
    const response = await httpClient.post<PhoneVerificationResponse>(
      "/auth/phone/verify",
      { phoneNumber, code },
    );

    if (import.meta.env.DEV) {
      console.log("✅ 휴대폰 인증 완료");
    }

    return response.user;
  }

  /**
   * 휴대폰 인증 초기화 (인증 해제)
   *
   * @returns 업데이트된 사용자 정보 (phoneVerified: false)
   */
  async resetPhoneVerification(): Promise<User> {
    const response = await httpClient.delete<PhoneVerificationResponse>(
      "/auth/phone/verification",
    );

    if (import.meta.env.DEV) {
      console.log("🔄 휴대폰 인증 초기화 완료");
    }

    return response.user;
  }

  /**
   * 사용자 활동 기록 업데이트
   * lastLoggedInAt, updateAt 필드를 현재 시간으로 업데이트
   *
   * @returns 업데이트된 사용자 정보
   */
  async updateUserActivity(): Promise<User> {
    const response = await httpClient.patch<UserActivityResponse>(
      "/auth/activity",
      {},
    );

    if (import.meta.env.DEV) {
      console.log("🕒 사용자 활동 기록 업데이트 완료");
    }

    return response.user;
  }

  /**
   * 계정 삭제
   *
   * @param password - 현재 비밀번호 (확인용)
   */
  async deleteAccount(password: string): Promise<void> {
    await httpClient.delete<void>("/auth/account", {
      data: { password },
    });

    // 계정 삭제 후 클라이언트 데이터 정리
    tokenStore.clearToken();
    this.clearClientAuthData();

    if (import.meta.env.DEV) {
      console.log("🗑️ 계정 삭제 및 클라이언트 데이터 정리 완료");
    }
  }

  /**
   * 비밀번호 변경
   *
   * @param currentPassword - 현재 비밀번호
   * @param newPassword - 새 비밀번호
   * @returns 업데이트된 사용자 정보
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<User> {
    const response = await httpClient.patch<UpdateUserProfileResponse>(
      "/auth/password/change",
      { currentPassword, newPassword },
    );

    if (import.meta.env.DEV) {
      console.log("🔐 비밀번호 변경 완료");
    }

    return response.user;
  }

  /**
   * 이메일 변경
   *
   * @param newEmail - 새 이메일 주소
   * @param password - 현재 비밀번호 (확인용)
   * @returns 업데이트된 사용자 정보
   */
  async changeEmail(newEmail: string, password: string): Promise<User> {
    const response = await httpClient.patch<UpdateUserProfileResponse>(
      "/auth/email/change",
      { newEmail, password },
    );

    if (import.meta.env.DEV) {
      console.log(`📧 이메일 변경 완료: ${newEmail}`);
    }

    return response.user;
  }

  /**
   * Remember Me 설정 업데이트
   *
   * @param rememberMe - Remember Me 설정 값
   * @returns 업데이트된 사용자 정보
   */
  async updateRememberMePreference(rememberMe: boolean): Promise<User> {
    const response = await httpClient.patch<UpdateUserProfileResponse>(
      "/auth/preferences/remember-me",
      { rememberMe },
    );

    if (import.meta.env.DEV) {
      console.log(`🔄 Remember Me 설정 업데이트: ${rememberMe}`);
    }

    return response.user;
  }

  /**
   * v6.1: OAuth URL 생성 (remember me 지원)
   */
  getOAuthUrl(provider: OAuthProvider, rememberMe = false): string {
    const params = new URLSearchParams();
    if (rememberMe) {
      params.append("rememberMe", "true");
    }
    return `http://localhost:8081/api/oauth2/authorization/${provider}?${params.toString()}`;
  }

  /**
   * v6.1: OAuth 콜백 처리
   */
  // authService.ts에서 수정
  handleOAuthCallback(): { success: boolean; error?: string } {
    const urlParams = new URLSearchParams(window.location.search);

    const status = urlParams.get("status");
    const accessToken = urlParams.get("accessToken");
    const error = urlParams.get("error");

    // ✅ OAuth 파라미터가 없으면 처리하지 않음 (중복 호출 방지)
    if (!status && !accessToken && !error) {
      if (import.meta.env.DEV) {
        console.log("🔄 OAuth 파라미터 없음 - 콜백 처리 스킵");
      }
      return { success: true }; // 이미 처리된 것으로 간주
    }

    if (status === "success" && accessToken) {
      tokenStore.setToken(accessToken);
      this.clearCallbackUrl();

      if (import.meta.env.DEV) {
        console.log("🔐 OAuth 콜백 - Access Token 저장 완료");
      }

      return { success: true };
    }

    if (error) {
      return {
        success: false,
        error: this.getOAuthErrorMessage(error),
      };
    }

    return { success: false, error: "알 수 없는 OAuth 오류가 발생했습니다" };
  }

  /**
   * v6.1: 토큰 갱신 (httpClient에서 자동 처리되지만 수동 호출도 지원)
   */
  async refreshToken(): Promise<string> {
    try {
      const response = await rawHttpClient.post<{ accessToken: string }>(
        "/auth/refresh",
      );

      if (response.success === "SUCCESS" && response.data) {
        tokenStore.setToken(response.data.accessToken);

        if (import.meta.env.DEV) {
          console.log("🔄 토큰 갱신 성공 - 새 Access Token 저장됨");
        }

        return response.data.accessToken;
      }

      throw new Error(response.message || "토큰 갱신에 실패했습니다");
    } catch (error) {
      tokenStore.clearToken();

      if (import.meta.env.DEV) {
        console.warn("❌ 토큰 갱신 실패 - Access Token 삭제됨:", error);
      }

      throw error;
    }
  }

  /**
   * 클라이언트 사이드 인증 데이터 정리
   * 참고: HttpOnly 쿠키는 JavaScript로 삭제할 수 없으므로, 서버 API를 통해서만 삭제 가능합니다.
   * 이 함수는 로컬/세션 스토리지의 다른 민감한 정보를 제거합니다.
   */
  private clearClientAuthData(): void {
    // 로컬 스토리지나 세션 스토리지의 인증 관련 데이터 정리
    if (typeof window !== "undefined") {
      try {
        // 일반적인 인증 관련 스토리지 키들 정리
        const authKeys = [
          "auth_token",
          "access_token",
          "user_data",
          "user_preferences",
          "remember_me",
          "phone_verification_temp",
          "profile_upload_temp",
        ];

        authKeys.forEach((key) => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });

        if (import.meta.env.DEV) {
          console.log("🧹 로컬/세션 스토리지 인증 데이터 정리 완료");
        }
      } catch (error) {
        console.warn("⚠️ 스토리지 정리 중 오류:", error);
      }
    }
  }

  private getOAuthErrorMessage(error: string): string {
    const errorMessages: Record<string, string> = {
      oauth_failed: "소셜 로그인 처리 중 오류가 발생했습니다",
      oauth_cancelled: "소셜 로그인이 취소되었습니다",
      unsupported_provider: "지원하지 않는 소셜 로그인 제공업체입니다",
      profile_incomplete: "프로필 정보가 불완전합니다",
      phone_verification_required: "휴대폰 인증이 필요합니다",
    };

    return errorMessages[error] || "소셜 로그인에 실패했습니다";
  }

  private clearCallbackUrl(): void {
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }

  /**
   * @deprecated HttpOnly 쿠키는 JavaScript로 삭제할 수 없습니다.
   * 대신 `logout()` 메서드를 사용하여 서버를 통해 쿠키를 삭제해야 합니다.
   */
  clearAuthCookies(): void {
    console.warn(
      "⚠️ clearAuthCookies()는 deprecated되었습니다. HttpOnly 쿠키는 JavaScript로 삭제할 수 없습니다. `logout()` 메서드를 사용하세요.",
    );
    this.clearClientAuthData();
  }

  /**
   * 에러 메시지 파싱 (User 타입 기반 에러 처리 포함)
   */
  parseErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    if (typeof error === "object" && error !== null) {
      // API 에러 응답 구조 처리
      const apiError = error as any;
      if (apiError.message) {
        return apiError.message;
      }
      if (apiError.error) {
        return apiError.error;
      }
      // User 관련 특정 에러들
      if (apiError.code) {
        return this.getUserErrorMessage(apiError.code);
      }
    }
    return "알 수 없는 오류가 발생했습니다";
  }

  /**
   * User 관련 에러 코드를 사용자 친화적 메시지로 변환
   */
  private getUserErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      // 프로필 관련
      PROFILE_UPDATE_FAILED: "프로필 업데이트에 실패했습니다",
      INVALID_PROFILE_IMAGE: "유효하지 않은 프로필 이미지입니다",
      PROFILE_IMAGE_TOO_LARGE: "프로필 이미지 크기가 너무 큽니다",

      // 휴대폰 인증 관련
      PHONE_VERIFICATION_FAILED: "휴대폰 인증에 실패했습니다",
      INVALID_PHONE_NUMBER: "유효하지 않은 휴대폰 번호입니다",
      PHONE_CODE_EXPIRED: "인증 코드가 만료되었습니다",
      PHONE_CODE_INVALID: "잘못된 인증 코드입니다",
      PHONE_ALREADY_VERIFIED: "이미 인증된 휴대폰 번호입니다",

      // 계정 관련
      ACCOUNT_DELETE_FAILED: "계정 삭제에 실패했습니다",
      PASSWORD_CHANGE_FAILED: "비밀번호 변경에 실패했습니다",
      EMAIL_CHANGE_FAILED: "이메일 변경에 실패했습니다",
      EMAIL_ALREADY_EXISTS: "이미 사용 중인 이메일입니다",

      // 일반
      USER_NOT_FOUND: "사용자를 찾을 수 없습니다",
      UNAUTHORIZED: "권한이 없습니다",
      VALIDATION_ERROR: "입력 정보가 올바르지 않습니다",
    };

    return errorMessages[errorCode] || "알 수 없는 오류가 발생했습니다";
  }

  /**
   * [1단계] 이메일로 사용자 정보(마스킹된 휴대폰 번호) 조회
   */
  async findPassword(data: FindPasswordRequest): Promise<FindPasswordResponse> {
    return httpClient.post<FindPasswordResponse>("/auth/password/find", data);
  }

  /**
   * [2단계] 인증 코드 발송 요청
   */
  async sendPasswordCode(data: SendPasswordCodeRequest): Promise<void> {
    return httpClient.post<void>("/auth/password/send-code", data);
  }

  /**
   * [3단계] 인증 코드 검증 및 리셋 토큰 발급
   */
  async verifyPasswordCode(
    data: VerifyPasswordCodeRequest,
  ): Promise<VerifyPasswordCodeResponse> {
    return httpClient.post<VerifyPasswordCodeResponse>(
      "/auth/password/verify-code",
      data,
    );
  }

  /**
   * [4단계] 리셋 토큰을 이용한 비밀번호 재설정
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    // PATCH 메서드 사용
    return httpClient.patch<void>("/auth/password/reset", data);
  }

  /**
   * 사용자 정보 유효성 검증 (클라이언트 사이드)
   */
  validateUserData(user: Partial<User>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // 이메일 검증
    if (user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        errors.push("유효하지 않은 이메일 형식입니다");
      }
    }

    // 이름 검증
    if (user.name !== undefined) {
      if (!user.name || user.name.trim().length < 2) {
        errors.push("이름은 2자 이상이어야 합니다");
      }
      if (user.name.length > 50) {
        errors.push("이름은 50자를 초과할 수 없습니다");
      }
    }

    // 프로필 이미지 URL 검증
    if (user.profileImage) {
      try {
        new URL(user.profileImage);
      } catch {
        errors.push("유효하지 않은 프로필 이미지 URL입니다");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 프로필 완성도 계산
   */
  calculateProfileCompleteness(user: User): {
    completeness: number;
    missingFields: string[];
    isComplete: boolean;
  } {
    const requiredFields = [
      { key: "name", label: "이름" },
      { key: "profileImage", label: "프로필 이미지" },
      { key: "phoneVerified", label: "휴대폰 인증" },
    ];

    const missingFields: string[] = [];

    requiredFields.forEach(({ key, label }) => {
      if (key === "phoneVerified") {
        if (!user.phoneVerified) {
          missingFields.push(label);
        }
      } else if (key === "profileImage") {
        if (!user.profileImage) {
          missingFields.push(label);
        }
      } else {
        if (!user[key as keyof User]) {
          missingFields.push(label);
        }
      }
    });

    const completeness = Math.round(
      ((requiredFields.length - missingFields.length) / requiredFields.length) *
        100,
    );

    return {
      completeness,
      missingFields,
      isComplete: missingFields.length === 0,
    };
  }
}

export const authService = new AuthService();
