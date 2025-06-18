import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import TanStackQueryLayout from "../integrations/tanstack-query/layout.tsx";
import TopNavBar from "@/components/common/TopNavBar.tsx";
import QuickLinksBar from "@/components/common/QuickLinksBar.tsx";
import SearchBarHeader from "@/components/search/SearchBarHeader.tsx";
import Footer from "@/components/common/Footer.tsx";
import { useAuthInit } from "@/hooks/common/useAuthInit.ts";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  const { isInitialized, isLoading } = useAuthInit();

  // 인증 상태 초기화가 완료되지 않았거나 로딩 중인 경우 로딩 화면 표시
  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-600 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <div className="mt-4 text-lg font-medium text-brand-700">
            로딩 중...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="-mr-scrollbar flex min-h-[100dvh] flex-col bg-neutral-50 font-nanum_square_neo_variable font-[500]">
      <TopNavBar />
      <QuickLinksBar />
      <SearchBarHeader />
      <main className="container mx-auto flex max-w-7xl flex-1 flex-col px-8 py-5">
        <Outlet />
      </main>
      <Footer />
      <Toaster />

      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </div>
  );
}
