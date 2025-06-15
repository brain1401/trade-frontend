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
} from "lucide-react";

export const Route = createFileRoute("/tracking/")({
  component: TrackingIndexPage,
});

// 목업 최근 추적 데이터
const mockTrackingHistory = [
  {
    id: "TRK001",
    cargoNumber: "HJMU1234567",
    description: "전자제품 수입",
    status: "통관완료",
    statusCode: "completed",
    origin: "중국 선전",
    destination: "인천항",
    lastUpdate: "2024-01-15T14:30:00Z",
    progress: 100,
  },
  {
    id: "TRK002",
    cargoNumber: "TCLU9876543",
    description: "의류 및 액세서리",
    status: "검사진행중",
    statusCode: "inspection",
    origin: "베트남 호치민",
    destination: "부산항",
    lastUpdate: "2024-01-15T10:15:00Z",
    progress: 75,
  },
  {
    id: "TRK003",
    cargoNumber: "OOLU5555555",
    description: "화장품 세트",
    status: "하역중",
    statusCode: "unloading",
    origin: "일본 요코하마",
    destination: "인천항",
    lastUpdate: "2024-01-15T08:45:00Z",
    progress: 60,
  },
];

// 샘플 화물번호
const sampleNumbers = [
  "HJMU1234567",
  "TCLU9876543",
  "OOLU5555555",
  "MSCU7777777",
];

function TrackingIndexPage() {
  const [cargoNumber, setCargoNumber] = useState("");

  const handleSearch = () => {
    if (cargoNumber.trim()) {
      window.location.href = `/tracking/result/${cargoNumber}`;
    }
  };

  const getStatusIcon = (statusCode: string) => {
    switch (statusCode) {
      case "completed":
        return <CheckCircle size={16} className="text-success-500" />;
      case "inspection":
        return <AlertCircle size={16} className="text-warning-500" />;
      case "unloading":
        return <Truck size={16} className="text-info-500" />;
      default:
        return <Package size={16} className="text-neutral-500" />;
    }
  };

  const getStatusBadge = (statusCode: string, status: string) => {
    const variant = statusCode === "completed" ? "default" : "secondary";
    return (
      <Badge variant={variant} className="text-xs">
        {status}
      </Badge>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">화물 추적</h1>
        <p className="text-neutral-600">
          화물관리번호 또는 B/L번호로 실시간 통관 진행 상황을 확인하세요
        </p>
      </div>

      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-2/3">
          {/* 화물번호 입력 */}
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
                    placeholder="예: HJMU1234567"
                    value={cargoNumber}
                    onChange={(e) => setCargoNumber(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    <Search size={16} className="mr-2" />
                    추적
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-neutral-700">
                  샘플 번호로 테스트
                </Label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {sampleNumbers.map((number) => (
                    <Button
                      key={number}
                      variant="outline"
                      size="sm"
                      onClick={() => setCargoNumber(number)}
                      className="text-xs"
                    >
                      {number}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </ContentCard>

          {/* 최근 추적 히스토리 */}
          <ContentCard title="최근 추적 기록" className="mt-8">
            <div className="space-y-4">
              {mockTrackingHistory.map((tracking) => (
                <div
                  key={tracking.id}
                  className="rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(tracking.statusCode)}
                      <h3 className="font-medium text-neutral-800">
                        {tracking.cargoNumber}
                      </h3>
                    </div>
                    {getStatusBadge(tracking.statusCode, tracking.status)}
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

                  {/* 진행률 바 */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-600">진행률</span>
                      <span className="font-medium text-neutral-800">
                        {tracking.progress}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-neutral-200">
                      <div
                        className="h-2 rounded-full bg-primary-500 transition-all"
                        style={{ width: `${tracking.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Clock size={12} className="text-neutral-400" />
                      <span className="text-xs text-neutral-400">
                        마지막 업데이트:{" "}
                        {new Date(tracking.lastUpdate).toLocaleString("ko-KR")}
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
          {/* 추적 가이드 */}
          <ContentCard title="추적 가이드">
            <div className="space-y-3">
              <div className="rounded-lg bg-info-50 p-3">
                <h4 className="mb-1 text-sm font-medium text-info-800">
                  📋 입력 가능한 번호
                </h4>
                <ul className="space-y-1 text-xs text-info-700">
                  <li>• 화물관리번호 (11자리)</li>
                  <li>• B/L 번호 (선하증권번호)</li>
                  <li>• 컨테이너 번호 (CNTR)</li>
                </ul>
              </div>

              <div className="rounded-lg bg-warning-50 p-3">
                <h4 className="mb-1 text-sm font-medium text-warning-800">
                  ⏰ 업데이트 주기
                </h4>
                <p className="text-xs text-warning-700">
                  통관 진행 상황은 실시간으로 업데이트되며, 중요한 변경사항이
                  있을 때 알림을 받을 수 있습니다.
                </p>
              </div>
            </div>
          </ContentCard>

          {/* 통관 단계 안내 */}
          <ContentCard title="통관 단계 안내" className="mt-8">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-neutral-300" />
                <span className="text-sm text-neutral-600">1. 반입신고</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-neutral-300" />
                <span className="text-sm text-neutral-600">2. 하역작업</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-neutral-300" />
                <span className="text-sm text-neutral-600">3. 수입신고</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-neutral-300" />
                <span className="text-sm text-neutral-600">4. 물품검사</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-success-500" />
                <span className="text-sm text-neutral-600">5. 통관완료</span>
              </div>
            </div>
          </ContentCard>
        </aside>
      </div>
    </div>
  );
}
