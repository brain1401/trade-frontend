// 화물 추적 관련 목업 데이터
import type { TrackingStatus, TimelineStep } from "@/types";

export const mockCargoTracking = {
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
