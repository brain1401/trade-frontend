import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink, Monitor, MonitorOff } from "lucide-react";
import type { Bookmark as BookmarkType } from "@/types/bookmark";
import {
  getBookmarkTypeColor,
  getBookmarkTypeName,
} from "@/lib/utils/ui-helpers";

/**
 * 북마크 카드 프로퍼티 타입
 */
export type BookmarkCardProps = {
  /** 북마크 데이터 */
  bookmark: BookmarkType;
  /** 모니터링 토글 핸들러 */
  onToggleMonitoring?: (bookmarkId: string) => void;
  /** 삭제 핸들러 */
  onDelete?: (bookmarkId: string) => void;
};

/**
 * 개별 북마크 카드 컴포넌트
 *
 * 북마크 상세 정보와 액션 버튼을 포함한 카드 형태로 표시
 * 모니터링 설정, 외부 링크 이동, 삭제 기능을 제공
 */
export function BookmarkCard({
  bookmark,
  onToggleMonitoring,
  onDelete,
}: BookmarkCardProps) {
  const typeColor = getBookmarkTypeColor(bookmark.type);
  const typeName = getBookmarkTypeName(bookmark.type);

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
        <p className="mb-4 text-neutral-600">
          {bookmark.description || "설명이 없습니다."}
        </p>

        {/* 대상 값 표시 */}
        <div className="mb-4">
          <Badge variant="outline" className="text-xs">
            {bookmark.type === "HS_CODE" ? "HS Code" : "화물번호"}:{" "}
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
            {bookmark.alertCount > 0 && (
              <p className="text-warning-600">알림 {bookmark.alertCount}개</p>
            )}
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
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-1 h-4 w-4" />
              보기
            </Button>
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
