import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

// 생성된 라우트 트리 가져오기
import { routeTree } from "./routeTree.gen";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";
import NotFound from "@/components/not-found/NotFound";

// 새로운 라우터 인스턴스 생성
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProvider.getContext(),
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  // 404 페이지 설정
  defaultNotFoundComponent: () => <NotFound />,
  notFoundMode: "root",
});

// 타입 안전성을 위한 라우터 인스턴스 등록
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// 앱 렌더링
const rootElement = document.getElementById("app");

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider>
        <RouterProvider router={router} />
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  );
}

// 앱에서 성능 측정을 시작하려면 결과를 로그하는 함수를 전달하거나
// 분석 엔드포인트로 전송 - 자세한 내용은 https://bit.ly/CRA-vitals 참조
reportWebVitals();
