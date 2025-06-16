import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ContentCard from "@/components/common/ContentCard";
import {
  Search,
  Package,
  Clock,
  Info,
  ChevronRight,
  FileText,
  Ship,
  HelpCircle,
  Phone,
  MessageCircle,
} from "lucide-react";

export const Route = createFileRoute("/tracking/search")({
  component: TrackingSearchPage,
});

// 목업 최근 추적 이력 - 간소화
const mockRecentSearches = [
  {
    number: "MSKU1234567",
    status: "통관 완료",
    commodity: "전자제품 (노트북)",
    searchDate: "2024-01-15T14:30:00Z",
    progress: 100,
  },
  {
    number: "COSCO987654",
    status: "통관 진행 중",
    commodity: "의류 및 액세서리",
    searchDate: "2024-01-15T10:15:00Z",
    progress: 75,
  },
  {
    number: "HAPAG555888",
    status: "검사 대기",
    commodity: "화장품 세트",
    searchDate: "2024-01-14T16:20:00Z",
    progress: 45,
  },
];

// 입력 형식 가이드
const inputGuides = [
  {
    type: "화물관리번호",
    format: "영문 4자리 + 숫자 7자리",
    example: "MSKU1234567",
    description: "컨테이너 화물의 고유 관리번호",
  },
  {
    type: "B/L번호",
    format: "영문/숫자 조합 (길이 가변)",
    example: "MSKU123456789012",
    description: "선하증권 번호 (Bill of Lading)",
  },
];

// 샘플 번호
const sampleNumbers = [
  { number: "MSKU1234567", type: "화물관리번호", commodity: "전자제품" },
  { number: "COSCO987654", type: "화물관리번호", commodity: "의류" },
  { number: "HAPAG555888", type: "화물관리번호", commodity: "화장품" },
];

function TrackingSearchPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingType, setTrackingType] = useState<"cargo" | "bl">("cargo");
  const [isSearching, setIsSearching] = useState(false);

  // 추적 검색 처리 개선
  const handleSearch = async () => {
    if (!trackingNumber.trim()) return;

    setIsSearching(true);

    // 실제 검색 시뮬레이션
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      // 결과 페이지로 이동
      window.location.href = `/tracking/result/${trackingNumber}`;
    } catch (error) {
      console.error("검색 오류:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: string, progress: number) => {
    if (progress === 100) return <Badge variant="default">{status}</Badge>;
    if (progress >= 75) return <Badge variant="secondary">{status}</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="mb-2 flex items-center space-x-2">
          <Search size={24} className="text-primary-600" />
          <h1 className="text-2xl font-bold text-neutral-800">
            화물 추적 검색
          </h1>
        </div>
        <p className="text-neutral-600">
          화물관리번호 또는 B/L번호를 입력하여 실시간 통관 진행 상황을
          확인하세요
        </p>
      </div>

      <div className="lg:flex lg:space-x-8">
        {/* 메인 검색 영역 */}
        <div className="lg:w-2/3">
          {/* 검색 입력 폼 */}
          <ContentCard title="화물 번호 검색">
            <div className="space-y-6">
              {/* 추적 타입 선택 - 개선된 UI */}
              <div>
                <Label className="mb-3 block text-sm font-medium text-neutral-700">
                  추적 유형 선택
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={trackingType === "cargo" ? "default" : "outline"}
                    onClick={() => setTrackingType("cargo")}
                    className="h-auto flex-col items-start p-4"
                    disabled={isSearching}
                  >
                    <div className="mb-1 flex items-center space-x-2">
                      <Package size={18} />
                      <span className="font-medium">화물관리번호</span>
                    </div>
                    <span className="text-xs opacity-80">
                      컨테이너 화물 추적
                    </span>
                  </Button>
                  <Button
                    variant={trackingType === "bl" ? "default" : "outline"}
                    onClick={() => setTrackingType("bl")}
                    className="h-auto flex-col items-start p-4"
                    disabled={isSearching}
                  >
                    <div className="mb-1 flex items-center space-x-2">
                      <FileText size={18} />
                      <span className="font-medium">B/L번호</span>
                    </div>
                    <span className="text-xs opacity-80">
                      선하증권 번호 추적
                    </span>
                  </Button>
                </div>
              </div>

              {/* 추적번호 입력 */}
              <div>
                <Label
                  htmlFor="trackingInput"
                  className="mb-2 block text-sm font-medium text-neutral-700"
                >
                  {trackingType === "cargo" ? "화물관리번호" : "B/L번호"} 입력
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="trackingInput"
                    placeholder={
                      trackingType === "cargo"
                        ? "예: MSKU1234567"
                        : "예: MSKU123456789012"
                    }
                    value={trackingNumber}
                    onChange={(e) =>
                      setTrackingNumber(e.target.value.toUpperCase())
                    }
                    onKeyPress={(e) =>
                      e.key === "Enter" && !isSearching && handleSearch()
                    }
                    className="flex-1"
                    disabled={isSearching}
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={!trackingNumber.trim() || isSearching}
                    className="min-w-[100px] bg-primary-600 hover:bg-primary-700"
                  >
                    {isSearching ? (
                      <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        검색중
                      </div>
                    ) : (
                      <>
                        <Search size={16} className="mr-2" />
                        추적하기
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* 입력 가이드 - 개선된 정보 표시 */}
              <div className="rounded-lg border border-info-200 bg-info-50 p-4">
                <div className="flex items-start space-x-2">
                  <Info
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-info-600"
                  />
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-info-800">
                      입력 가이드
                    </h4>
                    <div className="space-y-2">
                      {inputGuides.map((guide) => (
                        <div key={guide.type} className="text-xs text-info-700">
                          <div className="font-medium">{guide.type}</div>
                          <div>형식: {guide.format}</div>
                          <div>예시: {guide.example}</div>
                          <div className="mt-1 text-info-600">
                            {guide.description}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-info-200 pt-2 text-xs text-info-700">
                      💡 팁: 대소문자 구분하지 않으며, 하이픈(-) 등 특수문자는
                      제외하고 입력하세요
                    </div>
                  </div>
                </div>
              </div>

              {/* 샘플 번호 - 개선된 레이아웃 */}
              <div>
                <Label className="mb-3 block text-sm font-medium text-neutral-700">
                  샘플 번호로 테스트
                </Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
                  {sampleNumbers.map((sample) => (
                    <Button
                      key={sample.number}
                      variant="outline"
                      onClick={() => {
                        setTrackingNumber(sample.number);
                        setTrackingType("cargo");
                      }}
                      className="h-auto justify-start p-4 text-left"
                      disabled={isSearching}
                    >
                      <div className="flex w-full items-center justify-between">
                        <div>
                          <div className="font-medium text-neutral-800">
                            {sample.number}
                          </div>
                          <div className="mt-0.5 text-xs text-neutral-500">
                            {sample.type} • {sample.commodity}
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-neutral-400" />
                      </div>
                    </Button>
                  ))}
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
                  전체보기 <ChevronRight size={14} className="ml-0.5" />
                </Link>
              </Button>
            }
          >
            <div className="space-y-3">
              {mockRecentSearches.map((item, index) => (
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
                    {getStatusBadge(item.status, item.progress)}
                  </div>
                  <p className="mb-1 text-xs text-neutral-600">
                    {item.commodity}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      {new Date(item.searchDate).toLocaleDateString("ko-KR")}
                    </span>
                    <span className="text-xs font-medium text-neutral-500">
                      {item.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>

          {/* 추적 서비스 안내 */}
          <ContentCard title="추적 서비스 안내" className="mt-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Package
                  size={16}
                  className="mt-0.5 flex-shrink-0 text-primary-600"
                />
                <div>
                  <h4 className="mb-1 text-sm font-medium text-neutral-800">
                    실시간 위치 추적
                  </h4>
                  <p className="text-xs text-neutral-600">
                    선적부터 통관까지 전 과정을 실시간으로 추적할 수 있습니다
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock
                  size={16}
                  className="mt-0.5 flex-shrink-0 text-primary-600"
                />
                <div>
                  <h4 className="mb-1 text-sm font-medium text-neutral-800">
                    예상 시간 안내
                  </h4>
                  <p className="text-xs text-neutral-600">
                    각 통관 단계별 예상 완료 시간을 제공합니다
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Ship
                  size={16}
                  className="mt-0.5 flex-shrink-0 text-primary-600"
                />
                <div>
                  <h4 className="mb-1 text-sm font-medium text-neutral-800">
                    다양한 선사 지원
                  </h4>
                  <p className="text-xs text-neutral-600">
                    주요 글로벌 선사의 화물 추적을 지원합니다
                  </p>
                </div>
              </div>
            </div>
          </ContentCard>

          {/* 문의 및 도움말 */}
          <ContentCard title="문의 및 도움말" className="mt-8">
            <div className="space-y-3">
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <div className="mb-3 flex items-start space-x-2">
                  <HelpCircle size={16} className="mt-0.5 text-neutral-600" />
                  <h4 className="text-sm font-medium text-neutral-800">
                    자주 묻는 질문
                  </h4>
                </div>
                <div className="space-y-2">
                  <Button
                    variant="link"
                    className="h-auto justify-start p-0 text-xs text-neutral-600 hover:text-primary-600"
                  >
                    추적 번호를 모르는 경우
                  </Button>
                  <Button
                    variant="link"
                    className="h-auto justify-start p-0 text-xs text-neutral-600 hover:text-primary-600"
                  >
                    추적이 되지 않는 경우
                  </Button>
                  <Button
                    variant="link"
                    className="h-auto justify-start p-0 text-xs text-neutral-600 hover:text-primary-600"
                  >
                    통관 지연 문의
                  </Button>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Phone size={14} className="mr-1" />
                  전화 문의
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageCircle size={14} className="mr-1" />
                  채팅 상담
                </Button>
              </div>
            </div>
          </ContentCard>
        </div>
      </div>
    </div>
  );
}
