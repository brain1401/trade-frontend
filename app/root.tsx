import { Links, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

import GlobalErrorBoundary from "./components/error/GlobalErrorBoundary";
import TopNavBar from "./components/layout/TopNavBar";
import QuickLinksBar from "./components/layout/QuickLinksBar";
import Footer from "./components/layout/Footer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <div className="bg-gray-50 font-nanum_square_neo_variable font-[500]">
      <TopNavBar />
      <QuickLinksBar />
      <main className="container mx-auto max-w-7xl px-6 py-5">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <GlobalErrorBoundary error={error} />;
}

// eslint-disable-next-line react-refresh/only-export-components
export { links } from "./config/links";
