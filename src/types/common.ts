/**
 * 공통 API 응답 타입 정의 (API v4.0)
 *
 * 모든 API 요청에 대한 표준화된 응답 형태를 정의합니다.
 */

/**
 * API 공통 응답 래퍼 타입 (API v4.0 표준)
 *
 * 모든 API 응답은 이 구조로 래핑되어 반환됩니다.
 */
export type ApiResponse<T> = {
  /** 요청 처리 결과 상태 */
  success: "SUCCESS" | "ERROR";
  /** 처리 결과 메시지 */
  message: string;
  /** 응답 데이터 (성공 시에만 존재) */
  data: T | null;
};

/**
 * API 에러 코드 타입 (API v4.0 - ChatGPT 스타일 통합)
 *
 * v4.0의 주요 변화: 채팅 및 SMS 에러 코드 추가
 */
export type ApiErrorCode =
  // 공통 에러 (COMMON_xxx)
  | "COMMON_001" // 필수 입력 정보가 누락되었습니다
  | "COMMON_002" // 서버에서 오류가 발생했습니다

  // 인증 관련 에러 (AUTH_xxx)
  | "AUTH_001" // 이메일 또는 비밀번호가 올바르지 않습니다
  | "AUTH_002" // 현재 계정에 일시적인 접근 제한이 적용되었습니다
  | "AUTH_003" // 인증이 만료되었습니다
  | "AUTH_004" // 인증 정보가 올바르지 않습니다
  | "AUTH_005" // 해당 리소스에 접근할 권한이 없습니다

  // 사용자 관련 에러 (USER_xxx)
  | "USER_001" // 이미 사용 중인 이메일입니다
  | "USER_002" // 입력 정보가 올바르지 않습니다
  | "USER_003" // 사용자를 찾을 수 없습니다
  | "USER_004" // 비밀번호가 정책에 맞지 않습니다

  // OAuth 관련 에러 (OAUTH_xxx)
  | "OAUTH_001" // 지원하지 않는 OAuth 제공자입니다
  | "OAUTH_002" // 소셜 로그인에 실패했습니다
  | "OAUTH_003" // 사용자가 인증을 취소했습니다

  // 🆕 SMS 관련 에러 (SMS_xxx) - v4.0 신규
  | "SMS_001" // 휴대폰 번호 형식이 올바르지 않습니다
  | "SMS_002" // 이미 인증된 휴대폰 번호입니다
  | "SMS_003" // 인증 코드 발송 한도를 초과했습니다
  | "SMS_004" // SMS 발송 서비스에 문제가 발생했습니다
  | "SMS_005" // 인증 코드가 올바르지 않습니다
  | "SMS_006" // 인증 코드가 만료되었습니다
  | "SMS_007" // 인증 세션을 찾을 수 없습니다
  | "SMS_008" // 인증 시도 횟수를 초과했습니다
  | "SMS_009" // 인증되지 않은 휴대폰 번호입니다
  | "SMS_010" // 다른 사용자가 사용 중인 번호입니다
  | "SMS_011" // 등록된 휴대폰 번호가 없습니다
  | "SMS_012" // 알림 설정 데이터가 올바르지 않습니다
  | "SMS_013" // 문자 알림 설정은 휴대폰 인증 후 가능합니다

  // 🆕 채팅 관련 에러 (CHAT_xxx) - v4.0 신규 (ChatGPT 스타일)
  | "CHAT_001" // 메시지가 비어있습니다
  | "CHAT_002" // 메시지는 2자 이상이어야 합니다
  | "CHAT_003" // 무역 관련 질문에만 답변합니다
  | "CHAT_004" // AI 분석 중 오류가 발생했습니다
  | "CHAT_005" // 세션 토큰이 필요합니다
  | "CHAT_006" // 세션 토큰이 만료되었습니다
  | "CHAT_007" // 채팅 작업을 찾을 수 없습니다
  | "CHAT_008" // 채팅 응답 생성이 실패했습니다

  // 북마크 관련 에러 (BOOKMARK_xxx)
  | "BOOKMARK_001" // 북마크를 찾을 수 없습니다
  | "BOOKMARK_002" // 이미 존재하는 북마크입니다
  | "BOOKMARK_003" // 북마크 데이터가 올바르지 않습니다
  | "BOOKMARK_004" // 북마크할 수 없는 대상입니다
  | "BOOKMARK_005" // 북마크 개수 한도를 초과했습니다

  // 피드 관련 에러 (FEED_xxx)
  | "FEED_001" // 피드를 찾을 수 없습니다

  // 외부 시스템 관련 에러 (EXTERNAL_xxx)
  | "EXTERNAL_001" // 외부 시스템 연결에 실패했습니다
  | "EXTERNAL_002" // 외부 시스템 응답 시간이 초과되었습니다

  // 요청 제한 관련 에러 (RATE_LIMIT_xxx)
  | "RATE_LIMIT_001" // 로그인 시도 한도를 초과했습니다
  | "RATE_LIMIT_002" // 채팅 요청 한도를 초과했습니다

  // 시스템 관련 에러 (SYSTEM_xxx)
  | "SYSTEM_001" // 현재 서비스가 과부하 상태입니다

  // 🗑️ v4.0에서 제거된 검색 관련 에러들 (SEARCH_xxx) - 채팅으로 통합됨
  // 레거시 호환성을 위해 유지하되, 실제로는 사용되지 않음
  | "SEARCH_001" // @deprecated 사용하지 않음 - CHAT_001로 대체
  | "SEARCH_002" // @deprecated 사용하지 않음 - CHAT_004로 대체
  | "SEARCH_003" // @deprecated 사용하지 않음 - CHAT_004로 대체
  | "SEARCH_004" // @deprecated 사용하지 않음 - EXTERNAL_001로 대체
  | "SEARCH_005" // @deprecated 사용하지 않음 - CHAT_002로 대체
  | "SEARCH_006" // @deprecated 사용하지 않음 - CHAT_002로 대체
  | "SEARCH_007" // @deprecated 사용하지 않음 - CHAT_003로 대체
  | "SEARCH_008"; // @deprecated 사용하지 않음 - CHAT_003로 대체

/**
 * HTTP 상태 코드 타입 (API v4.0에서 사용되는 코드들)
 */
export type HttpStatusCode =
  | 200 // OK
  | 201 // Created
  | 202 // Accepted
  | 204 // No Content
  | 302 // Found (OAuth 리디렉션)
  | 400 // Bad Request
  | 401 // Unauthorized
  | 403 // Forbidden
  | 404 // Not Found
  | 409 // Conflict
  | 410 // Gone (SMS 코드 만료)
  | 412 // Precondition Failed (북마크 동시 수정)
  | 422 // Unprocessable Entity
  | 423 // Locked
  | 429 // Too Many Requests
  | 500 // Internal Server Error
  | 502 // Bad Gateway
  | 503 // Service Unavailable
  | 504; // Gateway Timeout

/**
 * 기본 엔티티 속성
 */
export type BaseEntity = {
  /** 고유 식별자 */
  id: string | number;
  /** 생성 시간 (ISO 8601) */
  createdAt: string;
  /** 수정 시간 (ISO 8601) */
  updatedAt: string;
};

/**
 * 페이지네이션 메타데이터 (API v4.0 표준)
 */
export type PaginationMeta = {
  /** 현재 오프셋 */
  offset: number;
  /** 페이지 크기 */
  limit: number;
  /** 전체 항목 수 */
  total: number;
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  /** 이전 페이지 존재 여부 */
  hasPrevious?: boolean;
};

/**
 * 페이지네이션 응답 타입 (API v4.0 표준)
 */
export type PaginatedResponse<T> = {
  /** 데이터 배열 */
  content: T[];
  /** 페이지네이션 메타데이터 */
  pagination: PaginationMeta;
};

/**
 * 🆕 v4.0 신규: 중요도 레벨 타입
 */
export type ImportanceLevel = "HIGH" | "MEDIUM" | "LOW";

/**
 * 🆕 v4.0 신규: 일반적인 정렬 옵션
 */
export type SortOrder = "asc" | "desc";

/**
 * 🆕 v4.0 신규: 일반적인 필터 상태
 */
export type FilterStatus = "ALL" | "ACTIVE" | "INACTIVE";
