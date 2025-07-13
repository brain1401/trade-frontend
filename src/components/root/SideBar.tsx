import { Link, useNavigate } from "@tanstack/react-router";
import {
  DollarSign,
  Newspaper,
  LayoutDashboard,
  LogIn,
  BarChart,
} from "lucide-react";

import UserAvatar from "../common/Avatar";
import AppLogo from "../common/AppLogo";
import { Button } from "../ui/button";
import { useAuth } from "@/stores/authStore.ts";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip.tsx";
import { menuItems } from "@/data/common.ts";

/**
 * 메인 사이드바 컴포넌트
 * 앱 로고, 주요 네비게이션 메뉴, 사용자 프로필/로그인 버튼을 포함
 * 인증 상태에 관계없이 항상 표시됨
 */
export default function SideBar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  console.log("user :", user);
  /**
   * 로그인 필요 메뉴 클릭 시 처리
   */
  const handleAuthRequiredClick = () => {
    toast.info("로그인이 필요한 기능입니다", {
      description: "로그인 후 이용해주세요",
      action: {
        label: "로그인",
        onClick: () => navigate({ to: "/auth/login" }),
      },
    });
  };

  /**
   * 로그인 버튼 클릭 처리
   */
  const handleLogin = () => {
    navigate({ to: "/auth/login" });
  };

  const renderMenuItem = (item: (typeof menuItems)[0]) => {
    const isAuthRequiredAndNotLoggedIn = item.requiresAuth && !isAuthenticated;

    const buttonContent = (
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-md p-0 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 ${
          isAuthRequiredAndNotLoggedIn ? "cursor-pointer opacity-60" : ""
        }`}
        onClick={
          isAuthRequiredAndNotLoggedIn ? handleAuthRequiredClick : undefined
        }
      >
        <item.icon className="h-5 w-5" />
        <span className="sr-only">
          {isAuthRequiredAndNotLoggedIn
            ? `${item.title} (로그인 필요)`
            : item.title}
        </span>
      </div>
    );

    const linkWrapper = isAuthRequiredAndNotLoggedIn ? (
      <div>{buttonContent}</div>
    ) : (
      <Link to={item.url}>{buttonContent}</Link>
    );

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{linkWrapper}</TooltipTrigger>
          <TooltipContent side="right">
            <p>
              {isAuthRequiredAndNotLoggedIn
                ? `${item.title} (로그인 필요)`
                : item.title}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <aside className="flex h-full w-[4rem] flex-col items-center border-r border-neutral-200 bg-neutral-50 py-4">
      {/* 앱 로고 */}
      <div className="flex h-[5.8rem] flex-col items-center justify-center pt-[2rem]">
        <AppLogo />
      </div>

      <nav className="flex-1 space-y-2 p-2">
        {menuItems.map((item) => (
          <div key={item.title}>{renderMenuItem(item)}</div>
        ))}
      </nav>

      <div className="flex-shrink-0 p-4">
        {isAuthenticated ? (
          // 로그인된 사용자: 아바타만 표시 (HoverCard에 로그아웃 포함)
          <UserAvatar
            src={user?.profileImage || undefined}
            name={user?.name || "사용자"}
            size="md"
          />
        ) : (
          // 로그인하지 않은 사용자: 로그인 버튼
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 border-primary-200 hover:border-primary-300 hover:bg-primary-50"
            onClick={handleLogin}
          >
            <LogIn className="h-5 w-5 text-primary-600" />
            <span className="sr-only">로그인</span>
          </Button>
        )}
      </div>
    </aside>
  );
}
