import type {
  CargoTrackingInfo,
  CargoTrackingStep,
  CargoDocument,
} from "@/types/tracking";

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
 * 화물 추적 Mock 데이터
 *
 * 상하이에서 부산으로 운송되는 전자제품 화물의 전체 추적 정보입니다.
 * 현재 부산항 도착 단계이며, 수입신고 대기 중인 상태를 시뮬레이션합니다.
 *
 * @example
 * ```typescript
 * const tracking = mockCargoTracking;
 * console.log(`화물 상태: ${tracking.status}`);
 * console.log(`진행률: ${tracking.currentStep}/${tracking.totalSteps}`);
 *
 * const currentStepInfo = tracking.timeline.find(step => step.status === "current");
 * console.log(`현재 단계: ${currentStepInfo?.title}`);
 * ```
 */
// 화물 추적 Mock 데이터
export const mockCargoTracking: CargoTrackingInfo = {
  cargoNumber: "12345670123456789",
  status: "통관 진행중",
  currentStep: "부산항 도착",
  progressPercentage: 50,
  steps: [
    {
      step: "선적 완료",
      status: "완료",
      timestamp: "2024-01-10T08:00:00Z",
      description: "상하이항에서 선적 완료되었습니다",
      department: "상하이항 운송사",
      estimatedDuration: "1일",
    },
    {
      step: "해상 운송",
      status: "완료",
      timestamp: "2024-01-12T10:00:00Z",
      description: "해상 운송이 완료되었습니다",
      department: "해운사",
      estimatedDuration: "5일",
    },
    {
      step: "부산항 도착",
      status: "진행중",
      timestamp: "2024-01-15T14:00:00Z",
      description: "부산항에 도착하여 하역 진행 중입니다",
      department: "부산항 하역사",
      estimatedDuration: "1일",
    },
    {
      step: "수입신고",
      status: "대기",
      timestamp: null,
      description: "수입신고 대기 중입니다",
      department: "부산세관",
      estimatedDuration: "2일",
    },
    {
      step: "통관 심사",
      status: "대기",
      timestamp: null,
      description: "서류 심사 및 검사 대기 중입니다",
      department: "부산세관",
      estimatedDuration: "3일",
    },
    {
      step: "통관 완료",
      status: "대기",
      timestamp: null,
      description: "국내 반입 가능 상태입니다",
      department: "부산세관",
      estimatedDuration: "1일",
    },
  ],
  estimatedCompletion: "2024-01-20T14:00:00Z",
  additionalInfo: {
    declarationType: "일반수입신고",
    customs: "부산본부세관",
    declarer: "한국전자상사",
    cargoType: "전자제품",
    origin: "중국",
    destination: "한국",
  },
  alerts: [
    {
      id: "alert-1",
      type: "INFO",
      title: "하역 진행 중",
      message:
        "부산항에서 하역이 진행 중입니다. 예상 완료 시간은 오늘 18시입니다.",
      timestamp: "2024-01-15T14:00:00Z",
      actionRequired: false,
      contact: {
        department: "부산항 하역팀",
        phone: "051-999-1234",
      },
    },
    {
      id: "alert-2",
      type: "WARNING",
      title: "원산지증명서 보완 필요",
      message:
        "원산지증명서에 일부 보완이 필요합니다. 빠른 시일 내에 보완해 주시기 바랍니다.",
      timestamp: "2024-01-15T15:30:00Z",
      actionRequired: true,
      contact: {
        department: "부산세관 심사과",
        phone: "051-620-1000",
        email: "busan@customs.go.kr",
      },
    },
  ],
  lastUpdated: "2024-01-15T15:30:00Z",
};

/**
 * 화물 문서 정보 Mock 데이터
 *
 * 해당 화물과 관련된 모든 제출 서류의 상태를 추적합니다.
 */
export const mockCargoDocuments: CargoDocument[] = [
  {
    id: "doc-1",
    name: "선적서류(B/L)",
    type: "상업송장",
    status: "승인",
    submittedAt: "2024-01-10T08:00:00Z",
    fileUrl: "https://example.com/docs/bl.pdf",
    fileSize: 1024576,
    notes: "선적서류 확인 완료",
  },
  {
    id: "doc-2",
    name: "상업송장(Invoice)",
    type: "상업송장",
    status: "승인",
    submittedAt: "2024-01-10T08:00:00Z",
    fileUrl: "https://example.com/docs/invoice.pdf",
    fileSize: 512000,
    notes: "금액 및 품목 확인 완료",
  },
  {
    id: "doc-3",
    name: "포장명세서(P/L)",
    type: "포장명세서",
    status: "승인",
    submittedAt: "2024-01-10T08:00:00Z",
    fileUrl: "https://example.com/docs/packing.pdf",
    fileSize: 256000,
    notes: "포장 상세 확인 완료",
  },
  {
    id: "doc-4",
    name: "원산지증명서",
    type: "원산지증명서",
    status: "보완요청",
    submittedAt: "2024-01-15T14:00:00Z",
    fileUrl: "https://example.com/docs/origin.pdf",
    fileSize: 128000,
    notes: "발급기관 확인 필요",
  },
];

/**
 * 화물 번호로 추적 정보 조회
 *
 * 17자리 화물관리번호를 기준으로 해당 화물의 추적 정보를 검색하여 반환합니다.
 *
 * @param number - 17자리 화물관리번호
 * @returns 해당 화물의 추적 정보, 없으면 undefined
 *
 * @example
 * ```typescript
 * const tracking = getTrackingByNumber("12345670123456789");
 * if (tracking) {
 *   console.log(`현재 상태: ${tracking.status}`);
 * }
 * ```
 */
export const getTrackingByNumber = (
  number: string,
): CargoTrackingInfo | undefined => {
  // 실제로는 여러 화물 데이터가 있겠지만, Mock에서는 하나만 제공
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

// 레거시 호환성을 위한 타입 별칭 export
export type { CargoTrackingStep as TimelineStep };
