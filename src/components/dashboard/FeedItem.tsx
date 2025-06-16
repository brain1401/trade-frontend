import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronRight, AlertCircle, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FeedItemProps } from "./types";

// 스타일 상수 정의 (THEME_GUIDE 기준)
const LINK_BUTTON_BASE_CLASSES = "h-auto p-0 text-sm hover:underline";

export default function FeedItem({ item }: FeedItemProps) {
  // 중요도에 따른 아이콘 반환 함수
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

  return (
    <div className="rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center space-x-2">
          {getImportanceIcon(item.importance)}
          <h3 className="font-medium text-neutral-800">{item.title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant={item.importance === "high" ? "destructive" : "secondary"}
          >
            {item.importance === "high" ? "중요" : "일반"}
          </Badge>
          <Clock size={12} className="text-neutral-400" />
          <span className="text-xs text-neutral-400">
            {new Date(item.timestamp).toLocaleDateString()}
          </span>
        </div>
      </div>

      <p className="mb-3 text-sm text-neutral-600">{item.summary}</p>

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
        <span className="text-xs text-neutral-500">출처: {item.source}</span>
        <Button
          variant="link"
          className={cn(
            LINK_BUTTON_BASE_CLASSES,
            "flex items-center justify-end text-primary-600",
          )}
        >
          상세보기 <ChevronRight size={12} className="ml-0.5" />
        </Button>
      </div>
    </div>
  );
}
