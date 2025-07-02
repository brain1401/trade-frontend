import { getRecentFeedItems } from "@/data/mock/dashboard";
import { AlertCircle, Bell, CheckCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

/**
 * 최근 업데이트 피드 컴포넌트
 * 사용자가 관심있어하는 항목들의 최신 변경사항 표시
 */
export default function RecentUpdatesFeed() {
  const recentUpdates = getRecentFeedItems(5);

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case "HIGH":
        return <AlertCircle className="text-danger-600 h-4 w-4" />;
      case "MEDIUM":
        return <AlertCircle className="h-4 w-4 text-warning-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-success-600" />;
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "HIGH":
        return (
          <Badge variant="destructive" className="text-xs">
            높음
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge
            variant="default"
            className="bg-warning-100 text-xs text-warning-800"
          >
            보통
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            낮음
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary-600" />
          최근 업데이트
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentUpdates.map((update) => (
          <div
            key={update.id}
            className="flex items-start gap-3 rounded-lg border border-neutral-200 p-3 transition-colors hover:bg-neutral-50"
          >
            {getImportanceIcon(update.importance)}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-neutral-900">
                  {update.title}
                </h4>
                {getImportanceBadge(update.importance)}
              </div>
              <p className="text-xs text-neutral-600">{update.content}</p>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>{update.sourceUrl ? "공식 발표" : "업데이트"}</span>
                <span>•</span>
                <span>
                  {new Date(update.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
