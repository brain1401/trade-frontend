import { createFileRoute } from "@tanstack/react-router";
import { Eye, Save } from "lucide-react";
import { AIAnalysisCard } from "../../../components/route/search-result/AIAnalysisCard";

/**
 * 검색 결과 페이지의 라우트 설정
 *
 * 사용자의 질문에 대한 AI 분석 결과를 표시하는 페이지
 * URL 파라미터로 전달된 query를 디코딩하여 분석 결과와 함께 표시
 */
export const Route = createFileRoute("/search-result/$query/")({
  component: SearchResultPage,
});

/**
 * 검색 결과 페이지 컴포넌트
 *
 * 사용자의 질문에 대한 AI 분석 결과를 중심으로 구성된 페이지
 * AIAnalysisCard를 사용하여 분석 결과를 표시하고,
 * 추가적인 관련 정보나 액션을 제공할 수 있음
 *
 * @returns 검색 결과 페이지 JSX 엘리먼트
 */
function SearchResultPage() {
  const { query } = Route.useParams();

  // URL 파라미터 처리
  const queryInfo = {
    /** URL 인코딩된 원본 query */
    encodedQuery: query,
    /** 디코딩된 사용자 질문 */
    decodedQuery: decodeURIComponent(query),
    /** 질문 길이가 적절한지 확인 */
    isValidLength:
      decodeURIComponent(query).length > 0 &&
      decodeURIComponent(query).length <= 500,
  };

  // AI 분석 결과 데이터 - 실제로는 API에서 가져올 데이터
  const analysisResult = {
    /** 분석을 통해 추천된 HS Code */
    recommendedHSCode: "8517.12.00",
    /** 분석 신뢰도 (0-100) */
    confidenceScore: 95,
    /** 분석 상태 */
    status: "completed" as "completed" | "processing" | "failed",
    /** 분석 처리 시간 (초) */
    processingTime: 2.3,
  };

  // 페이지 헤더 설정
  const pageHeader = {
    /** 메인 제목 */
    title: "AI 분석 완료",
    /** 부제목 */
    subtitle: "입력하신 질문을 분석하여 최적의 HS Code를 찾았습니다.",
    /** 성공 상태 메시지 */
    successMessage: `신뢰도 ${analysisResult.confidenceScore}%로 분석이 완료되었습니다.`,
  };

  // 다음 단계 액션 버튼들
  const nextStepActions = [
    {
      /** 액션 ID */
      id: "view-details",
      /** 버튼 레이블 */
      label: "상세 정보 보기",
      /** 액션 설명 */
      description: "HS Code에 대한 자세한 정보와 분류 기준을 확인합니다",
      /** 아이콘 컴포넌트 */
      icon: Eye,
      /** 스타일 클래스 */
      styleClass: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
      /** 클릭 핸들러 함수명 */
      action: "handleViewDetails",
      /** 대상 경로 */
      targetPath: `/hscode/guide/${analysisResult.recommendedHSCode}/`,
    },
    {
      id: "save-result",
      label: "결과 저장하기",
      description: "분석 결과를 북마크에 저장하여 나중에 확인할 수 있습니다",
      icon: Save,
      styleClass:
        "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
      action: "handleSaveResult",
      targetPath: null,
    },
  ];

  // 버튼 클릭 핸들러들
  const handleViewDetails = () => {
    // 실제로는 라우터 네비게이션 또는 링크 처리
    console.log(`Navigate to: ${nextStepActions[0].targetPath}`);
  };

  const handleSaveResult = () => {
    // 실제로는 API 호출을 통한 저장 처리
    console.log("Save analysis result to bookmarks");
  };

  // 액션 핸들러 매핑
  const actionHandlers = {
    handleViewDetails,
    handleSaveResult,
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* 페이지 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-slate-800">
            {pageHeader.title}
          </h1>
          <p className="mb-1 text-slate-600">{pageHeader.subtitle}</p>
          {analysisResult.status === "completed" && (
            <p className="text-sm font-medium text-green-600">
              {pageHeader.successMessage}
            </p>
          )}
        </div>

        {/* AI 분석 결과 카드 */}
        <AIAnalysisCard
          hscode={analysisResult.recommendedHSCode}
          query={queryInfo.decodedQuery}
        />

        {/* 추가 액션 영역 */}
        <div className="mx-auto mt-8 max-w-5xl">
          <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-slate-700">
              다음 단계
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {nextStepActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className={`flex items-center justify-center gap-3 rounded-lg border px-6 py-4 transition-colors ${action.styleClass}`}
                  onClick={() =>
                    actionHandlers[
                      action.action as keyof typeof actionHandlers
                    ]()
                  }
                  title={action.description}
                >
                  <action.icon className="h-5 w-5" />
                  <span className="font-medium">{action.label}</span>
                </button>
              ))}
            </div>

            {/* 분석 메타 정보 */}
            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>분석 처리 시간: {analysisResult.processingTime}초</span>
                <span>질문 길이: {queryInfo.decodedQuery.length}자</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
