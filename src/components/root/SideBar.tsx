import { Link, useNavigate } from "@tanstack/react-router";
import { DollarSign, Newspaper, LayoutDashboard, LogIn } from "lucide-react";

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
import AppLogo from "../common/AppLogo";
import { Button } from "../ui/button";
import { useAuth } from "@/stores/authStore.ts";
import { toast } from "sonner";

/**
 * 메인 사이드바 컴포넌트
 * 앱 로고, 주요 네비게이션 메뉴, 사용자 프로필/로그인 버튼을 포함
 * 인증 상태에 관계없이 항상 표시됨
 */
export default function SideBar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

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

  return (
    <Sidebar className="w-[5rem] border-r border-neutral-200">
      {/* 앱 로고 */}
      <SidebarHeader className="p-4">
        <div className="flex justify-center">
          <AppLogo size="md" />
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
        <div className="flex justify-center">
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
      </SidebarFooter>
    </Sidebar>
  );
}
