import React from "react";
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  ExternalLink,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  roles,
  aria,
  createKeyboardHandler,
  useScreenReaderAnnouncement,
} from "@/lib/utils/accessibility";
import type {
  NotificationSummaryProps,
  NotificationItem,
  NotificationGroup,
} from "@/types/dashboard";

// 접근성 개선을 위한 CSS 클래스 import
import "@/css/accessibility.css";

/**
 * NotificationSummary 컴포넌트
 * 중요/일반 알림을 구분하여 표시하고 일괄 처리 기능을 제공
 * 접근성: 키보드 네비게이션, ARIA 지원, 스크린 리더 호환성
 */
function NotificationSummary({
  groups,
  onMarkAllRead,
  onViewAll,
  onNotificationClick,
  className,
}: NotificationSummaryProps) {
  const announce = useScreenReaderAnnouncement();
  const componentId = React.useId();
  // 알림 타입별 아이콘 매핑
  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "error":
        return XCircle;
      case "warning":
        return AlertTriangle;
      case "success":
        return CheckCircle;
      case "info":
      default:
        return Info;
    }
  };

  // 알림 타입별 색상 클래스 매핑
  const getNotificationColor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "error":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      case "success":
        return "text-green-500";
      case "info":
      default:
        return "text-blue-500";
    }
  };

  // 시간 포맷팅 함수
  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  // 총 읽지 않은 알림 수 계산
  const totalUnreadCount = groups.reduce(
    (sum, group) => sum + group.unreadCount,
    0,
  );

  // 알림 항목 렌더링
  const renderNotificationItem = (
    notification: NotificationItem,
    isImportant: boolean,
  ) => {
    const Icon = getNotificationIcon(notification.type);
    const colorClass = getNotificationColor(notification.type);

    const handleClick = () => {
      if (onNotificationClick) {
        onNotificationClick(notification);
        announce(`${notification.title} 알림 선택됨`, "polite");
      }
    };

    const handleKeyDown = createKeyboardHandler(handleClick);

    return (
      <div
        key={notification.id}
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors",
          "interactive-hover-subtle hover:bg-gray-50 dark:hover:bg-gray-800",
          "focus:bg-gray-50 dark:focus:bg-gray-800",
          "focus-visible-enhanced touch-target",
          !notification.read && "bg-blue-50 dark:bg-blue-950/20",
          isImportant && "border-l-4 border-orange-400",
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`${notification.title} - ${notification.read ? "읽음" : "읽지 않음"} ${isImportant ? "중요 알림" : "일반 알림"}`}
        aria-describedby={`notification-${notification.id}-desc`}
      >
        <div
          className={cn("mt-0.5 flex-shrink-0", colorClass)}
          aria-hidden="true"
        >
          <Icon className="icon-sm" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p
                className={cn(
                  "text-sm font-medium text-gray-900 dark:text-gray-100",
                  !notification.read && "font-semibold",
                )}
              >
                {notification.title}
              </p>
              <p
                id={`notification-${notification.id}-desc`}
                className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400"
              >
                {notification.message}
              </p>
            </div>
            {notification.href && (
              <ExternalLink
                className="mt-1 h-3 w-3 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
            )}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <time
              className="text-xs text-gray-500 dark:text-gray-400"
              dateTime={notification.timestamp.toISOString()}
            >
              {formatTimeAgo(notification.timestamp)}
            </time>
            {!notification.read && (
              <div
                className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"
                aria-label="읽지 않은 알림"
                role="status"
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  // 그룹 렌더링
  const renderNotificationGroup = (group: NotificationGroup) => {
    const isImportant = group.type === "important";
    const displayItems = group.items.slice(0, 3); // 최대 3개만 표시

    return (
      <div key={group.type} className="space-y-2">
        <div className="flex items-center justify-between">
          <h4
            className={cn(
              "text-sm font-medium",
              isImportant
                ? "text-orange-600 dark:text-orange-400"
                : "text-gray-700 dark:text-gray-300",
            )}
          >
            {isImportant ? "중요 알림" : "일반 알림"}
            {group.unreadCount > 0 && (
              <span
                className={cn(
                  "ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  isImportant
                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                )}
              >
                {group.unreadCount}
              </span>
            )}
          </h4>
        </div>

        {displayItems.length > 0 ? (
          <div className="space-y-1">
            {displayItems.map((notification) =>
              renderNotificationItem(notification, isImportant),
            )}
            {group.items.length > 3 && (
              <div className="py-2 text-center">
                <button
                  onClick={onViewAll}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  +{group.items.length - 3}개 더 보기
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500 dark:text-gray-400">
            <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p className="text-sm">
              {isImportant
                ? "중요한 알림이 없습니다"
                : "새로운 알림이 없습니다"}
            </p>
          </div>
        )}
      </div>
    );
  };

  const handleMarkAllRead = React.useCallback(() => {
    if (onMarkAllRead) {
      onMarkAllRead();
      announce(
        `${totalUnreadCount}개의 알림을 모두 읽음으로 표시했습니다`,
        "polite",
      );
    }
  }, [onMarkAllRead, totalUnreadCount, announce]);

  const handleViewAll = React.useCallback(() => {
    if (onViewAll) {
      onViewAll();
      announce("모든 알림 페이지로 이동합니다", "polite");
    }
  }, [onViewAll, announce]);

  return (
    <section
      className={cn(
        "card-enhanced rounded-lg border bg-white shadow-sm dark:bg-gray-900",
        className,
      )}
      role={roles.region}
      aria-labelledby={`${componentId}-title`}
    >
      {/* 헤더 */}
      <header className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="icon-text-align">
            <Bell
              className="icon-md text-gray-600 dark:text-gray-400"
              {...aria.hidden(true)}
            />
            <h3
              id={`${componentId}-title`}
              className="text-hierarchy-2 text-gray-900 dark:text-gray-100"
            >
              알림 요약
            </h3>
            {totalUnreadCount > 0 && (
              <span
                className="badge-error inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200"
                aria-label={`${totalUnreadCount}개의 읽지 않은 알림`}
                role="status"
              >
                {totalUnreadCount}
              </span>
            )}
          </div>

          {/* 액션 버튼들 */}
          <div
            className="flex items-center gap-2"
            role="toolbar"
            aria-label="알림 관리 도구"
          >
            {totalUnreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                onKeyDown={createKeyboardHandler(handleMarkAllRead)}
                className="btn-consistent-sm focus-visible-enhanced text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                aria-label={`${totalUnreadCount}개의 알림을 모두 읽음으로 표시`}
              >
                <Check className="icon-xs" {...aria.hidden(true)} />
                모두 읽음
              </button>
            )}
            <button
              onClick={handleViewAll}
              onKeyDown={createKeyboardHandler(handleViewAll)}
              className="btn-consistent-sm focus-visible-enhanced text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/20 dark:hover:text-blue-300"
              aria-label="모든 알림 페이지로 이동"
            >
              <ExternalLink className="icon-xs" {...aria.hidden(true)} />
              전체 보기
            </button>
          </div>
        </div>
      </header>

      {/* 알림 그룹들 */}
      <div className="space-y-6 p-4">
        {groups.length > 0 ? (
          groups.map(renderNotificationGroup)
        ) : (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            <Bell className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p className="mb-2 text-lg font-medium">알림이 없습니다</p>
            <p className="text-sm">새로운 알림이 있으면 여기에 표시됩니다</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default NotificationSummary;
