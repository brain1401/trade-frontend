import React, { useState } from "react";
import {
  Bell,
  Bookmark,
  Eye,
  Search,
  BarChart3,
  Truck,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";

const LINK_BUTTON_BASE_CLASSES = "h-auto p-0 text-sm hover:underline";
const AVATAR_BORDER_CLASSES = "border-2 border-white";

// 링크가 있는 아이콘 버튼 생성 함수
const iconButton = (
  title: string,
  icon: React.ReactNode,
  hasDot: boolean,
  href?: string,
): React.ReactNode => (
  <Tooltip>
    <TooltipTrigger asChild>
      {href ? (
        <Link to={href}>
          <Button
            variant="link"
            size="icon"
            className="relative h-auto w-auto rounded-full p-1 text-white hover:text-blue-200"
          >
            {icon}
            {hasDot && (
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 animate-pulse-subtle rounded-full bg-red-500 ring-2 ring-brand-700"></span>
            )}
          </Button>
        </Link>
      ) : (
        <Button
          variant="link"
          size="icon"
          className="relative h-auto w-auto rounded-full p-1 text-white hover:text-blue-200"
        >
          {icon}
          {hasDot && (
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 animate-pulse-subtle rounded-full bg-red-500 ring-2 ring-brand-700"></span>
          )}
        </Button>
      )}
    </TooltipTrigger>
    <TooltipContent
      side="bottom"
      className="relative z-[100] rounded bg-black p-1 px-2 text-xs text-white"
    >
      <p>{title}</p>
    </TooltipContent>
  </Tooltip>
);

const TopNavBar = () => {
  const [hasNotification, _setHasNotification] = useState(true);
  const [hasBookmarkUpdate, _setHasBookmarkUpdate] = useState(true);
  const [hasChangeDetection, _setHasChangeDetection] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = async () => {
    // authStore의 로그아웃 함수 호출
    logout();
    // 로그인 페이지로 리다이렉트
    navigate({ to: "/auth/login" });
  };

  // 로그인하지 않은 경우 로그인 버튼 표시
  if (!isAuthenticated) {
    return (
      <TooltipProvider>
        <nav className="bg-brand-700 py-3 text-white shadow-md">
          <div className="container mx-auto flex items-center justify-between">
            {/* 로고 */}
            <Link to="/" className="ml-[3rem] text-4xl font-bold">
              AI HS Code 레이더
            </Link>

            {/* 로그인 버튼 */}
            <div className="flex items-center space-x-5">
              <Button
                variant="outline"
                className="border-white text-black hover:bg-white hover:text-brand-700"
                onClick={() => navigate({ to: "/auth/login" })}
              >
                로그인
              </Button>
            </div>
          </div>
        </nav>
      </TooltipProvider>
    );
  }

  return (
    <>
      <TooltipProvider>
        <nav className="bg-brand-700 py-3 text-white shadow-md">
          <div className="container mx-auto flex items-center justify-between">
            {/* 로고 */}
            <Link to="/" className="ml-[3rem] text-4xl font-bold">
              AI HS Code 레이더
            </Link>

            {/* 우측 아이콘들과 사용자 메뉴 */}
            <div className="flex items-center space-x-5">
              {iconButton(
                "알림",
                <Bell size={22} />,
                hasNotification,
                "/notifications",
              )}
              {iconButton(
                "대시보드",
                <Bookmark size={22} />,
                hasBookmarkUpdate,
                "/dashboard",
              )}
              {iconButton(
                "변동사항 감지",
                <Eye size={22} />,
                hasChangeDetection,
                "/dashboard",
              )}

              {/* 사용자 프로필 드롭다운 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarImage
                      src={
                        user?.avatar ||
                        "https://placehold.co/48x48/FFFFFF/004E98?text=" +
                          user?.name.charAt(0)
                      }
                      alt={`${user?.name || "사용자"} 프로필`}
                      className="hover:opacity-90"
                    />
                    <AvatarFallback className="bg-white text-brand-700">
                      {user?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm text-gray-600">
                    {user?.name || "사용자"}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>마이 대시보드</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/notifications" className="flex items-center">
                      <Bell className="mr-2 h-4 w-4" />
                      <span>알림 히스토리</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      </TooltipProvider>
    </>
  );
};

export default TopNavBar;
