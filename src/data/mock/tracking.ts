import type { TimelineStep } from "@/types";

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
  timeline: TimelineStep[];
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
export const mockCargoTracking: CargoTracking = {
  number: "MSKU1234567",
  type: "화물관리번호",
  status: "통관 진행 중",
  currentStep: 3,
  totalSteps: 6,
  estimatedCompletion: "2024-01-20T14:00:00Z",
  cargoInfo: {
    blNumber: "MSKU1234567890",
    vessel: "EVER GIVEN",
    voyage: "0001E",
    origin: "상하이항",
    destination: "부산항",
    commodity: "전자제품",
    weight: "2,500 KG",
    packages: 50,
    shipper: "ABC ELECTRONICS CO., LTD",
    consignee: "한국전자상사",
  },
  timeline: [
    {
      step: 1,
      title: "선적 완료",
      description: "상하이항에서 선적 완료",
      status: "completed",
      timestamp: "2024-01-10T08:00:00Z",
      location: "상하이항",
    },
    {
      step: 2,
      title: "운송 중",
      description: "해상 운송 진행 중",
      status: "completed",
      timestamp: "2024-01-12T10:00:00Z",
      location: "해상",
    },
    {
      step: 3,
      title: "부산항 도착",
      description: "부산항 도착, 하역 진행 중",
      status: "current",
      timestamp: "2024-01-15T14:00:00Z",
      location: "부산항",
    },
    {
      step: 4,
      title: "수입신고",
      description: "수입신고 대기 중",
      status: "pending",
      estimatedTime: "2024-01-16T10:00:00Z",
      location: "부산세관",
    },
    {
      step: 5,
      title: "통관 심사",
      description: "서류 심사 및 검사",
      status: "pending",
      estimatedTime: "2024-01-18T15:00:00Z",
      location: "부산세관",
    },
    {
      step: 6,
      title: "통관 완료",
      description: "국내 반입 가능",
      status: "pending",
      estimatedTime: "2024-01-20T14:00:00Z",
      location: "부산세관",
    },
  ],
  documents: [
    {
      name: "선적서류(B/L)",
      status: "확인완료",
      uploadDate: "2024-01-10T08:00:00Z",
    },
    {
      name: "상업송장(Invoice)",
      status: "확인완료",
      uploadDate: "2024-01-10T08:00:00Z",
    },
    {
      name: "포장명세서(P/L)",
      status: "확인완료",
      uploadDate: "2024-01-10T08:00:00Z",
    },
    {
      name: "원산지증명서",
      status: "검토중",
      uploadDate: "2024-01-15T14:00:00Z",
    },
  ],
  fees: [
    {
      type: "관세",
      amount: 125000,
      currency: "KRW",
      status: "미납",
    },
    {
      type: "부가세",
      amount: 87500,
      currency: "KRW",
      status: "미납",
    },
    {
      type: "하역비",
      amount: 45000,
      currency: "KRW",
      status: "납부완료",
    },
  ],
};

// 추적 이력 Mock 데이터
export const mockTrackingHistory = [
  {
    number: "MSKU1234567",
    searchDate: "2024-01-15T16:30:00Z",
    status: "통관 진행 중",
    commodity: "전자제품",
  },
  {
    number: "COSCO987654",
    searchDate: "2024-01-14T10:20:00Z",
    status: "통관 완료",
    commodity: "의류",
  },
  {
    number: "HAPAG555888",
    searchDate: "2024-01-12T14:15:00Z",
    status: "운송 중",
    commodity: "자동차 부품",
  },
];

// 유틸리티 함수
export const getTrackingByNumber = (
  number: string,
): CargoTracking | undefined => {
  // 실제 구현에서는 number로 조회
  return mockCargoTracking.number === number ? mockCargoTracking : undefined;
};
