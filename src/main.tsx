import { useMemo } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";
import { useAuth } from "@/stores/authStore";
import type { RouterAuthContext } from "@/types/auth";
import { NotFoundPage } from "@/components/common/NotFoundPage";

// 생성된 라우트 트리 가져오기
import { routeTree } from "./routeTree.gen";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";
import useInit from "./hooks/useInit.ts";

// 새로운 라우터 인스턴스 생성
export const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProvider.getContext(),
    // auth는 나중에 컴포넌트에서 주입됨
    auth: {} as RouterAuthContext,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  // 404 페이지 설정
  defaultNotFoundComponent: NotFoundPage,
  notFoundMode: "root",
});

// 타입 안전성을 위한 라우터 인스턴스 등록
declare module "@tanstack/react-router" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    router: typeof router;
  }
}

// auth 컨텍스트를 주입하는 내부 컴포넌트
function InnerApp() {
  const { isLoading } = useInit();

  const auth = useAuth();

  // auth 컨텍스트를 메모이제이션하여 불필요한 재렌더링 방지
  const authContext = useMemo(
    () => ({
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      user: auth.user,
      rememberMe: auth.rememberMe,
      tokenExpiresAt: auth.tokenExpiresAt,
    }),
    [
      auth.isAuthenticated,
      auth.isLoading,
      auth.user,
      auth.rememberMe,
      auth.tokenExpiresAt,
    ],
  );

  if (isLoading) {
    // 초기화 중일 때 로딩 스피너나 스플래시 화면을 보여줄 수 있음
    return <div>Loading...</div>;
  }

  // 인증 초기화 완료 후 라우터 렌더링
  return (
    <RouterProvider
      router={router}
      context={{
        ...TanStackQueryProvider.getContext(),
        auth: authContext,
      }}
    />
  );
}

// 메인 앱 컴포넌트
function App() {
  return (
    <TanStackQueryProvider.Provider>
      <InnerApp />
    </TanStackQueryProvider.Provider>
  );
}

// 앱 렌더링
const rootElement = document.getElementById("app");

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    // StrictMode는 개발 단계에서 잠시 비활성화
    // <StrictMode>
    <App />,
    // </StrictMode>
  );
}

// 성능 측정
reportWebVitals();
