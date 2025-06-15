import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Bot, User, Sparkles } from "lucide-react";
import { useAnalysisStore } from "@/stores/analysisStore";
import { useHsCodeAnalysis } from "@/hooks/api/hscode/useHsCodeAnalysis";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isQuestion?: boolean;
};

type AnalysisChatProps = {
  sessionId: string;
  onAnalysisComplete?: (resultId: string) => void;
};

export const AnalysisChat: React.FC<AnalysisChatProps> = ({
  sessionId,
  onAnalysisComplete,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const analysisStore = useAnalysisStore();
  const currentSession = analysisStore.getCurrentSession();
  const { mutate: submitAnswer } = useHsCodeAnalysis();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 세션 초기화 시 환영 메시지 추가
  useEffect(() => {
    if (currentSession?.id === sessionId && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: `안녕하세요! AI HS Code 분석 시스템입니다. 
        
제품에 대해 자세히 설명해주시면 정확한 품목분류번호를 찾아드리겠습니다.
        
다음 정보를 포함해주시면 더 정확한 분석이 가능합니다:
- 제품의 재질 (예: 플라스틱, 금속, 면, 가죽 등)
- 제품의 용도 (예: 개인용, 산업용, 의료용 등)
- 제품의 크기나 규격
- 제조 방법이나 가공 정도
- 브랜드나 모델명 (선택사항)`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [currentSession, sessionId, messages.length]);

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentInput("");
    setIsLoading(true);

    try {
      // AI 분석 요청
      await new Promise<void>((resolve, reject) => {
        submitAnswer(
          {
            sessionId,
            question: currentInput,
            context: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          },
          {
            onSuccess: (response) => {
              const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response.message,
                timestamp: new Date(),
                isQuestion: response.needsMoreInfo,
              };

              setMessages((prev) => [...prev, assistantMessage]);

              // 분석 완료 시 결과 페이지로 이동
              if (response.completed && response.resultId) {
                onAnalysisComplete?.(response.resultId);
              }
              resolve();
            },
            onError: (error) => {
              reject(error);
            },
          },
        );
      });
    } catch (_e) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "죄송합니다. 분석 중 오류가 발생했습니다. 다시 시도해주세요.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex h-[600px] flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI 제품 분석 대화
          {currentSession?.progress && (
            <Badge variant="secondary" className="ml-auto">
              진행률: {currentSession.progress}%
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden">
        {/* 메시지 영역 */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {message.role === "user" ? "사용자" : "AI 분석사"}
                  </span>
                  {message.isQuestion && (
                    <Badge variant="outline" className="text-xs">
                      추가 정보 필요
                    </Badge>
                  )}
                </div>
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>
                <div className="mt-1 text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-muted px-3 py-2">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <span className="text-sm font-medium">AI 분석사</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">분석 중...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div className="flex gap-2">
          <Textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="제품에 대해 자세히 설명해주세요..."
            className="max-h-[120px] min-h-[60px] flex-1 resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!currentInput.trim() || isLoading}
            size="icon"
            className="self-end"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
