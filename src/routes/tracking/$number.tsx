import { createFileRoute } from "@tanstack/react-router";
import { CargoTrackingDashboard } from "@/components/tracking/CargoTrackingDashboard";
import { useCargoTracking } from "@/hooks/api/tracking/useCargoTracking";

export const Route = createFileRoute("/tracking/$number")({
  component: CargoTrackingPage,
});

function CargoTrackingPage() {
  const { number } = Route.useParams();
  const { data: trackingData, isLoading, error } = useCargoTracking(number);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">추적 정보를 불러오는 중...</div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-red-500">
          추적 정보를 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-muted-foreground">
          추적 데이터를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <CargoTrackingDashboard
        trackingData={trackingData}
        cargoNumber={number}
      />
    </div>
  );
}
