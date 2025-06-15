import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ContentCard from "@/components/common/ContentCard";
import { Search, Package, Clock, Info, ChevronRight } from "lucide-react";
import { mockTrackingHistory } from "@/data/mock/tracking";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tracking/search")({
  component: TrackingSearchPage,
});

function TrackingSearchPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingType, setTrackingType] = useState<"cargo" | "bl">("cargo");
  const [isSearching, setIsSearching] = useState(false);

  // 추적 검색 처리 (목업)
  const handleSearch = () => {
    if (!trackingNumber.trim()) return;

    setIsSearching(true);

    // 실제로는 API 호출 후 결과 페이지로 이동
    setTimeout(() => {
      setIsSearching(false);
      // 임시로 고정된 결과 페이지로 이동
      window.location.href = `/tracking/result/MSKU1234567`;
    }, 1500);
  };

  return (
    <div className="lg:flex lg:space-x-8">
      {/* 메인 검색 영역 */}
      <div className="lg:w-2/3">
        <ContentCard title="화물 추적">
          <div className="space-y-6">
            {/* 추적 타입 선택 */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-neutral-700">
                추적 유형 선택
              </h3>
              <div className="flex space-x-2">
                <Button
                  variant={trackingType === "cargo" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTrackingType("cargo")}
                >
                  화물관리번호
                </Button>
                <Button
                  variant={trackingType === "bl" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTrackingType("bl")}
                >
                  B/L번호
                </Button>
              </div>
            </div>

            {/* 추적번호 입력 */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-neutral-700">
                {trackingType === "cargo" ? "화물관리번호" : "B/L번호"} 입력
              </h3>
              <div className="flex space-x-2">
                <Input
                  placeholder={
                    trackingType === "cargo"
                      ? "예: MSKU1234567"
                      : "예: MSKU1234567890"
                  }
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSearch}
                  disabled={!trackingNumber.trim() || isSearching}
                >
                  {isSearching ? (
                    <>검색 중...</>
                  ) : (
                    <>
                      <Search size={16} className="mr-1" />
                      추적
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* 입력 가이드 */}
            <div className="rounded-lg border border-info-200 bg-info-50 p-4">
              <div className="flex items-start space-x-2">
                <Info size={16} className="mt-0.5 text-info-600" />
                <div>
                  <h4 className="mb-1 text-sm font-medium text-info-800">
                    입력 가이드
                  </h4>
                  <ul className="space-y-1 text-xs text-info-700">
                    <li>
                      • 화물관리번호: 영문 4자리 + 숫자 7자리 (예: MSKU1234567)
                    </li>
                    <li>
                      • B/L번호: 영문 4자리 + 숫자 10자리 (예: MSKU1234567890)
                    </li>
                    <li>• 대소문자 구분하지 않습니다</li>
                    <li>• 하이픈(-) 등 특수문자는 제외하고 입력하세요</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 샘플 번호 */}
            <div>
              <h4 className="mb-2 text-sm font-medium text-neutral-700">
                샘플 번호로 테스트
              </h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTrackingNumber("MSKU1234567")}
                >
                  MSKU1234567
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTrackingNumber("COSCO987654")}
                >
                  COSCO987654
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTrackingNumber("HAPAG555888")}
                >
                  HAPAG555888
                </Button>
              </div>
            </div>
          </div>
        </ContentCard>
      </div>

      {/* 사이드바 */}
      <div className="mt-8 lg:mt-0 lg:w-1/3">
        {/* 최근 추적 이력 */}
        <ContentCard
          title="최근 추적 이력"
          titleRightElement={
            <Button
              variant="link"
              className="h-auto p-0 text-sm text-primary-600 hover:underline"
              asChild
            >
              <Link to="/dashboard">
                전체보기 <ChevronRight size={16} className="ml-0.5" />
              </Link>
            </Button>
          }
        >
          <div className="space-y-3">
            {mockTrackingHistory.map((item) => (
              <div
                key={item.number}
                className="border-b border-neutral-100 pb-3 last:border-b-0"
              >
                <div className="mb-1 flex items-center justify-between">
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm font-medium text-primary-600 hover:underline"
                    asChild
                  >
                    <Link
                      to="/tracking/result/$number"
                      params={{ number: item.number }}
                    >
                      {item.number}
                    </Link>
                  </Button>
                  <Badge
                    variant={
                      item.status === "통관 완료"
                        ? "default"
                        : item.status === "통관 진행 중"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
                <p className="mb-1 text-xs text-neutral-600">
                  {item.commodity}
                </p>
                <p className="text-xs text-neutral-400">
                  {new Date(item.searchDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </ContentCard>

        {/* 추적 안내 */}
        <ContentCard title="추적 서비스 안내" className="mt-8">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Package size={16} className="mt-0.5 text-primary-600" />
              <div>
                <h4 className="mb-1 text-sm font-medium text-neutral-800">
                  실시간 위치 추적
                </h4>
                <p className="text-xs text-neutral-600">
                  선적부터 통관까지 전 과정 추적
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock size={16} className="mt-0.5 text-primary-600" />
              <div>
                <h4 className="mb-1 text-sm font-medium text-neutral-800">
                  예상 시간 안내
                </h4>
                <p className="text-xs text-neutral-600">
                  각 단계별 예상 완료 시간 제공
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Info size={16} className="mt-0.5 text-primary-600" />
              <div>
                <h4 className="mb-1 text-sm font-medium text-neutral-800">
                  알림 서비스
                </h4>
                <p className="text-xs text-neutral-600">
                  상태 변경 시 자동 알림 전송
                </p>
              </div>
            </div>
          </div>
        </ContentCard>

        {/* 문의 및 도움말 */}
        <ContentCard title="문의 및 도움말" className="mt-8">
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start text-sm">
              추적 번호를 모르겠어요
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm">
              추적이 안 되는 경우
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm">
              고객센터 문의
            </Button>
          </div>
        </ContentCard>
      </div>
    </div>
  );
}
