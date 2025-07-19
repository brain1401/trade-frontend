import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Sparkles } from "lucide-react";

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
  // 색상별 스타일 매핑 (모던한 그라데이션과 글래스모피즘 효과)
  const colorStyles = {
    primary: {
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50/80 via-indigo-50/60 to-purple-50/40",
      hoverShadow: "hover:shadow-blue-500/25",
    },
    success: {
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50/80 via-teal-50/60 to-cyan-50/40",
      hoverShadow: "hover:shadow-emerald-500/25",
    },
    warning: {
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50/80 via-orange-50/60 to-red-50/40",
      hoverShadow: "hover:shadow-amber-500/25",
    },
    info: {
      gradient: "from-cyan-500 to-blue-600",
      bgGradient: "from-cyan-50/80 via-blue-50/60 to-indigo-50/40",
      hoverShadow: "hover:shadow-cyan-500/25",
    },
    neutral: {
      gradient: "from-slate-500 to-gray-600",
      bgGradient: "from-slate-50/80 via-gray-50/60 to-zinc-50/40",
      hoverShadow: "hover:shadow-slate-500/25",
    },
    brand: {
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-50/80 via-pink-50/60 to-rose-50/40",
      hoverShadow: "hover:shadow-purple-500/25",
    },
  };

  const currentStyle = colorStyles[color];

  return (
    <Link to={href} className="group block">
      <Card
        className={`relative cursor-pointer overflow-hidden border-0 bg-gradient-to-br ${currentStyle.bgGradient} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${currentStyle.hoverShadow} focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2`}
      >
        {/* 배경 장식 요소들 */}
        <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/30 blur-2xl transition-all duration-300 group-hover:scale-110" />
        <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/20 blur-xl" />

        {/* 반짝이는 효과 */}
        <div className="absolute top-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Sparkles className="h-4 w-4 text-white/60" />
        </div>

        <CardHeader className="relative pb-4">
          <div className="mb-3 flex items-center justify-between">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${currentStyle.gradient} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-2">
              {badge && (
                <Badge
                  variant="secondary"
                  className="bg-white/80 text-xs text-slate-700"
                >
                  {badge}
                </Badge>
              )}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white/30">
                <ChevronRight className="h-4 w-4 text-slate-600" />
              </div>
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-slate-800 transition-colors duration-200 group-hover:text-slate-900">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative">
          <p className="text-sm leading-relaxed font-medium text-slate-600">
            {description}
          </p>

          {/* 하단 그라데이션 라인 */}
          <div
            className={`absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r ${currentStyle.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
          />
        </CardContent>
      </Card>
    </Link>
  );
}
