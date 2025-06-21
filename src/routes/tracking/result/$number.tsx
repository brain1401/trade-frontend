import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  Share2,
  Eye,
  EyeOff,
  ArrowLeft,
  Download,
  Calendar,
  User,
  Building,
  Phone,
  TrendingUp,
  Anchor,
} from "lucide-react";

export const Route = createFileRoute("/tracking/result/$number")({
  component: TrackingResultPage,
}) as unknown;

// 목업 화물 추적 데이터 - 실제 시나리오 기반
const mockCargoTracking = {
  id: "TRK001",
  number: "MSKU1234567",
  type: "화물관리번호",
  status: "검사 진행 중",
  currentStep: 4,
  totalSteps: 5,
  estimatedCompletion: "2024-01-18T16:00:00Z",
  lastUpdate: "2024-01-15T14:30:00Z",

  // 화물 기본 정보
  cargoInfo: {
    vessel: "MSC MAYA",
    voyage: "024E",
    commodity: "전자제품 (노트북 500대)",
    origin: "중국 선전",
    destination: "인천항",
    weight: "12,500 KG",
    packages: 500,
    shipper: "SAMSUNG ELECTRONICS CO LTD",
    consignee: "ABC TRADING KOREA",
    blNumber: "MSKU123456789012",
  },

  // 통관 타임라인
  timeline: [
    {
      step: 1,
      title: "반입신고",
      description: "화물이 항구에 도착하여 반입신고가 완료되었습니다",
      location: "인천항 제3부두",
      status: "completed" as const,
      timestamp: "2024-01-12T10:30:00Z",
      estimatedTime: null,
    },
    {
      step: 2,
      title: "하역작업",
      description: "컨테이너 하역 작업이 완료되었습니다",
      location: "인천항 컨테이너터미널",
      status: "completed" as const,
      timestamp: "2024-01-13T08:15:00Z",
      estimatedTime: null,
    },
    {
      step: 3,
      title: "수입신고",
      description: "관세청에 수입신고서가 제출되었습니다",
      location: "인천세관",
      status: "completed" as const,
      timestamp: "2024-01-14T11:45:00Z",
      estimatedTime: null,
    },
    {
      step: 4,
      title: "물품검사",
      description: "관세청 물품검사가 진행 중입니다",
      location: "인천세관 검사장",
      status: "current" as const,
      timestamp: null,
      estimatedTime: "2024-01-16T15:00:00Z",
    },
    {
      step: 5,
      title: "통관완료",
      description: "반출 허가 대기 중",
      location: "인천세관",
      status: "pending" as const,
      timestamp: null,
      estimatedTime: "2024-01-18T16:00:00Z",
    },
  ],

  // 제출 서류
  documents: [
    {
      name: "수입신고서",
      status: "확인완료",
      uploadDate: "2024-01-14T09:00:00Z",
    },
    {
      name: "포장명세서",
      status: "확인완료",
      uploadDate: "2024-01-14T09:30:00Z",
    },
    {
      name: "원산지증명서",
      status: "검토중",
      uploadDate: "2024-01-14T10:00:00Z",
    },
    {
      name: "품질인증서",
      status: "확인완료",
      uploadDate: "2024-01-14T10:30:00Z",
    },
  ],

  // 관세 및 비용
  fees: [
    { type: "관세", amount: 850000, currency: "KRW", status: "납부완료" },
    {
      type: "부가가치세",
      amount: 1200000,
      currency: "KRW",
      status: "납부완료",
    },
    { type: "통관수수료", amount: 45000, currency: "KRW", status: "납부대기" },
    { type: "하역비", amount: 120000, currency: "KRW", status: "납부완료" },
  ],
};

type TimelineStep = (typeof mockCargoTracking.timeline)[0];

function TrackingResultPage() {
  const tracking = mockCargoTracking;
  const [isMonitoring, setIsMonitoring] = useState(true);

  // 진행률 계산
  const progressPercentage = (tracking.currentStep / tracking.totalSteps) * 100;

  // 타임라인 단계별 아이콘 및 스타일
  const getStepIcon = (step: TimelineStep) => {
    if (step.status === "completed") {
      return <CheckCircle2 size={20} className="text-success-600" />;
    } else if (step.status === "current") {
      return <Clock size={20} className="animate-pulse text-warning-600" />;
    } else {
      return <AlertCircle size={20} className="text-neutral-400" />;
    }
  };

  const getStepBackground = (step: TimelineStep) => {
    if (step.status === "completed") {
      return "bg-success-50 border-success-200";
    } else if (step.status === "current") {
      return "bg-warning-50 border-warning-200";
    } else {
      return "bg-neutral-50 border-neutral-200";
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case "확인완료":
        return (
          <Badge variant="default" className="text-xs">
            확인완료
          </Badge>
        );
      case "검토중":
        return (
          <Badge variant="secondary" className="text-xs">
            검토중
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  const getFeeStatusBadge = (status: string) => {
    return (
      <Badge
        variant={status === "납부완료" ? "default" : "destructive"}
        className="text-xs"
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="mb-2 flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="p-2" asChild>
            <Link to="/tracking">
              <ArrowLeft size={16} />
            </Link>
          </Button>
          <Ship size={24} className="text-primary-600" />
          <h1 className="text-2xl font-bold text-neutral-800">
            화물 추적 결과
          </h1>
        </div>
        <p className="ml-11 text-neutral-600">
          {tracking.type}:{" "}
          <span className="font-medium text-neutral-800">
            {tracking.number}
          </span>
        </p>
      </div>

      <div className="lg:flex lg:space-x-8">
        {/* 메인 추적 정보 */}
        <div className="lg:w-2/3">
          {/* 현재 상태 개요 */}
          <ContentCard
            title="현재 상태"
            titleRightElement={
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
            }
          >
            <div className="space-y-6">
              {/* 현재 상태 표시 */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-neutral-800">
                    {tracking.status}
                  </h2>
                  <Badge
                    variant={
                      tracking.currentStep === tracking.totalSteps
                        ? "default"
                        : "secondary"
                    }
                    className="text-sm"
                  >
                    {tracking.currentStep}/{tracking.totalSteps} 단계
                  </Badge>
                </div>

                <Progress value={progressPercentage} className="mb-3" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">
                    진행률:{" "}
                    <span className="font-medium">
                      {Math.round(progressPercentage)}%
                    </span>
                  </span>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} className="text-neutral-400" />
                    <span className="text-neutral-500">
                      예상 완료:{" "}
                      {new Date(
                        tracking.estimatedCompletion,
                      ).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                </div>
              </div>

              {/* 화물 기본 정보 - 개선된 레이아웃 */}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <h3 className="mb-3 flex items-center text-sm font-medium text-neutral-800">
                  <Package size={16} className="mr-2 text-primary-600" />
                  화물 정보
                </h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <p className="mb-1 text-xs text-neutral-500">선박/항차</p>
                    <p className="font-medium text-neutral-800">
                      {tracking.cargoInfo.vessel} / {tracking.cargoInfo.voyage}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-neutral-500">화물</p>
                    <p className="font-medium text-neutral-800">
                      {tracking.cargoInfo.commodity}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-neutral-500">
                      출발지 → 도착지
                    </p>
                    <p className="font-medium text-neutral-800">
                      {tracking.cargoInfo.origin} →{" "}
                      {tracking.cargoInfo.destination}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-neutral-500">중량/포장</p>
                    <p className="font-medium text-neutral-800">
                      {tracking.cargoInfo.weight} /{" "}
                      {tracking.cargoInfo.packages}개
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ContentCard>

          {/* 통관 진행 상황 타임라인 - 개선된 시각화 */}
          <ContentCard title="통관 진행 상황" className="mt-8">
            <div className="space-y-4">
              {tracking.timeline.map((step, index) => {
                const isLast = index === tracking.timeline.length - 1;

                return (
                  <div key={step.step} className="flex items-start space-x-4">
                    {/* 타임라인 라인 및 아이콘 */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          step.status === "completed"
                            ? "border-success-300 bg-success-100"
                            : step.status === "current"
                              ? "border-warning-300 bg-warning-100"
                              : "border-neutral-300 bg-neutral-100"
                        }`}
                      >
                        {getStepIcon(step)}
                      </div>
                      {!isLast && (
                        <div
                          className={`mt-2 h-12 w-px ${
                            step.status === "completed"
                              ? "bg-success-300"
                              : "bg-neutral-200"
                          }`}
                        />
                      )}
                    </div>

                    {/* 단계 내용 */}
                    <div className="flex-1 pb-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium text-neutral-800">
                          {step.step}. {step.title}
                        </h4>
                        <Badge
                          variant={
                            step.status === "completed"
                              ? "default"
                              : step.status === "current"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
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
                            ? new Date(step.timestamp).toLocaleString("ko-KR")
                            : `예상 ${new Date(step.estimatedTime!).toLocaleString("ko-KR")}`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ContentCard>

          {/* 제출 서류 현황 */}
          <ContentCard title="제출 서류 현황" className="mt-8">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {tracking.documents.map((doc, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-neutral-200 p-3 transition-colors hover:bg-neutral-50"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText size={16} className="text-primary-600" />
                      <span className="text-sm font-medium text-neutral-800">
                        {doc.name}
                      </span>
                    </div>
                    {getDocumentStatusBadge(doc.status)}
                  </div>
                  <p className="text-xs text-neutral-500">
                    제출일:{" "}
                    {new Date(doc.uploadDate).toLocaleDateString("ko-KR")}
                  </p>
                </div>
              ))}
            </div>
          </ContentCard>
        </div>

        {/* 사이드바 */}
        <div className="mt-8 lg:mt-0 lg:w-1/3">
          {/* 관세 및 비용 */}
          <ContentCard
            title="관세 및 비용"
            titleRightElement={
              <TrendingUp size={16} className="text-success-600" />
            }
          >
            <div className="space-y-3">
              {tracking.fees.map((fee, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">{fee.type}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-neutral-800">
                      {fee.amount.toLocaleString()} {fee.currency}
                    </span>
                    {getFeeStatusBadge(fee.status)}
                  </div>
                </div>
              ))}
              <div className="mt-3 border-t border-neutral-200 pt-3">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-neutral-800">총 비용</span>
                  <span className="text-lg text-neutral-900">
                    {tracking.fees
                      .reduce((sum, fee) => sum + fee.amount, 0)
                      .toLocaleString()}{" "}
                    KRW
                  </span>
                </div>
              </div>
            </div>
          </ContentCard>

          {/* 화주 정보 */}
          <ContentCard title="화주 정보" className="mt-8">
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center space-x-2">
                  <Building size={14} className="text-primary-600" />
                  <p className="text-xs font-medium text-neutral-500">송하인</p>
                </div>
                <p className="text-sm font-medium text-neutral-800">
                  {tracking.cargoInfo.shipper}
                </p>
              </div>
              <div>
                <div className="mb-2 flex items-center space-x-2">
                  <User size={14} className="text-primary-600" />
                  <p className="text-xs font-medium text-neutral-500">수하인</p>
                </div>
                <p className="text-sm font-medium text-neutral-800">
                  {tracking.cargoInfo.consignee}
                </p>
              </div>
              <div>
                <div className="mb-2 flex items-center space-x-2">
                  <Anchor size={14} className="text-primary-600" />
                  <p className="text-xs font-medium text-neutral-500">
                    B/L 번호
                  </p>
                </div>
                <p className="text-sm font-medium text-neutral-800">
                  {tracking.cargoInfo.blNumber}
                </p>
              </div>
            </div>
          </ContentCard>

          {/* 빠른 액션 */}
          <ContentCard title="빠른 액션" className="mt-8">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to="/tracking/search">
                  <Package size={16} className="mr-2" />
                  다른 화물 추적
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download size={16} className="mr-2" />
                서류 다운로드
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign size={16} className="mr-2" />
                비용 납부
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bell size={16} className="mr-2" />
                알림 설정
              </Button>
            </div>
          </ContentCard>

          {/* 고객 지원 */}
          <ContentCard title="고객 지원" className="mt-8">
            <div className="space-y-3">
              <div className="rounded-lg border border-info-200 bg-info-50 p-3">
                <div className="mb-2 flex items-center space-x-2">
                  <Phone size={14} className="text-info-600" />
                  <span className="text-sm font-medium text-info-800">
                    고객센터
                  </span>
                </div>
                <p className="text-xs text-info-700">
                  운영시간: 평일 09:00 - 18:00
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  variant="link"
                  className="h-auto justify-start p-0 text-sm text-neutral-600 hover:text-primary-600"
                >
                  통관 절차 문의
                </Button>
                <Button
                  variant="link"
                  className="h-auto justify-start p-0 text-sm text-neutral-600 hover:text-primary-600"
                >
                  비용 관련 문의
                </Button>
                <Button
                  variant="link"
                  className="h-auto justify-start p-0 text-sm text-neutral-600 hover:text-primary-600"
                >
                  서류 제출 문의
                </Button>
              </div>
            </div>
          </ContentCard>
        </div>
      </div>
    </div>
  );
}
