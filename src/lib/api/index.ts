/**
 * API 모듈 통합 인덱스 파일
 *
 * 모든 API 함수와 타입을 중앙에서 관리하고 export함
 * 스프링부트 서버와의 모든 통신을 추상화하여 일관된 인터페이스 제공
 *
 * @module ApiIndex
 * @since 1.0.0
 */

// 핵심 API 클라이언트 및 공통 타입
export {
  apiClient,
  publicApiClient,
  type ApiResponse,
  API_ENDPOINTS,
} from "./client";

// 인증 관련 API
export {
  loginUser,
  signupUser,
  refreshAccessToken,
  validateToken,
  logoutUser,
  type LoginRequest,
  type LoginResponse,
  type SignupRequest,
  type RefreshTokenRequest,
  type RefreshTokenResponse,
} from "./auth";

// Claude AI 분석 관련 API
export {
  analyzeSearchIntent,
  analyzeHSCode,
  generateSmartQuestions,
  uploadProductImage,
  getAnalysisSession,
  type IntentAnalysisRequest,
  type IntentAnalysisResponse,
  type HSCodeAnalysisRequest,
  type HSCodeAnalysisResponse,
  type SmartQuestionsResponse,
  type ImageUploadResponse,
} from "./claude";

// 관세청 API 연동
export {
  getCargoProgress,
  getTradeStatistics,
  getExchangeRates,
  getCargoTrackingHistory,
  type CargoProgressResponse,
  type TradeStatisticsRequest,
  type TradeStatisticsResponse,
  type ExchangeRateResponse,
} from "./customs";

// 북마크 관리 API
export {
  createBookmark,
  getBookmarks,
  getBookmarkDetail,
  updateBookmark,
  deleteBookmark,
  toggleBookmarkMonitoring,
  deleteBulkBookmarks,
  type BookmarkType,
  type CreateBookmarkRequest,
  type UpdateBookmarkRequest,
  type BookmarkResponse,
  type GetBookmarksParams,
  type BookmarksListResponse,
} from "./bookmarks";

// 알림 시스템 API
export {
  getNotifications,
  markNotificationsAsRead,
  markAllNotificationsAsRead,
  getNotificationSettings,
  updateNotificationSettings,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  deleteNotifications,
  sendTestNotification,
  type NotificationType,
  type NotificationPriority,
  type NotificationResponse,
  type GetNotificationsParams,
  type NotificationsListResponse,
  type NotificationSettings,
  type PushSubscriptionRequest,
} from "./notifications";

/**
 * 사용 예시:
 *
 * @example
 * ```typescript
 * // 개별 함수 import 방식
 * import { loginUser, analyzeHSCode, getCargoProgress } from "@/lib/api";
 *
 * // 사용
 * const loginResult = await loginUser({ email: "user@example.com", password: "password" });
 * const hsCodeResult = await analyzeHSCode({ productDescription: "스마트폰" });
 * const cargoResult = await getCargoProgress("24012345678901");
 * ```
 */
