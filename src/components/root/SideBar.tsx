import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  DollarSign,
  Newspaper,
  LayoutDashboard,
  LogOut,
  LogIn,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../ui/sidebar";
import UserAvatar from "../common/Avatar";
import { Button } from "../ui/button";
import { useAuthStore, useUser, useIsAuthenticated } from "@/stores/authStore";
import { toast } from "sonner";

/**
 * 메인 사이드바 컴포넌트
 * 아바타, 주요 네비게이션 메뉴, 로그인/로그아웃 버튼을 포함
 * 인증 상태에 관계없이 항상 표시됨
 */
export default function SideBar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    {
      title: "환율",
      icon: DollarSign,
      url: "/exchange-rates",
      requiresAuth: false, // 로그인 없이도 접근 가능
    },
    {
      title: "뉴스",
      icon: Newspaper,
      url: "/news",
      requiresAuth: false, // 로그인 없이도 접근 가능
    },
    {
      title: "대시보드",
      icon: LayoutDashboard,
      url: "/dashboard",
      requiresAuth: true, // 로그인 필요
    },
  ];

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

  /**
   * 로그아웃 버튼 클릭 처리
   */
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();

      toast.success("로그아웃되었습니다", {
        description: "언제든지 다시 로그인하실 수 있습니다",
      });

      // 현재 페이지가 로그인 필요한 페이지라면 홈으로 이동
      const currentPath = window.location.pathname;
      const protectedPaths = ["/dashboard", "/bookmarks"];
      const isOnProtectedPath = protectedPaths.some((path) =>
        currentPath.startsWith(path),
      );

      if (isOnProtectedPath) {
        navigate({ to: "/" });
      }
    } catch (error) {
      console.error("로그아웃 실패:", error);
      toast.error("로그아웃 중 오류가 발생했습니다", {
        description: "다시 시도해주세요",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Sidebar className="w-[5rem] border-r border-neutral-200">
      <SidebarHeader className="p-4">
        <div className="flex justify-center">
          <UserAvatar
            src={isAuthenticated ? user?.profileImage : undefined}
            name={isAuthenticated ? user?.name || "사용자" : "게스트"}
            size="md"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarMenu className="space-y-2">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild={!item.requiresAuth || isAuthenticated}
                  tooltip={
                    item.requiresAuth && !isAuthenticated
                      ? `${item.title} (로그인 필요)`
                      : item.title
                  }
                  className={`flex h-12 w-12 items-center justify-center p-0 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 ${
                    item.requiresAuth && !isAuthenticated
                      ? "cursor-pointer opacity-60"
                      : ""
                  }`}
                  onClick={
                    item.requiresAuth && !isAuthenticated
                      ? handleAuthRequiredClick
                      : undefined
                  }
                >
                  {!item.requiresAuth || isAuthenticated ? (
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.title}</span>
                    </Link>
                  ) : (
                    <div>
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">
                        {item.title} (로그인 필요)
                      </span>
                    </div>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {isAuthenticated ? (
          // 로그인된 사용자: 로그아웃 버튼
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-danger-50 hover:text-danger-600 h-12 w-12 text-neutral-600"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">로그아웃</span>
          </Button>
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
      </SidebarFooter>
    </Sidebar>
  );
}
