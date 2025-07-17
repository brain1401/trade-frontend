import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { roles, aria, createKeyboardHandler } from "@/lib/utils/accessibility";

/**
 * 관리 액션 타입 정의
 */
export type ManagementAction = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
  badge?: {
    text: string;
    variant: "default" | "destructive" | "secondary";
  };
};

/**
 * ManagementActions 컴포넌트 Props
 */
export type ManagementActionsProps = {
  actions: ManagementAction[];
  className?: string;
};

/**
 * ManagementActions 컴포넌트
 * 주요 관리 기능에 대한 바로가기를 제공하는 컴포넌트
 *
 * 기능:
 * - 주요 관리 기능 바로가기
 * - 배지를 통한 상태 표시 (예: 설정 필요)
 * - 아이콘과 설명이 포함된 리스트
 * - 접근성 고려 (키보드 네비게이션, ARIA 라벨)
 */
export function ManagementActions({
  actions,
  className = "",
}: ManagementActionsProps) {
  const sectionId = React.useId();

  if (!actions || actions.length === 0) {
    return (
      <Card
        className={className}
        role={roles.region}
        aria-labelledby={`${sectionId}-title`}
      >
        <CardHeader>
          <CardTitle
            id={`${sectionId}-title`}
            className="text-lg font-semibold"
          >
            관리 기능
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground" role="status">
            사용 가능한 관리 기능이 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={className}
      role={roles.region}
      aria-labelledby={`${sectionId}-title`}
    >
      <CardHeader>
        <CardTitle id={`${sectionId}-title`} className="text-lg font-semibold">
          관리 기능
        </CardTitle>
      </CardHeader>
      <CardContent>
        <nav role={roles.navigation} aria-label="관리 기능 바로가기">
          <ul role={roles.list} className="space-y-2">
            {actions.map((action) => (
              <li key={action.id} role={roles.listitem}>
                <ManagementActionItem action={action} />
              </li>
            ))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
}

/**
 * 개별 관리 액션 아이템 컴포넌트
 */
function ManagementActionItem({ action }: { action: ManagementAction }) {
  const { label, description, icon: Icon, href, badge } = action;

  return (
    <Link
      to={href}
      className="group block"
      aria-label={`${label} - ${description}`}
    >
      <div className="flex items-center gap-3 rounded-lg border border-transparent p-3 transition-all duration-200 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 hover:border-border hover:bg-accent/50">
        {/* 아이콘 */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors duration-200 group-hover:bg-muted/80">
          <Icon className="h-5 w-5" />
        </div>

        {/* 콘텐츠 */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-medium text-foreground group-hover:text-foreground/90">
              {label}
            </h3>
            {badge && (
              <Badge variant={badge.variant} className="text-xs">
                {badge.text}
              </Badge>
            )}
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        {/* 화살표 아이콘 */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/50 transition-all duration-200 group-hover:translate-x-1 group-hover:bg-muted">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </Link>
  );
}

export default ManagementActions;
