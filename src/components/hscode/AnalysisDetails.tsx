import { CheckSquare, MessageSquareQuote } from "lucide-react";

/**
 * HS Code 분석 결과의 상세 정보를 표시하는 컴포넌트의 props 타입
 */
type AnalysisDetailsProps = {
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
 * HS Code 분석 결과를 시각적으로 표시하는 컴포넌트
 *
 * 사용자의 질문과 분석을 통해 도출된 추천 HS Code를
 * 구분된 섹션으로 나누어 표시함
 *
 * @param props - 컴포넌트 props
 * @param props.hscode - 분석을 통해 추천된 HS Code
 * @param props.query - 사용자가 입력한 분석 대상 질문
 *
 * @returns 분석 결과를 표시하는 JSX 엘리먼트
 *
 * @example
 * ```tsx
 * <AnalysisDetails
 *   hscode="1234.56.78"
 *   query="스마트폰을 수출하려고 하는데 HS Code가 무엇인가요?"
 * />
 * ```
 */
export function AnalysisDetails({ hscode, query }: AnalysisDetailsProps) {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-start rounded-lg bg-white p-4">
        <MessageSquareQuote className="mt-1 mr-3 h-5 w-5 flex-shrink-0 text-slate-500" />
        <div>
          <p className="font-semibold text-slate-700">분석 대상 질문</p>
          <p className="text-slate-600 italic">"{query}"</p>
        </div>
      </div>
      <div className="flex items-start rounded-lg bg-white p-4">
        <CheckSquare className="mt-1 mr-3 h-5 w-5 flex-shrink-0 text-green-600" />
        <div>
          <p className="font-semibold text-slate-700">추천 HS Code</p>
          <p className="text-2xl font-bold text-green-700">{hscode}</p>
        </div>
      </div>
    </div>
  );
}
