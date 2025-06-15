import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";
import TopNavBar from "@/components/common/TopNavBar";
import QuickLinksBar from "@/components/common/QuickLinksBar";
import Footer from "@/components/common/Footer";
import SearchBarHeader from "@/components/search/SearchBarHeader";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useWebSocket } from "@/hooks/common/useWebSocket";
import { useAuthCheck } from "@/hooks/auth/useAuthCheck";
import { NotificationCenter } from "@/components/notification/NotificationCenter";
import { ErrorFallback } from "@/components/common/GlobalErrorBoundary";

import TanStackQueryLayout from "../integrations/tanstack-query/layout.tsx";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
  errorComponent: ErrorFallback,
});

function RootLayout() {
  // Initialize global connections and state
  useWebSocket(); // Start real-time connection for notifications
  useAuthCheck(); // Verify user authentication status

  // Initialize auth store on app load
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="-mr-scrollbar flex min-h-[100dvh] flex-col bg-neutral-50 font-nanum_square_neo_variable font-[500]">
      <TopNavBar />
      <QuickLinksBar />
      <SearchBarHeader />
      <main className="container mx-auto flex max-w-7xl flex-1 flex-col px-8 py-5">
        <Outlet />
      </main>
      <Footer />
      <Toaster /> {/* Global toast notifications */}
      <NotificationCenter /> {/* Real-time notification panel */}
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </div>
  );
}
