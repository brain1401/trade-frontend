import { useEffect, useMemo } from "react";
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
  // initialize를 의존성 배열에서 제거하여 무한루프 방지
  useEffect(() => {
    let isMounted = true;

    console.log("🚀 앱 시작 - 통합 인증 시스템 초기화");

    const initializeAuth = async () => {
      try {
        await initialize();
        if (isMounted) {
          console.log("✅ 인증 초기화 완료");
        }
      } catch (error) {
        if (isMounted) {
          console.error("❌ 인증 초기화 실패:", error);

          // 개발 환경에서는 재시도 로직 추가
          if (import.meta.env.DEV) {
            console.log("💡 개발 모드 - 3초 후 재시도");
            setTimeout(async () => {
              if (!isMounted) return;
              try {
                console.log("🔄 인증 초기화 재시도");
                await initialize();
                if (isMounted) {
                  console.log("✅ 인증 초기화 재시도 성공");
                }
              } catch (retryError) {
                if (isMounted) {
                  console.error("❌ 인증 초기화 재시도 실패:", retryError);
                }
              }
            }, 3000);
          }
        }
      }
    };

    initializeAuth();

    // cleanup 함수로 메모리 누수 방지
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 의존성 배열로 한 번만 실행 (initialize는 zustand 액션으로 안정적)

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

  // 인증 초기화 중일 때 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-card">
        <div className="space-y-4 text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-neutral-600">
            통합 인증 시스템을 초기화하고 있습니다...
          </p>
          {import.meta.env.DEV && (
            <p className="text-xs text-neutral-400">
              개발 모드: 백엔드 연결 및 토큰 상태를 확인 중입니다.
            </p>
          )}
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
