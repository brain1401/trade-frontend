import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

/**
 * 대시보드 카드 컴포넌트
 * 클릭 가능한 링크 카드로 구현하여 사용자 경험 개선
 */
type DashboardCardProps = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: "primary" | "success" | "warning" | "info" | "neutral" | "brand";
  badge?: string;
};

export default function DashboardCard({
  title,
  description,
  icon: Icon,
  href,
  color,
  badge,
}: DashboardCardProps) {
  // 색상별 스타일 매핑 (커스텀 색상 시스템 활용)
  const colorStyles = {
    primary:
      "hover:border-primary-200 hover:bg-primary-50/50 focus-within:ring-primary-500",
    success:
      "hover:border-success-200 hover:bg-success-50/50 focus-within:ring-success-500",
    warning:
      "hover:border-warning-200 hover:bg-warning-50/50 focus-within:ring-warning-500",
    info: "hover:border-info-200 hover:bg-info-50/50 focus-within:ring-info-500",
    neutral:
      "hover:border-neutral-200 hover:bg-neutral-50/50 focus-within:ring-neutral-500",
    brand:
      "hover:border-brand-200 hover:bg-brand-50/50 focus-within:ring-brand-500",
  };

  const iconColors = {
    primary: "text-primary-600",
    success: "text-success-600",
    warning: "text-warning-600",
    info: "text-info-600",
    neutral: "text-neutral-600",
    brand: "text-brand-600",
  };

  return (
    <Link to={href} className="group block">
      <Card
        className={`cursor-pointer transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-2 hover:-translate-y-1 hover:shadow-md ${colorStyles[color]} `}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Icon
              className={`h-6 w-6 ${iconColors[color]} transition-transform duration-200 group-hover:scale-110`}
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
