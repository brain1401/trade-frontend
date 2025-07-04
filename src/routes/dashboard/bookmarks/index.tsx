import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, ExternalLink, Monitor, MonitorOff } from "lucide-react";
import { useAuth } from "@/stores/authStore";
import { requireAuth } from "@/lib/utils/authGuard";
import BookmarkCard from "@/components/dashboard/bookmarks/BookmarkCard";
import { getTypeName } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  bookmarkApi,
  bookmarkQueries,
  type UpdateBookmarkRequest,
} from "@/lib/api";
import type { Bookmark as BookmarkType } from "@/lib/api/bookmark/types";
import { useState } from "react";
import { toast } from "sonner";

import { EditBookmarkModal } from "@/components/dashboard/bookmarks/EditBookmarkModal";
import { DeleteConfirmationModal } from "@/components/dashboard/bookmarks/DeleteConfirmationModal";
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
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: paginatedData } = useQuery(bookmarkQueries.list());
  const bookmarks = paginatedData?.content ?? [];

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<BookmarkType | null>(
    null,
  );

  // 북마크 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: (id: number) => bookmarkApi.deleteBookmark(id),
    onSuccess: () => {
      toast.success("북마크가 삭제되었습니다.");
      queryClient.invalidateQueries({
        queryKey: bookmarkQueries.list().queryKey,
      });
      setDeleteModalOpen(false);
    },
    onError: (error) => {
      toast.error(`삭제 실패: ${error.message}`);
    },
  });

  // 북마크 수정 뮤테이션
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBookmarkRequest }) =>
      bookmarkApi.updateBookmark(id, data),
    onSuccess: () => {
      toast.success("북마크가 수정되었습니다.");
      queryClient.invalidateQueries({
        queryKey: bookmarkQueries.list().queryKey,
      });
      setEditModalOpen(false);
    },
    onError: (error) => {
      toast.error(`수정 실패: ${error.message}`);
    },
  });

  const activeBookmarks = bookmarks.filter(
    (bookmark) => bookmark.monitoringActive,
  );

  // 수정 버튼 클릭 핸들러
  const handleEditClick = (bookmark: BookmarkType) => {
    setSelectedBookmark(bookmark);
    setEditModalOpen(true);
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = (bookmark: BookmarkType) => {
    setSelectedBookmark(bookmark);
    setDeleteModalOpen(true);
  };

  // 최종 수정 확인 핸들러
  const handleEditConfirm = (data: UpdateBookmarkRequest) => {
    if (selectedBookmark) {
      updateMutation.mutate({ id: selectedBookmark.id, data });
    }
  };

  // 최종 삭제 확인 핸들러
  const handleDeleteConfirm = () => {
    if (selectedBookmark) {
      deleteMutation.mutate(selectedBookmark.id);
    }
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
            <p className="text-xs text-neutral-500">
              모니터링 비활성화: {bookmarks.length - activeBookmarks.length}개
            </p>
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryBookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
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
      {/* 모달 컴포넌트 렌더링 */}
      <EditBookmarkModal
        bookmark={selectedBookmark}
        open={isEditModalOpen}
        onOpenChange={setEditModalOpen}
        onConfirm={handleEditConfirm}
        isLoading={updateMutation.isPending}
      />
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
