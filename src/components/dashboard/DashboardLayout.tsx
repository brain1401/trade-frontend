import React from "react";

/**
 * 반응형 대시보드 레이아웃 컴포넌트
 *
 * 모바일 우선 반응형 그리드 시스템 구현:
 * - 모바일: 단일 컬럼 스택
 * - 태블릿: 2x2 메트릭 그리드, 전체 너비 섹션
 * - 데스크톱: 4컬럼 메트릭, 8+4 메인 콘텐츠 분할
 */

type DashboardLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

type DashboardGridProps = {
  children: React.ReactNode;
  className?: string;
};

type MetricsGridProps = {
  children: React.ReactNode;
  className?: string;
};

type MainContentProps = {
  children: React.ReactNode;
  className?: string;
};

type SidebarProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * 메인 대시보드 레이아웃 컨테이너
 * 모든 화면 크기에서 일관된 최대 너비와 패딩 제공
 */
export function DashboardLayout({
  children,
  className = "",
}: DashboardLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}

/**
 * 메인 대시보드 그리드 컨테이너
 * 모바일, 태블릿, 데스크톱 간 반응형 레이아웃 전환 처리
 */
export function DashboardGrid({
  children,
  className = "",
}: DashboardGridProps) {
  return (
    <div className={`space-y-6 lg:space-y-8 ${className}`}>{children}</div>
  );
}

/**
 * 메트릭 그리드 컴포넌트
 * 메트릭 카드용 반응형 그리드:
 * - 모바일: 1컬럼 (스택)
 * - 태블릿: 2x2 그리드
 * - 데스크톱: 한 줄에 4컬럼
 */
export function MetricsGrid({ children, className = "" }: MetricsGridProps) {
  return (
    <section
      className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
      aria-label="대시보드 주요 지표"
      role="region"
    >
      {children}
    </section>
  );
}

/**
 * 사이드바 레이아웃을 포함한 메인 콘텐츠 영역
 * 반응형 레이아웃:
 * - 모바일: 단일 컬럼 (메인 콘텐츠 아래 사이드바)
 * - 태블릿: 단일 컬럼 (메인 콘텐츠 아래 사이드바)
 * - 데스크톱: 8+4 컬럼 분할 (메인 콘텐츠 + 사이드바)
 */
export function MainContentGrid({
  children,
  className = "",
}: DashboardGridProps) {
  return (
    <div className={`grid gap-6 lg:grid-cols-12 lg:gap-8 ${className}`}>
      {children}
    </div>
  );
}

/**
 * 메인 콘텐츠 영역 (데스크톱에서 왼쪽)
 * 데스크톱에서 8컬럼, 작은 화면에서 전체 너비 차지
 */
export function MainContent({ children, className = "" }: MainContentProps) {
  return (
    <div className={`space-y-6 lg:col-span-8 ${className}`}>{children}</div>
  );
}

/**
 * 사이드바 영역 (데스크톱에서 오른쪽)
 * 데스크톱에서 4컬럼, 작은 화면에서 전체 너비 차지
 * 모바일/태블릿에서 메인 콘텐츠 아래 표시
 */
export function Sidebar({ children, className = "" }: SidebarProps) {
  return <div className={`lg:col-span-4 ${className}`}>{children}</div>;
}

/**
 * 액션 카드 그리드
 * 액션/기능 카드용 반응형 그리드:
 * - 모바일: 1컬럼
 * - 태블릿 이상: 2컬럼
 */
export function ActionGrid({ children, className = "" }: DashboardGridProps) {
  return (
    <div className={`grid gap-4 sm:gap-6 md:grid-cols-2 ${className}`}>
      {children}
    </div>
  );
}

/**
 * 모바일 상호작용을 위한 터치 친화적 컨테이너
 * 최소 터치 대상 크기와 적절한 간격 보장
 */
export function TouchContainer({
  children,
  className = "",
}: DashboardGridProps) {
  return (
    <div
      className={`touch-manipulation ${className}`}
      style={{ minHeight: "44px" }}
    >
      {children}
    </div>
  );
}
