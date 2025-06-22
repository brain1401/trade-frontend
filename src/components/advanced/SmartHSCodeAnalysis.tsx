import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, Target } from "lucide-react";
import { mockHSCodeResult } from "@/data/mock/hscode";

/**
 * HS Code 스마트 분석 위젯 컴포넌트
 *
 * AI 기반 HS Code 분석 결과를 표시하는 위젯
 * 수출 요구사항, 인증 요구사항 등의 상세 분석 정보를 제공
 */
export function SmartHSCodeAnalysis() {
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
