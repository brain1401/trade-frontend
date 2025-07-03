import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Bookmark as BookmarkType } from "@/lib/api/bookmark/types";

import { getTypeColor, getTypeName } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Bookmark, ExternalLink, Monitor, MonitorOff } from "lucide-react";

/**
 * 개별 북마크 카드 컴포넌트
 * 북마크 상세 정보와 액션 버튼을 포함한 카드 형태로 표시
 */
type BookmarkCardProps = {
  bookmark: BookmarkType;
  onToggleMonitoring?: (id: number) => void;
  onDelete?: (id: number) => void;
};

export default function BookmarkCard({
  bookmark,
  onToggleMonitoring,
  onDelete,
}: BookmarkCardProps) {
  const color = getTypeColor(bookmark.type);
  const typeName = getTypeName(bookmark.type);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className={`h-5 w-5 ${color.icon}`} />
            <CardTitle className="text-lg">{bookmark.displayName}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={color.badge}>{typeName}</Badge>
            {bookmark.monitoringActive && (
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
        <p className="mb-4 text-neutral-600">{bookmark.displayName}</p>

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
            <Link to="/search">
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-1 h-4 w-4" />
                보기
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(bookmark.id)}
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
