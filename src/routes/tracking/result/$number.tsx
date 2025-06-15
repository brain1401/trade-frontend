import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ContentCard from "@/components/common/ContentCard";
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Ship,
  Truck,
  FileText,
  DollarSign,
  Bell,
  Bookmark,
  Share2,
  Eye,
  EyeOff,
} from "lucide-react";
import { mockCargoTracking, type TimelineStep } from "@/data/mock/tracking";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tracking/result/$number")({
  component: TrackingResultPage,
}) as any;

function TrackingResultPage() {
  // 현재는 목업이므로 number를 하드코딩으로 설정
  const trackingNumber = "MSKU1234567";
  const tracking = mockCargoTracking;
  const [isMonitoring, setIsMonitoring] = useState(true);

  // 진행률 계산
  const progressPercentage = (tracking.currentStep / tracking.totalSteps) * 100;

  // 타임라인 단계별 아이콘
  const getStepIcon = (step: TimelineStep) => {
    if (step.status === "completed") {
      return <CheckCircle2 size={20} className="text-success-600" />;
    } else if (step.status === "current") {
      return <Clock size={20} className="text-warning-600" />;
    } else {
      return <AlertCircle size={20} className="text-neutral-400" />;
    }
  };

  // 상태별 배경색
  const getStepBackground = (step: TimelineStep) => {
    if (step.status === "completed") {
      return "bg-success-50 border-success-200";
    } else if (step.status === "current") {
      return "bg-warning-50 border-warning-200";
    } else {
      return "bg-neutral-50 border-neutral-200";
    }
  };

  return (
    <div className="lg:flex lg:space-x-8">
      {/* 메인 추적 정보 */}
      <div className="lg:w-2/3">
        {/* 헤더 카드 */}
        <Card className="mb-4 py-0">
          <div className="flex flex-row items-center justify-between border-b p-4">
            <div>
              <h1 className="!mt-0 text-lg font-semibold text-neutral-800">
                화물 추적 결과
              </h1>
              <p className="text-xs text-neutral-500">
                {tracking.type}: {trackingNumber}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={isMonitoring ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsMonitoring(!isMonitoring)}
              >
                {isMonitoring ? (
                  <Eye size={16} className="mr-1" />
                ) : (
                  <EyeOff size={16} className="mr-1" />
                )}
                모니터링
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 size={16} className="mr-1" />
                공유
              </Button>
            </div>
          </div>

          <div className="p-4">
            {/* 현재 상태 */}
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xl font-bold text-neutral-800">
                  {tracking.status}
                </h2>
                <Badge
                  variant={
                    tracking.currentStep === tracking.totalSteps
                      ? "default"
                      : "secondary"
                  }
                >
                  {tracking.currentStep}/{tracking.totalSteps} 단계
                </Badge>
              </div>

              <Progress value={progressPercentage} className="mb-2" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">
                  진행률: {Math.round(progressPercentage)}%
                </span>
                <span className="text-neutral-500">
                  예상 완료:{" "}
                  {new Date(tracking.estimatedCompletion).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* 화물 기본 정보 */}
            <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg bg-neutral-50 p-4">
              <div>
                <p className="mb-1 text-xs text-neutral-500">선박/항차</p>
                <p className="font-medium">
                  {tracking.cargoInfo.vessel} / {tracking.cargoInfo.voyage}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-neutral-500">화물</p>
                <p className="font-medium">{tracking.cargoInfo.commodity}</p>
              </div>
              <div>
                <p className="mb-1 text-xs text-neutral-500">출발지 → 도착지</p>
                <p className="font-medium">
                  {tracking.cargoInfo.origin} → {tracking.cargoInfo.destination}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-neutral-500">중량/포장</p>
                <p className="font-medium">
                  {tracking.cargoInfo.weight} / {tracking.cargoInfo.packages}개
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* 추적 타임라인 */}
        <Card className="mb-4 py-0">
          <div className="border-b p-4">
            <h3 className="!mt-0 text-lg font-semibold text-neutral-800">
              통관 진행 상황
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {tracking.timeline.map((step, index) => (
                <div
                  key={step.step}
                  className={cn(
                    "rounded-lg border p-4",
                    getStepBackground(step),
                  )}
                >
                  <div className="flex items-start space-x-3">
                    {getStepIcon(step)}
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <h4 className="font-medium text-neutral-800">
                          {step.title}
                        </h4>
                        <Badge
                          variant={
                            step.status === "completed"
                              ? "default"
                              : step.status === "current"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {step.status === "completed"
                            ? "완료"
                            : step.status === "current"
                              ? "진행중"
                              : "대기"}
                        </Badge>
                      </div>
                      <p className="mb-2 text-sm text-neutral-600">
                        {step.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <div className="flex items-center space-x-1">
                          <MapPin size={12} />
                          <span>{step.location}</span>
                        </div>
                        <span>
                          {step.timestamp
                            ? new Date(step.timestamp).toLocaleString()
                            : `예상: ${new Date(step.estimatedTime!).toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 필요 서류 */}
        <Card className="py-0">
          <div className="border-b p-4">
            <h3 className="!mt-0 text-lg font-semibold text-neutral-800">
              제출 서류 현황
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {tracking.documents.map((doc, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-neutral-200 p-3"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">{doc.name}</span>
                    <Badge
                      variant={
                        doc.status === "확인완료" ? "default" : "secondary"
                      }
                    >
                      {doc.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-500">
                    제출일: {new Date(doc.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 사이드바 */}
      <div className="mt-8 lg:mt-0 lg:w-1/3">
        {/* 관세 및 비용 */}
        <Card className="mb-4 py-0">
          <div className="border-b p-4">
            <h3 className="!mt-0 text-lg font-semibold text-neutral-800">
              관세 및 비용
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {tracking.fees.map((fee, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{fee.type}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {fee.amount.toLocaleString()} {fee.currency}
                    </span>
                    <Badge
                      variant={
                        fee.status === "납부완료" ? "default" : "destructive"
                      }
                    >
                      {fee.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <div className="mt-3 border-t pt-3">
                <div className="flex items-center justify-between font-medium">
                  <span>총 비용</span>
                  <span>
                    {tracking.fees
                      .reduce((sum, fee) => sum + fee.amount, 0)
                      .toLocaleString()}{" "}
                    KRW
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 화주 정보 */}
        <Card className="mb-4 py-0">
          <div className="border-b p-4">
            <h3 className="!mt-0 text-lg font-semibold text-neutral-800">
              화주 정보
            </h3>
          </div>
          <div className="space-y-3 p-4">
            <div>
              <p className="mb-1 text-xs text-neutral-500">송하인</p>
              <p className="text-sm font-medium">
                {tracking.cargoInfo.shipper}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs text-neutral-500">수하인</p>
              <p className="text-sm font-medium">
                {tracking.cargoInfo.consignee}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs text-neutral-500">B/L 번호</p>
              <p className="text-sm font-medium">
                {tracking.cargoInfo.blNumber}
              </p>
            </div>
          </div>
        </Card>

        {/* 빠른 액션 */}
        <Card className="mb-4 py-0">
          <div className="border-b p-4">
            <h3 className="!mt-0 text-lg font-semibold text-neutral-800">
              빠른 액션
            </h3>
          </div>
          <div className="space-y-2 p-4">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/tracking/search">다른 화물 추적</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText size={16} className="mr-1" />
              서류 다운로드
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <DollarSign size={16} className="mr-1" />
              비용 납부
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Bell size={16} className="mr-1" />
              알림 설정
            </Button>
          </div>
        </Card>

        {/* 고객 지원 */}
        <Card className="py-0">
          <div className="border-b p-4">
            <h3 className="!mt-0 text-lg font-semibold text-neutral-800">
              고객 지원
            </h3>
          </div>
          <div className="space-y-2 p-4">
            <Button variant="link" className="h-auto justify-start p-0 text-sm">
              통관 절차 문의
            </Button>
            <Button variant="link" className="h-auto justify-start p-0 text-sm">
              비용 관련 문의
            </Button>
            <Button variant="link" className="h-auto justify-start p-0 text-sm">
              서류 제출 문의
            </Button>
            <Button variant="link" className="h-auto justify-start p-0 text-sm">
              고객센터 연결
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
