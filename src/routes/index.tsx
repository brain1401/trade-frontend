import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/stores/authStore";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="via-brand-50 flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200/80">
      <div className="flex min-h-full flex-col items-center justify-center space-y-8 px-4">
        {/* 환영 메시지 */}
        {isAuthenticated && user ? (
          <div className="text-center">
            <h1 className="text-6xl font-bold tracking-tight text-foreground">
              안녕하세요, {user.name}님
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              개인화된 무역 정보를 확인해보세요
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Badge
                variant="secondary"
                className="bg-success-100 text-success-800"
              >
                <User className="mr-1 h-3 w-3" />
                로그인됨
              </Badge>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-6xl font-bold tracking-tight text-foreground">
              TRADE
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              무역 정보 통합 플랫폼
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-neutral-600">
                로그인 없이 이용 가능
              </Badge>
              <Link to="/auth/login">
                <Badge
                  variant="default"
                  className="cursor-pointer bg-primary-600 px-3 py-2 hover:bg-primary-700"
                >
                  로그인하여 더 많은 기능 이용하기
                </Badge>
              </Link>
            </div>
          </div>
        )}

        {/* 검색 섹션 */}
        <div className="w-[80rem] space-y-4">
          <div className="relative">
            <Textarea
              placeholder="상품명, HS코드, 기업명으로 검색하세요"
              className="h-[10rem] resize-none border-2 border-neutral-400 px-5 py-5 text-base"
            />
            <Button
              variant="outline"
              className="absolute right-2 bottom-2 h-10 w-10"
            >
              <Search className="h-10 w-10 text-muted-foreground" />
            </Button>
          </div>

          {/* 검색 힌트 */}
          <div className="text-center text-sm text-neutral-600">
            {isAuthenticated ? (
              <p>🎯 변동사항 모니터링과 검색 히스토리가 제공됩니다</p>
            ) : (
              <p>
                💡 로그인하시면 검색 히스토리와 변동사항 모니터링을 받을 수
                있습니다
                <Link
                  to="/auth/login"
                  className="ml-1 text-primary-600 underline hover:text-primary-700"
                >
                  로그인하기
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
