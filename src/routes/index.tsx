import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, User, Heart, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser, useIsAuthenticated } from "@/stores/authStore";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();

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
              <Badge variant="outline" className="text-neutral-600">
                개인화 기능 활성화
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
                  className="cursor-pointer bg-primary-600 hover:bg-primary-700"
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
              <p>🎯 개인화된 검색 추천과 히스토리가 제공됩니다</p>
            ) : (
              <p>
                💡 로그인하시면 검색 히스토리와 개인화된 추천을 받을 수 있습니다
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

        {/* 기능 소개 카드 */}
        <div className="w-[80rem]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* 공개 기능 */}
            <Card className="border-neutral-200">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Search className="mr-2 h-5 w-5 text-primary-600" />
                  무료 검색
                </CardTitle>
                <CardDescription>
                  로그인 없이 모든 무역 정보 검색 가능
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li>• HS Code 자동 분류</li>
                  <li>• 수출입 요건 조회</li>
                  <li>• 화물 추적</li>
                  <li>• 최신 무역 뉴스</li>
                </ul>
              </CardContent>
            </Card>

            {/* 개인화 기능 */}
            <Card
              className={`border-2 ${isAuthenticated ? "border-success-200 bg-success-50" : "border-primary-200 bg-primary-50"}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Heart className="mr-2 h-5 w-5 text-primary-600" />
                  개인화 기능
                  {isAuthenticated ? (
                    <Badge className="ml-2 bg-success-600">활성화</Badge>
                  ) : (
                    <Badge variant="outline" className="ml-2">
                      로그인 필요
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {isAuthenticated
                    ? "현재 이용 중인 개인화 서비스"
                    : "로그인하여 더 많은 기능을 이용하세요"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li>• 북마크 및 모니터링</li>
                  <li>• 검색 히스토리 저장</li>
                  <li>• 개인화된 추천</li>
                  <li>• 알림 서비스</li>
                </ul>
                {!isAuthenticated && (
                  <div className="mt-4">
                    <Link to="/auth/login">
                      <Button size="sm" className="w-full">
                        로그인하기
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 대시보드 */}
            <Card
              className={`border-neutral-200 ${!isAuthenticated && "opacity-60"}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary-600" />
                  대시보드
                  {isAuthenticated ? (
                    <Badge className="ml-2 bg-success-600">이용 가능</Badge>
                  ) : (
                    <Badge variant="outline" className="ml-2">
                      로그인 필요
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {isAuthenticated
                    ? "나만의 무역 정보 대시보드"
                    : "개인화된 대시보드 (로그인 필요)"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li>• 북마크 관리</li>
                  <li>• 업데이트 피드</li>
                  <li>• 통계 및 분석</li>
                  <li>• 빠른 액세스</li>
                </ul>
                {!isAuthenticated && (
                  <div className="mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="w-full"
                    >
                      로그인 후 이용 가능
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="space-y-2 text-center">
          <p className="text-sm text-neutral-600">
            🚀 AI 기반 무역 규제 레이더 플랫폼
          </p>
          {!isAuthenticated && (
            <p className="text-xs text-neutral-500">
              모든 기본 기능은 로그인 없이 사용하실 수 있습니다. 개인화 기능을
              원하시면 언제든지 가입해주세요!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
