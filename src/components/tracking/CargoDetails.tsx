import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Scale,
  Ruler,
  DollarSign,
  FileText,
  Truck,
  Ship,
  Plane,
  MapPin,
} from "lucide-react";
import type { CargoStatus } from "@/hooks/api/tracking/useCargoTracking";

type CargoDetailsProps = {
  details: CargoStatus["cargoDetails"];
  trackingData?: CargoStatus;
  className?: string;
};

const getTransportIcon = (transportType?: string) => {
  switch (transportType?.toLowerCase()) {
    case "truck":
    case "road":
      return <Truck className="h-4 w-4" />;
    case "ship":
    case "sea":
      return <Ship className="h-4 w-4" />;
    case "plane":
    case "air":
      return <Plane className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

export const CargoDetails: React.FC<CargoDetailsProps> = ({
  details,
  trackingData,
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          화물 상세 정보
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 기본 화물 정보 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <Scale className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <h4 className="font-medium">중량</h4>
              <p className="text-2xl font-bold text-primary">
                {details.weight}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Ruler className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <h4 className="font-medium">치수</h4>
              <p className="text-lg font-semibold">{details.dimensions}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <h4 className="font-medium">상품 설명</h4>
              <p className="text-sm">{details.description}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <h4 className="font-medium">가격</h4>
              <p className="text-lg font-semibold text-green-600">
                {details.value}
              </p>
            </div>
          </div>
        </div>

        {/* 운송 정보 (있는 경우) */}
        {trackingData && (
          <div className="border-t pt-4">
            <h4 className="mb-3 flex items-center gap-2 font-medium">
              {getTransportIcon()}
              운송 정보
            </h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm text-muted-foreground">출발지:</span>
                  <span className="ml-2 font-medium">
                    {trackingData.origin}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm text-muted-foreground">목적지:</span>
                  <span className="ml-2 font-medium">
                    {trackingData.destination}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 현재 운송 수단 정보 (현재 이벤트에서) */}
        {trackingData?.timeline.find((event) => event.isCurrent)?.details && (
          <div className="border-t pt-4">
            <h4 className="mb-3 font-medium">현재 운송 수단</h4>
            <div className="space-y-2">
              {trackingData.timeline.find((event) => event.isCurrent)?.details
                ?.vessel && (
                <div className="flex items-center gap-2">
                  <Ship className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    선박:{" "}
                    {
                      trackingData.timeline.find((event) => event.isCurrent)
                        ?.details?.vessel
                    }
                  </span>
                </div>
              )}
              {trackingData.timeline.find((event) => event.isCurrent)?.details
                ?.flight && (
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    항공편:{" "}
                    {
                      trackingData.timeline.find((event) => event.isCurrent)
                        ?.details?.flight
                    }
                  </span>
                </div>
              )}
              {trackingData.timeline.find((event) => event.isCurrent)?.details
                ?.carrier && (
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    운송사:{" "}
                    {
                      trackingData.timeline.find((event) => event.isCurrent)
                        ?.details?.carrier
                    }
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 상태 배지 */}
        {trackingData && (
          <div className="border-t pt-4">
            <h4 className="mb-3 font-medium">상태</h4>
            <Badge variant="secondary">
              {trackingData.currentStatus.toUpperCase()}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
