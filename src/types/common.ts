/**
 * 공통 API 응답 타입 정의 (API v2.4)
 *
 * 모든 API 요청에 대한 표준화된 응답 형태를 정의합니다.
 */

/**
 * API 응답 래퍼 타입
 *
 * 모든 API 요청에 대한 표준화된 응답 형태를 정의합니다.
 * success 필드로 성공/실패를 구분하고, message로 응답 메시지를 전달합니다.
 *
 * @template T - 실제 응답 데이터의 타입
 */
export type ApiResponse<T> = {
  /** 응답 성공 여부 */
  success: "SUCCESS" | "ERROR";
  /** 응답 메시지 */
  message: string;
  /** 실제 응답 데이터 (실패시 null) */
  data: T | null;
  /** 에러 코드 (에러 발생시) */
  errorCode?: string;
};

/**
 * API 에러 코드 타입 (API v2.4)
 *
 * 총 39개의 포괄적 에러 코드를 지원합니다.
 */
export type ApiErrorCode =
  // 공통 에러 (COMMON_xxx)
  | "COMMON_001" // 필수 입력 정보가 누락되었습니다
  | "COMMON_002" // 서버에서 오류가 발생했습니다
  | "COMMON_003" // 잘못된 요청 형식입니다
  | "COMMON_004" // 요청 파라미터가 올바르지 않습니다

  // 인증 관련 에러 (AUTH_xxx)
  | "AUTH_001" // 이메일 또는 비밀번호가 올바르지 않습니다
  | "AUTH_002" // 현재 계정에 일시적인 접근 제한이 적용되었습니다
  | "AUTH_003" // 인증이 만료되었습니다
  | "AUTH_004" // 인증 정보가 올바르지 않습니다

  // 사용자 관련 에러 (USER_xxx)
  | "USER_001" // 이미 사용 중인 이메일입니다
  | "USER_002" // 입력 정보가 올바르지 않습니다
  | "USER_003" // 사용자를 찾을 수 없습니다
  | "USER_004" // 비밀번호가 정책에 맞지 않습니다

  // OAuth 관련 에러 (OAUTH_xxx)
  | "OAUTH_001" // 지원하지 않는 OAuth 제공자입니다
  | "OAUTH_002" // 소셜 로그인에 실패했습니다
  | "OAUTH_003" // 사용자가 인증을 취소했습니다

  // 검색 관련 에러 (SEARCH_xxx)
  | "SEARCH_001" // 검색어가 비어있습니다
  | "SEARCH_002" // 검색 결과를 찾을 수 없습니다
  | "SEARCH_003" // 분석 중 오류가 발생했습니다
  | "SEARCH_004" // 검색 서비스에 연결할 수 없습니다
  | "SEARCH_005" // 검색 요청이 너무 복잡합니다
  | "SEARCH_006" // 검색어는 2자 이상이어야 합니다
  | "SEARCH_007" // 분석할 수 없는 품목입니다
  | "SEARCH_008" // 조회할 수 없는 주제입니다

  // 북마크 관련 에러 (BOOKMARK_xxx)
  | "BOOKMARK_001" // 북마크를 찾을 수 없습니다
  | "BOOKMARK_002" // 이미 북마크에 추가된 항목입니다
  | "BOOKMARK_003" // 북마크 한도를 초과했습니다
  | "BOOKMARK_004" // 북마크 삭제에 실패했습니다

  // 대시보드 관련 에러 (DASHBOARD_xxx)
  | "DASHBOARD_001" // 대시보드 데이터를 불러올 수 없습니다
  | "DASHBOARD_002" // 피드를 찾을 수 없습니다
  | "DASHBOARD_003" // 대시보드 설정 저장에 실패했습니다

  // 화물 추적 관련 에러 (CARGO_xxx)
  | "CARGO_001" // 올바르지 않은 화물번호 형식입니다
  | "CARGO_002" // 화물 정보를 찾을 수 없습니다
  | "CARGO_003" // 화물 추적 서비스에 연결할 수 없습니다

  // 외부 시스템 관련 에러 (EXTERNAL_xxx)
  | "EXTERNAL_001" // 외부 시스템에 연결할 수 없습니다
  | "EXTERNAL_002" // 외부 시스템 응답 시간이 초과되었습니다

  // 요청 제한 관련 에러 (RATE_LIMIT_xxx)
  | "RATE_LIMIT_001" // 로그인 시도 한도를 초과했습니다
  | "RATE_LIMIT_002" // 검색 요청 한도를 초과했습니다
  | "RATE_LIMIT_003" // API 호출 한도를 초과했습니다

  // 시스템 관련 에러 (SYSTEM_xxx)
  | "SYSTEM_001" // 현재 서비스가 과부하 상태입니다
  | "SYSTEM_002" // 시스템 점검 중입니다
  | "SYSTEM_003"; // 일시적인 서비스 장애가 발생했습니다

/**
 * HTTP 상태 코드 타입 (API v2.4)
 *
 * 17개 상황별 정확한 응답 코드를 지원합니다.
 */
export type HttpStatusCode =
  | 200 // OK - 성공
  | 201 // Created - 생성 성공
  | 202 // Accepted - 비동기 작업 시작
  | 204 // No Content - 성공 (응답 본문 없음)
  | 400 // Bad Request - 잘못된 요청
  | 401 // Unauthorized - 인증 필요/실패
  | 403 // Forbidden - 권한 없음
  | 404 // Not Found - 리소스 없음
  | 409 // Conflict - 충돌 (중복 등)
  | 410 // Gone - 리소스 만료
  | 422 // Unprocessable Entity - 요청 처리 불가
  | 423 // Locked - 리소스 잠김
  | 429 // Too Many Requests - 요청 한도 초과
  | 500 // Internal Server Error - 서버 오류
  | 502 // Bad Gateway - 외부 시스템 오류
  | 503 // Service Unavailable - 서비스 이용 불가
  | 504; // Gateway Timeout - 외부 시스템 타임아웃
