import { useState } from "react";
import { HelpCircle, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type SmartQuestion = {
  id: string;
  question: string;
  type: "multiple_choice" | "text" | "boolean" | "range";
  options?: string[];
  placeholder?: string;
  required?: boolean;
  context?: string;
};

type SmartQuestionResponse = {
  questionId: string;
  answer: string | number | boolean;
};

type SmartQuestionsProps = {
  questions: SmartQuestion[];
  loading?: boolean;
  onSubmitAnswers: (responses: SmartQuestionResponse[]) => void;
  onSkip?: () => void;
};

export function SmartQuestions({
  questions,
  loading = false,
  onSubmitAnswers,
  onSkip,
}: SmartQuestionsProps) {
  const [responses, setResponses] = useState<
    Record<string, string | number | boolean>
  >({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnswer =
    currentQuestion && responses[currentQuestion.id] !== undefined;

  const handleAnswerChange = (
    questionId: string,
    answer: string | number | boolean,
  ) => {
    setResponses((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const formattedResponses: SmartQuestionResponse[] = questions.map(
        (q) => ({
          questionId: q.id,
          answer: responses[q.id] || "",
        }),
      );
      onSubmitAnswers(formattedResponses);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-3/4 rounded bg-neutral-200"></div>
          <div className="space-y-2">
            <div className="h-4 w-1/2 rounded bg-neutral-200"></div>
            <div className="h-4 w-2/3 rounded bg-neutral-200"></div>
            <div className="h-4 w-1/3 rounded bg-neutral-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center shadow-sm">
        <CheckCircle className="mx-auto mb-3 h-12 w-12 text-success-500" />
        <p className="font-medium text-neutral-700">
          모든 필요한 정보가 수집되었습니다!
        </p>
        <p className="mt-1 text-sm text-neutral-500">분석을 진행하겠습니다.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-neutral-800">
              추가 정보 수집
            </h3>
          </div>

          <div className="text-xs text-neutral-500">
            {currentQuestionIndex + 1} / {questions.length}
          </div>
        </div>

        {/* 진행 바 */}
        <div className="h-2 w-full rounded-full bg-neutral-200">
          <div
            className="h-2 rounded-full bg-primary-600 transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        {/* 현재 질문 */}
        {currentQuestion && (
          <div className="space-y-4">
            {currentQuestion.context && (
              <div className="rounded-lg bg-primary-50 p-3">
                <p className="text-sm text-primary-700">
                  {currentQuestion.context}
                </p>
              </div>
            )}

            <div>
              <h4 className="mb-3 font-medium text-neutral-800">
                {currentQuestion.question}
                {currentQuestion.required && (
                  <span className="ml-1 text-danger-500">*</span>
                )}
              </h4>

              <QuestionInput
                question={currentQuestion}
                value={responses[currentQuestion.id]}
                onChange={(value) =>
                  handleAnswerChange(currentQuestion.id, value)
                }
              />
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex justify-between border-t border-neutral-100 pt-4">
          <div className="flex gap-2">
            {currentQuestionIndex > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={loading}
              >
                이전
              </Button>
            )}

            {onSkip && (
              <Button
                variant="ghost"
                onClick={onSkip}
                disabled={loading}
                className="text-neutral-500"
              >
                건너뛰기
              </Button>
            )}
          </div>

          <Button
            onClick={handleNext}
            disabled={loading || (currentQuestion?.required && !hasAnswer)}
            className="flex items-center gap-2"
          >
            {isLastQuestion ? "분석 시작" : "다음"}
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: SmartQuestion;
  value: string | number | boolean | undefined;
  onChange: (value: string | number | boolean) => void;
}) {
  switch (question.type) {
    case "multiple_choice":
      return (
        <RadioGroup value={(value as string) || ""} onValueChange={onChange}>
          {question.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${question.id}-${index}`} />
              <Label
                htmlFor={`${question.id}-${index}`}
                className="cursor-pointer text-sm"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );

    case "boolean":
      return (
        <RadioGroup
          value={value?.toString() || ""}
          onValueChange={(val) => onChange(val === "true")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id={`${question.id}-yes`} />
            <Label
              htmlFor={`${question.id}-yes`}
              className="cursor-pointer text-sm"
            >
              예
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id={`${question.id}-no`} />
            <Label
              htmlFor={`${question.id}-no`}
              className="cursor-pointer text-sm"
            >
              아니오
            </Label>
          </div>
        </RadioGroup>
      );

    case "text":
    default:
      return (
        <Textarea
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || "답변을 입력해 주세요..."}
          className="min-h-[100px] resize-none"
        />
      );
  }
}
