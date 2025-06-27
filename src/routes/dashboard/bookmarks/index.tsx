import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, ExternalLink, Monitor, MonitorOff } from "lucide-react";
import { useAuth } from "@/stores/authStore";
import { requireAuth } from "@/lib/utils/authGuard";
import { mockBookmarks, getActiveBookmarks } from "@/data/mock/bookmarks";
import type { Bookmark as BookmarkType } from "@/types/bookmark";

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
 * 북마크 타입별 색상 매핑
 * 각 북마크 타입에 따라 다른 시각적 구분을 제공
 */
const getTypeColor = (type: string) => {
  switch (type) {
    case "HS_CODE":
      return {
        badge: "bg-primary-100 text-primary-800",
        icon: "text-primary-600",
      };
    case "CARGO":
      return {
        badge: "bg-info-100 text-info-800",
        icon: "text-info-600",
      };
    case "REGULATION":
      return {
        badge: "bg-warning-100 text-warning-800",
        icon: "text-warning-600",
      };
    default:
      return {
        badge: "bg-neutral-100 text-neutral-800",
        icon: "text-neutral-600",
      };
  }
};

/**
 * 북마크 타입 표시명 매핑
 * 내부 타입명을 사용자 친화적인 표시명으로 변환
 */
const getTypeName = (type: string) => {
  switch (type) {
    case "HS_CODE":
      return "HS Code";
    case "CARGO":
      return "화물추적";
    case "REGULATION":
      return "규제정보";
    default:
      return type;
  }
};

/**
 * 개별 북마크 카드 컴포넌트
 * 북마크 상세 정보와 액션 버튼을 포함한 카드 형태로 표시
 */
type BookmarkCardProps = {
  bookmark: BookmarkType;
  onToggleMonitoring?: (id: string) => void;
  onDelete?: (id: string) => void;
};

function BookmarkCard({
  bookmark,
  onToggleMonitoring,
  onDelete,
}: BookmarkCardProps) {
  const typeColor = getTypeColor(bookmark.type);
  const typeName = getTypeName(bookmark.type);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className={`h-5 w-5 ${typeColor.icon}`} />
            <CardTitle className="text-lg">{bookmark.displayName}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={typeColor.badge}>{typeName}</Badge>
            {bookmark.monitoringEnabled && (
              <Badge
                variant="secondary"
                className="bg-success-100 text-xs text-success-800"
              >
                <Monitor className="mr-1 h-3 w-3" />
                모니터링
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-neutral-600">{bookmark.description}</p>

        {/* 대상 값 표시 */}
        <div className="mb-4">
          <Badge variant="outline" className="text-xs">
            {bookmark.targetValue}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            <p>
              저장일: {new Date(bookmark.createdAt).toLocaleDateString("ko-KR")}
            </p>
            <p>
              업데이트:{" "}
              {new Date(bookmark.updatedAt).toLocaleDateString("ko-KR")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleMonitoring?.(bookmark.bookmarkId)}
              className="flex items-center gap-1"
            >
              {bookmark.monitoringEnabled ? (
                <>
                  <MonitorOff className="h-4 w-4" />
                  모니터링 해제
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4" />
                  모니터링 설정
                </>
              )}
            </Button>
            <Link to="/search">
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-1 h-4 w-4" />
                보기
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(bookmark.bookmarkId)}
              className="text-danger-600 hover:bg-danger-50"
            >
              삭제
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 북마크 관리 페이지
 *
 * 인증된 사용자만 접근 가능
 * 저장된 북마크 목록 조회 및 관리 기능 제공
 */
function BookmarksPage() {
  const { user } = useAuth();
  const bookmarks = mockBookmarks;
  const activeBookmarks = getActiveBookmarks();

  // 임시 핸들러 함수들 (실제로는 상태 관리를 통해 구현)
  const handleToggleMonitoring = (id: string) => {
    console.log(`모니터링 토글: ${id}`);
    // TODO: 실제 구현 시 상태 업데이트 로직 추가
  };

  const handleDelete = (id: string) => {
    console.log(`북마크 삭제: ${id}`);
    // TODO: 실제 구현 시 삭제 로직 추가
  };

  // 타입별 북마크 분류
  const bookmarksByCategory = bookmarks.reduce(
    (acc: Record<string, BookmarkType[]>, bookmark: BookmarkType) => {
      const category = bookmark.type;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(bookmark);
      return acc;
    },
    {},
  );

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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">
              총 북마크
            </CardTitle>
            <Bookmark className="h-4 w-4 text-primary-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900">
              {bookmarks.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">
              활성 모니터링
            </CardTitle>
            <Monitor className="h-4 w-4 text-success-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900">
              {activeBookmarks.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">
              카테고리
            </CardTitle>
            <Badge className="h-4 w-4 text-info-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900">
              {Object.keys(bookmarksByCategory).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 북마크 목록 */}
      <div className="space-y-6">
        {Object.entries(bookmarksByCategory).map(
          ([category, categoryBookmarks]) => (
            <div key={category}>
              <h2 className="mb-4 text-xl font-semibold text-neutral-900">
                {getTypeName(category)} ({categoryBookmarks.length})
              </h2>
              <div className="grid gap-4">
                {categoryBookmarks.map((bookmark: BookmarkType) => (
                  <BookmarkCard
                    key={bookmark.bookmarkId}
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
