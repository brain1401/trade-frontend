import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { getDashboardCardStyles } from "@/lib/utils/ui-helpers";

/**
 * 대시보드 카드 프로퍼티 타입
 */
export type DashboardCardProps = {
  /** 카드 제목 */
  title: string;
  /** 카드 설명 */
  description: string;
  /** 아이콘 컴포넌트 */
  icon: React.ComponentType<{ className?: string }>;
  /** 링크 경로 */
  href: string;
  /** 색상 테마 */
  color: "primary" | "success" | "warning" | "info" | "neutral" | "brand";
  /** 뱃지 텍스트 (선택사항) */
  badge?: string;
};

/**
 * 대시보드 카드 컴포넌트
 *
 * 클릭 가능한 링크 카드로 구현하여 사용자 경험 개선
 * 다양한 색상 테마와 뱃지를 지원하여 시각적 구분을 제공
 */
export function DashboardCard({
  title,
  description,
  icon: Icon,
  href,
  color,
  badge,
}: DashboardCardProps) {
  const styles = getDashboardCardStyles(color);

  return (
    <Link to={href} className="group block">
      <Card
        className={`cursor-pointer transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-2 hover:-translate-y-1 hover:shadow-md ${styles.hover} `}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Icon
              className={`h-6 w-6 ${styles.icon} transition-transform duration-200 group-hover:scale-110`}
            />
            <div className="flex items-center gap-2">
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
              <ChevronRight className="h-4 w-4 text-neutral-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-neutral-600" />
            </div>
          </div>
          <CardTitle className="text-lg font-semibold text-neutral-800 group-hover:text-neutral-900">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-neutral-600">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
