import React from "react";
import {
  User,
  Bell,
  Settings,
  MessageSquare,
  Bookmark,
  Search,
} from "lucide-react";
import {
  roles,
  aria,
  createKeyboardHandler,
  useScreenReaderAnnouncement,
} from "@/lib/utils/accessibility";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/cn";
import { formatRelativeTimeKo, formatBadgeCount } from "@/lib/utils/dashboard";
import type { User as UserType } from "@/types/auth";
import type { QuickAction, NotificationItem } from "@/types/dashboard";

// 접근성 개선을 위한 CSS 클래스 import
import "@/css/accessibility.css";

type DashboardHeaderProps = {
  user: UserType | null;
  quickActions?: QuickAction[];
  notifications?: {
    count: number;
    items: NotificationItem[];
  };
  className?: string;
};

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type DashboardHeaderBreadcrumbProps = {
  items?: BreadcrumbItem[];
  className?: string;
};

// 기본 브레드크럼 아이템들
const DEFAULT_BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { label: "홈", href: "/" },
  { label: "대시보드" },
];

/**
 * 대시보드용 브레드크럼 네비게이션 컴포넌트
 * 계층적 네비게이션 컨텍스트 제공
 * 접근성: 네비게이션 랜드마크와 적절한 ARIA 라벨 제공
 */
function DashboardHeaderBreadcrumb({
  items = DEFAULT_BREADCRUMB_ITEMS,
  className,
}: DashboardHeaderBreadcrumbProps) {
  return (
    <nav role={roles.navigation} aria-label="브레드크럼 네비게이션">
      <Breadcrumb className={className}>
        <BreadcrumbList>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink
                    href={item.href}
                    aria-label={`${item.label}로 이동`}
                  >
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage aria-current="page">
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < items.length - 1 && (
                <BreadcrumbSeparator {...aria.hidden(true)} />
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
}

/**
 * 빠른 액션 버튼 컴포넌트
 * 접근성: 적절한 ARIA 라벨과 키보드 네비게이션 지원
 */
function QuickActionButton({ action }: { action: QuickAction }) {
  const Icon = action.icon;
  const announce = useScreenReaderAnnouncement();

  const handleClick = React.useCallback(() => {
    if (action.onClick) {
      action.onClick();
      // 스크린 리더에 액션 실행을 알림
      announce(`${action.label} 실행됨`, "polite");
    }
  }, [action, announce]);

  const handleKeyDown = createKeyboardHandler(handleClick);

  return (
    <Button
      variant={
        action.variant === "primary" ? "default" : action.variant || "outline"
      }
      size="sm"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={action.disabled}
      className={cn(
        "focus-visible-enhanced touch-target-sm relative",
        "icon-text-align-sm interactive-hover",
      )}
      aria-label={
        action.badge && action.badge > 0
          ? `${action.label} (${action.badge}개 알림)`
          : action.label
      }
      aria-describedby={action.description ? `${action.id}-desc` : undefined}
    >
      <Icon className="icon-sm" {...aria.hidden(true)} />
      <span className="ml-2 hidden sm:inline-block">{action.label}</span>
      {action.badge && action.badge > 0 && (
        <Badge
          variant="destructive"
          className="badge-error absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center p-0 text-xs"
          aria-label={`${action.badge}개 알림`}
        >
          {formatBadgeCount(action.badge)}
        </Badge>
      )}
      {action.description && (
        <span id={`${action.id}-desc`} className="sr-only">
          {action.description}
        </span>
      )}
    </Button>
  );
}

/**
 * 알림 드롭다운 컴포넌트
 * 접근성: 적절한 ARIA 속성과 키보드 네비게이션 지원
 */
function NotificationDropdown({
  notifications,
}: {
  notifications: { count: number; items: NotificationItem[] };
}) {
  const unreadCount = notifications.items.filter((item) => !item.read).length;
  const announce = useScreenReaderAnnouncement();
  const dropdownId = React.useId();

  const handleNotificationClick = React.useCallback(
    (notification: NotificationItem) => {
      if (notification.href) {
        announce(`${notification.title} 알림으로 이동`, "polite");
        window.location.href = notification.href;
      }
    },
    [announce],
  );

  const handleViewAllClick = React.useCallback(() => {
    announce("모든 알림 페이지로 이동", "polite");
    // TODO: Navigate to all notifications page
  }, [announce]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "focus-visible-enhanced touch-target-sm relative",
            "icon-text-align-sm interactive-hover",
          )}
          aria-label={
            unreadCount > 0
              ? `알림 ${unreadCount}개, 읽지 않은 알림 있음`
              : "알림, 읽지 않은 알림 없음"
          }
          aria-describedby={`${dropdownId}-desc`}
          {...aria.expandable(false)}
        >
          <Bell className="icon-sm" {...aria.hidden(true)} />
          <span className="ml-2 hidden sm:inline-block">알림</span>
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="badge-error absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center p-0 text-xs"
              aria-label={`${unreadCount}개의 읽지 않은 알림`}
            >
              {formatBadgeCount(unreadCount)}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80"
        role="menu"
        aria-labelledby={`${dropdownId}-trigger`}
      >
        <DropdownMenuLabel
          className="flex items-center justify-between"
          id={`${dropdownId}-label`}
        >
          알림
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {formatBadgeCount(unreadCount)}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.items.length === 0 ? (
          <div
            className="p-4 text-center text-sm text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            새로운 알림이 없습니다
          </div>
        ) : (
          <>
            {notifications.items.slice(0, 5).map((notification, index) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex cursor-pointer flex-col items-start p-3",
                  !notification.read && "bg-accent/50",
                )}
                onClick={() => handleNotificationClick(notification)}
                role="menuitem"
                aria-label={`${notification.title} - ${notification.read ? "읽음" : "읽지 않음"}`}
                tabIndex={0}
              >
                <div className="flex w-full items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {notification.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <div
                      className="mt-1 ml-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"
                      aria-label="읽지 않은 알림"
                      role="status"
                    />
                  )}
                </div>
                <time
                  className="mt-2 text-xs text-muted-foreground"
                  dateTime={notification.timestamp.toISOString()}
                >
                  {formatRelativeTimeKo(notification.timestamp)}
                </time>
              </DropdownMenuItem>
            ))}
            {notifications.items.length > 5 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-center text-sm text-primary"
                  onClick={handleViewAllClick}
                  role="menuitem"
                  aria-label="모든 알림 보기"
                >
                  모든 알림 보기
                </DropdownMenuItem>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
      <span id={`${dropdownId}-desc`} className="sr-only">
        알림 드롭다운을 열려면 Enter 또는 Space를 누르세요
      </span>
    </DropdownMenu>
  );
}

/**
 * 현재 시간을 표시하는 컴포넌트
 */
function CurrentTime() {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden text-sm text-muted-foreground lg:block">
      {currentTime.toLocaleString("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </div>
  );
}

// 기본 빠른 액션들 (배열 참조로 변경하여 무한 렌더링 방지)
const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  {
    id: "new-chat",
    label: "새 대화",
    icon: MessageSquare,
    onClick: () => (window.location.href = "/chat"),
    variant: "default",
  },
  {
    id: "add-bookmark",
    label: "북마크 추가",
    icon: Bookmark,
    onClick: () => (window.location.href = "/bookmarks/new"),
    variant: "outline",
  },
  {
    id: "search",
    label: "검색",
    icon: Search,
    onClick: () => (window.location.href = "/search"),
    variant: "outline",
  },
];

/**
 * 향상된 대시보드 헤더 컴포넌트
 *
 * 기능:
 * - 사용자 정보와 환영 메시지 표시
 * - 빠른 액션 버튼들과 알림 드롭다운
 * - 반응형 레이아웃 (모바일에서 간소화)
 * - 현재 시간 표시
 * - 접근성 지원
 *
 * 요구사항: 1.1, 4.1, 5.1
 */
export default function DashboardHeader({
  user,
  quickActions,
  notifications,
  className,
}: DashboardHeaderProps) {
  const allQuickActions = [...DEFAULT_QUICK_ACTIONS, ...(quickActions || [])];

  return (
    <header
      className={cn("space-y-4 border-b border-border pb-6", className)}
      role="banner"
      aria-label="대시보드 헤더"
    >
      {/* 브레드크럼 네비게이션 */}
      <DashboardHeaderBreadcrumb />

      {/* 메인 헤더 콘텐츠 */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        {/* 사용자 정보 섹션 */}
        <div className="flex items-center gap-4">
          {/* 사용자 아바타 */}
          <div className="card-enhanced flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-primary/10 lg:h-14 lg:w-14">
            <User
              className="icon-lg lg:icon-xl text-primary"
              aria-hidden="true"
            />
          </div>

          {/* 환영 메시지와 시간 */}
          <div className="min-w-0 flex-1">
            <h1 className="text-hierarchy-1 sm:text-hierarchy-1 lg:text-hierarchy-1">
              안녕하세요, {user?.name || "사용자"}님
            </h1>
            <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <p className="text-hierarchy-5 lg:text-hierarchy-4">
                오늘도 스마트한 무역 관리를 시작해보세요
              </p>
              <CurrentTime />
            </div>
          </div>
        </div>

        {/* 빠른 액션 및 알림 섹션 */}
        <div
          className="flex flex-wrap items-center gap-2 sm:gap-3"
          role="toolbar"
          aria-label="빠른 액션"
        >
          {/* 빠른 액션 버튼들 */}
          <div className="flex items-center gap-2">
            {allQuickActions.map((action) => (
              <QuickActionButton key={action.id} action={action} />
            ))}
          </div>

          {/* 구분선 */}
          {(allQuickActions.length > 0 || notifications) && (
            <div className="hidden h-6 w-px bg-border sm:block" />
          )}

          {/* 알림 드롭다운 */}
          {notifications && (
            <NotificationDropdown notifications={notifications} />
          )}

          {/* 설정 버튼 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (window.location.href = "/settings")}
            aria-label="설정"
            className={cn(
              "focus-visible-enhanced touch-target-sm",
              "icon-text-align-sm interactive-hover",
            )}
          >
            <Settings className="icon-sm" />
            <span className="ml-2 hidden sm:inline-block">설정</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export { DashboardHeaderBreadcrumb, QuickActionButton, NotificationDropdown };
export type { DashboardHeaderProps, BreadcrumbItem };
