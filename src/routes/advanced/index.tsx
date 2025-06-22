import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Brain,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Target,
  Lightbulb,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle,
} from "lucide-react";
import { requireAuth } from "@/lib/utils/authGuard";
import { mockHSCodeResult } from "@/data/mock/hscode";
import { getTradeStatisticsSummary } from "@/data/mock/trade-statistics";

/**
 * 고급 기능 라우트 정의 (인증 필요)
 */
export const Route = createFileRoute("/advanced/")({
  beforeLoad: ({ context, location }) => {
    requireAuth(context, location);
  },
  component: AdvancedFeaturesPage,
});

/**
 * AI 분석 카드 타입
 */
type AIAnalysisCardProps = {
  title: string;
  description: string;
  status: "completed" | "processing" | "pending";
  icon: React.ComponentType<{ className?: string }>;
  progress?: number;
  results?: string[];
  color: "primary" | "success" | "warning" | "info" | "brand";
};

/**
 * AI 분석 카드 컴포넌트
 */
function AIAnalysisCard({
  title,
  description,
  status,
  icon: Icon,
  progress,
  results,
  color,
}: AIAnalysisCardProps) {
  const colorStyles = {
    primary: "border-primary-200 bg-primary-50/30",
    success: "border-success-200 bg-success-50/30",
    warning: "border-warning-200 bg-warning-50/30",
    info: "border-info-200 bg-info-50/30",
    brand: "border-brand-200 bg-brand-50/30",
  };

  const statusInfo = {
    completed: {
      text: "분석 완료",
      color: "text-success-600",
      icon: CheckCircle,
    },
    processing: { text: "분석 중", color: "text-warning-600", icon: RefreshCw },
    pending: { text: "대기 중", color: "text-neutral-600", icon: Clock },
  };

  const statusConfig = statusInfo[status];

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${colorStyles[color]}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 text-${color}-600`} />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <statusConfig.icon className={`h-4 w-4 ${statusConfig.color}`} />
            <Badge variant="outline" className="text-xs">
              {statusConfig.text}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-neutral-600">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 진행률 표시 (processing 상태인 경우) */}
          {status === "processing" && progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">진행률</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* 분석 결과 (completed 상태인 경우) */}
          {status === "completed" && results && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-neutral-800">
                분석 결과
              </h4>
              <div className="space-y-1">
                {results.slice(0, 3).map((result, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-success-600" />
                    <span className="text-neutral-700">{result}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            {status === "completed" && (
              <Button variant="outline" size="sm" className="flex-1">
                <ArrowRight className="mr-1 h-4 w-4" />
                상세 보기
              </Button>
            )}
            {status === "pending" && (
              <Button size="sm" className="flex-1">
                <Sparkles className="mr-1 h-4 w-4" />
                분석 시작
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 예측 통계 위젯 컴포넌트
 */
function PredictiveAnalytics() {
  const tradeStats = getTradeStatisticsSummary();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="text-brand-600 h-5 w-5" />
          AI 무역 예측 분석
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 예측 지표 */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <div className="text-sm text-neutral-600">다음 분기 수출 예측</div>
            <div className="text-2xl font-bold text-success-600">
              +{tradeStats.growthRates.exportGrowth + 2.3}%
            </div>
            <div className="text-xs text-neutral-500">현재 대비 상승 예상</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-neutral-600">리스크 지수</div>
            <div className="text-2xl font-bold text-warning-600">Medium</div>
            <div className="text-xs text-neutral-500">환율 변동 영향</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-neutral-600">추천 신뢰도</div>
            <div className="text-2xl font-bold text-info-600">87%</div>
            <div className="text-xs text-neutral-500">AI 모델 정확도</div>
          </div>
        </div>

        {/* AI 추천사항 */}
        <div className="space-y-3">
          <h4 className="font-medium text-neutral-800">AI 추천사항</h4>
          <div className="space-y-2">
            {[
              "전자제품 수출 확대 시점: 2월 중순 이후",
              "중국 시장 진출 리스크 관리 필요",
              "환율 헤지 상품 검토 권장",
            ].map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2">
                <Lightbulb className="text-brand-600 mt-0.5 h-4 w-4 flex-shrink-0" />
                <span className="text-sm text-neutral-700">
                  {recommendation}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * HS Code 스마트 분석 위젯 컴포넌트
 */
function SmartHSCodeAnalysis() {
  const analysisData = mockHSCodeResult;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary-600" />
          스마트 HS Code 분석
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {analysisData && (
          <>
            {/* 분석 대상 */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-neutral-800">
                  {analysisData.description}
                </div>
                <div className="text-sm text-neutral-600">
                  HS Code: {analysisData.hsCode}
                </div>
              </div>
              <Badge variant="secondary">높음</Badge>
            </div>

            {/* 주요 수출 요구사항 */}
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-800">
                주요 수출 요구사항
              </h4>
              <div className="space-y-2">
                {analysisData.analysis.exportRequirements
                  .slice(0, 3)
                  .map((req, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-neutral-800">
                          {req.country}
                        </div>
                        <div className="text-xs text-neutral-600">
                          {req.requirements.join(", ")}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        필수
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>

            {/* 인증 요구사항 */}
            <div className="space-y-3">
              <h4 className="font-medium text-neutral-800">인증 요구사항</h4>
              <div className="space-y-1">
                {analysisData.analysis.certifications
                  .slice(0, 2)
                  .map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Target className="h-3 w-3 text-info-600" />
                      <span className="text-neutral-700">{cert.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * 고급 기능 페이지 컴포넌트
 */
function AdvancedFeaturesPage() {
  const aiAnalysisCards = [
    {
      title: "시장 동향 분석",
      description: "최신 무역 데이터를 기반으로 시장 동향을 예측합니다.",
      status: "completed" as const,
      icon: BarChart3,
      results: [
        "아시아 시장 성장률 15% 증가 예상",
        "전자제품 수요 2월 급증 전망",
        "신흥국 시장 진출 기회 포착",
      ],
      color: "success" as const,
    },
    {
      title: "규제 변경 영향 분석",
      description: "새로운 무역 규제가 비즈니스에 미치는 영향을 분석합니다.",
      status: "processing" as const,
      icon: AlertTriangle,
      progress: 73,
      color: "warning" as const,
    },
    {
      title: "최적 라우팅 추천",
      description: "비용과 시간을 최적화하는 물류 경로를 제안합니다.",
      status: "pending" as const,
      icon: Target,
      color: "info" as const,
    },
  ];

  return (
    <div className="container mx-auto space-y-8 p-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold text-neutral-900">
          <Zap className="text-brand-600 h-8 w-8" />
          고급 기능
        </h1>
        <p className="text-neutral-600">
          AI 기반 분석과 예측 기능으로 더 스마트한 무역 업무를 경험하세요
        </p>
      </div>

      {/* AI 분석 카드 그리드 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {aiAnalysisCards.map((card, index) => (
          <AIAnalysisCard key={index} {...card} />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* 예측 분석 위젯 */}
        <PredictiveAnalytics />

        {/* HS Code 스마트 분석 위젯 */}
        <SmartHSCodeAnalysis />
      </div>

      {/* 기능 안내 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-brand-600 h-5 w-5" />
            고급 기능 안내
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 text-sm text-neutral-700">
            <div className="flex items-start gap-2">
              <span className="font-medium">• AI 분석:</span>
              <span>머신러닝을 활용한 시장 동향 예측 및 리스크 분석</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">• 스마트 추천:</span>
              <span>개인화된 무역 전략과 최적화 방안 제시</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">• 실시간 모니터링:</span>
              <span>규제 변경과 시장 변동사항을 실시간으로 추적</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
