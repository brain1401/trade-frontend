import React from "react";
import { cn } from "@/lib/utils/cn";
import { roles, aria, createKeyboardHandler } from "@/lib/utils/accessibility";

// 접근성 개선을 위한 CSS 클래스 import
import "@/css/accessibility.css";

/**
 * 반응형 대시보드 레이아웃 컴포넌트
 *
 * 모바일 우선 반응형 그리드 시스템 구현:
 * - 모바일 (< 640px): 단일 컬럼 스택, 터치 친화적 인터페이스
 * - 태블릿 (640px - 1024px): 2x2 메트릭 그리드, 스택 레이아웃
 * - 데스크톱 (> 1024px): 4컬럼 메트릭, 8+4 메인 콘텐츠 분할
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
  collapsible?: boolean;
  defaultCollapsed?: boolean;
};

/**
 * 메인 대시보드 레이아웃 컨테이너
 * 모든 화면 크기에서 일관된 최대 너비와 패딩 제공
 * 모바일 최적화: 더 작은 패딩과 터치 친화적 간격
 * 접근성: 메인 랜드마크 역할과 적절한 ARIA 라벨 제공
 */
export function DashboardLayout({
  children,
  className = "",
}: DashboardLayoutProps) {
  return (
    <main
      role={roles.main}
      aria-label="대시보드 메인 콘텐츠"
      className={cn(
        "container mx-auto h-full max-w-7xl",
        // 모바일: 더 작은 패딩으로 화면 공간 최대 활용
        "px-3 py-4",
        // 태블릿: 중간 패딩
        "sm:px-4 sm:py-5",
        // 데스크톱: 표준 패딩
        "lg:px-8 lg:py-6",
        className,
      )}
    >
      {children}
    </main>
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
  return <div className={cn("grid-consistent-lg", className)}>{children}</div>;
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
 * 접근성: 적절한 ARIA 속성과 키보드 네비게이션 지원
 */
export function Sidebar({
  children,
  className = "",
  collapsible = false,
  defaultCollapsed = false,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const sidebarId = React.useId();
  const contentId = `${sidebarId}-content`;

  const handleToggle = React.useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  const handleKeyDown = createKeyboardHandler(handleToggle);

  if (collapsible) {
    return (
      <aside
        className={cn("lg:col-span-4", className)}
        role={roles.complementary}
        aria-label="대시보드 사이드바"
      >
        {/* 모바일/태블릿용 접기/펼치기 버튼 */}
        <div className="mb-4 lg:hidden">
          <button
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            className={cn(
              "flex w-full items-center justify-between rounded-lg border border-border bg-card p-3",
              "text-sm font-medium text-foreground",
              "interactive-hover hover:bg-accent hover:text-accent-foreground",
              "focus-visible-enhanced",
              // 터치 친화적 최소 높이
              "touch-target",
            )}
            {...aria.expandable(!isCollapsed, contentId)}
            aria-label={`사이드바 ${isCollapsed ? "펼치기" : "접기"}`}
          >
            <span>사이드바 {isCollapsed ? "펼치기" : "접기"}</span>
            <span
              className={cn(
                "transition-transform duration-200",
                isCollapsed ? "rotate-0" : "rotate-180",
              )}
              {...aria.hidden(true)}
            >
              ▼
            </span>
          </button>
        </div>

        {/* 사이드바 콘텐츠 */}
        <div
          id={contentId}
          className={cn(
            "transition-all duration-300 ease-in-out lg:block",
            isCollapsed ? "hidden" : "block",
          )}
          {...aria.hidden(isCollapsed)}
        >
          {children}
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn("lg:col-span-4", className)}
      role={roles.complementary}
      aria-label="대시보드 사이드바"
    >
      {children}
    </aside>
  );
}

/**
 * 액션 카드 그리드
 * 액션/기능 카드용 반응형 그리드:
 * - 모바일: 1컬럼
 * - 태블릿 이상: 2컬럼
 */
export function ActionGrid({ children, className = "" }: DashboardGridProps) {
  return (
    <div
      className={cn("grid-consistent gap-4 sm:gap-6 md:grid-cols-2", className)}
    >
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
      className={cn(
        "touch-manipulation",
        // 최소 터치 영역 보장 (44px)
        "touch-target",
        // 터치 친화적 패딩
        "p-2 sm:p-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * 반응형 카드 컨테이너
 * 화면 크기에 따라 카드 간격과 패딩을 조정
 */
export function ResponsiveCard({
  children,
  className = "",
}: DashboardGridProps) {
  return (
    <div
      className={cn(
        "card-enhanced rounded-lg border border-border bg-card text-card-foreground shadow-sm",
        // 반응형 패딩
        "p-4 sm:p-5 lg:p-6",
        // 터치 친화적 최소 높이
        "min-h-[60px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * 모바일 최적화된 버튼 컨테이너
 * 터치 친화적 크기와 간격 제공
 */
export function MobileButtonContainer({
  children,
  className = "",
}: DashboardGridProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 sm:gap-3",
        // 모바일에서 버튼들이 충분한 공간을 가지도록
        "space-y-2 sm:space-y-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
