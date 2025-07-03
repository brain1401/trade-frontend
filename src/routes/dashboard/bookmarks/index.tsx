import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, ExternalLink, Monitor, MonitorOff } from "lucide-react";
import { useAuth } from "@/stores/authStore";
import { requireAuth } from "@/lib/utils/authGuard";
import BookmarkCard from "@/components/dashboard/bookmarks/BookmarkCard";
import { getTypeName } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { bookmarkQueries } from "@/lib/api";
import type { Bookmark as BookmarkType } from "@/lib/api/bookmark/types";

/**
 * 북마크 관리 라우트 정의
 *
 * 인증된 사용자만 접근 가능한 보호된 페이지
 */
export const Route = createFileRoute("/dashboard/bookmarks/")({
  beforeLoad: ({ context, location }) => {
    requireAuth(context, location);
  },
  component: BookmarksPage,
});

/**
 * 북마크 관리 페이지
 *
 * 인증된 사용자만 접근 가능
 * 저장된 북마크 목록 조회 및 관리 기능 제공
 */
function BookmarksPage() {
  const { user } = useAuth();
  const { data: paginatedData } = useQuery(bookmarkQueries.list());

  const bookmarks = paginatedData?.content ?? [];

  const activeBookmarks = bookmarks.filter(
    (bookmark) => bookmark.monitoringActive,
  );

  // 임시 핸들러 함수들 (실제로는 상태 관리를 통해 구현)
  const handleToggleMonitoring = (id: number) => {
    console.log(`모니터링 토글: ${id}`);
    // TODO: 실제 구현 시 상태 업데이트 로직 추가
  };

  const handleDelete = (id: number) => {
    console.log(`북마크 삭제: ${id}`);
    // TODO: 실제 구현 시 삭제 로직 추가
  };

  // 타입별 북마크 분류
  const bookmarksByCategory = bookmarks.reduce<Record<string, BookmarkType[]>>(
    (acc, bookmark) => {
      const category = bookmark.type;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(bookmark);
      return acc;
    },
    {},
  );

  const cardData = [
    {
      title: "총 북마크",
      value: bookmarks.length,
      icon: <Bookmark className="h-4 w-4 text-primary-600" />,
    },
    {
      title: "활성 모니터링",
      value: activeBookmarks.length,
      icon: <Monitor className="h-4 w-4 text-success-600" />,
    },
    {
      title: "카테고리",
      value: Object.keys(bookmarksByCategory).length,
      icon: <Badge className="h-4 w-4 text-info-600" />,
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          북마크
        </h1>
        <p className="mt-2 text-neutral-600">
          {user?.name}님이 저장한 북마크를 관리할 수 있습니다.
        </p>
      </div>

      {/* 요약 통계 */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {cardData.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neutral-900">
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 북마크 목록 */}
      <div className="space-y-6">
        {Object.entries(bookmarksByCategory).map(
          ([category, categoryBookmarks]) => (
            <div key={category}>
              <h2 className="mb-4 text-xl font-semibold text-neutral-900">
                {getTypeName(category)} ({categoryBookmarks.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryBookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onToggleMonitoring={handleToggleMonitoring}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ),
        )}

        {bookmarks.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Bookmark className="mx-auto mb-4 h-12 w-12 text-neutral-400" />
              <p className="text-neutral-600">아직 저장된 북마크가 없습니다.</p>
              <p className="mt-2 text-sm text-neutral-500">
                관심 있는 정보를 북마크로 저장해보세요.
              </p>
              <Link to="/search">
                <Button className="mt-4">검색하러 가기</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
