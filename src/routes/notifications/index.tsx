import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useRouteGuard } from "@/hooks/common/useRouteGuard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import ContentCard from "@/components/common/ContentCard";
import {
  Bell,
  BellOff,
  CheckCircle2,
  Circle,
  Settings,
  Filter,
  AlertCircle,
  Info,
  Package,
  FileText,
  ChevronRight,
} from "lucide-react";
import {
  mockNotifications,
  mockNotificationSettings,
} from "@/data/mock/notifications";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications/")({
  component: NotificationsPage,
}) as any;

function NotificationsPage() {
  // 알림 페이지 가드 - 로그인 사용자만 접근 허용
  const { isAllowed, LoadingComponent } = useRouteGuard("protected");

  const [filter, setFilter] = useState<"all" | "unread" | "high">("all");
  const [notifications, setNotifications] = useState(mockNotifications);

  // 인증 상태 확인 중이면 스켈레톤 UI 표시
  if (!isAllowed && LoadingComponent) {
    return <LoadingComponent />;
  }

  // 인증 상태 확인 완료 후 접근 권한 없으면 null 반환 (리다이렉션됨)
  if (!isAllowed) {
    return null;
  }

  // 필터링된 알림
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read;
    if (filter === "high") return notif.importance === "high";
    return true;
  });

  // 알림 읽음 처리
  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif,
      ),
    );
  };

  // 모든 알림 읽음 처리
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  // 알림 타입별 아이콘
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "hscode_regulation":
        return <FileText size={16} className="text-warning-600" />;
      case "cargo_status":
        return <Package size={16} className="text-info-600" />;
      case "trade_news":
        return <Bell size={16} className="text-primary-600" />;
      case "exchange_rate":
        return <AlertCircle size={16} className="text-success-600" />;
      case "system":
        return <Info size={16} className="text-neutral-500" />;
      default:
        return <Bell size={16} className="text-neutral-500" />;
    }
  };

  // 중요도별 배경색
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return "border-l-danger-400 bg-danger-50";
      case "medium":
        return "border-l-warning-400 bg-warning-50";
      default:
        return "border-l-neutral-200 bg-neutral-50";
    }
  };

  return (
    <div className="lg:flex lg:space-x-8">
      {/* 메인 알림 목록 */}
      <div className="lg:w-2/3">
        <ContentCard
          title="알림 히스토리"
          titleRightElement={
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                모두 읽음
              </Button>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="rounded border border-neutral-200 px-2 py-1 text-xs"
                title="알림 필터 선택"
              >
                <option value="all">전체</option>
                <option value="unread">읽지 않음</option>
                <option value="high">중요</option>
              </select>
              <Filter size={14} className="text-neutral-400" />
            </div>
          }
        >
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "rounded-lg border-l-4 p-4 transition-all duration-200 hover:shadow-sm",
                  getImportanceColor(notification.importance),
                  !notification.read && "shadow-sm",
                )}
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getNotificationIcon(notification.type)}
                    <h3
                      className={cn(
                        "text-sm",
                        notification.read
                          ? "text-neutral-600"
                          : "font-medium text-neutral-800",
                      )}
                    >
                      {notification.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Circle size={12} className="text-primary-600" />
                      </Button>
                    )}
                    <Badge
                      variant={
                        notification.importance === "high"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {notification.importance === "high" ? "중요" : "일반"}
                    </Badge>
                  </div>
                </div>

                <p
                  className={cn(
                    "mb-3 text-sm",
                    notification.read ? "text-neutral-500" : "text-neutral-700",
                  )}
                >
                  {notification.message}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-neutral-400">
                      {notification.source}
                    </span>
                    <span className="text-xs text-neutral-400">·</span>
                    <span className="text-xs text-neutral-400">
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                  </div>

                  {/* 액션 버튼들 */}
                  <div className="flex items-center space-x-2">
                    {notification.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant="link"
                        className="h-auto p-0 text-xs text-primary-600 hover:underline"
                        asChild={!!action.url}
                      >
                        {action.url ? (
                          <Link to={action.url}>{action.label}</Link>
                        ) : (
                          <span>{action.label}</span>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ContentCard>
      </div>

      {/* 사이드바 */}
      <div className="mt-8 lg:mt-0 lg:w-1/3">
        {/* 알림 통계 */}
        <ContentCard title="알림 현황">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">전체 알림</span>
              <span className="font-medium">{notifications.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">읽지 않음</span>
              <div className="flex items-center space-x-1">
                <Circle size={8} className="text-primary-600" />
                <span className="font-medium text-primary-600">
                  {notifications.filter((n) => !n.read).length}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">중요 알림</span>
              <span className="font-medium text-danger-600">
                {notifications.filter((n) => n.importance === "high").length}
              </span>
            </div>
          </div>
        </ContentCard>

        {/* 알림 설정 */}
        <ContentCard title="알림 설정" className="mt-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">전체 알림</span>
              <Switch defaultChecked={mockNotificationSettings.pushEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">이메일 알림</span>
              <Switch defaultChecked={mockNotificationSettings.emailEnabled} />
            </div>

            <hr className="border-neutral-200" />

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-neutral-700">
                카테고리별 설정
              </h4>
              {Object.entries(mockNotificationSettings.categories).map(
                ([key, category]) => (
                  <div key={key} className="space-y-2">
                    <span className="text-xs text-neutral-600">
                      {category.name}
                    </span>
                    <div className="flex items-center justify-between pl-3">
                      <span className="text-xs">푸시</span>
                      <Switch defaultChecked={category.pushEnabled} />
                    </div>
                    <div className="flex items-center justify-between pl-3">
                      <span className="text-xs">이메일</span>
                      <Switch defaultChecked={category.emailEnabled} />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </ContentCard>

        {/* 빠른 액션 */}
        <ContentCard title="빠른 액션" className="mt-8">
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/dashboard">대시보드로 이동</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings size={16} className="mr-1" />
              고급 알림 설정
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BellOff size={16} className="mr-1" />
              알림 일시 정지
            </Button>
          </div>
        </ContentCard>

        {/* 도움말 */}
        <ContentCard title="도움말" className="mt-8">
          <div className="space-y-2">
            <Button variant="link" className="h-auto justify-start p-0 text-sm">
              알림이 오지 않는 경우
            </Button>
            <Button variant="link" className="h-auto justify-start p-0 text-sm">
              브라우저 알림 설정
            </Button>
            <Button variant="link" className="h-auto justify-start p-0 text-sm">
              이메일 알림 설정
            </Button>
          </div>
        </ContentCard>
      </div>
    </div>
  );
}
