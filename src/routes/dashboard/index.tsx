import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import ContentCard from "@/components/common/ContentCard";
import {
  Bell,
  Bookmark as BookmarkIcon,
  Clock,
  ExternalLink,
  Filter,
  Settings,
  TrendingUp,
  Package,
  FileText,
  Eye,
  EyeOff,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import {
  mockUpdatesFeed,
  mockBookmarks,
  type FeedItem,
  type Bookmark,
} from "@/data/mock/dashboard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard" as any)({
  component: DashboardPage,
});

function DashboardPage() {
  const [feedFilter, setFeedFilter] = useState<"all" | "high" | "medium">(
    "all",
  );
  const [bookmarkFilter, setBookmarkFilter] = useState<
    "all" | "hscode" | "tracking" | "regulation"
  >("all");

  // 피드 필터링
  const filteredFeed = mockUpdatesFeed.filter(
    (item) => feedFilter === "all" || item.importance === feedFilter,
  );

  // 북마크 필터링
  const filteredBookmarks = mockBookmarks.filter(
    (bookmark) => bookmarkFilter === "all" || bookmark.type === bookmarkFilter,
  );

  // 북마크 모니터링 토글
  const toggleMonitoring = (bookmarkId: string) => {
    // 실제로는 API 호출
    console.log(`Toggle monitoring for bookmark: ${bookmarkId}`);
  };

  // 피드 아이템 중요도에 따른 아이콘
  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case "high":
        return <AlertCircle size={16} className="text-danger-500" />;
      case "medium":
        return <Clock size={16} className="text-warning-500" />;
      default:
        return <Bell size={16} className="text-info-500" />;
    }
  };

  // 북마크 타입에 따른 아이콘
  const getBookmarkIcon = (type: string) => {
    switch (type) {
      case "hscode":
        return <FileText size={16} className="text-primary-600" />;
      case "tracking":
        return <Package size={16} className="text-success-600" />;
      case "regulation":
        return <ExternalLink size={16} className="text-warning-600" />;
      default:
        return <BookmarkIcon size={16} className="text-neutral-500" />;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">
          마이 대시보드
        </h1>
        <p className="text-neutral-600">
          북마크한 항목들의 업데이트와 관리를 한 곳에서 확인하세요
        </p>
      </div>

      <Tabs defaultValue="updates" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="updates">최신 업데이트 피드</TabsTrigger>
          <TabsTrigger value="bookmarks">북마크 관리</TabsTrigger>
        </TabsList>

        {/* 첫 번째 탭: 최신 업데이트 피드 */}
        <TabsContent value="updates">
          <div className="lg:flex lg:space-x-8">
            <div className="lg:w-2/3">
              <ContentCard
                title="업데이트 피드"
                titleRightElement={
                  <div className="flex items-center space-x-2">
                    <select
                      value={feedFilter}
                      onChange={(e) => setFeedFilter(e.target.value as any)}
                      className="rounded border border-neutral-200 px-2 py-1 text-xs"
                    >
                      <option value="all">전체</option>
                      <option value="high">중요</option>
                      <option value="medium">보통</option>
                    </select>
                    <Filter size={14} className="text-neutral-400" />
                  </div>
                }
              >
                <ScrollArea className="h-[600px] pr-3">
                  <div className="space-y-4">
                    {filteredFeed.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getImportanceIcon(item.importance)}
                            <h3 className="font-medium text-neutral-800">
                              {item.title}
                            </h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                item.importance === "high"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {item.importance === "high" ? "중요" : "일반"}
                            </Badge>
                            <Clock size={12} className="text-neutral-400" />
                            <span className="text-xs text-neutral-400">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <p className="mb-3 text-sm text-neutral-600">
                          {item.summary}
                        </p>

                        {/* 변경사항 */}
                        <div className="mb-3">
                          <h4 className="mb-1 text-xs font-medium text-neutral-700">
                            주요 변경사항:
                          </h4>
                          <ul className="space-y-0.5 text-xs text-neutral-600">
                            {item.changes.map((change, index) => (
                              <li key={index}>• {change}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-neutral-500">
                            출처: {item.source}
                          </span>
                          <Button
                            variant="link"
                            className="h-auto p-0 text-xs text-primary-600 hover:underline"
                          >
                            상세보기{" "}
                            <ChevronRight size={12} className="ml-0.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </ContentCard>
            </div>

            <div className="mt-8 lg:mt-0 lg:w-1/3">
              {/* 알림 설정 */}
              <ContentCard title="알림 설정">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">브라우저 푸시 알림</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">이메일 알림</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">중요 알림만</span>
                    <Switch />
                  </div>
                </div>
                <Button variant="outline" className="mt-4 w-full" asChild>
                  <Link to="/notifications">알림 히스토리 보기</Link>
                </Button>
              </ContentCard>

              {/* 통계 요약 */}
              <ContentCard title="이번 주 요약" className="mt-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-primary-50 p-3 text-center">
                    <TrendingUp
                      size={20}
                      className="mx-auto mb-1 text-primary-600"
                    />
                    <p className="text-xs text-primary-600">업데이트</p>
                    <p className="text-lg font-bold text-primary-800">12</p>
                  </div>
                  <div className="rounded-lg bg-success-50 p-3 text-center">
                    <Bell size={20} className="mx-auto mb-1 text-success-600" />
                    <p className="text-xs text-success-600">새 알림</p>
                    <p className="text-lg font-bold text-success-800">8</p>
                  </div>
                </div>
              </ContentCard>
            </div>
          </div>
        </TabsContent>

        {/* 두 번째 탭: 북마크 관리 */}
        <TabsContent value="bookmarks">
          <div className="lg:flex lg:space-x-8">
            <div className="lg:w-2/3">
              <ContentCard
                title="북마크 목록"
                titleRightElement={
                  <div className="flex items-center space-x-2">
                    <select
                      value={bookmarkFilter}
                      onChange={(e) => setBookmarkFilter(e.target.value as any)}
                      className="rounded border border-neutral-200 px-2 py-1 text-xs"
                    >
                      <option value="all">전체</option>
                      <option value="hscode">HS Code</option>
                      <option value="tracking">화물 추적</option>
                      <option value="regulation">규제</option>
                    </select>
                    <Filter size={14} className="text-neutral-400" />
                  </div>
                }
              >
                <div className="space-y-4">
                  {filteredBookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getBookmarkIcon(bookmark.type)}
                          <Button
                            variant="link"
                            className="h-auto p-0 text-sm font-medium text-primary-600 hover:underline"
                            asChild
                          >
                            <Link to={bookmark.url}>{bookmark.title}</Link>
                          </Button>
                        </div>
                        <Badge variant="outline">{bookmark.category}</Badge>
                      </div>

                      <p className="mb-2 text-sm text-neutral-600">
                        {bookmark.description}
                      </p>

                      {/* 태그 */}
                      <div className="mb-3 flex flex-wrap gap-1">
                        {bookmark.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {bookmark.monitoringEnabled ? (
                              <Eye size={14} className="text-success-500" />
                            ) : (
                              <EyeOff size={14} className="text-neutral-400" />
                            )}
                            <span className="text-xs text-neutral-600">
                              모니터링{" "}
                              {bookmark.monitoringEnabled ? "활성" : "비활성"}
                            </span>
                            <Switch
                              checked={bookmark.monitoringEnabled}
                              onCheckedChange={() =>
                                toggleMonitoring(bookmark.id)
                              }
                            />
                          </div>
                        </div>
                        <div className="text-xs text-neutral-400">
                          마지막 업데이트:{" "}
                          {new Date(bookmark.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ContentCard>
            </div>

            <div className="mt-8 lg:mt-0 lg:w-1/3">
              {/* 북마크 통계 */}
              <ContentCard title="북마크 통계">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">전체 북마크</span>
                    <span className="font-medium">{mockBookmarks.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">모니터링 중</span>
                    <span className="font-medium text-success-600">
                      {mockBookmarks.filter((b) => b.monitoringEnabled).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">HS Code</span>
                    <span className="font-medium">
                      {mockBookmarks.filter((b) => b.type === "hscode").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">화물 추적</span>
                    <span className="font-medium">
                      {
                        mockBookmarks.filter((b) => b.type === "tracking")
                          .length
                      }
                    </span>
                  </div>
                </div>
              </ContentCard>

              {/* 빠른 액션 */}
              <ContentCard title="빠른 액션" className="mt-8">
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() =>
                      (window.location.href = "/hscode/analyze/new-session")
                    }
                  >
                    새 HS Code 분석
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/tracking/search">화물 추적하기</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/search/results">정보 검색하기</Link>
                  </Button>
                </div>
              </ContentCard>

              {/* 모니터링 설정 */}
              <ContentCard title="모니터링 설정" className="mt-8">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">자동 체크 주기</span>
                    <select className="rounded border border-neutral-200 px-2 py-1 text-xs">
                      <option>1시간</option>
                      <option>6시간</option>
                      <option>12시간</option>
                      <option>24시간</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">중요 변경사항만</span>
                    <Switch />
                  </div>
                  <Button variant="outline" className="mt-4 w-full">
                    <Settings size={16} className="mr-1" />
                    고급 설정
                  </Button>
                </div>
              </ContentCard>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
