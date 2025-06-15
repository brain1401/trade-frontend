import { useQuery } from "@tanstack/react-query";
import { trackingApi, type TrackingHistory } from "@/lib/api/tracking";

export const useTrackingHistory = (trackingNumber: string) => {
  return useQuery({
    queryKey: ["tracking-history", trackingNumber],
    queryFn: async (): Promise<TrackingHistory[]> => {
      // 실제 API 호출 대신 목업 데이터 반환
      // TODO: 실제 API 연동 시 trackingApi.getTrackingHistory(trackingNumber) 사용
      return [
        {
          id: "1",
          timestamp: "2024-02-01T09:00:00Z",
          status: "pending",
          location: "부산항",
          description: "화물이 접수되었습니다",
        },
        {
          id: "2",
          timestamp: "2024-02-02T14:00:00Z",
          status: "picked_up",
          location: "부산항",
          description: "화물 픽업이 완료되었습니다",
        },
        {
          id: "3",
          timestamp: "2024-02-05T08:00:00Z",
          status: "in_transit",
          location: "태평양",
          description: "화물이 운송 중입니다",
        },
      ];
    },
    enabled: !!trackingNumber,
    staleTime: 10 * 60 * 1000, // 10분간 캐시
    refetchInterval: 60 * 1000, // 1분마다 자동 갱신
  });
};

export type { TrackingHistory };
