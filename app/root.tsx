import { Links, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

import RootLayout from "./components/layout/RootLayout";
import GlobalErrorBoundary from "./components/error/GlobalErrorBoundary";

export default function Root() {
  return <RootLayout />;
}

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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <GlobalErrorBoundary error={error} />;
}

// eslint-disable-next-line react-refresh/only-export-components
export { links } from "./config/links";
