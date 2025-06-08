import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import TanStackQueryLayout from "../integrations/tanstack-query/layout.tsx";

import type { QueryClient } from "@tanstack/react-query";
import TopNavBar from "@/components/layout/TopNavBar.tsx";
import QuickLinksBar from "@/components/layout/QuickLinksBar.tsx";
import Footer from "@/components/layout/Footer.tsx";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="-mr-scrollbar flex min-h-[100dvh] flex-col bg-gray-50 font-nanum_square_neo_variable font-[500]">
      <TopNavBar />
      <QuickLinksBar />
      <main className="container mx-auto flex max-w-7xl flex-1 flex-col px-8 py-5">
        <Outlet />
      </main>
      <Footer />
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </div>
  ),
});
