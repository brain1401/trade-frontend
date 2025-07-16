import React from "react";
import { User } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import type { User as UserType } from "@/types/auth";

type DashboardHeaderProps = {
  user: UserType | null;
  className?: string;
};

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type DashboardHeaderBreadcrumbProps = {
  items?: BreadcrumbItem[];
  className?: string;
};

/**
 * 대시보드용 브레드크럼 네비게이션 컴포넌트
 * 계층적 네비게이션 컨텍스트 제공
 */
function DashboardHeaderBreadcrumb({
  items = [{ label: "홈", href: "/" }, { label: "대시보드" }],
  className,
}: DashboardHeaderBreadcrumbProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/**
 * 깔끔한 대시보드 헤더 컴포넌트
 *
 * 기능:
 * - 깔끔한 타이포그래피 계층 구조 (text-3xl font-bold)
 * - 브레드크럼 네비게이션
 * - 반응형 텍스트 크기
 * - 시맨틱 HTML 구조
 * - 장식적 배경 요소 없음
 *
 * 요구사항: 1.1, 1.2, 2.2, 5.2
 */
export default function DashboardHeader({
  user,
  className,
}: DashboardHeaderProps) {
  return (
    <header
      className={`space-y-4 ${className || ""}`}
      role="banner"
      aria-label="대시보드 헤더"
    >
      {/* 브레드크럼 네비게이션 */}
      <DashboardHeaderBreadcrumb />

      {/* 메인 헤더 콘텐츠 */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center gap-3">
          {/* 사용자 아바타 - 단순함, 그라데이션 없음 */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-primary/10">
            <User className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>

          {/* 깔끔한 타이포그래피를 사용한 환영 메시지 */}
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              안녕하세요, {user?.name || "사용자"}님
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              오늘도 스마트한 무역 관리를 시작해보세요
            </p>
          </div>
        </div>

        {/* 추가 헤더 액션을 여기에 추가할 수 있음 */}
        <div
          className="flex items-center gap-2"
          role="toolbar"
          aria-label="헤더 액션"
        >
          {/* 필요시 빠른 액션 버튼 추가 */}
        </div>
      </div>
    </header>
  );
}

export { DashboardHeaderBreadcrumb };
export type { DashboardHeaderProps, BreadcrumbItem };
