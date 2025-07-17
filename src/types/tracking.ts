/**
 * 화물 추적 API 관련 타입 정의 (API v2.4)
 *
 * Public API: 화물 추적은 로그인 없이 사용 가능
 */

/**
 * 화물 추적 상태 타입 (API v2.4 표준)
 */
export type CargoTrackingStatus =
  | "신고 접수" // 수입신고서 접수 완료
  | "서류 심사" // 제출 서류 심사 중
  | "검사 대기" // 물품 검사 대기
  | "검사 진행중" // 물품 검사 진행
  | "통관 진행중" // 통관 처리 중
  | "통관 완료" // 통관 완료
  | "반송" // 반송 처리
  | "보류"; // 처리 보류

/**
 * 화물 추적 단계 상태 타입
 */
export type StepStatus =
  | "완료" // 단계 완료
  | "진행중" // 현재 진행 중
  | "대기" // 대기 중
  | "실패"; // 단계 실패

/**
 * 화물 추적 단계 정보 타입
 */
export type CargoTrackingStep = {
  /** 단계명 */
  step: string;
  /** 단계 상태 */
  status: StepStatus;
  /** 처리 시간 (완료된 경우, ISO 8601) */
  timestamp: string | null;
  /** 단계 설명 */
  description: string;
  /** 담당 부서/기관 */
  department?: string;
  /** 예상 소요 시간 */
  estimatedDuration?: string;
};

/**
 * 화물 추적 정보 타입 (API v2.4 표준)
 */
export type CargoTrackingInfo = {
  /** 17자리 화물관리번호 */
  cargoNumber: string;
  /** 현재 전체 상태 */
  status: CargoTrackingStatus;
  /** 현재 진행 단계 */
  currentStep: string;
  /** 전체 진행률 (0-100) - API 명세서 요구사항 */
  progressPercentage: number;
  /** 단계별 진행 상황 */
  steps: CargoTrackingStep[];
  /** 예상 완료 시간 (ISO 8601) */
  estimatedCompletion: string | null;
  /** 추가 정보 */
  additionalInfo: {
    /** 신고 유형 */
    declarationType: string;
    /** 담당 세관 */
    customs: string;
    /** 신고업체 */
    declarer: string;
    /** 화물 종류 */
    cargoType?: string;
    /** 원산지 */
    origin?: string;
    /** 목적지 */
    destination?: string;
  };
  /** 특이사항/알림 */
  alerts?: CargoAlert[];
  /** 마지막 업데이트 시간 (ISO 8601) */
  lastUpdated: string;
};

/**
 * 화물 알림 정보 타입
 */
export type CargoAlert = {
  /** 알림 ID */
  id: string;
  /** 알림 타입 */
  type: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
  /** 알림 제목 */
  title: string;
  /** 알림 메시지 */
  message: string;
  /** 발생 시간 (ISO 8601) */
  timestamp: string;
  /** 조치 필요 여부 */
  actionRequired: boolean;
  /** 관련 연락처 */
  contact?: {
    department: string;
    phone: string;
    email?: string;
  };
};

/**
 * 화물 번호 유효성 검증 결과 타입
 */
export type CargoNumberValidation = {
  /** 유효성 여부 */
  isValid: boolean;
  /** 에러 메시지 (유효하지 않은 경우) */
  errorMessage?: string;
  /** 화물번호 형식 */
  format?: "17자리" | "기타";
};

/**
 * 화물 검색 필터 타입
 */
export type CargoSearchFilter = {
  /** 상태 필터 */
  status?: CargoTrackingStatus[];
  /** 날짜 범위 */
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  /** 세관 필터 */
  customs?: string[];
  /** 신고업체 필터 */
  declarer?: string;
};

/**
 * 화물 추적 히스토리 타입
 */
export type CargoTrackingHistory = {
  /** 히스토리 ID */
  id: string;
  /** 변경 시간 (ISO 8601) */
  timestamp: string;
  /** 이전 상태 */
  previousStatus: CargoTrackingStatus;
  /** 새로운 상태 */
  newStatus: CargoTrackingStatus;
  /** 변경 사유 */
  reason: string;
  /** 담당자 */
  officer?: string;
  /** 비고 */
  notes?: string;
};

/**
 * 화물 문서 정보 타입
 */
export type CargoDocument = {
  /** 문서 ID */
  id: string;
  /** 문서명 */
  name: string;
  /** 문서 타입 */
  type: "수입신고서" | "원산지증명서" | "포장명세서" | "상업송장" | "기타";
  /** 문서 상태 */
  status: "접수" | "심사중" | "승인" | "반려" | "보완요청";
  /** 제출 시간 (ISO 8601) */
  submittedAt: string;
  /** 파일 URL (있는 경우) */
  fileUrl?: string;
  /** 파일 크기 (bytes) */
  fileSize?: number;
  /** 비고 */
  notes?: string;
};

// 레거시 호환성을 위한 타입 (기존 코드와의 호환성 유지)
export type TrackingStatus = StepStatus;
export type TimelineStep = CargoTrackingStep;
