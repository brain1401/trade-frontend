import type {
  CargoTrackingInfo,
  CargoTrackingStep,
  CargoAlert,
  CargoDocument,
} from "@/types/tracking";

/**
 * 화물 추적 Mock 데이터 (API 명세서 기준)
 *
 * `GET /api/search/cargo/{cargoNumber}` 응답에 해당
 */
export const mockCargoTracking: CargoTrackingInfo = {
  cargoNumber: "KRPU1234567890",
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
 * 화물 문서 정보 Mock 데이터 (API 명세서 기준)
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
