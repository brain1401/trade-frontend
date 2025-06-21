import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  User,
  Bot,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
  Bookmark,
  Share2,
} from "lucide-react";
import {
  mockHSCodeAnalysisSession,
  type AnalysisMessage,
} from "@/data/mock/hscode";
import { cn } from "@/lib/utils";

// 라우트를 정의하기 위해 파라미터 타입 추가
type RouteParams = {
  sessionId: string;
};

export const Route = createFileRoute("/hscode/analyze/$sessionId")({
  component: HSCodeAnalyzeChat,
}) as unknown;

function HSCodeAnalyzeChat() {
  // 현재는 목업이므로 sessionId를 하드코딩으로 설정
  const sessionId = "session-123";
  const [messages, setMessages] = useState<AnalysisMessage[]>(
    mockHSCodeAnalysisSession.messages as AnalysisMessage[],
  );
  const [inputValue, setInputValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // 메시지 전송 처리 (목업)
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: AnalysisMessage = {
      id: `msg-${Date.now()}`,
      type: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsAnalyzing(true);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponse: AnalysisMessage = {
        id: `msg-${Date.now()}-ai`,
        type: "assistant",
        content:
          "추가 정보를 바탕으로 분석을 계속하겠습니다. 잠시만 기다려주세요...",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsAnalyzing(false);
    }, 1500);
  };

  // 스마트 질문 선택 처리
  const handleQuestionOption = (questionId: string, option: string) => {
    const responseMessage: AnalysisMessage = {
      id: `msg-${Date.now()}`,
      type: "user",
      content: option,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, responseMessage]);
  };

  return (
    <div className="lg:flex lg:space-x-8">
      {/* 메인 채팅 영역 */}
      <div className="lg:w-2/3">
        <Card className="mb-4 py-0">
          <div className="flex flex-row items-center justify-between border-b p-4">
            <div>
              <h1 className="!mt-0 text-lg font-semibold text-neutral-800">
                HS Code 분석 세션
              </h1>
              <p className="text-xs text-neutral-500">세션 ID: {sessionId}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Bookmark size={16} className="mr-1" />
                북마크
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 size={16} className="mr-1" />
                공유
              </Button>
            </div>
          </div>

          <div className="p-4">
            {/* 채팅 메시지 영역 */}
            <ScrollArea ref={scrollAreaRef} className="h-[500px] pr-3">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.type === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg p-3",
                        message.type === "user"
                          ? "bg-primary-600 text-white"
                          : message.type === "smart_question"
                            ? "border border-warning-200 bg-warning-50"
                            : "bg-neutral-100 text-neutral-800",
                      )}
                    >
                      {/* 메시지 헤더 */}
                      <div className="mb-2 flex items-center space-x-2">
                        {message.type === "user" ? (
                          <User size={16} />
                        ) : message.type === "smart_question" ? (
                          <HelpCircle size={16} className="text-warning-600" />
                        ) : (
                          <Bot size={16} />
                        )}
                        <span className="text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      {/* 메시지 내용 */}
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>

                      {/* 스마트 질문 옵션 */}
                      {message.type === "smart_question" && message.options && (
                        <div className="mt-3 space-y-2">
                          {message.options.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() =>
                                handleQuestionOption(message.id, option)
                              }
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      )}

                      {/* 분석 결과 */}
                      {message.analysisResult && (
                        <div className="mt-3 rounded border border-success-200 bg-success-50 p-3">
                          <div className="mb-2 flex items-center space-x-2">
                            <CheckCircle2
                              size={16}
                              className="text-success-600"
                            />
                            <span className="text-sm font-medium text-success-800">
                              분석 완료
                            </span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <p>
                              <strong>HS Code:</strong>{" "}
                              {message.analysisResult.hscode}
                            </p>
                            <p>
                              <strong>분류:</strong>{" "}
                              {message.analysisResult.category}
                            </p>
                            <p>
                              <strong>신뢰도:</strong>{" "}
                              {message.analysisResult.confidence}%
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* 분석 중 표시 */}
                {isAnalyzing && (
                  <div className="flex justify-start">
                    <div className="rounded-lg bg-neutral-100 p-3">
                      <div className="flex items-center space-x-2">
                        <Bot size={16} />
                        <span className="text-xs text-neutral-500">
                          AI가 분석 중...
                        </span>
                      </div>
                      <div className="mt-2 flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 delay-100" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="my-4 border-t border-neutral-100" />

            {/* 입력 영역 */}
            <div className="flex space-x-2">
              <Input
                placeholder="분석하고 싶은 제품이나 추가 정보를 입력하세요..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isAnalyzing}
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* 사이드바 */}
      <div className="mt-8 lg:mt-0 lg:w-1/3">
        {/* 분석 진행 상황 */}
        <Card className="mb-4 py-0">
          <div className="border-b p-4">
            <h3 className="!mt-0 text-lg font-semibold text-neutral-800">
              분석 진행 상황
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">정보 수집</span>
                <Badge variant="default">완료</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">분류 분석</span>
                <Badge variant="default">완료</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">규제 확인</span>
                <Badge variant="secondary">진행중</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">최종 검토</span>
                <Badge variant="secondary">대기</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* 신뢰할 수 있는 출처 */}
        <Card className="mb-4 py-0">
          <div className="border-b p-4">
            <h3 className="!mt-0 text-lg font-semibold text-neutral-800">
              참고 출처
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div className="rounded bg-neutral-50 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">관세청 품목분류</span>
                  <ExternalLink size={14} className="text-neutral-400" />
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  공식 HS Code 분류 기준
                </p>
              </div>
              <div className="rounded bg-neutral-50 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">WCO 가이드라인</span>
                  <ExternalLink size={14} className="text-neutral-400" />
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  국제 표준 분류 규정
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* 관련 규제 미리보기 */}
        <Card className="py-0">
          <div className="border-b p-4">
            <h3 className="!mt-0 text-lg font-semibold text-neutral-800">
              관련 규제 미리보기
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <div className="text-sm">
                <Badge variant="destructive" className="mr-2">
                  필수
                </Badge>
                KC 인증 필요
              </div>
              <div className="text-sm">
                <Badge variant="default" className="mr-2">
                  권장
                </Badge>
                FCC 인증 (미국 수출 시)
              </div>
              <div className="text-sm">
                <Badge variant="secondary" className="mr-2">
                  참고
                </Badge>
                개인정보보호법 준수
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
