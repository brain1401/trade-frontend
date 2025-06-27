import type { ApiResponse } from "../../../types/common";
import type {
  SmsVerificationSendRequest,
  SmsVerificationSendResponse,
  SmsVerificationVerifyRequest,
  SmsVerificationVerifyResponse,
  SmsSettingsUpdateRequest,
  SmsSettingsResponse,
} from "./types";
import type {
  UpdateBookmarkNotificationSettingsV61,
  UpdateBookmarkNotificationResponseV61,
} from "../../../types/bookmark";
import { httpClient, ApiError } from "../common";

/**
 * 간단한 알림 API
 */
export const notificationApi = {
  async sendPhoneVerification(
    request: SmsVerificationSendRequest,
  ): Promise<ApiResponse<SmsVerificationSendResponse>> {
    return httpClient.postRaw<SmsVerificationSendResponse>(
      "/notification/phone/send",
      request,
    );
  },

  async verifyPhoneCode(
    request: SmsVerificationVerifyRequest,
  ): Promise<ApiResponse<SmsVerificationVerifyResponse>> {
    return httpClient.postRaw<SmsVerificationVerifyResponse>(
      "/notification/phone/verify",
      request,
    );
  },

  async getNotificationSettings(): Promise<ApiResponse<SmsSettingsResponse>> {
    return httpClient.getRaw<SmsSettingsResponse>("/notification/settings");
  },

  async updateNotificationSettings(
    settings: SmsSettingsUpdateRequest,
  ): Promise<ApiResponse<SmsSettingsResponse>> {
    return httpClient.postRaw<SmsSettingsResponse>(
      "/notification/settings",
      settings,
    );
  },

  async updateBookmarkNotification(
    bookmarkId: string,
    settings: UpdateBookmarkNotificationSettingsV61,
  ): Promise<ApiResponse<UpdateBookmarkNotificationResponseV61>> {
    return httpClient.putRaw<UpdateBookmarkNotificationResponseV61>(
      `/bookmarks/${bookmarkId}/notifications`,
      settings,
    );
  },

  /**
   * 에러 메시지 파싱
   */
  parseErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "알 수 없는 오류가 발생했습니다";
  },
};
