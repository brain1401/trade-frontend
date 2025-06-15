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

  const handleLogout = () => {
    // 로그아웃 로직 처리 (여기서는 로그인 페이지로 이동)
    navigate({ to: "/auth/login" });
  };

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
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage
                      src="https://placehold.co/32x32/FFFFFF/004E98?text=사"
                      alt="사용자 프로필"
                      className="border-2 border-blue-200 hover:opacity-90"
                    />
                    <AvatarFallback className="border-2 border-blue-200 bg-white text-brand-700">
                      사
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
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
