import React from "react";
import { Link } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";
import { useAnalysisStore } from "@/stores/analysisStore";
import { useBookmarkStore } from "@/stores/bookmarkStore";
import { useResultStore } from "@/stores/resultStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Package,
  BarChart3,
  BookmarkIcon,
  Clock,
  ArrowRight,
  Activity,
  AlertCircle,
} from "lucide-react";

export const DashboardOverview = () => {
  const { user } = useAuthStore();
  const { activeSessions, getSessionProgress } = useAnalysisStore();
  const { bookmarks } = useBookmarkStore();
  const { getRecentResults } = useResultStore();

  // 최근 결과 가져오기
  const recentResults = getRecentResults(10);

  // 활성 세션들을 배열로 변환
  const activeSessionsArray = Array.from(activeSessions.values());

  // 통계 계산
  const stats = {
    totalAnalyses: recentResults.length,
    activeAnalyses: activeSessionsArray.filter(
      (session) =>
        session.status === "processing" ||
        session.status === "awaiting_questions",
    ).length,
    completedAnalyses: activeSessionsArray.filter(
      (session) => session.status === "completed",
    ).length,
    totalBookmarks: bookmarks.length,
    activeBookmarks: bookmarks.filter((bookmark) => bookmark.isMonitored)
      .length,
  };

  return (
    <div className="space-y-8">
      {/* 환영 메시지 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          안녕하세요, {user?.name || "사용자"}님!
        </h1>
        <p className="text-muted-foreground">
          최근 활동과 분석 현황을 확인하고 새로운 분석을 시작해보세요.
        </p>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 분석 수</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnalyses}</div>
            <p className="text-xs text-muted-foreground">
              지금까지 완료된 분석
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">진행 중 분석</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAnalyses}</div>
            <p className="text-xs text-muted-foreground">현재 처리 중인 분석</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">북마크</CardTitle>
            <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookmarks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeBookmarks}개 모니터링 중
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료된 분석</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedAnalyses}</div>
            <p className="text-xs text-muted-foreground">이번 달 완료 분석</p>
          </CardContent>
        </Card>
      </div>

      {/* 빠른 액션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>빠른 액션</span>
          </CardTitle>
          <CardDescription>
            자주 사용하는 기능에 빠르게 접근하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link to="/user/analysis-history">
              <Button className="h-20 w-full flex-col space-y-2">
                <Sparkles className="h-6 w-6" />
                <span>분석 시작</span>
              </Button>
            </Link>

            <Link to="/statistics">
              <Button
                variant="outline"
                className="h-20 w-full flex-col space-y-2"
              >
                <Package className="h-6 w-6" />
                <span>통계 보기</span>
              </Button>
            </Link>

            <Link to="/dashboard/bookmarks">
              <Button
                variant="outline"
                className="h-20 w-full flex-col space-y-2"
              >
                <BookmarkIcon className="h-6 w-6" />
                <span>북마크 관리</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 진행 중인 분석 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <CardTitle>진행 중인 분석</CardTitle>
              </div>
              {stats.activeAnalyses > 0 && (
                <Badge variant="secondary">
                  {stats.activeAnalyses}개 진행 중
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {stats.activeAnalyses === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Activity className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>진행 중인 분석이 없습니다</p>
                <Link to="/user/analysis-history">
                  <Button className="mt-4">
                    새 분석 시작하기 <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeSessionsArray
                  .filter(
                    (session) =>
                      session.status === "processing" ||
                      session.status === "awaiting_questions",
                  )
                  .slice(0, 3)
                  .map((session) => (
                    <Link
                      key={session.id}
                      to="/hscode/analyze/$sessionId"
                      params={{ sessionId: session.id }}
                      className="block"
                    >
                      <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="truncate font-medium">
                            {session.query}
                          </div>
                          <Badge
                            variant={
                              session.status === "processing"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {session.status === "processing"
                              ? "분석 중"
                              : "질문 대기"}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <Progress value={getSessionProgress(session.id)} />
                          <div className="text-sm text-muted-foreground">
                            진행률: {getSessionProgress(session.id)}%
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}

                {stats.activeAnalyses > 3 && (
                  <Link to="/user/analysis-history">
                    <Button variant="ghost" className="w-full">
                      모든 진행중인 분석 보기 ({stats.activeAnalyses - 3}개 더)
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 최근 완료된 분석 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <CardTitle>최근 완료된 분석</CardTitle>
              </div>
              <Link to="/user/analysis-history">
                <Button variant="ghost" size="sm">
                  모두 보기
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentResults.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Clock className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>완료된 분석이 없습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentResults.slice(0, 4).map((result) => {
                  // 세션에서 제품 설명 가져오기
                  const session = activeSessions.get(result.sessionId);
                  const productDescription = session?.query || "분석 결과";

                  return (
                    <Link
                      key={result.id}
                      to="/hscode/result/$resultId"
                      params={{ resultId: result.id }}
                      className="block"
                    >
                      <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted/70">
                        <div>
                          <div className="truncate font-medium">
                            {productDescription}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            HS Code: {result.recommendedHsCode}
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {result.confidence}% 정확도
                        </Badge>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 북마크 현황 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookmarkIcon className="h-5 w-5 text-muted-foreground" />
              <CardTitle>북마크 현황</CardTitle>
            </div>
            <Link to="/dashboard/bookmarks">
              <Button variant="ghost" size="sm">
                관리하기 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {bookmarks.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <BookmarkIcon className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>북마크된 항목이 없습니다</p>
              <p className="text-sm">
                중요한 분석 결과나 화물을 북마크하여 쉽게 추적하세요
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium">HS Code 분석</span>
                </div>
                <div className="text-2xl font-bold">
                  {bookmarks.filter((b) => b.type === "HS Code").length}
                </div>
                <p className="text-sm text-muted-foreground">
                  분석 결과 북마크
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center space-x-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">화물 추적</span>
                </div>
                <div className="text-2xl font-bold">
                  {bookmarks.filter((b) => b.type === "화물추적").length}
                </div>
                <p className="text-sm text-muted-foreground">
                  화물 추적 북마크
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 오류가 있는 세션들 표시 */}
      {activeSessionsArray.some((session) => session.status === "error") && (
        <Card className="border-destructive/50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">
                오류가 발생한 분석
              </CardTitle>
            </div>
            <CardDescription>
              일부 분석에서 오류가 발생했습니다. 다시 시도해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeSessionsArray
                .filter((session) => session.status === "error")
                .slice(0, 3)
                .map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg bg-destructive/10 p-3"
                  >
                    <div>
                      <div className="truncate font-medium">
                        {session.query}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {session.error || "알 수 없는 오류"}
                      </div>
                    </div>
                    <Link to="/user/analysis-history">
                      <Button size="sm" variant="outline">
                        다시 시도
                      </Button>
                    </Link>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
