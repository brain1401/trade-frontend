import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAnalysisStore } from "@/stores/analysisStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/hscode/analyze/$sessionId")({
  component: AnalysisSession,
});

function AnalysisSession() {
  const { sessionId } = Route.useParams();
  const router = useRouter();
  const analysisStore = useAnalysisStore();

  // Get current session from store
  const currentSession = analysisStore.activeSessions.get(sessionId);

  useEffect(() => {
    // Set current session when component mounts
    analysisStore.setCurrentSession(sessionId);

    // If session doesn't exist, redirect to home
    if (!currentSession) {
      router.navigate({ to: "/" });
    }
  }, [sessionId, analysisStore, router, currentSession]);

  if (!currentSession) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="space-y-4 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">세션을 찾을 수 없습니다</h2>
          <p className="text-muted-foreground">
            요청하신 분석 세션이 존재하지 않거나 만료되었습니다.
          </p>
          <Button onClick={() => router.navigate({ to: "/" })}>
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "initializing":
        return "bg-blue-100 text-blue-800";
      case "awaiting_questions":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "initializing":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "awaiting_questions":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "initializing":
        return "AI가 제품 정보를 분석하고 있습니다...";
      case "awaiting_questions":
        return "추가 정보가 필요합니다. 아래 질문에 답변해주세요.";
      case "processing":
        return "HS Code 분석을 진행하고 있습니다...";
      case "completed":
        return "분석이 완료되었습니다!";
      case "error":
        return "분석 중 오류가 발생했습니다.";
      default:
        return "상태를 확인하고 있습니다...";
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.navigate({ to: "/" })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            돌아가기
          </Button>
          <div>
            <h1 className="text-2xl font-bold">HS Code 분석</h1>
            <p className="text-muted-foreground">세션 ID: {sessionId}</p>
          </div>
        </div>

        <Badge className={getStatusColor(currentSession.status)}>
          {getStatusIcon(currentSession.status)}
          <span className="ml-2">
            {currentSession.status === "initializing" && "초기화 중"}
            {currentSession.status === "awaiting_questions" && "질문 대기"}
            {currentSession.status === "processing" && "분석 중"}
            {currentSession.status === "completed" && "완료"}
            {currentSession.status === "error" && "오류"}
          </span>
        </Badge>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span>분석 진행 상황</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>진행률</span>
              <span>{currentSession.progress}%</span>
            </div>
            <Progress value={currentSession.progress} className="w-full" />
          </div>

          <div className="text-sm text-muted-foreground">
            {getStatusMessage(currentSession.status)}
          </div>

          {currentSession.createdAt && (
            <div className="text-xs text-muted-foreground">
              시작 시간: {new Date(currentSession.createdAt).toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>분석 대상 제품</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium">제품 설명</h4>
              <p className="rounded bg-muted/50 p-3 text-sm text-muted-foreground">
                {currentSession.query}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      {currentSession.status === "awaiting_questions" &&
        currentSession.questions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>추가 정보 요청</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="mb-4 text-sm text-muted-foreground">
                더 정확한 분석을 위해 아래 질문에 답변해주세요.
              </div>

              {currentSession.questions.map((question, index) => (
                <div key={index} className="space-y-3 rounded-lg border p-4">
                  <h4 className="font-medium">질문 {index + 1}</h4>
                  <p className="text-sm">{question.text}</p>

                  {question.type === "multiple_choice" && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          className="flex cursor-pointer items-center space-x-2"
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            className="rounded border-gray-300"
                            onChange={(e) => {
                              analysisStore.submitAnswer(
                                sessionId,
                                question.id,
                                e.target.value,
                              );
                            }}
                          />
                          <span className="text-sm">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === "text" && (
                    <textarea
                      className="w-full rounded-md border p-3 text-sm"
                      placeholder="답변을 입력해주세요..."
                      rows={3}
                      onBlur={(e) => {
                        if (e.target.value.trim()) {
                          analysisStore.submitAnswer(
                            sessionId,
                            question.id,
                            e.target.value,
                          );
                        }
                      }}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

      {/* Processing Status */}
      {currentSession.status === "processing" && (
        <Card>
          <CardContent className="py-8">
            <div className="space-y-4 text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
              <div>
                <h3 className="text-lg font-medium">AI가 분석 중입니다</h3>
                <p className="text-sm text-muted-foreground">
                  제품 정보를 바탕으로 최적의 HS Code를 찾고 있습니다. 잠시만
                  기다려주세요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Status */}
      {currentSession.status === "completed" && currentSession.resultId && (
        <Card>
          <CardContent className="py-8">
            <div className="space-y-4 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
              <div>
                <h3 className="text-lg font-medium">분석이 완료되었습니다!</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  HS Code 분석 결과가 준비되었습니다.
                </p>
                <Button
                  onClick={() =>
                    router.navigate({
                      to: "/hscode/result/$resultId",
                      params: { resultId: currentSession.resultId! },
                    })
                  }
                >
                  결과 보기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Status */}
      {currentSession.status === "error" && (
        <Card>
          <CardContent className="py-8">
            <div className="space-y-4 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
              <div>
                <h3 className="text-lg font-medium">
                  분석 중 오류가 발생했습니다
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {currentSession.error || "알 수 없는 오류가 발생했습니다."}
                </p>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => router.navigate({ to: "/" })}
                  >
                    홈으로 돌아가기
                  </Button>
                  <Button
                    onClick={() => {
                      // 재시도 로직 구현
                      analysisStore.createSession(currentSession.query);
                    }}
                  >
                    다시 시도
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
