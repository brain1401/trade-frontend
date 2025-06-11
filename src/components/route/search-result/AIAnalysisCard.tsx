import { BrainCircuit } from "lucide-react";
import { AnalysisDetails } from "../hscode-info/AnalysisDetails";

/**
 * AI 분석 결과 카드 컴포넌트의 props 타입
 */
type AIAnalysisCardProps = {
  /**
   * 분석을 통해 추천된 HS Code
   *
   * @example "1234.56.78"
   * @example "8517.12.00"
   */
  hscode: string;

  /**
   * 사용자가 입력한 분석 대상 질문
   *
   * @example "스마트폰을 수출하려고 하는데 HS Code가 무엇인가요?"
   * @example "철강 제품의 관세 분류는 어떻게 되나요?"
   */
  query: string;
};

/**
 * AI 분석 결과를 시각적으로 표시하는 카드 컴포넌트
 *
 * 사용자의 질문에 대한 AI 분석 결과를 파란색 테마의 카드 형태로 표시하며,
 * 내부에 AnalysisDetails 컴포넌트를 포함하여 상세 정보를 제공함
 *
 * @param props - 컴포넌트 props
 * @param props.hscode - 분석을 통해 추천된 HS Code
 * @param props.query - 사용자가 입력한 분석 대상 질문
 *
 * @returns AI 분석 결과 카드를 표시하는 JSX 엘리먼트
 *
 * @example
 * ```tsx
 * <AIAnalysisCard
 *   hscode="8517.12.00"
 *   query="스마트폰을 수출하려고 하는데 HS Code가 무엇인가요?"
 * />
 * ```
 */
export function AIAnalysisCard({ hscode, query }: AIAnalysisCardProps) {
  return (
    <div className="mx-auto mb-10 w-full max-w-5xl overflow-hidden rounded-xl border border-blue-200 bg-blue-50 shadow-md">
      <div className="p-6 sm:p-8">
        <div className="flex items-start">
          <BrainCircuit className="mr-5 h-10 w-10 flex-shrink-0 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-blue-900">AI 분석 결과</h2>
            <p className="mt-1 text-slate-600">
              사용자님의 질문을 바탕으로 AI가 최적의 HS Code를 분석했습니다.
            </p>
          </div>
        </div>
        <AnalysisDetails hscode={hscode} query={query} />
      </div>
    </div>
  );
}
