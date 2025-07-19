import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";

import TanStackQueryLayout from "../integrations/tanstack-query/layout.tsx";
import type { RouterAuthContext } from "@/types/auth";
import { Toaster } from "@/components/ui/sonner";
import SideBar from "@/components/root/SideBar.tsx";
import { useIsMobile } from "@/hooks/use-mobile.ts";
import TopBar from "@/components/root/TopBar.tsx";
import { useAuth } from "@/stores/authStore.ts";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

/**
 * 라우터 컨텍스트 타입 정의
 *
 * TanStack Router 공식 문서의 Authentication using React context/hooks 방식
 * @see https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes
 */
type MyRouterContext = {
  queryClient: QueryClient;
  auth: RouterAuthContext;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  const isMobile = useIsMobile();
  const { isLoading, initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isMobile === undefined) {
    // SSR 또는 초기 로드 시 깜빡임 방지
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-dvh w-dvw items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div
      className={`h-dvh w-dvw bg-neutral-50 font-nanum_gothic ${
        isMobile ? "flex flex-col" : "flex"
      }`}
    >
      {isMobile ? <TopBar /> : <SideBar />}
      <main className="flex flex-1 flex-col overflow-y-auto px-[2.5rem]">
        <Outlet />
      </main>
      {/* <TanStackQueryLayout /> */}
      <Toaster />
      {/* <TanStackRouterDevtools /> */}
    </div>
  );
}
