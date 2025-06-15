// 한국어 에러 메시지 상수

// 네트워크 관련 에러
export const NETWORK_ERRORS = {
  NETWORK_ERROR: "네트워크 연결을 확인해 주세요",
  TIMEOUT: "요청 시간이 초과되었습니다. 다시 시도해 주세요",
  CONNECTION_FAILED: "서버 연결에 실패했습니다",
  RETRY_EXCEEDED: "재시도 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요",
} as const;

// 인증 관련 에러
export const AUTH_ERRORS = {
  UNAUTHORIZED: "로그인이 필요합니다",
  FORBIDDEN: "접근 권한이 없습니다",
  SESSION_EXPIRED: "세션이 만료되었습니다. 다시 로그인해 주세요",
  INVALID_TOKEN: "인증 토큰이 유효하지 않습니다",
  LOGIN_FAILED: "로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요",
  REGISTRATION_FAILED: "회원가입에 실패했습니다",
  PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다",
  WEAK_PASSWORD:
    "비밀번호는 8자 이상이어야 하며, 영문, 숫자, 특수문자를 포함해야 합니다",
  EMAIL_EXISTS: "이미 등록된 이메일 주소입니다",
  EMAIL_INVALID: "올바른 이메일 주소를 입력해 주세요",
} as const;

// 검증 관련 에러
export const VALIDATION_ERRORS = {
  REQUIRED_FIELD: "필수 항목입니다",
  INVALID_FORMAT: "입력하신 정보를 다시 확인해 주세요",
  INVALID_EMAIL: "올바른 이메일 형식으로 입력해 주세요",
  INVALID_PHONE: "올바른 전화번호 형식으로 입력해 주세요",
  INVALID_DATE: "올바른 날짜를 선택해 주세요",
  FILE_TOO_LARGE: "파일 크기가 너무 큽니다. 10MB 이하의 파일을 선택해 주세요",
  UNSUPPORTED_FILE_TYPE: "지원하지 않는 파일 형식입니다",
  INVALID_HS_CODE: "올바른 HS Code 형식을 입력해 주세요 (예: 8517.12.00)",
  INVALID_CARGO_NUMBER: "올바른 화물관리번호를 입력해 주세요",
} as const;

// HS Code 분석 관련 에러
export const HSCODE_ERRORS = {
  ANALYSIS_FAILED: "HS Code 분석 중 오류가 발생했습니다. 다시 시도해 주세요",
  INSUFFICIENT_INFO:
    "분석을 위한 정보가 부족합니다. 제품에 대한 자세한 설명을 입력해 주세요",
  IMAGE_ANALYSIS_FAILED:
    "이미지 분석 중 오류가 발생했습니다. 다른 이미지로 시도해 주세요",
  CLASSIFICATION_ERROR: "HS Code 분류 중 오류가 발생했습니다",
  SESSION_NOT_FOUND:
    "분석 세션을 찾을 수 없습니다. 새로운 분석을 시작해 주세요",
  QUESTION_SUBMIT_FAILED: "답변 제출 중 오류가 발생했습니다",
  CONTEXT_LOST: "분석 컨텍스트가 손실되었습니다. 처음부터 다시 시작해 주세요",
} as const;

// 화물 추적 관련 에러
export const TRACKING_ERRORS = {
  CARGO_NOT_FOUND: "화물 정보를 찾을 수 없습니다. 화물관리번호를 확인해 주세요",
  INVALID_CARGO_NUMBER: "올바른 화물관리번호 형식을 입력해 주세요",
  TRACKING_UNAVAILABLE: "현재 화물 추적 서비스를 이용할 수 없습니다",
  STATUS_UPDATE_FAILED: "화물 상태 업데이트에 실패했습니다",
} as const;

// 검색 관련 에러
export const SEARCH_ERRORS = {
  SEARCH_FAILED: "검색 중 오류가 발생했습니다",
  NO_RESULTS: "검색 결과가 없습니다. 다른 키워드로 검색해 보세요",
  INTENT_DETECTION_FAILED:
    "검색 의도를 파악할 수 없습니다. 좀 더 구체적으로 검색해 주세요",
  QUERY_TOO_SHORT: "검색어가 너무 짧습니다. 2자 이상 입력해 주세요",
  FILTER_ERROR: "검색 필터 적용 중 오류가 발생했습니다",
} as const;

// 북마크 및 모니터링 관련 에러
export const BOOKMARK_ERRORS = {
  BOOKMARK_FAILED: "북마크 저장에 실패했습니다",
  BOOKMARK_NOT_FOUND: "북마크를 찾을 수 없습니다",
  MONITORING_SETUP_FAILED: "모니터링 설정에 실패했습니다",
  ALERT_SEND_FAILED: "알림 전송에 실패했습니다",
  DUPLICATE_BOOKMARK: "이미 북마크에 추가된 항목입니다",
} as const;

// 뉴스 관련 에러
export const NEWS_ERRORS = {
  NEWS_LOAD_FAILED: "뉴스를 불러오는 중 오류가 발생했습니다",
  NEWS_NOT_FOUND: "요청하신 뉴스를 찾을 수 없습니다",
  SUMMARY_FAILED: "뉴스 요약 중 오류가 발생했습니다",
  SUBSCRIPTION_FAILED: "뉴스 구독 설정에 실패했습니다",
} as const;

// 무역 정보 관련 에러
export const TRADE_ERRORS = {
  REGULATION_SEARCH_FAILED: "규제 정보 검색 중 오류가 발생했습니다",
  EXCHANGE_RATE_FAILED: "환율 정보를 가져오는 중 오류가 발생했습니다",
  STATISTICS_FAILED: "무역 통계를 불러오는 중 오류가 발생했습니다",
  DATA_EXPORT_FAILED: "데이터 내보내기에 실패했습니다",
} as const;

// AI 관련 에러
export const AI_ERRORS = {
  AI_ANALYSIS_ERROR: "AI 분석 중 오류가 발생했습니다. 다시 시도해 주세요",
  INTENT_DETECTION_ERROR: "의도 감지 중 오류가 발생했습니다",
  IMAGE_ANALYSIS_ERROR: "이미지 분석 중 오류가 발생했습니다",
  SMART_QUESTIONS_ERROR: "추가 질문 생성 중 오류가 발생했습니다",
  SOURCE_VERIFICATION_ERROR: "출처 확인 중 오류가 발생했습니다",
  NEWS_SUMMARY_ERROR: "뉴스 요약 중 오류가 발생했습니다",
  BUSINESS_IMPACT_ERROR: "비즈니스 영향 분석 중 오류가 발생했습니다",
  FEEDBACK_SUBMIT_ERROR: "피드백 전송 중 오류가 발생했습니다",
  SESSION_RESUME_ERROR: "세션 복구 중 오류가 발생했습니다",
  AI_SERVICE_UNAVAILABLE: "AI 서비스를 일시적으로 이용할 수 없습니다",
  TOKEN_LIMIT_EXCEEDED:
    "AI 처리 한도를 초과했습니다. 잠시 후 다시 시도해 주세요",
} as const;

// 서버 관련 에러
export const SERVER_ERRORS = {
  INTERNAL_ERROR: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요",
  SERVICE_UNAVAILABLE: "서비스를 일시적으로 이용할 수 없습니다",
  MAINTENANCE: "서비스 점검 중입니다. 잠시 후 다시 이용해 주세요",
  RATE_LIMIT_EXCEEDED: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요",
  DATABASE_ERROR: "데이터베이스 오류가 발생했습니다",
} as const;

// WebSocket 관련 에러
export const WEBSOCKET_ERRORS = {
  CONNECTION_FAILED: "실시간 연결에 실패했습니다",
  CONNECTION_LOST: "실시간 연결이 끊어졌습니다. 다시 연결하는 중입니다",
  RECONNECT_FAILED: "재연결에 실패했습니다",
  MESSAGE_SEND_FAILED: "메시지 전송에 실패했습니다",
  SUBSCRIPTION_FAILED: "실시간 알림 구독에 실패했습니다",
} as const;

// 파일 업로드 관련 에러
export const FILE_ERRORS = {
  UPLOAD_FAILED: "파일 업로드에 실패했습니다",
  FILE_TOO_LARGE: "파일 크기가 너무 큽니다. 10MB 이하의 파일을 선택해 주세요",
  INVALID_FILE_TYPE: "지원하지 않는 파일 형식입니다",
  FILE_CORRUPTED: "파일이 손상되었습니다. 다른 파일을 선택해 주세요",
} as const;

// 모든 에러 타입의 유니온 타입
export type ErrorType =
  | keyof typeof NETWORK_ERRORS
  | keyof typeof AUTH_ERRORS
  | keyof typeof VALIDATION_ERRORS
  | keyof typeof HSCODE_ERRORS
  | keyof typeof TRACKING_ERRORS
  | keyof typeof SEARCH_ERRORS
  | keyof typeof BOOKMARK_ERRORS
  | keyof typeof NEWS_ERRORS
  | keyof typeof TRADE_ERRORS
  | keyof typeof AI_ERRORS
  | keyof typeof SERVER_ERRORS
  | keyof typeof WEBSOCKET_ERRORS
  | keyof typeof FILE_ERRORS;

// 에러 메시지 조회 함수
export function getErrorMessage(errorType: ErrorType | string): string {
  // 모든 에러 메시지를 하나의 객체로 합침
  const allErrors = {
    ...NETWORK_ERRORS,
    ...AUTH_ERRORS,
    ...VALIDATION_ERRORS,
    ...HSCODE_ERRORS,
    ...TRACKING_ERRORS,
    ...SEARCH_ERRORS,
    ...BOOKMARK_ERRORS,
    ...NEWS_ERRORS,
    ...TRADE_ERRORS,
    ...AI_ERRORS,
    ...SERVER_ERRORS,
    ...WEBSOCKET_ERRORS,
    ...FILE_ERRORS,
  };

  return (
    allErrors[errorType as keyof typeof allErrors] ||
    "알 수 없는 오류가 발생했습니다"
  );
}

// 상황별 사용자 가이드 메시지
export const USER_GUIDE_MESSAGES = {
  // HS Code 분석
  HSCODE_ANALYSIS_GUIDE:
    "제품명, 재질, 용도, 크기 등을 자세히 설명해 주시면 더 정확한 분석이 가능합니다",
  IMAGE_UPLOAD_GUIDE: "제품이 명확히 보이는 고화질 이미지를 업로드해 주세요",

  // 화물 추적
  CARGO_NUMBER_GUIDE:
    "화물관리번호는 영문 4자리 + 숫자 8자리 형식입니다 (예: ABCD12345678)",

  // 검색
  SEARCH_GUIDE: "HS Code, 제품명, 규제 내용 등으로 검색하실 수 있습니다",

  // 북마크
  BOOKMARK_GUIDE:
    "관심 있는 HS Code나 뉴스를 북마크하여 변경사항을 실시간으로 받아보세요",

  // 모니터링
  MONITORING_GUIDE:
    "규제 변경, 관세율 변동, 관련 뉴스 등을 자동으로 알려드립니다",
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  ANALYSIS_COMPLETED: "HS Code 분석이 완료되었습니다",
  BOOKMARK_SAVED: "북마크에 저장되었습니다",
  MONITORING_ENABLED: "모니터링이 설정되었습니다",
  FEEDBACK_SUBMITTED: "소중한 의견 감사합니다",
  FILE_UPLOADED: "파일이 성공적으로 업로드되었습니다",
  SETTINGS_SAVED: "설정이 저장되었습니다",
  EMAIL_SENT: "이메일이 전송되었습니다",
  SUBSCRIPTION_UPDATED: "구독 설정이 업데이트되었습니다",
} as const;

// 로딩 메시지
export const LOADING_MESSAGES = {
  ANALYZING: "AI가 분석 중입니다...",
  SEARCHING: "검색 중입니다...",
  UPLOADING: "파일을 업로드하는 중입니다...",
  LOADING_DATA: "데이터를 불러오는 중입니다...",
  CONNECTING: "연결 중입니다...",
  PROCESSING: "처리 중입니다...",
  GENERATING_QUESTIONS: "추가 질문을 생성하는 중입니다...",
  VERIFYING_SOURCE: "출처를 확인하는 중입니다...",
} as const;
