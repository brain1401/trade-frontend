import type {
  CargoTrackingInfo,
  CargoTrackingStep,
  CargoAlert,
  CargoDocument,
  StepStatus,
} from "@/types/tracking";

/**
 * 사전 정의된 Mock 화물 번호들
 *
 * 테스트용으로 사용할 수 있는 샘플 화물관리번호 목록입니다.
 */
export const MOCK_CARGO_NUMBERS = [
  "12345670123456789",
  "98765432109876543",
  "11223344556677889",
] as const;

/**
 * 화물의 기본 정보를 담는 데이터 구조
 *
 * B/L 번호, 선박 정보, 출발지/도착지, 화물 상세 정보 등
 * 화물 추적에 필요한 모든 기본 정보를 포함합니다.
 */
export type CargoInfo = {
  /** B/L(Bill of Lading) 번호 */
  blNumber: string;
  /** 운송 선박명 */
  vessel: string;
  /** 항차 번호 */
  voyage: string;
  /** 출발지 항구 */
  origin: string;
  /** 도착지 항구 */
  destination: string;
  /** 화물 품목명 */
  commodity: string;
  /** 화물 중량 */
  weight: string;
  /** 포장 개수 */
  packages: number;
  /** 송하인(수출자) */
  shipper: string;
  /** 수하인(수입자) */
  consignee: string;
};

/**
 * 통관 관련 서류의 상태 정보
 *
 * 각 서류별 처리 상태와 업로드 일시를 추적합니다.
 */
export type Document = {
  /** 서류명 */
  name: string;
  /** 처리 상태 (확인완료, 검토중, 미제출 등) */
  status: string;
  /** 업로드 일시 (ISO 문자열) */
  uploadDate: string;
};

/**
 * 통관 수수료 정보
 *
 * 관세, 부가세, 각종 수수료의 금액과 납부 상태를 관리합니다.
 */
export type Fee = {
  /** 수수료 유형 (관세, 부가세, 하역비 등) */
  type: string;
  /** 금액 */
  amount: number;
  /** 통화 단위 */
  currency: string;
  /** 납부 상태 (납부완료, 미납 등) */
  status: string;
};

/**
 * 화물 추적 정보의 전체 데이터 구조
 *
 * 화물의 현재 상태, 진행 단계, 상세 정보, 타임라인, 서류, 수수료 등
 * 화물 추적에 필요한 모든 정보를 종합적으로 포함합니다.
 */
export type CargoTracking = {
  /** 화물 추적 번호 */
  number: string;
  /** 추적 번호 타입 (화물관리번호, B/L번호 등) */
  type: string;
  /** 현재 화물 상태 */
  status: string;
  /** 현재 진행 단계 */
  currentStep: number;
  /** 전체 단계 수 */
  totalSteps: number;
  /** 예상 완료 시간 (ISO 문자열) */
  estimatedCompletion: string;
  /** 화물 기본 정보 */
  cargoInfo: CargoInfo;
  /** 진행 단계별 타임라인 */
  timeline: CargoTrackingStep[];
  /** 관련 서류 목록 */
  documents: Document[];
  /** 수수료 정보 목록 */
  fees: Fee[];
};

/**
 * 화물 추적 Mock 데이터 (API v2.4 명세서 준수)
 *
 * API 명세서의 CargoTrackingInfo 타입을 완전히 준수하는 mock 데이터입니다.
 * 실제 API 응답 형태와 동일한 구조를 가지고 있습니다.
 *
 * @example
 * ```typescript
 * const tracking = mockCargoTracking;
 * console.log(`화물 상태: ${tracking.status}`);
 * console.log(`진행률: ${tracking.progressPercentage}%`);
 *
 * const currentStepInfo = tracking.steps.find(step => step.status === "진행중");
 * console.log(`현재 단계: ${currentStepInfo?.step}`);
 * ```
 */
export const mockCargoTracking: CargoTrackingInfo = {
  cargoNumber: "12345678901234567",
  status: "통관 진행중",
  currentStep: "검사 대기",
  progressPercentage: 60,
  steps: [
    {
      step: "신고 접수",
      status: "완료",
      timestamp: "2024-01-15T09:00:00Z",
      description: "수입신고서가 정상적으로 접수되었습니다",
      department: "부산세관",
      estimatedDuration: "1시간",
    },
    {
      step: "서류 심사",
      status: "완료",
      timestamp: "2024-01-15T09:30:00Z",
      description: "제출 서류 심사가 완료되었습니다",
      department: "부산세관 심사과",
      estimatedDuration: "2시간",
    },
    {
      step: "검사 대기",
      status: "진행중",
      timestamp: "2024-01-15T10:30:00Z",
      description: "물품 검사를 대기하고 있습니다",
      department: "부산세관 검사과",
      estimatedDuration: "1일",
    },
    {
      step: "통관 완료",
      status: "대기",
      timestamp: null,
      description: "검사 완료 후 통관 처리됩니다",
      department: "부산세관",
      estimatedDuration: "1시간",
    },
  ],
  estimatedCompletion: "2024-01-16T14:00:00Z",
  additionalInfo: {
    declarationType: "수입신고",
    customs: "인천본부세관",
    declarer: "(주)무역회사",
    cargoType: "전자제품",
    origin: "중국",
    destination: "한국",
  },
  alerts: [
    {
      id: "alert-1",
      type: "INFO",
      title: "검사 대기 중",
      message: "물품 검사 대기 중입니다. 예상 소요 시간은 1일입니다.",
      timestamp: "2024-01-15T10:30:00Z",
      actionRequired: false,
      contact: {
        department: "부산세관 검사과",
        phone: "051-620-1000",
      },
    },
    {
      id: "alert-2",
      type: "WARNING",
      title: "추가 서류 요청",
      message: "원산지증명서 보완이 필요합니다.",
      timestamp: "2024-01-15T11:00:00Z",
      actionRequired: true,
      contact: {
        department: "부산세관 심사과",
        phone: "051-620-1100",
        email: "busan@customs.go.kr",
      },
    },
  ],
  lastUpdated: "2024-01-15T11:00:00Z",
};

/**
 * 화물 문서 정보 Mock 데이터 (API v2.4 명세서 준수)
 *
 * 해당 화물과 관련된 모든 제출 서류의 상태를 추적합니다.
 */
export const mockCargoDocuments: CargoDocument[] = [
  {
    id: "doc-1",
    name: "수입신고서",
    type: "수입신고서",
    status: "승인",
    submittedAt: "2024-01-15T09:00:00Z",
    fileUrl: "https://example.com/docs/import-declaration.pdf",
    fileSize: 1024576,
    notes: "수입신고서 정상 접수",
  },
  {
    id: "doc-2",
    name: "상업송장",
    type: "상업송장",
    status: "승인",
    submittedAt: "2024-01-15T09:00:00Z",
    fileUrl: "https://example.com/docs/commercial-invoice.pdf",
    fileSize: 512000,
    notes: "상업송장 확인 완료",
  },
  {
    id: "doc-3",
    name: "포장명세서",
    type: "포장명세서",
    status: "승인",
    submittedAt: "2024-01-15T09:00:00Z",
    fileUrl: "https://example.com/docs/packing-list.pdf",
    fileSize: 256000,
    notes: "포장명세서 확인 완료",
  },
  {
    id: "doc-4",
    name: "원산지증명서",
    type: "원산지증명서",
    status: "보완요청",
    submittedAt: "2024-01-15T09:00:00Z",
    fileUrl: "https://example.com/docs/certificate-of-origin.pdf",
    fileSize: 128000,
    notes: "원산지 정보 보완 필요",
  },
];

/**
 * 화물 번호로 추적 정보 조회 (API v2.4 명세서 준수)
 *
 * 17자리 화물관리번호를 기준으로 해당 화물의 추적 정보를 검색하여 반환합니다.
 * API 명세서의 GET /api/search/cargo/{cargoNumber} 응답과 동일한 형태입니다.
 *
 * @param number - 17자리 화물관리번호
 * @returns 해당 화물의 추적 정보, 없으면 undefined
 *
 * @example
 * ```typescript
 * const tracking = getTrackingByNumber("12345678901234567");
 * if (tracking) {
 *   console.log(`현재 상태: ${tracking.status}`);
 *   console.log(`진행률: ${tracking.progressPercentage}%`);
 * }
 * ```
 */
export const getTrackingByNumber = (
  number: string,
): CargoTrackingInfo | undefined => {
  // Mock 데이터에서는 하나의 샘플만 제공
  return number === mockCargoTracking.cargoNumber
    ? mockCargoTracking
    : undefined;
};

/**
 * 화물 문서 목록 조회
 *
 * 특정 화물번호와 관련된 모든 제출 서류 목록을 반환합니다.
 *
 * @param cargoNumber - 화물관리번호
 * @returns 해당 화물의 문서 목록
 */
export const getDocumentsByCargoNumber = (
  cargoNumber: string,
): CargoDocument[] => {
  return cargoNumber === mockCargoTracking.cargoNumber
    ? mockCargoDocuments
    : [];
};

/**
 * 화물번호 유효성 검증 (17자리)
 *
 * @param cargoNumber - 검증할 화물번호
 * @returns 유효성 검증 결과
 */
export const validateCargoNumber = (cargoNumber: string): boolean => {
  return cargoNumber.length === 17 && /^\d{17}$/.test(cargoNumber);
};

/**
 * 추가 Mock 화물 데이터 생성 도우미
 *
 * 다양한 테스트 시나리오를 위한 추가 mock 데이터를 생성합니다.
 */
export const generateMockCargoData = (
  cargoNumber: string,
  status: CargoTrackingInfo["status"] = "통관 진행중",
): CargoTrackingInfo => {
  return {
    ...mockCargoTracking,
    cargoNumber,
    status,
    lastUpdated: new Date().toISOString(),
  };
};

// 레거시 호환성을 위한 타입 별칭 export
export type { CargoTrackingStep as TimelineStep };
