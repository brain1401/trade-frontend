import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Package, Clock, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/tracking/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      navigate({
        to: "/tracking/$number",
        params: { number: trackingNumber.trim() },
      });
    }
  };

  const recentSearches = ["ABCD-1234-5678", "KRPU-2024-0001", "SEIC-2024-1201"];

  const trackingExamples = [
    {
      type: "화물관리번호",
      format: "ABCD-1234-5678",
      description: "관세청에서 발급하는 화물 관리번호",
    },
    {
      type: "B/L 번호",
      format: "SEIC2024120100001",
      description: "선하증권 번호로도 추적 가능",
    },
    {
      type: "컨테이너번호",
      format: "TEMU1234567",
      description: "컨테이너 번호로 화물 추적",
    },
  ];

  const trackingSteps = [
    {
      icon: <Package className="h-6 w-6 text-primary-500" />,
      title: "번호 입력",
      description: "화물관리번호 또는 B/L 번호 입력",
    },
    {
      icon: <Search className="h-6 w-6 text-warning-500" />,
      title: "실시간 조회",
      description: "관세청 시스템에서 최신 정보 조회",
    },
    {
      icon: <Clock className="h-6 w-6 text-success-500" />,
      title: "진행 상황",
      description: "통관 진행 단계별 상세 정보",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-success-600" />,
      title: "완료 알림",
      description: "통관 완료 시 실시간 알림",
    },
  ];

  return (
    <div className="mx-auto flex max-w-4xl flex-1 flex-col space-y-8">
      {/* 헤더 섹션 */}
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold text-neutral-800">
          화물 추적 서비스
        </h1>
        <p className="mb-6 text-lg text-neutral-600">
          화물관리번호나 B/L 번호로 실시간 통관 진행 상황을 확인하세요.
        </p>
      </div>

      {/* 추적 입력 폼 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-6 w-6" />
            화물 추적
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="trackingNumber">화물관리번호 또는 B/L 번호</Label>
              <Input
                id="trackingNumber"
                type="text"
                placeholder="예: ABCD-1234-5678 또는 SEIC2024120100001"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!trackingNumber.trim()}
            >
              <Search className="mr-2 h-4 w-4" />
              추적하기
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 최근 검색 */}
      {recentSearches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>최근 검색</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((number) => (
                <Badge
                  key={number}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary-100"
                  onClick={() => setTrackingNumber(number)}
                >
                  {number}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 추적 번호 형식 안내 */}
      <Card>
        <CardHeader>
          <CardTitle>추적 번호 형식 안내</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trackingExamples.map(({ type, format, description }) => (
              <div key={type} className="border-l-4 border-primary-200 pl-4">
                <div className="mb-1 flex items-center gap-2">
                  <h4 className="font-medium text-neutral-800">{type}</h4>
                  <Badge variant="outline">{format}</Badge>
                </div>
                <p className="text-sm text-neutral-600">{description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 추적 프로세스 */}
      <Card>
        <CardHeader>
          <CardTitle>추적 프로세스</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {trackingSteps.map(({ icon, title, description }, index) => (
              <div key={title} className="text-center">
                <div className="mb-3 flex justify-center">{icon}</div>
                <h4 className="mb-2 font-medium">{title}</h4>
                <p className="text-sm text-neutral-600">{description}</p>
                {index < trackingSteps.length - 1 && (
                  <div className="absolute top-1/2 right-0 hidden translate-x-1/2 -translate-y-1/2 transform md:block">
                    <div className="h-0.5 w-8 bg-neutral-200"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
