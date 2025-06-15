import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  AlertTriangle,
  FileText,
  ExternalLink,
  Bookmark,
  Share2,
  TrendingUp,
} from "lucide-react";

type AnalysisResult = {
  id: string;
  hsCode: string;
  description: string;
  confidence: number;
  reasoning: string;
  requirements: {
    import: string[];
    export: string[];
  };
  relatedRegulations: Array<{
    id: string;
    title: string;
    summary: string;
    url?: string;
  }>;
  tradeStatistics?: {
    volume: number;
    value: number;
    trend: "up" | "down" | "stable";
  };
  createdAt: string;
};

type AnalysisResultDashboardProps = {
  result: AnalysisResult;
  resultId: string;
};

export const AnalysisResultDashboard: React.FC<
  AnalysisResultDashboardProps
> = ({ result, resultId }) => {
  const confidenceColor =
    result.confidence >= 90
      ? "bg-green-100 text-green-800"
      : result.confidence >= 70
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800";

  const handleBookmark = () => {
    console.log("북마크 추가:", resultId);
    // 실제 북마크 로직 구현
  };

  const handleShare = () => {
    console.log("공유하기:", resultId);
    // 실제 공유 로직 구현
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">HS Code 분석 결과</h1>
          <p className="text-muted-foreground">
            {new Date(result.createdAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            에 생성됨
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleBookmark}>
            <Bookmark className="mr-2 h-4 w-4" />
            북마크
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            공유
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 메인 결과 */}
        <div className="space-y-6 lg:col-span-2">
          {/* HS Code 결과 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>추천 HS Code</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold text-primary">
                  {result.hsCode}
                </div>
                <Badge className={confidenceColor}>
                  신뢰도 {result.confidence}%
                </Badge>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">제품 설명</h4>
                <p className="text-muted-foreground">{result.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* 분석 근거 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>분석 근거</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-muted-foreground">
                {result.reasoning}
              </p>
            </CardContent>
          </Card>

          {/* 수출입 요구사항 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">수입 요구사항</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.requirements.import.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-orange-500" />
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">수출 요구사항</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.requirements.export.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-orange-500" />
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 관련 규정 */}
          <Card>
            <CardHeader>
              <CardTitle>관련 규정 및 법령</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.relatedRegulations.map((regulation) => (
                  <div key={regulation.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h4 className="font-semibold">{regulation.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {regulation.summary}
                        </p>
                      </div>
                      {regulation.url && (
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 무역 통계 */}
          {result.tradeStatistics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>무역 통계</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">거래량</div>
                  <div className="text-2xl font-bold">
                    {result.tradeStatistics.volume.toLocaleString()}톤
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">거래액</div>
                  <div className="text-2xl font-bold">
                    ${result.tradeStatistics.value.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">추세</div>
                  <Badge
                    variant={
                      result.tradeStatistics.trend === "up"
                        ? "default"
                        : result.tradeStatistics.trend === "down"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {result.tradeStatistics.trend === "up"
                      ? "상승"
                      : result.tradeStatistics.trend === "down"
                        ? "하락"
                        : "안정"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 빠른 액션 */}
          <Card>
            <CardHeader>
              <CardTitle>빠른 액션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                PDF로 다운로드
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                통계 상세보기
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4" />
                규정 업데이트 알림
              </Button>
            </CardContent>
          </Card>

          {/* 정확성 개선 */}
          <Card>
            <CardHeader>
              <CardTitle>분석 결과 피드백</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="mb-4 text-sm text-muted-foreground">
                이 분석 결과가 도움이 되었나요?
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  👍 도움됨
                </Button>
                <Button variant="outline" size="sm">
                  👎 부정확함
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
