import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import type { QueryClient } from "@tanstack/react-query";

import TanStackQueryLayout from "../integrations/tanstack-query/layout.tsx";
import { Toaster } from "@/components/ui/sonner";
import SideBar from "@/components/root/SideBar.tsx";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { useAuthStore, useAuthLoading } from "@/stores/authStore";

type MyRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  const initialize = useAuthStore((state) => state.initialize);
  const isLoading = useAuthLoading();

  // 앱 시작 시 인증 상태 초기화
  useEffect(() => {
    initialize();
  }, [initialize]);

  // 인증 초기화 중 로딩 표시
  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-card">
        <div className="space-y-4 text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-neutral-600">
            시스템을 초기화하고 있습니다...
          </p>
        </div>
      </div>
    );
  }

  // 인증 상태에 관계없이 항상 사이드바와 함께 표시
  return (
    <SidebarProvider>
      <div className="-mr-scrollbar flex min-h-dvh min-w-dvw flex-col font-nanum_square_neo_variable font-[500]">
        <SideBar />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
        <TanStackQueryLayout />
        <TanStackRouterDevtools />
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
