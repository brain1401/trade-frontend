import React from "react";
import {
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useNotificationStore,
  type Notification,
} from "@/stores/notificationStore";

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

const getNotificationBadgeVariant = (priority: Notification["priority"]) => {
  switch (priority) {
    case "high":
      return "destructive";
    case "normal":
      return "default";
    case "low":
      return "secondary";
    default:
      return "default";
  }
};

const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "방금 전";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}분 전`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}시간 전`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}일 전`;
  }
};

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    isNotificationPanelOpen,
    markAsRead,
    markAllAsRead,
    removeNotification,
    toggleNotificationPanel,
    clearAllNotifications,
    getUnreadNotifications,
  } = useNotificationStore();

  const unreadNotifications = getUnreadNotifications();
  // 읽지 않은 알림을 우선적으로 표시하고, 나머지는 최신순으로 표시
  const readNotifications = notifications.filter((n) => n.read);

  // 알림 내용 렌더링 함수
  const renderNotificationContent = (notification: Notification) => (
    <div className="flex items-start gap-3">
      <div className="mt-1">{getNotificationIcon(notification.type)}</div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="text-sm leading-tight font-medium">
              {notification.title}
            </h4>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {notification.message}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Badge
              variant={getNotificationBadgeVariant(notification.priority)}
              className="text-xs"
            >
              {notification.priority}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => removeNotification(notification.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(notification.createdAt)}
          </span>

          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => markAsRead(notification.id)}
            >
              읽음으로 표시
            </Button>
          )}
        </div>

        {/* 카테고리별 추가 정보 */}
        {notification.category === "analysis" && notification.data && (
          <div className="mt-2 rounded bg-muted/50 p-2 text-xs">
            {notification.data.progress && (
              <div>진행률: {notification.data.progress}%</div>
            )}
            {notification.data.hsCode && (
              <div>HS Code: {notification.data.hsCode}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (!isNotificationPanelOpen) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleNotificationPanel}
          className="relative"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-96">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              알림
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount}개의 새 알림</Badge>
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleNotificationPanel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  모두 읽음
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllNotifications}
              >
                모두 삭제
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p>새로운 알림이 없습니다</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {/* 읽지 않은 알림 섹션 */}
              {unreadNotifications.length > 0 && (
                <>
                  <div className="bg-blue-50/30 px-4 py-2 text-sm font-medium text-blue-900">
                    읽지 않은 알림 ({unreadNotifications.length}개)
                  </div>
                  {unreadNotifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className="border-b bg-blue-50/50 p-4 transition-colors last:border-b-0 hover:bg-blue-100/50"
                    >
                      {renderNotificationContent(notification)}
                    </div>
                  ))}
                </>
              )}

              {/* 읽은 알림 섹션 */}
              {readNotifications.length > 0 &&
                unreadNotifications.length > 0 && (
                  <div className="bg-muted/30 px-4 py-2 text-sm font-medium text-muted-foreground">
                    읽은 알림
                  </div>
                )}

              {readNotifications
                .slice(0, Math.max(0, 10 - unreadNotifications.length))
                .map((notification) => (
                  <div
                    key={notification.id}
                    className="border-b p-4 transition-colors last:border-b-0 hover:bg-muted/50"
                  >
                    {renderNotificationContent(notification)}
                  </div>
                ))}

              {unreadNotifications.length + readNotifications.length > 10 && (
                <div className="border-t p-3 text-center">
                  <span className="text-sm text-muted-foreground">
                    {unreadNotifications.length + readNotifications.length - 10}
                    개의 추가 알림이 있습니다
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
