import {
  isRouteErrorResponse,
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigationType,
} from "react-router";
import { useEffect, useRef } from "react";

import type { Route } from "./+types/root";
import "./app.css";

import TopNavBar from "./components/layout/TopNavBar";
import QuickLinksBar from "./components/layout/QuickLinksBar";
import Footer from "./components/layout/Footer";
import { ScrollArea } from "./components/ui/scroll-area";

// 전역 스크롤 위치 캐시 (React Router 방식과 동일)
const scrollPositions = new Map<string, number>();

export default function Root() {
  return (
    <div className="bg-gray-50 py-[20rem]">
      <TopNavBar />
      <QuickLinksBar />
      <main className="container mx-auto max-w-7xl px-6 py-[10rem]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) as HTMLElement;
    if (!viewport) return;

    const locationKey = location.key || "default";

    if (navigationType === "POP") {
      // 뒤로/앞으로 가기 : 저장된 스크롤 위치 복원
      const savedScrollTop = scrollPositions.get(locationKey);
      if (savedScrollTop !== undefined) {
        viewport.scrollTop = savedScrollTop;
      }
    } else {
      // 새로운 내비게이션 (PUSH/REPLACE) : 스크롤 리셋
      viewport.scrollTop = 0;
    }

    const handleScroll = () => {
      scrollPositions.set(locationKey, viewport.scrollTop);
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });

    // 정리
    return () => {
      viewport.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname, location.key, navigationType]);

  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Links />
      </head>
      <body>
        <ScrollArea
          ref={scrollAreaRef}
          className="h-[100dvh] w-[100dvw]"
          scrollBarStyles="!bg-brand-500"
        >
          {children}
        </ScrollArea>
        <Scripts />

        {/* {children} */}
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = "Error";
    details = error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];
