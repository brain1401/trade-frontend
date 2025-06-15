import { useState } from "react";
import { Brain, ArrowRight, Target, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type DetectedIntent = {
  type:
    | "hscode_analysis"
    | "cargo_tracking"
    | "trade_info"
    | "news_search"
    | "general";
  confidence: number;
  parameters: Record<string, string>;
  suggestedAction: string;
  route?: string;
};

type IntentDetectionProps = {
  query: string;
  intent: DetectedIntent | null;
  loading?: boolean;
  onAcceptIntent: (intent: DetectedIntent) => void;
  onRejectIntent: () => void;
  onRefineQuery?: (refinedQuery: string) => void;
};

export function IntentDetection({
  query,
  intent,
  loading = false,
  onAcceptIntent,
  onRejectIntent,
  onRefineQuery,
}: IntentDetectionProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAccept = async () => {
    if (!intent) return;

    setIsProcessing(true);
    try {
      onAcceptIntent(intent);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="animate-spin">
            <Brain className="h-5 w-5 text-primary-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-800">
              검색 의도를 분석하고 있습니다...
            </p>
            <p className="mt-1 text-xs text-neutral-500">"{query}"</p>
          </div>
        </div>
      </div>
    );
  }

  if (!intent) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="flex items-center gap-3 border-b bg-primary-50 p-4">
        <Brain className="h-5 w-5 text-primary-600" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-primary-800">
            검색 의도 분석 결과
          </h3>
          <p className="text-xs text-primary-600">
            Claude AI가 귀하의 검색 의도를 분석했습니다
          </p>
        </div>
        <ConfidenceBadge confidence={intent.confidence} />
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-start gap-3">
          <IntentTypeIcon type={intent.type} />
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h4 className="font-medium text-neutral-800">
                {getIntentTitle(intent.type)}
              </h4>
              <IntentTypeBadge type={intent.type} />
            </div>

            <p className="mb-3 text-sm text-neutral-600">
              {intent.suggestedAction}
            </p>

            {Object.keys(intent.parameters).length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-neutral-700">
                  감지된 정보:
                </p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(intent.parameters).map(([key, value]) => (
                    <Badge
                      key={key}
                      variant="outline"
                      className="px-2 py-0 text-xs"
                    >
                      {key}: {value}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRejectIntent}
              className="text-neutral-500"
            >
              다른 방법으로 검색
            </Button>

            {onRefineQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRefineQuery(query)}
                className="text-neutral-500"
              >
                검색어 수정
              </Button>
            )}
          </div>

          <Button
            onClick={handleAccept}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            {isProcessing ? "이동 중..." : "계속 진행"}
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      {intent.confidence < 0.7 && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 rounded border border-warning-200 bg-warning-50 p-2 text-sm">
            <AlertCircle size={14} className="flex-shrink-0 text-warning-600" />
            <p className="text-warning-700">
              분석 신뢰도가 낮습니다. 더 구체적인 검색어를 사용해보세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function IntentTypeIcon({ type }: { type: DetectedIntent["type"] }) {
  const iconMap = {
    hscode_analysis: "🔍",
    cargo_tracking: "📦",
    trade_info: "📊",
    news_search: "📰",
    general: "❓",
  };

  return (
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm">
      {iconMap[type]}
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const percentage = Math.round(confidence * 100);
  const variant =
    confidence >= 0.8 ? "default" : confidence >= 0.6 ? "secondary" : "outline";

  return (
    <Badge variant={variant} className="text-xs">
      {percentage}% 확신
    </Badge>
  );
}

function IntentTypeBadge({ type }: { type: DetectedIntent["type"] }) {
  const config = {
    hscode_analysis: { label: "HS Code 분석", variant: "default" as const },
    cargo_tracking: { label: "화물 추적", variant: "secondary" as const },
    trade_info: { label: "무역 정보", variant: "outline" as const },
    news_search: { label: "뉴스 검색", variant: "secondary" as const },
    general: { label: "일반 검색", variant: "outline" as const },
  };

  const { label, variant } = config[type];

  return (
    <Badge variant={variant} className="px-2 py-0 text-xs">
      {label}
    </Badge>
  );
}

function getIntentTitle(type: DetectedIntent["type"]): string {
  const titles = {
    hscode_analysis: "제품 분류 분석",
    cargo_tracking: "화물 추적 조회",
    trade_info: "무역 정보 검색",
    news_search: "관련 뉴스 검색",
    general: "일반 정보 검색",
  };

  return titles[type];
}

// 예시 의도 감지 결과 생성 함수 (개발용)
export function createMockIntent(query: string): DetectedIntent | null {
  // HS Code 분석 패턴
  if (
    query.includes("품목분류") ||
    query.includes("HS Code") ||
    query.includes("분류번호")
  ) {
    return {
      type: "hscode_analysis",
      confidence: 0.9,
      parameters: {
        제품명: query.replace(/품목분류|HS Code|분류번호/g, "").trim(),
      },
      suggestedAction: "제품에 대한 정확한 HS Code 분석을 시작하겠습니다.",
      route: "/hscode/analyze",
    };
  }

  // 화물 추적 패턴
  if (query.match(/[A-Z0-9]{8,}/)) {
    return {
      type: "cargo_tracking",
      confidence: 0.85,
      parameters: {
        화물관리번호: query.match(/[A-Z0-9]{8,}/)?.[0] || "",
      },
      suggestedAction: "화물 통관 진행 상황을 조회하겠습니다.",
      route: "/tracking",
    };
  }

  // 무역 정보 패턴
  if (
    query.includes("무역") ||
    query.includes("수출") ||
    query.includes("수입") ||
    query.includes("관세")
  ) {
    return {
      type: "trade_info",
      confidence: 0.75,
      parameters: {},
      suggestedAction: "관련 무역 정보와 규정을 검색하겠습니다.",
      route: "/trade",
    };
  }

  return null;
}
