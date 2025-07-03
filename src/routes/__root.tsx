import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";

import TanStackQueryLayout from "../integrations/tanstack-query/layout.tsx";
import type { RouterAuthContext } from "@/types/auth";
import { Toaster } from "@/components/ui/sonner";
import SideBar from "@/components/root/SideBar.tsx";

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
    <div className="flex h-screen w-full bg-neutral-50 font-nanum_gothic">
      <SideBar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <TanStackQueryLayout />
      <Toaster />
      <TanStackRouterDevtools />
    </div>
  );
}
