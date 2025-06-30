import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback } from "react";
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FullPageChatInterface } from "@/components/search";
import { useAuth } from "@/stores/authStore";
import { bookmarkApi, exchangeRatesApi } from "@/lib/api";
import { toast } from "sonner";
import type { RelatedInfo } from "@/types/chat";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { user, isAuthenticated } = useAuth();
      const _ = useQuery({
      queryKey: ["exchange_rate"],
      queryFn: () => exchangeRatesApi.getExchangeRates()
    })

  return (
    <div className="via-brand-50 flex h-full w-full flex-col bg-gradient-to-br from-primary-100 to-primary-200/80">
      <div className="flex min-h-full w-full flex-col">
        {/* 상단 환영 메시지 (간소화) */}
        <div className="flex items-center justify-between border-b bg-white/80 px-6 py-4 backdrop-blur-sm">
          <div>
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-foreground">
                  안녕하세요, {user.name}님
                </h1>
                <Badge
                  variant="secondary"
                  className="bg-success-100 text-success-800"
                >
                  <User className="mr-1 h-3 w-3" />
                  로그인됨
                </Badge>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-foreground">
                  TRADE 무역 정보 플랫폼
                </h1>
                <Badge variant="outline" className="text-neutral-600">
                  로그인 없이 이용 가능
                </Badge>
              </div>
            )}
          </div>

          {!isAuthenticated && (
            <Link to="/auth/login" className="flex items-center">
              <Badge
                variant="default"
                className="cursor-pointer bg-primary-600 px-4 py-2 text-sm font-semibold hover:bg-primary-700"
              >
                로그인
              </Badge>
            </Link>
          )}
        </div>

        {/* 메인 채팅 인터페이스 */}
        <div className="flex-1">
          <FullPageChatInterface
            // onBookmark={handleBookmarkAdd}
            welcomeMessage={
              isAuthenticated
                ? "개인화된 무역 정보와 변동사항 모니터링을 받아보세요. 궁금한 것을 자연어로 질문해주세요!"
                : "무역 관련 궁금한 것을 자연어로 질문해주세요. 로그인하시면 검색 히스토리와 변동사항 모니터링을 받을 수 있습니다."
            }
          />
        </div>
      </div>
    </div>
  );
}
