import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

/**
 * 대시보드용 간소화된 액션 카드 컴포넌트
 * 최소한의 시각적 요소와 적절한 접근성을 갖춘 깔끔한 디자인
 */
type ActionCardProps = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  variant?: "default" | "primary";
};

export default function ActionCard({
  title,
  description,
  icon: Icon,
  href,
  variant = "default",
}: ActionCardProps) {
  const isPrimary = variant === "primary";

  return (
    <Link to={href} className="group block">
      <Card
        className={`relative min-h-[44px] cursor-pointer border transition-all duration-200 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:scale-[1.02] hover:shadow-md ${
          isPrimary
            ? "border-primary/20 bg-primary/5"
            : "border-border bg-card hover:border-border/80"
        } `}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200 ${
                isPrimary
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground group-hover:bg-muted/80"
              } `}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 transition-all duration-200 group-hover:translate-x-1 group-hover:bg-muted">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <CardTitle
            className={`text-lg font-semibold transition-colors duration-200 ${
              isPrimary
                ? "text-primary group-hover:text-primary/90"
                : "text-foreground group-hover:text-foreground/90"
            } `}
          >
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
