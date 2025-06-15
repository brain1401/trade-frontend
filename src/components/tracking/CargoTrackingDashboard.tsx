import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusTimeline } from "./StatusTimeline";
import {
  Package,
  MapPin,
  Calendar,
  Clock,
  Truck,
  Bell,
  Share2,
  Download,
  RefreshCw,
} from "lucide-react";
import type { CargoStatus } from "@/hooks/api/tracking/useCargoTracking";

type CargoTrackingDashboardProps = {
  trackingData: CargoStatus;
  cargoNumber: string;
};

const formatDateTime = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadgeVariant = (
  status: string,
): "default" | "secondary" | "destructive" => {
  switch (status) {
    case "delivered":
      return "default";
    case "delayed":
    case "exception":
      return "destructive";
    default:
      return "secondary";
  }
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: "접수 대기",
    picked_up: "픽업 완료",
    in_transit: "운송 중",
    customs_clearance: "통관 진행",
    out_for_delivery: "배송 중",
    delivered: "배송 완료",
    delayed: "지연",
    exception: "예외 상황",
  };
  return labels[status] || status;
};

export const CargoTrackingDashboard: React.FC<CargoTrackingDashboardProps> = ({
  trackingData,
  cargoNumber,
}) => {
  const handleSubscribe = () => {
    // TODO: 실제 알림 구독 로직 구현
    console.log("알림 구독:", cargoNumber);
  };

  const handleShare = () => {
    // TODO: 공유 기능 구현
    navigator.clipboard.writeText(window.location.href);
    alert("링크가 복사되었습니다.");
  };

  const handleExport = () => {
    // TODO: 추적 정보 내보내기 구현
    console.log("추적 정보 내보내기:", cargoNumber);
  };

  const handleRefresh = () => {
    // TODO: 새로고침 로직 구현
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">화물 추적</h1>
            <p className="text-muted-foreground">
              추적 번호: {trackingData.trackingNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-1 h-4 w-4" />
            새로고침
          </Button>
          <Button variant="outline" size="sm" onClick={handleSubscribe}>
            <Bell className="mr-1 h-4 w-4" />
            알림 받기
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-1 h-4 w-4" />
            공유
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-1 h-4 w-4" />
            내보내기
          </Button>
        </div>
      </div>

      {/* 현재 상태 카드 */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              현재 상태
            </CardTitle>
            <Badge variant={getStatusBadgeVariant(trackingData.currentStatus)}>
              {getStatusLabel(trackingData.currentStatus)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">출발지</p>
                <p className="font-medium">{trackingData.origin}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">목적지</p>
                <p className="font-medium">{trackingData.destination}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">예상 도착</p>
                <p className="font-medium">
                  {formatDateTime(trackingData.estimatedDelivery)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">마지막 업데이트</p>
                <p className="font-medium">
                  {formatDateTime(new Date().toISOString())}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 화물 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>화물 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">중량</p>
              <p className="font-medium">{trackingData.cargoDetails.weight}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">치수</p>
              <p className="font-medium">
                {trackingData.cargoDetails.dimensions}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">상품 설명</p>
              <p className="font-medium">
                {trackingData.cargoDetails.description}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">가격</p>
              <p className="font-medium">{trackingData.cargoDetails.value}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 추적 타임라인 */}
      <StatusTimeline status={trackingData} timeline={trackingData.timeline} />
    </div>
  );
};
