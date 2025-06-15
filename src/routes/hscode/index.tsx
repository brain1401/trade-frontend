import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, FileText, Globe, TrendingUp, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/hscode/")({
  component: RouteComponent,
});

function RouteComponent() {
  const analysisFeatures = [
    {
      icon: <Search className="h-8 w-8 text-primary-500" />,
      title: "Claude AI 분석",
      description: "최신 AI 기술로 정확한 HS Code 분류",
    },
    {
      icon: <FileText className="h-8 w-8 text-success-500" />,
      title: "다양한 입력 방식",
      description: "텍스트 설명과 제품 이미지 모두 지원",
    },
    {
      icon: <Globe className="h-8 w-8 text-warning-500" />,
      title: "규제 정보 제공",
      description: "수출입 요구사항과 인증 정보 자동 조회",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-danger-500" />,
      title: "무역 통계",
      description: "실시간 무역량과 시장 동향 분석",
    },
  ];

  const sampleAnalysis = [
    {
      product: "삶은 족발",
      hsCode: "1602.32",
      description: "조리된 돼지고기 제품",
      status: "완료",
    },
    {
      product: "스마트폰 충전기",
      hsCode: "8504.40",
      description: "정전압 정전류 전원공급장치",
      status: "완료",
    },
    {
      product: "유기농 녹차",
      hsCode: "0902.10",
      description: "발효하지 않은 차",
      status: "완료",
    },
  ];

  return (
    <div className="flex flex-1 flex-col space-y-8">
      {/* 헤더 섹션 */}
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold text-neutral-800">
          HS Code 분석 서비스
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-lg text-neutral-600">
          Claude AI를 활용한 정확하고 빠른 HS Code 분류와 포괄적인 무역 정보를
          제공합니다.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-primary-600 hover:bg-primary-700"
        >
          <Link to="/hscode/analyze/$sessionId" params={{ sessionId: "new" }}>
            <Search className="mr-2 h-5 w-5" />
            분석 시작하기
          </Link>
        </Button>
      </div>

      {/* 주요 기능 소개 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {analysisFeatures.map(({ icon, title, description }) => (
          <Card key={title} className="text-center">
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">{icon}</div>
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm text-neutral-600">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 분석 예시 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            분석 예시
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sampleAnalysis.map(({ product, hsCode, description, status }) => (
              <div
                key={product}
                className="rounded-lg border border-neutral-200 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium text-neutral-800">{product}</h4>
                  <Badge variant="secondary">{status}</Badge>
                </div>
                <div className="mb-1 text-sm text-neutral-600">
                  <span className="font-medium">HS Code:</span> {hsCode}
                </div>
                <div className="text-sm text-neutral-600">{description}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link
                to="/hscode/analyze/$sessionId"
                params={{ sessionId: "new" }}
              >
                나만의 분석 시작하기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 최근 분석 결과 (로그인 사용자만) */}
      <Card>
        <CardHeader>
          <CardTitle>최근 분석 결과</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-neutral-600">
            로그인하시면 최근 분석 결과를 확인할 수 있습니다.
          </p>
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link to="/auth/login">로그인하기</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
