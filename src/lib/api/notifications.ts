/**
 * 알림 시스템 관련 API 함수 모음
 *
 * 브라우저 푸시 알림 및 이메일 알림 관리 기능 제공
 * 북마크 모니터링과 연동하여 실시간 변동사항 알림 지원
 *
 * @module NotificationsApi
 * @since 1.0.0
 */

import { apiClient, type ApiResponse, API_ENDPOINTS } from "./client";

/**
 * 알림 타입 정의
 */
export type NotificationType =
  | "HSCODE_UPDATE"
  | "CARGO_UPDATE"
  | "SYSTEM"
  | "REGULATION_CHANGE";

/**
 * 알림 우선순위 정의
 */
export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

/**
 * 알림 응답 데이터 타입
 */
export type NotificationResponse = {
  /** 알림 ID */
  id: string;
  /** 알림 타입 */
  type: NotificationType;
  /** 우선순위 */
  priority: NotificationPriority;
  /** 알림 제목 */
  title: string;
  /** 알림 내용 */
  message: string;
  /** 읽음 여부 */
  isRead: boolean;
  /** 관련 북마크 ID */
  bookmarkId?: string;
  /** 관련 데이터 */
  relatedData?: {
    hsCode?: string;
    cargoNumber?: string;
    sessionId?: string;
    changeType?: string;
  };
  /** 생성일시 */
  createdAt: string;
  /** 읽음 처리 일시 */
  readAt?: string;
  /** 만료일시 */
  expiresAt?: string;
};

/**
 * 알림 목록 조회 파라미터 타입
 */
export type GetNotificationsParams = {
  /** 페이지 번호 */
  page?: number;
  /** 페이지 크기 */
  size?: number;
  /** 알림 타입 필터 */
  type?: NotificationType;
  /** 읽음 여부 필터 */
  isRead?: boolean;
  /** 우선순위 필터 */
  priority?: NotificationPriority;
  /** 시작일 필터 */
  startDate?: string;
  /** 종료일 필터 */
  endDate?: string;
};

/**
 * 알림 목록 응답 타입
 */
export type NotificationsListResponse = {
  /** 알림 목록 */
  notifications: NotificationResponse[];
  /** 읽지 않은 알림 수 */
  unreadCount: number;
  /** 페이지네이션 정보 */
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};

/**
 * 알림 설정 타입
 */
export type NotificationSettings = {
  /** 브라우저 푸시 알림 활성화 */
  pushEnabled: boolean;
  /** 이메일 알림 활성화 */
  emailEnabled: boolean;
  /** 알림 받을 타입들 */
  enabledTypes: NotificationType[];
  /** 최소 우선순위 */
  minPriority: NotificationPriority;
  /** 알림 시간 설정 */
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:mm 형식
    endTime: string; // HH:mm 형식
  };
};

/**
 * 푸시 구독 요청 타입
 */
export type PushSubscriptionRequest = {
  /** 푸시 구독 정보 */
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
  /** 사용자 에이전트 정보 */
  userAgent?: string;
};

/**
 * 알림 목록 조회 API 함수
 *
 * @param params - 조회 파라미터
 * @returns 알림 목록 및 페이지네이션 정보
 *
 * @example
 * ```typescript
 * const result = await getNotifications({
 *   page: 1,
 *   size: 20,
 *   isRead: false,
 *   type: "HSCODE_UPDATE"
 * });
 *
 * if (result.success) {
 *   console.log(`읽지 않은 알림 ${result.data.unreadCount}개`);
 * }
 * ```
 */
export const getNotifications = async (
  params?: GetNotificationsParams,
): Promise<ApiResponse<NotificationsListResponse>> => {
  const queryString = params
    ? new URLSearchParams(params as any).toString()
    : "";
  const url = queryString
    ? `${API_ENDPOINTS.NOTIFICATIONS.LIST}?${queryString}`
    : API_ENDPOINTS.NOTIFICATIONS.LIST;

  const response =
    await apiClient.get<ApiResponse<NotificationsListResponse>>(url);
  return response.data;
};

/**
 * 알림 읽음 처리 API 함수
 *
 * @param notificationIds - 읽음 처리할 알림 ID 목록
 * @returns 처리 결과
 *
 * @example
 * ```typescript
 * const result = await markNotificationsAsRead(["notif_1", "notif_2"]);
 * if (result.success) {
 *   console.log("알림이 읽음 처리되었습니다");
 * }
 * ```
 */
export const markNotificationsAsRead = async (
  notificationIds: string[],
): Promise<ApiResponse<{ markedCount: number }>> => {
  const response = await apiClient.post<ApiResponse<{ markedCount: number }>>(
    API_ENDPOINTS.NOTIFICATIONS.MARK_READ,
    { notificationIds },
  );
  return response.data;
};

/**
 * 모든 알림 읽음 처리 API 함수
 *
 * @returns 처리 결과
 *
 * @example
 * ```typescript
 * const result = await markAllNotificationsAsRead();
 * if (result.success) {
 *   console.log(`${result.data.markedCount}개 알림이 읽음 처리되었습니다`);
 * }
 * ```
 */
export const markAllNotificationsAsRead = async (): Promise<
  ApiResponse<{ markedCount: number }>
> => {
  const response = await apiClient.post<ApiResponse<{ markedCount: number }>>(
    `${API_ENDPOINTS.NOTIFICATIONS.MARK_READ}/all`,
  );
  return response.data;
};

/**
 * 알림 설정 조회 API 함수
 *
 * @returns 현재 알림 설정
 *
 * @example
 * ```typescript
 * const result = await getNotificationSettings();
 * if (result.success) {
 *   console.log("푸시 알림:", result.data.pushEnabled);
 *   console.log("이메일 알림:", result.data.emailEnabled);
 * }
 * ```
 */
export const getNotificationSettings = async (): Promise<
  ApiResponse<NotificationSettings>
> => {
  const response = await apiClient.get<ApiResponse<NotificationSettings>>(
    API_ENDPOINTS.NOTIFICATIONS.SETTINGS,
  );
  return response.data;
};

/**
 * 알림 설정 업데이트 API 함수
 *
 * @param settings - 업데이트할 설정
 * @returns 업데이트된 설정
 *
 * @example
 * ```typescript
 * const result = await updateNotificationSettings({
 *   pushEnabled: true,
 *   emailEnabled: false,
 *   enabledTypes: ["HSCODE_UPDATE", "CARGO_UPDATE"],
 *   minPriority: "MEDIUM",
 *   quietHours: {
 *     enabled: true,
 *     startTime: "22:00",
 *     endTime: "08:00"
 *   }
 * });
 * ```
 */
export const updateNotificationSettings = async (
  settings: Partial<NotificationSettings>,
): Promise<ApiResponse<NotificationSettings>> => {
  const response = await apiClient.put<ApiResponse<NotificationSettings>>(
    API_ENDPOINTS.NOTIFICATIONS.SETTINGS,
    settings,
  );
  return response.data;
};

/**
 * 푸시 알림 구독 등록 API 함수
 *
 * @param subscriptionData - 푸시 구독 정보
 * @returns 구독 등록 결과
 *
 * @example
 * ```typescript
 * // 브라우저에서 푸시 권한 요청 후
 * const subscription = await registration.pushManager.subscribe(options);
 *
 * const result = await subscribeToPushNotifications({
 *   subscription: {
 *     endpoint: subscription.endpoint,
 *     keys: {
 *       p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
 *       auth: arrayBufferToBase64(subscription.getKey('auth'))
 *     }
 *   }
 * });
 * ```
 */
export const subscribeToPushNotifications = async (
  subscriptionData: PushSubscriptionRequest,
): Promise<ApiResponse<{ subscriptionId: string }>> => {
  const response = await apiClient.post<
    ApiResponse<{ subscriptionId: string }>
  >(
    `${API_ENDPOINTS.NOTIFICATIONS.SETTINGS}/push-subscription`,
    subscriptionData,
  );
  return response.data;
};

/**
 * 푸시 알림 구독 해제 API 함수
 *
 * @returns 구독 해제 결과
 *
 * @example
 * ```typescript
 * const result = await unsubscribeFromPushNotifications();
 * if (result.success) {
 *   console.log("푸시 알림 구독이 해제되었습니다");
 * }
 * ```
 */
export const unsubscribeFromPushNotifications = async (): Promise<
  ApiResponse<null>
> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    `${API_ENDPOINTS.NOTIFICATIONS.SETTINGS}/push-subscription`,
  );
  return response.data;
};

/**
 * 알림 삭제 API 함수
 *
 * @param notificationIds - 삭제할 알림 ID 목록
 * @returns 삭제 결과
 *
 * @example
 * ```typescript
 * const result = await deleteNotifications(["notif_1", "notif_2"]);
 * if (result.success) {
 *   console.log(`${result.data.deletedCount}개 알림이 삭제되었습니다`);
 * }
 * ```
 */
export const deleteNotifications = async (
  notificationIds: string[],
): Promise<ApiResponse<{ deletedCount: number }>> => {
  const response = await apiClient.delete<
    ApiResponse<{ deletedCount: number }>
  >(API_ENDPOINTS.NOTIFICATIONS.LIST, { data: { notificationIds } });
  return response.data;
};

/**
 * 테스트 알림 발송 API 함수
 *
 * @param type - 테스트할 알림 타입
 * @returns 테스트 발송 결과
 *
 * @example
 * ```typescript
 * const result = await sendTestNotification("HSCODE_UPDATE");
 * if (result.success) {
 *   console.log("테스트 알림이 발송되었습니다");
 * }
 * ```
 */
export const sendTestNotification = async (
  type: NotificationType,
): Promise<ApiResponse<null>> => {
  const response = await apiClient.post<ApiResponse<null>>(
    `${API_ENDPOINTS.NOTIFICATIONS.SETTINGS}/test`,
    { type },
  );
  return response.data;
};
