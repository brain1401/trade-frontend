import { useQuery } from "@tanstack/react-query";
import { trackingApi } from "@/lib/api/tracking";

type TrackingStatus =
  | "pending"
  | "picked_up"
  | "in_transit"
  | "customs_clearance"
  | "out_for_delivery"
  | "delivered"
  | "delayed"
  | "exception";

type TimelineEvent = {
  id: string;
  status: TrackingStatus;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  isCompleted: boolean;
  isCurrent: boolean;
  details?: {
    carrier?: string;
    vessel?: string;
    flight?: string;
    estimatedArrival?: string;
  };
};

type CargoStatus = {
  trackingNumber: string;
  currentStatus: TrackingStatus;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  timeline: TimelineEvent[];
  cargoDetails: {
    weight: string;
    dimensions: string;
    description: string;
    value: string;
  };
};

export const useCargoTracking = (trackingNumber: string) => {
  return useQuery({
    queryKey: ["tracking", trackingNumber],
    queryFn: async (): Promise<CargoStatus> => {
      // 실제 API 호출 대신 목업 데이터 반환
      // TODO: 실제 API 연동 시 trackingApi.trackCargo(trackingNumber) 사용
      return {
        trackingNumber,
        currentStatus: "in_transit",
        origin: "부산항",
        destination: "로스앤젤레스항",
        estimatedDelivery: "2024-02-15T10:00:00Z",
        timeline: [
          {
            id: "1",
            status: "pending",
            title: "화물 접수",
            description: "화물이 접수되었습니다",
            location: "부산항",
            timestamp: "2024-02-01T09:00:00Z",
            isCompleted: true,
            isCurrent: false,
          },
          {
            id: "2",
            status: "picked_up",
            title: "픽업 완료",
            description: "화물 픽업이 완료되었습니다",
            location: "부산항",
            timestamp: "2024-02-02T14:00:00Z",
            isCompleted: true,
            isCurrent: false,
          },
          {
            id: "3",
            status: "in_transit",
            title: "운송 중",
            description: "화물이 운송 중입니다",
            location: "태평양",
            timestamp: "2024-02-05T08:00:00Z",
            isCompleted: false,
            isCurrent: true,
            details: {
              vessel: "HYUNDAI BUSAN",
              estimatedArrival: "2024-02-15T10:00:00Z",
            },
          },
          {
            id: "4",
            status: "customs_clearance",
            title: "통관 진행",
            description: "통관 절차를 진행합니다",
            location: "로스앤젤레스항",
            timestamp: "",
            isCompleted: false,
            isCurrent: false,
          },
          {
            id: "5",
            status: "delivered",
            title: "배송 완료",
            description: "화물이 최종 목적지에 도착했습니다",
            location: "로스앤젤레스 창고",
            timestamp: "",
            isCompleted: false,
            isCurrent: false,
          },
        ],
        cargoDetails: {
          weight: "2,500kg",
          dimensions: "120cm x 80cm x 100cm",
          description: "전자제품 (스마트폰)",
          value: "$50,000",
        },
      };
    },
    enabled: !!trackingNumber,
    staleTime: 5 * 60 * 1000, // 5분간 캐시
    refetchInterval: 30 * 1000, // 30초마다 자동 갱신
  });
};

export type { CargoStatus, TimelineEvent, TrackingStatus };
