import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Bookmark,
  Share2,
  Download,
  CheckCircle,
  AlertTriangle,
  Info,
  TrendingUp,
  Globe,
  Clock,
  Star,
} from "lucide-react";
import type { AnalysisResult, ComplianceRequirement } from "@/types/api/hscode";

type ResultDashboardProps = {
  result: AnalysisResult;
  onBookmark?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
};

const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 90) return "text-green-600";
  if (confidence >= 70) return "text-yellow-600";
  return "text-red-600";
};

const getConfidenceBadgeVariant = (
  confidence: number,
): "default" | "secondary" | "destructive" => {
  if (confidence >= 90) return "default";
  if (confidence >= 70) return "secondary";
  return "destructive";
};

const RequirementCard: React.FC<{
  requirement: ComplianceRequirement;
  type: "export" | "import";
}> = ({ requirement, type }) => {
  const getRequirementIcon = (reqType: ComplianceRequirement["type"]) => {
    switch (reqType) {
      case "document":
        return <FileText className="h-4 w-4" />;
      case "certificate":
        return <CheckCircle className="h-4 w-4" />;
      case "inspection":
        return <AlertTriangle className="h-4 w-4" />;
      case "license":
        return <Info className="h-4 w-4" />;
      case "other":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card
      className={`${requirement.mandatory ? "border-orange-200" : "border-gray-200"}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">{getRequirementIcon(requirement.type)}</div>
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h4 className="text-sm font-medium">{requirement.title}</h4>
              {requirement.mandatory && (
                <Badge variant="destructive" className="text-xs">
                  필수
                </Badge>
              )}
            </div>

            <p className="mb-3 text-sm text-muted-foreground">
              {requirement.description}
            </p>

            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-medium">담당 기관:</span>
                <span>{requirement.authority}</span>
              </div>

              {requirement.processingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>{requirement.processingTime}</span>
                </div>
              )}

              {requirement.cost && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">예상 비용:</span>
                  <span>{requirement.cost}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  result,
  onBookmark,
  onShare,
  onDownload,
}) => {
  const [activeTab, setActiveTab] = useState<
    "requirements" | "regulations" | "statistics"
  >("requirements");

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">
                HS Code: {result.recommendedHsCode}
              </CardTitle>
              <CardDescription>
                분석 완료 •{" "}
                {new Date(result.createdAt).toLocaleDateString("ko-KR")}
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={getConfidenceBadgeVariant(result.confidence)}
                className="text-sm"
              >
                신뢰도 {result.confidence}%
              </Badge>

              {result.isBookmarked && (
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3" />
                  북마크됨
                </Badge>
              )}
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-2 pt-4">
            <Button onClick={onBookmark} variant="outline" size="sm">
              <Bookmark className="mr-2 h-4 w-4" />
              북마크
            </Button>
            <Button onClick={onShare} variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              공유
            </Button>
            <Button onClick={onDownload} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              PDF 다운로드
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* 분석 결과 요약 */}
      <Card>
        <CardHeader>
          <CardTitle>분석 결과</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium">AI 분석 근거</h4>
              <p className="leading-relaxed text-muted-foreground">
                {result.reasoning}
              </p>
            </div>

            {result.alternativeHsCodes.length > 0 && (
              <div>
                <h4 className="mb-3 font-medium">대안 HS Code</h4>
                <div className="space-y-2">
                  {result.alternativeHsCodes.map((alt, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                    >
                      <div>
                        <span className="font-medium">{alt.code}</span>
                        <p className="text-sm text-muted-foreground">
                          {alt.reasoning}
                        </p>
                      </div>
                      <Badge variant="secondary">{alt.confidence}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 탭 섹션 */}
      <div className="space-y-4">
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("requirements")}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "requirements"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            수출입 요구사항
          </button>
          <button
            onClick={() => setActiveTab("regulations")}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "regulations"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            관련 규정
          </button>
          <button
            onClick={() => setActiveTab("statistics")}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "statistics"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            무역 통계
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        {activeTab === "requirements" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* 수출 요구사항 */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <TrendingUp className="h-5 w-5" />
                수출 요구사항
              </h3>

              {result.exportRequirements.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    특별한 수출 요구사항이 없습니다
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {result.exportRequirements.map((req) => (
                    <RequirementCard
                      key={req.id}
                      requirement={req}
                      type="export"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 수입 요구사항 */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Globe className="h-5 w-5" />
                수입 요구사항
              </h3>

              {result.importRequirements.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    특별한 수입 요구사항이 없습니다
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {result.importRequirements.map((req) => (
                    <RequirementCard
                      key={req.id}
                      requirement={req}
                      type="import"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "regulations" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">관련 규정 및 법규</h3>

            {result.relatedRegulations.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  관련 규정 정보가 없습니다
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {result.relatedRegulations.map((regulation) => (
                  <Card key={regulation.id}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">{regulation.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {regulation.description}
                        </p>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-muted-foreground">
                            최종 업데이트:{" "}
                            {new Date(
                              regulation.lastUpdated,
                            ).toLocaleDateString("ko-KR")}
                          </span>

                          {regulation.url && (
                            <Button variant="link" size="sm" asChild>
                              <a
                                href={regulation.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                자세히 보기
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "statistics" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">무역 통계</h3>

            {!result.tradeStatistics ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  무역 통계 데이터가 없습니다
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {result.tradeStatistics.exportData.totalQuantity.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        수출량
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.tradeStatistics.importData.totalQuantity.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        수입량
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        $
                        {result.tradeStatistics.exportData.totalValue.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        수출 총액
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
