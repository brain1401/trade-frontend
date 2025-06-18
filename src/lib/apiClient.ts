import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../stores/authStore";

/**
 * AI HS Code 레이더 시스템의 API 클라이언트 설정
 *
 * 이 모듈은 스프링부트 서버와의 모든 HTTP 통신을 담당하며,
 * Claude AI 분석, 관세청 API 연동, 사용자 인증 등의 기능을 제공함
 *
 * @module ApiClient
 * @since 1.0.0
 */

/**
 * 인증이 필요한 API 요청용 클라이언트 생성 함수
 *
 * 자동 토큰 추가, 토큰 갱신, 401 오류 처리 등의 기능을 포함한
 * axios 인스턴스를 생성함. 스프링부트 서버의 인증 체계와 완전 호환됨
 *
 * @function createApiClient
 * @returns {AxiosInstance} 설정된 axios 인스턴스
 *
 * @example
 * ```typescript
 * // 자동으로 Authorization 헤더가 추가됨
 * const response = await apiClient.get('/hscode/analyze');
 *
 * // 401 오류 시 자동으로 토큰 갱신 후 재시도
 * const result = await apiClient.post('/bookmarks', data);
 * ```
 *
 * @description
 * 주요 기능:
 * - 환경변수 기반 baseURL 자동 설정 (개발/프로덕션 환경 대응)
 * - 요청 시 JWT 토큰 자동 추가
 * - 401 응답 시 refresh token으로 자동 토큰 갱신
 * - 토큰 갱신 실패 시 자동 로그아웃 처리
 * - 10초 요청 타임아웃 설정
 */
const createApiClient = (): AxiosInstance => {
  const baseURL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  /**
   * 요청 인터셉터 - JWT 토큰 자동 추가
   *
   * 모든 API 요청에 Authorization 헤더를 자동으로 추가함
   * Zustand 스토어에서 실시간으로 토큰 상태를 가져와 설정
   */
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const { accessToken } = useAuthStore.getState();

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  /**
   * 응답 인터셉터 - 자동 토큰 갱신 및 오류 처리
   *
   * 401 Unauthorized 응답 시 refresh token을 사용하여
   * 자동으로 access token을 갱신하고 원래 요청을 재시도함
   * 토큰 갱신 실패 시 사용자를 자동으로 로그아웃 처리
   */
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // 401 오류이고 아직 재시도하지 않은 요청일 때
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const { refreshAccessToken, logout } = useAuthStore.getState();

        try {
          // 토큰 갱신 시도
          const success = await refreshAccessToken();

          if (success) {
            // 새로운 토큰으로 원래 요청 재시도
            const { accessToken } = useAuthStore.getState();
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return client(originalRequest);
          } else {
            // 토큰 갱신 실패 시 로그아웃
            logout();
            return Promise.reject(error);
          }
        } catch (refreshError) {
          // 토큰 갱신 중 오류 발생 시 로그아웃
          logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return client;
};

/**
 * 인증이 필요한 API 호출용 메인 클라이언트
 *
 * HS Code 분석, 화물 추적, 북마크 관리 등 대부분의 비즈니스 로직에서 사용됨
 * JWT 토큰 기반 인증이 자동으로 처리되며, 토큰 만료 시 자동 갱신됨
 *
 * @constant {AxiosInstance} apiClient
 *
 * @example
 * ```typescript
 * // HS Code 분석 요청
 * const analysisResult = await apiClient.post('/claude/analyze-hscode', {
 *   productDescription: '스마트폰',
 *   additionalInfo: '삼성 갤럭시'
 * });
 *
 * // 북마크 목록 조회
 * const bookmarks = await apiClient.get('/bookmarks');
 *
 * // 화물 추적 정보 조회
 * const trackingInfo = await apiClient.get(`/customs/cargo-progress/${cargoNumber}`);
 * ```
 */
export const apiClient = createApiClient();

/**
 * 인증이 필요하지 않은 공개 API 호출용 클라이언트
 *
 * 로그인, 회원가입, 토큰 갱신 등 인증 전후 상황에서 사용됨
 * Authorization 헤더가 자동으로 추가되지 않으며,
 * 토큰 관련 인터셉터도 적용되지 않음
 *
 * @constant {AxiosInstance} publicApiClient
 *
 * @example
 * ```typescript
 * // 사용자 로그인
 * const loginResponse = await publicApiClient.post('/auth/login', {
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 *
 * // 회원가입
 * const signupResponse = await publicApiClient.post('/auth/signup', userData);
 *
 * // 토큰 갱신 (refresh token 사용)
 * const refreshResponse = await publicApiClient.post('/auth/refresh', {
 *   refreshToken
 * });
 * ```
 */
export const publicApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 스프링부트 서버의 표준 API 응답 타입
 *
 * 모든 API 응답은 이 형태로 통일되며, 성공/실패 여부,
 * 실제 데이터, 메시지, 오류 정보, 타임스탬프를 포함함
 *
 * @template T - 실제 응답 데이터의 타입
 *
 * @typedef {Object} ApiResponse
 * @property {boolean} success - 요청 성공 여부
 * @property {T} [data] - 성공 시 반환되는 실제 데이터
 * @property {string} [message] - 성공 시 메시지 (한국어)
 * @property {Object} [error] - 실패 시 오류 정보
 * @property {string} error.code - 오류 코드 (예: 'INVALID_HS_CODE')
 * @property {string} error.message - 사용자용 오류 메시지 (한국어)
 * @property {string} [error.details] - 상세 오류 정보 (개발자용)
 * @property {string} timestamp - 응답 생성 시각 (ISO 8601 형식)
 *
 * @example
 * ```typescript
 * // 성공 응답 예시
 * const successResponse: ApiResponse<HSCodeAnalysis> = {
 *   success: true,
 *   data: {
 *     hsCode: '8517.12.00',
 *     description: '휴대용 무선전화기',
 *     confidence: 0.95
 *   },
 *   message: 'HS Code 분석이 완료되었습니다',
 *   timestamp: '2025-01-15T10:30:00.000Z'
 * };
 *
 * // 실패 응답 예시
 * const errorResponse: ApiResponse<never> = {
 *   success: false,
 *   error: {
 *     code: 'ANALYSIS_FAILED',
 *     message: '제품 정보가 불충분합니다',
 *     details: 'Claude AI 분석을 위해 더 상세한 제품 설명이 필요합니다'
 *   },
 *   timestamp: '2025-01-15T10:30:00.000Z'
 * };
 * ```
 */
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  timestamp: string;
};

/**
 * 스프링부트 서버 API 엔드포인트 상수 정의
 *
 * 모든 API 경로를 중앙에서 관리하여 일관성을 보장하고
 * 경로 변경 시 한 곳에서만 수정할 수 있도록 함
 * 도메인별로 그룹화되어 있어 관련 API를 쉽게 찾을 수 있음
 *
 * @constant {Object} API_ENDPOINTS
 *
 * @property {Object} AUTH - 사용자 인증 관련 엔드포인트
 * @property {string} AUTH.LOGIN - 로그인 API 경로
 * @property {string} AUTH.REFRESH - 토큰 갱신 API 경로
 * @property {string} AUTH.LOGOUT - 로그아웃 API 경로
 * @property {string} AUTH.VALIDATE - 토큰 검증 API 경로
 * @property {string} AUTH.SIGNUP - 회원가입 API 경로
 *
 * @property {Object} CLAUDE - Claude AI 분석 관련 엔드포인트
 * @property {string} CLAUDE.ANALYZE_INTENT - 검색 의도 분석 API 경로
 * @property {string} CLAUDE.ANALYZE_HSCODE - HS Code 종합 분석 API 경로
 * @property {string} CLAUDE.GENERATE_QUESTIONS - 스마트 질문 생성 API 경로
 * @property {string} CLAUDE.UPLOAD_IMAGE - 제품 이미지 분석 API 경로
 * @property {string} CLAUDE.ANALYSIS_SESSION - 분석 세션 조회 API 경로
 *
 * @property {Object} CUSTOMS - 관세청 연동 관련 엔드포인트
 * @property {string} CUSTOMS.CARGO_PROGRESS - 화물 진행정보 조회 API 경로
 * @property {string} CUSTOMS.TRADE_STATISTICS - 무역통계 조회 API 경로
 * @property {string} CUSTOMS.EXCHANGE_RATES - 환율정보 조회 API 경로
 *
 * @property {Object} BOOKMARKS - 북마크 관리 관련 엔드포인트
 * @property {string} BOOKMARKS.LIST - 북마크 목록 조회 API 경로
 * @property {string} BOOKMARKS.CREATE - 북마크 생성 API 경로
 * @property {string} BOOKMARKS.UPDATE - 북마크 수정 API 경로
 * @property {string} BOOKMARKS.DELETE - 북마크 삭제 API 경로
 *
 * @property {Object} NOTIFICATIONS - 알림 관리 관련 엔드포인트
 * @property {string} NOTIFICATIONS.LIST - 알림 목록 조회 API 경로
 * @property {string} NOTIFICATIONS.MARK_READ - 알림 읽음 처리 API 경로
 * @property {string} NOTIFICATIONS.SETTINGS - 알림 설정 관리 API 경로
 *
 * @example
 * ```typescript
 * // HS Code 분석 요청
 * const response = await apiClient.post(API_ENDPOINTS.CLAUDE.ANALYZE_HSCODE, data);
 *
 * // 화물 추적 정보 조회
 * const trackingData = await apiClient.get(
 *   `${API_ENDPOINTS.CUSTOMS.CARGO_PROGRESS}/${cargoNumber}`
 * );
 *
 * // 북마크 생성
 * const bookmark = await apiClient.post(API_ENDPOINTS.BOOKMARKS.CREATE, {
 *   type: 'HSCODE',
 *   hsCode: '8517.12.00',
 *   title: '스마트폰 분석 결과'
 * });
 * ```
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    VALIDATE: "/auth/validate",
    SIGNUP: "/auth/signup",
  },
  CLAUDE: {
    ANALYZE_INTENT: "/claude/analyze-intent",
    ANALYZE_HSCODE: "/claude/analyze-hscode",
    GENERATE_QUESTIONS: "/claude/generate-questions",
    UPLOAD_IMAGE: "/claude/upload-image",
    ANALYSIS_SESSION: "/claude/analysis-session",
  },
  CUSTOMS: {
    CARGO_PROGRESS: "/customs/cargo-progress",
    TRADE_STATISTICS: "/customs/trade-statistics",
    EXCHANGE_RATES: "/customs/exchange-rates",
  },
  BOOKMARKS: {
    LIST: "/bookmarks",
    CREATE: "/bookmarks",
    UPDATE: "/bookmarks",
    DELETE: "/bookmarks",
  },
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: "/notifications/read",
    SETTINGS: "/notifications/settings",
  },
} as const;
