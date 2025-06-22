import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  RefreshCw,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

/**
 * AI 분석 카드 타입 정의
 */
export type AIAnalysisCardProps = {
  /** 카드 제목 */
  title: string;
  /** 카드 설명 */
  description: string;
  /** 분석 상태 */
  status: "completed" | "processing" | "pending";
  /** 아이콘 컴포넌트 */
  icon: React.ComponentType<{ className?: string }>;
  /** 진행률 (processing 상태일 때) */
  progress?: number;
  /** 분석 결과 (completed 상태일 때) */
  results?: string[];
  /** 색상 테마 */
  color: "primary" | "success" | "warning" | "info" | "brand";
  /** 상세보기 클릭 핸들러 */
  onViewDetails?: () => void;
  /** 분석 시작 클릭 핸들러 */
  onStartAnalysis?: () => void;
};

/**
 * AI 분석 카드 컴포넌트
 *
 * AI 기반 분석 작업의 상태와 결과를 카드 형태로 표시
 * 세 가지 상태(완료, 진행중, 대기)를 지원하며 각각 다른 UI를 제공
 */
export function AIAnalysisCard({
  title,
  description,
  status,
  icon: Icon,
  progress,
  results,
  color,
  onViewDetails,
  onStartAnalysis,
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
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={onViewDetails}
              >
                <ArrowRight className="mr-1 h-4 w-4" />
                상세 보기
              </Button>
            )}
            {status === "pending" && (
              <Button size="sm" className="flex-1" onClick={onStartAnalysis}>
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
