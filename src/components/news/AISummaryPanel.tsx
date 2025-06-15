import { Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

type AISummary = {
  summary: string;
  keyPoints: string[];
  businessImpact: string;
  relatedHsCodes: string[];
  confidence: number;
};

type AISummaryPanelProps = {
  summary: AISummary | null;
  loading?: boolean;
};

export function AISummaryPanel({
  summary,
  loading = false,
}: AISummaryPanelProps) {
  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-neutral-200"></div>
            <div className="h-5 w-32 rounded bg-neutral-200"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-neutral-200"></div>
            <div className="h-4 w-3/4 rounded bg-neutral-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="py-8 text-center">
          <Sparkles className="mx-auto mb-3 h-12 w-12 text-neutral-300" />
          <p className="text-neutral-500">AI 분석 결과가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-neutral-800">
              Claude AI 분석
            </h3>
          </div>

          <div className="text-xs text-neutral-500">
            신뢰도: {Math.round(summary.confidence * 100)}%
          </div>
        </div>

        {/* 요약 */}
        <div className="rounded-lg bg-primary-50 p-4">
          <h4 className="mb-2 text-sm font-semibold text-primary-800">
            주요 내용 요약
          </h4>
          <p className="text-sm leading-relaxed text-primary-700">
            {summary.summary}
          </p>
        </div>

        {/* 핵심 포인트 */}
        {summary.keyPoints.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold text-neutral-800">
              핵심 포인트
            </h4>
            <ul className="space-y-1">
              {summary.keyPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-neutral-700"
                >
                  <span className="mt-1 text-primary-600">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 비즈니스 영향 */}
        {summary.businessImpact && (
          <div className="border-t border-neutral-100 pt-4">
            <h4 className="mb-2 text-sm font-semibold text-neutral-800">
              비즈니스 영향
            </h4>
            <div className="rounded-lg bg-warning-50 p-3">
              <p className="text-sm leading-relaxed text-warning-800">
                {summary.businessImpact}
              </p>
            </div>
          </div>
        )}

        {/* 관련 HS Code */}
        {summary.relatedHsCodes.length > 0 && (
          <div className="border-t border-neutral-100 pt-4">
            <h4 className="mb-2 text-sm font-semibold text-neutral-800">
              관련 HS Code
            </h4>
            <div className="flex flex-wrap gap-2">
              {summary.relatedHsCodes.map((code, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-auto rounded-full px-2 py-1 text-xs"
                >
                  {code}
                  <ExternalLink size={10} className="ml-1" />
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* 주의사항 */}
        <div className="rounded-lg bg-neutral-50 p-3 text-xs text-neutral-600">
          ℹ️ 이 분석은 Claude AI에 의해 생성되었습니다. 정확한 정보는 공식
          출처를 확인해 주세요.
        </div>
      </div>
    </div>
  );
}
