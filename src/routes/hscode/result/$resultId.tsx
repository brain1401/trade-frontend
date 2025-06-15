import { createFileRoute } from "@tanstack/react-router";
import { AnalysisResultDashboard } from "@/components/hscode/AnalysisResultDashboard";
import { useAnalysisResult } from "@/hooks/api/hscode/useAnalysisResult";

export const Route = createFileRoute("/hscode/result/$resultId")({
  component: AnalysisResultPage,
});

function AnalysisResultPage() {
  const { resultId } = Route.useParams();
  const { data: result, isLoading, error } = useAnalysisResult(resultId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">분석 결과를 불러오는 중...</div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-red-500">
          분석 결과를 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">분석 결과를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <AnalysisResultDashboard result={result} resultId={resultId} />
    </div>
  );
}
