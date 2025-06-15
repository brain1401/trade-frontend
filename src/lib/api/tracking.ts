import apiClient from "./client";

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

type TrackingHistory = {
  id: string;
  timestamp: string;
  status: TrackingStatus;
  location: string;
  description: string;
};

export const trackingApi = {
  // 화물 추적 정보 조회
  trackCargo: async (number: string): Promise<CargoStatus> => {
    return apiClient.get(`/tracking/${encodeURIComponent(number)}`);
  },

  // 화물 추적 이력 조회
  getTrackingHistory: async (number: string): Promise<TrackingHistory[]> => {
    return apiClient.get(`/tracking/${encodeURIComponent(number)}/history`);
  },

  // 화물 상태 업데이트 구독
  subscribeToUpdates: async (number: string, userId: number): Promise<void> => {
    return apiClient.post(`/tracking/${encodeURIComponent(number)}/subscribe`, {
      userId,
    });
  },
};

export type { CargoStatus, TimelineEvent, TrackingStatus, TrackingHistory };
