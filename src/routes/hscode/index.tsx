import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ContentCard from "@/components/common/ContentCard";
import {
  FileText,
  Clock,
  ChevronRight,
  Plus,
  History,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/hscode/")({
  component: HsCodeIndexPage,
});

// 목업 분석 히스토리 데이터
const mockAnalysisHistory = [
  {
    id: "session-001",
    title: "스마트폰 케이스 분석",
    description: "실리콘 재질의 모바일 기기 보호케이스",
    hsCode: "3926.90.9000",
    confidence: 95,
    timestamp: "2024-01-15T10:30:00Z",
    status: "completed",
  },
  {
    id: "session-002",
    title: "블루투스 이어폰 분석",
    description: "무선 스테레오 헤드셋",
    hsCode: "8518.30.2000",
    confidence: 88,
    timestamp: "2024-01-14T15:20:00Z",
    status: "completed",
  },
  {
    id: "session-003",
    title: "화장품 세트 분석",
    description: "스킨케어 제품 세트",
    hsCode: "3304.99.0000",
    confidence: 92,
    timestamp: "2024-01-13T09:45:00Z",
    status: "completed",
  },
];

function HsCodeIndexPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">
          HS Code 분석
        </h1>
        <p className="text-neutral-600">
          AI 기반 종합 분석으로 정확한 HS Code를 찾아드립니다
        </p>
      </div>

      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-2/3">
          {/* 새로운 분석 시작 */}
          <ContentCard title="새로운 분석 시작">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary-50 p-6">
                  <Sparkles size={48} className="text-primary-600" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-neutral-800">
                AI 기반 HS Code 분석
              </h3>
              <p className="mb-6 text-sm text-neutral-600">
                제품 정보를 입력하시면 Claude AI가 멀티스텝 웹검색과 스마트 질문
                시스템으로 정확한 HS Code를 분석해드립니다.
              </p>
              <Button
                className="w-full max-w-md bg-primary-600 hover:bg-primary-700"
                asChild
              >
                <Link
                  to="/hscode/analyze/$sessionId"
                  params={{ sessionId: "new-session" }}
                >
                  <Plus size={16} className="mr-2" />새 분석 시작하기
                </Link>
              </Button>
            </div>
          </ContentCard>

          {/* 최근 분석 히스토리 */}
          <ContentCard title="최근 분석 히스토리" className="mt-8">
            <div className="space-y-4">
              {mockAnalysisHistory.map((analysis) => (
                <div
                  key={analysis.id}
                  className="rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText size={16} className="text-primary-600" />
                      <h3 className="font-medium text-neutral-800">
                        {analysis.title}
                      </h3>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      완료
                    </Badge>
                  </div>

                  <p className="mb-2 text-sm text-neutral-600">
                    {analysis.description}
                  </p>

                  <div className="mb-3 flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-neutral-500">HS Code:</span>
                      <span className="font-mono text-xs font-medium text-primary-700">
                        {analysis.hsCode}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-neutral-500">신뢰도:</span>
                      <span className="text-xs font-medium text-success-600">
                        {analysis.confidence}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Clock size={12} className="text-neutral-400" />
                      <span className="text-xs text-neutral-400">
                        {new Date(analysis.timestamp).toLocaleDateString(
                          "ko-KR",
                        )}
                      </span>
                    </div>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs text-primary-600 hover:underline"
                      asChild
                    >
                      <Link
                        to="/hscode/result/$resultId"
                        params={{ resultId: analysis.id }}
                      >
                        상세보기 <ChevronRight size={12} className="ml-0.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>
        </div>

        <aside className="mt-8 lg:mt-0 lg:w-1/3">
          {/* 분석 가이드 */}
          <ContentCard title="분석 가이드">
            <div className="space-y-3">
              <div className="rounded-lg bg-info-50 p-3">
                <h4 className="mb-1 text-sm font-medium text-info-800">
                  🎯 정확한 분석을 위한 팁
                </h4>
                <ul className="space-y-1 text-xs text-info-700">
                  <li>• 제품의 재질과 용도를 구체적으로 설명</li>
                  <li>• 제품 이미지가 있다면 함께 업로드</li>
                  <li>• 브랜드명보다는 기능적 특성에 집중</li>
                </ul>
              </div>

              <div className="rounded-lg bg-warning-50 p-3">
                <h4 className="mb-1 text-sm font-medium text-warning-800">
                  ⚡ 스마트 질문 시스템
                </h4>
                <p className="text-xs text-warning-700">
                  AI가 추가 정보가 필요할 때 자동으로 질문을 생성합니다.
                  답변할수록 분석 정확도가 높아집니다.
                </p>
              </div>
            </div>
          </ContentCard>

          {/* 통계 */}
          <ContentCard title="분석 통계" className="mt-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">1,234</p>
                <p className="text-xs text-neutral-600">총 분석 건수</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success-600">94.2%</p>
                <p className="text-xs text-neutral-600">평균 정확도</p>
              </div>
            </div>
          </ContentCard>
        </aside>
      </div>
    </div>
  );
}
