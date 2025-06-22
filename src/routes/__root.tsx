import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";

import TanStackQueryLayout from "../integrations/tanstack-query/layout.tsx";
import type { RouterAuthContext } from "@/types/auth";
import { Toaster } from "@/components/ui/sonner";
import SideBar from "@/components/root/SideBar.tsx";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";

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
