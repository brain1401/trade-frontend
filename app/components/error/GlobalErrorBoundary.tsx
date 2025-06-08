import { isRouteErrorResponse } from "react-router";
import type { Route } from "../../+types/root";

type GlobalErrorBoundaryProps = {
  error: Route.ErrorBoundaryProps["error"];
};

export default function GlobalErrorBoundary({
  error,
}: GlobalErrorBoundaryProps) {
  let message = "이런!";
  let details = "예상치 못한 오류가 발생했습니다.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = "오류";
    details = error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16 text-center">
      <h1 className="mb-4 text-4xl font-bold text-red-500">{message}</h1>
      <p className="text-lg text-neutral-900">{details}</p>
      {stack && (
        <pre className="mt-6 w-full overflow-x-auto rounded-md bg-gray-800 p-4 text-left text-white">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
