import { StrictMode, useEffect } from "react";
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

// 새로운 라우터 인스턴스 생성
const router = createRouter({
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
  const auth = useAuth();
  const { isLoading, initialize } = auth;

  // 앱 시작 시 인증 상태 초기화 (한 번만 실행)
  useEffect(() => {
    initialize();
  }, [initialize]);

  // 인증 초기화 중일 때 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-card">
        <div className="space-y-4 text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-neutral-600">
            시스템을 초기화하고 있습니다...
          </p>
        </div>
      </div>
    );
  }

  // 인증 초기화 완료 후 라우터 렌더링
  return (
    <RouterProvider
      router={router}
      context={{
        ...TanStackQueryProvider.getContext(),
        auth,
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
    // StrictMode 일시 비활성화 (테스트용)
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

// 앱에서 성능 측정을 시작하려면 결과를 로그하는 함수를 전달하거나
// 분석 엔드포인트로 전송 - 자세한 내용은 https://bit.ly/CRA-vitals 참조
reportWebVitals();
