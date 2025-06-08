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
      {/* 
        overflow-x-hidden을 주어 body안의 div태그의 너비가 body보다 커질 경우
        x축 스크롤바가 생기는 것을 방지

        자세한건 Root 컴포넌트의 주석 참고
      */}
      <body className="overflow-x-hidden">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    /*
     * 스크롤바 발생 시 레이아웃 깨짐 방지
     * - `-mr-scrollbar` 클래스 적용 : 스크롤바 너비만큼 마이너스 마진 부여
     *   - 마이너스 마진 적용으로 해당 div 태그의 너비가 body 태그보다 커짐
     * - `body` 태그의 `overflow-x-hidden` 클래스 적용 : div 태그 너비 증가로 인한 X축 스크롤바 발생 방지
     *
     * 해당 클래스들을 제거하면 Y축 스크롤바 발생 시 상단바 레이아웃 쉬프팅 현상 확인 가능
     */

    /**
     * flex를 준 이유
     * - flex와 flex-col은 main 태그 안의 내용이 접속 기기 높이보다 작을 때 Footer가 위로 끌어올려져 하단에 여백이 생기는 것을 방지
     * - 최소 높이를 100dvh로 설정하여 기기 높이와 동일하게 유지
     * - flex-col로 세로 배치
     * - flex-1로 내용이 없을 때에도 높이를 차지하도록 설정
     *
     * dvh 단위 사용 이유
     * - 모바일 환경에서 브라우저 주소창이 동적으로 나타나거나 사라질 때 뷰포트 높이가 변동하는 문제 해결
     * - 동적 뷰포트 높이(dvh)를 사용하여 레이아웃 깨짐 방지
     */
    <div className="-mr-scrollbar flex min-h-[100dvh] flex-col bg-gray-50 font-nanum_square_neo_variable font-[500]">
      <TopNavBar />
      <QuickLinksBar />
      <main className="container mx-auto max-w-7xl flex-1 px-8 py-5">
        {/* 
        {/* 
          Outlet 컴포넌트
          - React Router v7의 파일 기반 라우팅에서 중첩된 자식 라우트 컴포넌트를 렌더링하는 위치
          - app/routes/ 폴더의 라우트 파일들이 이 위치에 렌더링됨
          - 라우트 파일들은 모두 app/routes/ 폴더 안에 있음
          - 라우트 변경 시 이 영역의 내용만 교체되며, 상단바/퀵링크바/푸터는 유지됨
        */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// React Router v7 프레임워크 모드에서는 이 root.tsx 파일에 에러 바운더리 컴포넌트를 작성해야 함.
// 다만 이 파일이 비대해지는 것을 막기 위해 실제 에러 처리 로직은 GlobalErrorBoundary로 분리했으며,
// 이 ErrorBoundary 컴포넌트는 어댑터 역할을 하여 GlobalErrorBoundary를 렌더링함.
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <GlobalErrorBoundary error={error} />;
}

// eslint-disable-next-line react-refresh/only-export-components
export { links } from "./config/links";
