import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  FileText,
  Package,
  ExternalLink,
  Bookmark as BookmarkIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookmarkItemProps } from "./types";

// 스타일 상수 정의 (THEME_GUIDE 기준)
const LINK_BUTTON_BASE_CLASSES = "h-auto p-0 text-sm hover:underline";

export default function BookmarkItem({
  bookmark,
  onToggleMonitoring,
}: BookmarkItemProps) {
  // 북마크 타입에 따른 아이콘 반환 함수
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
    <div className="rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center space-x-2">
          {getBookmarkIcon(bookmark.type)}
          <Button
            variant="link"
            className={cn(
              LINK_BUTTON_BASE_CLASSES,
              "font-medium text-primary-600",
            )}
            asChild
          >
            <Link to={bookmark.url}>{bookmark.title}</Link>
          </Button>
        </div>
        <Badge variant="outline">{bookmark.category}</Badge>
      </div>

      <p className="mb-2 text-sm text-neutral-600">{bookmark.description}</p>

      {/* 태그 */}
      <div className="mb-3 flex flex-wrap gap-1">
        {bookmark.tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
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
              모니터링 {bookmark.monitoringEnabled ? "활성" : "비활성"}
            </span>
            <Switch
              checked={bookmark.monitoringEnabled}
              onCheckedChange={() => onToggleMonitoring(bookmark.id)}
            />
          </div>
        </div>
        <div className="text-xs text-neutral-400">
          마지막 업데이트: {new Date(bookmark.lastUpdated).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
