import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  MapPin,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import type {
  CargoStatus,
  TimelineEvent,
  TrackingStatus,
} from "@/hooks/api/tracking/useCargoTracking";

type StatusTimelineProps = {
  status: CargoStatus;
  timeline: TimelineEvent[];
};

const getStatusIcon = (
  status: TrackingStatus,
  isCompleted: boolean,
  isCurrent: boolean,
) => {
  const iconClass = `h-5 w-5 ${
    isCompleted
      ? "text-green-600"
      : isCurrent
        ? "text-blue-600"
        : "text-gray-400"
  }`;

  switch (status) {
    case "pending":
      return <Clock className={iconClass} />;
    case "picked_up":
      return <Package className={iconClass} />;
    case "in_transit":
      return <Truck className={iconClass} />;
    case "customs_clearance":
      return <MapPin className={iconClass} />;
    case "out_for_delivery":
      return <Truck className={iconClass} />;
    case "delivered":
      return <CheckCircle className={iconClass} />;
    case "delayed":
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    case "exception":
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    default:
      return <Clock className={iconClass} />;
  }
};

const getStatusBadgeVariant = (
  status: TrackingStatus,
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

const getStatusLabel = (status: TrackingStatus): string => {
  const labels = {
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

const formatDateTime = (timestamp: string): { date: string; time: string } => {
  const date = new Date(timestamp);
  return {
    date: date.toLocaleDateString("ko-KR"),
    time: date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  status,
  timeline,
}) => {
  const currentEvent = timeline.find((event) => event.isCurrent);
  const nextEvent = timeline.find(
    (event) => !event.isCompleted && !event.isCurrent,
  );

  return (
    <div className="space-y-6">
      {/* 현재 상태 요약 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {status.trackingNumber}
            </CardTitle>
            <Badge variant={getStatusBadgeVariant(status.currentStatus)}>
              {getStatusLabel(status.currentStatus)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                출발지
              </h4>
              <p className="font-medium">{status.origin}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                도착지
              </h4>
              <p className="font-medium">{status.destination}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                예상 도착
              </h4>
              <p className="font-medium">
                {new Date(status.estimatedDelivery).toLocaleDateString("ko-KR")}
              </p>
            </div>
          </div>

          {/* 현재 위치 및 다음 단계 */}
          {currentEvent && (
            <div className="mt-4 rounded-lg bg-blue-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                {getStatusIcon(currentEvent.status, false, true)}
                <span className="font-medium">현재 상태</span>
              </div>
              <p className="text-sm">
                <span className="font-medium">{currentEvent.location}</span> -{" "}
                {currentEvent.description}
              </p>

              {nextEvent && (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4" />
                  다음: {nextEvent.title}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 타임라인 */}
      <Card>
        <CardHeader>
          <CardTitle>추적 내역</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* 타임라인 라인 */}
            <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gray-200"></div>

            <div className="space-y-6">
              {timeline.map((event, _index) => {
                const { date, time } = formatDateTime(event.timestamp);

                return (
                  <div key={event.id} className="relative flex gap-4">
                    {/* 아이콘 */}
                    <div
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 ${
                        event.isCompleted
                          ? "border-green-200 bg-green-50"
                          : event.isCurrent
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-200 bg-gray-50"
                      } `}
                    >
                      {getStatusIcon(
                        event.status,
                        event.isCompleted,
                        event.isCurrent,
                      )}
                    </div>

                    {/* 컨텐츠 */}
                    <div className="flex-1 pb-6">
                      <div className="mb-1 flex items-center justify-between">
                        <h3
                          className={`font-medium ${
                            event.isCompleted || event.isCurrent
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {event.title}
                        </h3>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>{date}</div>
                          <div>{time}</div>
                        </div>
                      </div>

                      <p
                        className={`mb-2 text-sm ${
                          event.isCompleted || event.isCurrent
                            ? "text-muted-foreground"
                            : "text-gray-400"
                        }`}
                      >
                        {event.description}
                      </p>

                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {event.location}
                        </span>
                      </div>

                      {/* 추가 세부 정보 */}
                      {event.details && (
                        <div className="mt-3 rounded-lg bg-muted/50 p-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {event.details.carrier && (
                              <div>
                                <span className="font-medium">운송사:</span>{" "}
                                {event.details.carrier}
                              </div>
                            )}
                            {event.details.vessel && (
                              <div>
                                <span className="font-medium">선박:</span>{" "}
                                {event.details.vessel}
                              </div>
                            )}
                            {event.details.flight && (
                              <div>
                                <span className="font-medium">항공편:</span>{" "}
                                {event.details.flight}
                              </div>
                            )}
                            {event.details.estimatedArrival && (
                              <div>
                                <span className="font-medium">예상 도착:</span>
                                {new Date(
                                  event.details.estimatedArrival,
                                ).toLocaleDateString("ko-KR")}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 화물 상세 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>화물 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                중량
              </h4>
              <p className="font-medium">{status.cargoDetails.weight}</p>
            </div>
            <div>
              <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                규격
              </h4>
              <p className="font-medium">{status.cargoDetails.dimensions}</p>
            </div>
            <div>
              <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                화물 가치
              </h4>
              <p className="font-medium">{status.cargoDetails.value}</p>
            </div>
            <div>
              <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                화물 설명
              </h4>
              <p className="font-medium">{status.cargoDetails.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
