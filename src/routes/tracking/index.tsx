import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ContentCard from "@/components/common/ContentCard";
import {
  Package,
  Search,
  Clock,
  ChevronRight,
  MapPin,
  Truck,
  CheckCircle,
  AlertCircle,
  Ship,
  FileText,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/tracking/")({
  component: TrackingIndexPage,
});

// 목업 최근 추적 데이터 - 실제 시나리오 기반
const mockTrackingHistory = [
  {
    id: "TRK001",
    cargoNumber: "HJMU1234567",
    description: "전자제품 (노트북 500대)",
    status: "통관완료",
    statusCode: "completed",
    origin: "중국 선전",
    destination: "인천항",
    lastUpdate: "2024-01-15T14:30:00Z",
    progress: 100,
    urgency: "normal", // normal, high, critical
  },
  {
    id: "TRK002",
    cargoNumber: "TCLU9876543",
    description: "의류 및 액세서리 (15톤)",
    status: "검사진행중",
    statusCode: "inspection",
    origin: "베트남 호치민",
    destination: "부산항",
    lastUpdate: "2024-01-15T10:15:00Z",
    progress: 75,
    urgency: "high",
  },
  {
    id: "TRK003",
    cargoNumber: "OOLU5555555",
    description: "화장품 세트 (1,200박스)",
    status: "하역중",
    statusCode: "unloading",
    origin: "일본 요코하마",
    destination: "인천항",
    lastUpdate: "2024-01-15T08:45:00Z",
    progress: 60,
    urgency: "normal",
  },
];

// 샘플 화물번호 - 실제 형태 반영
const sampleNumbers = [
  { number: "HJMU1234567", type: "화물관리번호", description: "전자제품" },
  { number: "TCLU9876543", type: "화물관리번호", description: "의류" },
  { number: "OOLU5555555", type: "화물관리번호", description: "화장품" },
  { number: "MSCU7777777", type: "화물관리번호", description: "기계부품" },
];

// 통관 단계 정보 - 실제 절차 반영
const clearanceSteps = [
  { step: 1, name: "반입신고", icon: Package, description: "화물 입항 신고" },
  { step: 2, name: "하역작업", icon: Truck, description: "컨테이너 하역" },
  {
    step: 3,
    name: "수입신고",
    icon: FileText,
    description: "세관 신고서 제출",
  },
  { step: 4, name: "물품검사", icon: Search, description: "관세청 검사" },
  { step: 5, name: "통관완료", icon: CheckCircle, description: "반출 허가" },
];

function TrackingIndexPage() {
  const [cargoNumber, setCargoNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (cargoNumber.trim()) {
      setIsSearching(true);
      // 실제 검색 지연 시뮬레이션
      setTimeout(() => {
        setIsSearching(false);
        window.location.href = `/tracking/result/${cargoNumber}`;
      }, 800);
    }
  };

  const getStatusIcon = (statusCode: string, urgency: string = "normal") => {
    const iconSize = 16;
    const baseClasses = urgency === "high" ? "animate-pulse" : "";

    switch (statusCode) {
      case "completed":
        return (
          <CheckCircle
            size={iconSize}
            className={`text-success-500 ${baseClasses}`}
          />
        );
      case "inspection":
        return (
          <AlertCircle
            size={iconSize}
            className={`text-warning-500 ${baseClasses}`}
          />
        );
      case "unloading":
        return (
          <Truck size={iconSize} className={`text-info-500 ${baseClasses}`} />
        );
      default:
        return (
          <Package
            size={iconSize}
            className={`text-neutral-500 ${baseClasses}`}
          />
        );
    }
  };

  const getStatusBadge = (
    statusCode: string,
    status: string,
    urgency: string = "normal",
  ) => {
    let variant: "default" | "secondary" | "destructive" | "outline" =
      "secondary";

    if (statusCode === "completed") variant = "default";
    else if (urgency === "high") variant = "destructive";

    return (
      <Badge variant={variant} className="text-xs whitespace-nowrap">
        {status}
      </Badge>
    );
  };

  const getUrgencyIndicator = (urgency: string) => {
    if (urgency === "high") {
      return (
        <div className="absolute -top-1 -right-1 h-3 w-3 animate-ping rounded-full bg-warning-500" />
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="mb-2 flex items-center space-x-2">
          <Ship size={24} className="text-primary-600" />
          <h1 className="text-2xl font-bold text-neutral-800">화물 추적</h1>
        </div>
        <p className="text-neutral-600">
          화물관리번호 또는 B/L번호로 실시간 통관 진행 상황을 확인하고
          모니터링하세요
        </p>
      </div>

      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-2/3">
          {/* 화물번호 입력 - 개선된 UX */}
          <ContentCard title="화물 추적 검색">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="cargoNumber"
                  className="text-sm font-medium text-neutral-700"
                >
                  화물관리번호 또는 B/L번호
                </Label>
                <div className="mt-1 flex space-x-2">
                  <Input
                    id="cargoNumber"
                    type="text"
                    placeholder="예: HJMU1234567 (대소문자 구분 없음)"
                    value={cargoNumber}
                    onChange={(e) =>
                      setCargoNumber(e.target.value.toUpperCase())
                    }
                    onKeyPress={(e) =>
                      e.key === "Enter" && !isSearching && handleSearch()
                    }
                    className="flex-1"
                    disabled={isSearching}
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={!cargoNumber.trim() || isSearching}
                    className="min-w-[80px] bg-primary-600 hover:bg-primary-700"
                  >
                    {isSearching ? (
                      <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        검색중
                      </div>
                    ) : (
                      <>
                        <Search size={16} className="mr-2" />
                        추적
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* 샘플 번호 - 개선된 정보 제공 */}
              <div>
                <Label className="text-sm font-medium text-neutral-700">
                  샘플 번호로 테스트
                </Label>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {sampleNumbers.map((sample) => (
                    <Button
                      key={sample.number}
                      variant="outline"
                      size="sm"
                      onClick={() => setCargoNumber(sample.number)}
                      className="h-auto justify-start p-3 text-left"
                      disabled={isSearching}
                    >
                      <div>
                        <div className="font-medium text-neutral-800">
                          {sample.number}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {sample.description}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </ContentCard>

          {/* 최근 추적 히스토리 - 향상된 시각화 */}
          <ContentCard
            title="최근 추적 기록"
            className="mt-8"
            titleRightElement={
              <Button
                variant="link"
                className="h-auto p-0 text-sm text-primary-600 hover:underline"
                asChild
              >
                <Link to="/dashboard">
                  전체보기 <ChevronRight size={14} className="ml-0.5" />
                </Link>
              </Button>
            }
          >
            <div className="space-y-4">
              {mockTrackingHistory.map((tracking) => (
                <div
                  key={tracking.id}
                  className="relative rounded-lg border border-neutral-200 p-4 transition-all hover:border-primary-200 hover:bg-neutral-50"
                >
                  {getUrgencyIndicator(tracking.urgency)}

                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(tracking.statusCode, tracking.urgency)}
                      <h3 className="font-medium text-neutral-800">
                        {tracking.cargoNumber}
                      </h3>
                    </div>
                    {getStatusBadge(
                      tracking.statusCode,
                      tracking.status,
                      tracking.urgency,
                    )}
                  </div>

                  <p className="mb-2 text-sm text-neutral-600">
                    {tracking.description}
                  </p>

                  <div className="mb-3 flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <MapPin size={12} className="text-neutral-400" />
                      <span className="text-xs text-neutral-600">
                        {tracking.origin} → {tracking.destination}
                      </span>
                    </div>
                  </div>

                  {/* 개선된 진행률 표시 */}
                  <div className="mb-3">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-neutral-600">진행률</span>
                      <span className="font-medium text-neutral-800">
                        {tracking.progress}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          tracking.progress === 100
                            ? "bg-success-500"
                            : tracking.urgency === "high"
                              ? "bg-warning-500"
                              : "bg-primary-500"
                        }`}
                        style={{ width: `${tracking.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Clock size={12} className="text-neutral-400" />
                      <span className="text-xs text-neutral-400">
                        {new Date(tracking.lastUpdate).toLocaleString("ko-KR", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs text-primary-600 hover:underline"
                      asChild
                    >
                      <Link
                        to="/tracking/result/$number"
                        params={{ number: tracking.cargoNumber }}
                      >
                        상세보기 <ChevronRight size={12} className="ml-0.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>
        </div>

        <aside className="mt-8 lg:mt-0 lg:w-1/3">
          {/* 추적 가이드 - 정보 아키텍처 개선 */}
          <ContentCard title="추적 가이드">
            <div className="space-y-4">
              <div className="rounded-lg border border-info-200 bg-info-50 p-3">
                <div className="flex items-start space-x-2">
                  <FileText size={16} className="mt-0.5 text-info-600" />
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-info-800">
                      입력 가능한 번호
                    </h4>
                    <ul className="space-y-1 text-xs text-info-700">
                      <li>• 화물관리번호: 영문 4자리 + 숫자 7자리</li>
                      <li>• B/L 번호: 선하증권번호 (길이 가변)</li>
                      <li>• 컨테이너 번호: CNTR 포함</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-success-200 bg-success-50 p-3">
                <div className="flex items-start space-x-2">
                  <TrendingUp size={16} className="mt-0.5 text-success-600" />
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-success-800">
                      실시간 업데이트
                    </h4>
                    <p className="text-xs text-success-700">
                      통관 진행 상황이 실시간으로 업데이트되며, 중요한 변경사항
                      발생 시 알림을 받을 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ContentCard>

          {/* 통관 단계 안내 - 시각적 개선 */}
          <ContentCard title="통관 단계 안내" className="mt-8">
            <div className="space-y-3">
              {clearanceSteps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === clearanceSteps.length - 1;

                return (
                  <div key={step.step} className="flex items-start space-x-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          isLast ? "bg-success-100" : "bg-neutral-100"
                        }`}
                      >
                        <Icon
                          size={14}
                          className={`${
                            isLast ? "text-success-600" : "text-neutral-500"
                          }`}
                        />
                      </div>
                      {!isLast && (
                        <div className="mt-1 h-4 w-px bg-neutral-200" />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <h4 className="text-sm font-medium text-neutral-800">
                        {step.step}. {step.name}
                      </h4>
                      <p className="mt-0.5 text-xs text-neutral-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ContentCard>
        </aside>
      </div>
    </div>
  );
}
