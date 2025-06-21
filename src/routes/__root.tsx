import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import TanStackQueryLayout from "../integrations/tanstack-query/layout.tsx";

type MyRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="-mr-scrollbar flex min-h-[100dvh] flex-col bg-neutral-50 font-nanum_square_neo_variable font-[500]">
      <main className="container mx-auto flex max-w-7xl flex-1 flex-col px-8 py-5">
        <Outlet />
      </main>
    </div>
  );
}
