import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";
import { useState } from "react";

import { FullPageChatInterface } from "@/components/search";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/stores/authStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [chatStarted, setChatStarted] = useState(false);

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center space-y-8 px-4 py-8 sm:py-12",
        !chatStarted && "!pt-[15rem]",
        chatStarted && "max-h-screen",
      )}
    >
      {/* Greeting and Status */}
      {!chatStarted && (
        <div className="flex-shrink-0 text-center">
          {user ? (
            <div className="flex flex-col items-center gap-3">
              <h1 className="text-3xl font-bold text-neutral-800 sm:text-4xl">
                안녕하세요, {user.name}님
              </h1>
              <Badge
                variant="secondary"
                className="border border-green-200 bg-green-100 text-green-800"
              >
                <User className="mr-1 h-3 w-3" />
                로그인됨
              </Badge>
            </div>
          ) : (
            <h1 className="text-3xl font-bold text-neutral-800 sm:text-4xl">
              AI 무역 정보 플랫폼
            </h1>
          )}
        </div>
      )}

      {/* Main Chat Interface */}
      <div className={cn("min-h-0 w-full max-w-3xl", chatStarted && "flex-1")}>
        <FullPageChatInterface
          onChatStart={() => setChatStarted(true)}
          welcomeMessage={
            isAuthenticated
              ? "개인화된 무역 정보와 변동사항 모니터링을 받아보세요. 궁금한 것을 자연어로 질문해주세요!"
              : "무역 관련 궁금한 것을 자연어로 질문해주세요. 로그인하시면 검색 히스토리와 변동사항 모니터링을 받을 수 있습니다."
          }
        />
      </div>
    </div>
  );
}
