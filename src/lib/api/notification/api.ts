import type { Notification } from "@/types/notification";
import { httpClient, rawHttpClient } from "../common/httpClient";
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
} from "@/lib/api/bookmark/types";
import type { ApiResponse } from "@/types/common";

export const notificationApi = {
  /**
   * 모든 알림 조회
   * @returns 알림 목록
   */
  getNotifications(): Promise<Notification[]> {
    return httpClient.get<Notification[]>("/notifications");
  },

  /**
   * 특정 알림을 읽음으로 표시
   * @param notificationId 읽음 처리할 알림 ID
   * @returns 성공 여부
   */
  markNotificationAsRead(notificationId: string): Promise<void> {
    return httpClient.put<void>(`/notifications/${notificationId}/read`);
  },

  /**
   * 모든 알림을 읽음으로 표시
   * @returns 성공 여부
   */
  markAllNotificationsAsRead(): Promise<void> {
    return httpClient.put<void>("/notifications/read-all");
  },

  /**
   * SMS 인증 코드 발송
   */
  sendPhoneVerification(
    request: SmsVerificationSendRequest,
  ): Promise<ApiResponse<SmsVerificationSendResponse>> {
    return rawHttpClient.post<
      SmsVerificationSendResponse,
      SmsVerificationSendRequest
    >("/notification/phone/send", request);
  },

  /**
   * SMS 인증 코드 검증
   */
  verifyPhoneCode(
    request: SmsVerificationVerifyRequest,
  ): Promise<ApiResponse<SmsVerificationVerifyResponse>> {
    return rawHttpClient.post<
      SmsVerificationVerifyResponse,
      SmsVerificationVerifyRequest
    >("/notification/phone/verify", request);
  },

  /**
   * 알림 설정 조회
   */
  getNotificationSettings(): Promise<ApiResponse<SmsSettingsResponse>> {
    return rawHttpClient.get<SmsSettingsResponse>("/notification/settings");
  },

  /**
   * 알림 설정 업데이트
   */
  updateNotificationSettings(
    settings: SmsSettingsUpdateRequest,
  ): Promise<ApiResponse<SmsSettingsResponse>> {
    return rawHttpClient.post<SmsSettingsResponse, SmsSettingsUpdateRequest>(
      "/notification/settings",
      settings,
    );
  },

  /**
   * 북마크 알림 설정 업데이트
   */
  updateBookmarkNotification(
    bookmarkId: string,
    settings: UpdateBookmarkNotificationSettingsV61,
  ): Promise<ApiResponse<UpdateBookmarkNotificationResponseV61>> {
    return rawHttpClient.put<
      UpdateBookmarkNotificationResponseV61,
      UpdateBookmarkNotificationSettingsV61
    >(`/bookmarks/${bookmarkId}/notifications`, settings);
  },
};
