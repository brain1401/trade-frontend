import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import TanStackQueryLayout from "../integrations/tanstack-query/layout.tsx";
import TopNavBar from "@/components/common/TopNavBar.tsx";
import QuickLinksBar from "@/components/common/QuickLinksBar.tsx";
import SearchBarHeader from "@/components/search/SearchBarHeader.tsx";
import Footer from "@/components/common/Footer.tsx";
import { useAuthBackgroundInit } from "@/hooks/common/useAuthBackgroundInit.ts";

type MyRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  // 백그라운드에서 조용히 인증 상태 초기화
  useAuthBackgroundInit();

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
