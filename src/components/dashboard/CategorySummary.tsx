import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bookmark,
  TrendingUp,
  ExternalLink,
  AlertCircle,
  BarChart3,
  Eye,
  Plus,
  ArrowRight,
  PieChart,
  Activity,
  List,
  BarChart2,
} from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import type { CategorySummaryProps, CategoryData } from "@/types/dashboard";

// 접근성 개선을 위한 CSS 클래스 import
import "@/css/accessibility.css";

/**
 * 차트 범례 포맷터 컴포넌트
 */
const LegendFormatter = (value: string) => (
  <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>
);

/**
 * 카테고리별 북마크 요약 컴포넌트
 * 북마크를 타입별로 그룹화하여 통계 정보를 표시
 *
 * 기능:
 * - 카테고리별 북마크 수 표시
 * - 최근 활동 수 표시 (지난 7일)
 * - 전체 보기 링크 제공
 * - 빈 카테고리에 대한 안내 메시지
 * - 로딩 및 에러 상태 처리
 */
export function CategorySummary({
  categories,
  title = "카테고리별 요약",
  loading = false,
  error = false,
  className,
}: CategorySummaryProps) {
  if (loading) {
    return <CategorySummarySkeleton className={className} />;
  }

  if (error) {
    return (
      <Card className={cn("card-enhanced w-full", className)}>
        <CardHeader>
          <CardTitle className="icon-text-align">
            <AlertCircle className="icon-md text-destructive" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="icon-sm" />
            <AlertDescription>
              카테고리 정보를 불러오는 중 오류가 발생했습니다.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (categories.length === 0) {
    return (
      <Card className={cn("card-enhanced w-full", className)}>
        <CardHeader>
          <CardTitle className="icon-text-align">
            <PieChart className="icon-md" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Bookmark className="icon-xl text-muted-foreground" />
            </div>
            <h3 className="text-hierarchy-3 mb-2">카테고리가 비어있습니다</h3>
            <p className="text-hierarchy-5 mb-6">
              북마크를 추가하여 카테고리별로 정리해보세요.
              <br />
              체계적인 관리로 더 효율적인 업무가 가능합니다.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button
                variant="default"
                size="sm"
                className="icon-text-align-sm focus-visible-enhanced touch-target-sm"
              >
                <Plus className="icon-sm" />첫 북마크 추가하기
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="icon-text-align-sm focus-visible-enhanced touch-target-sm"
              >
                <Activity className="icon-sm" />
                가이드 보기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 차트 데이터 준비
  const chartData = categories.map((category) => ({
    name: category.name,
    value: category.count,
    color: category.color || "#3b82f6",
  }));

  return (
    <Card className={cn("card-enhanced w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-hierarchy-3">{title}</span>
          <Badge variant="secondary" className="text-xs">
            {categories.length}개 카테고리
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="card-spacious-sm">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="list"
              className="icon-text-align-sm focus-visible-enhanced"
            >
              <List className="icon-sm" />
              목록 보기
            </TabsTrigger>
            <TabsTrigger
              value="chart"
              className="icon-text-align-sm focus-visible-enhanced"
            >
              <BarChart2 className="icon-sm" />
              차트 보기
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4 space-y-4">
            {categories.map((category) => {
              const maxCount = Math.max(...categories.map((c) => c.count));
              return (
                <CategoryItem
                  key={category.id}
                  category={category}
                  maxCount={maxCount}
                />
              );
            })}
          </TabsContent>

          <TabsContent value="chart" className="mt-4">
            <div className="space-y-4">
              {/* 도넛 차트 */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value}개`,
                        name,
                      ]}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={LegendFormatter}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* 차트 하단 통계 */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="font-medium">가장 많은 카테고리</div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: categories[0]?.color }}
                    />
                    <span>{categories[0]?.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {categories[0]?.count}개
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">최근 활동</div>
                  <div className="text-muted-foreground">
                    {categories.filter((c) => c.recentCount > 0).length}개
                    카테고리에서 활동
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-3 border-t pt-4">
          {/* 카테고리 요약 통계 */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>총 북마크</span>
            <span className="font-medium">
              {categories.reduce((sum, cat) => sum + cat.count, 0)}개
            </span>
          </div>

          {/* 네비게이션 버튼들 */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="group flex-1 transition-colors hover:border-primary/50"
              asChild
            >
              <a href="/bookmarks">
                <ExternalLink className="mr-2 h-4 w-4 transition-colors group-hover:text-primary" />
                전체 북마크 보기
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="px-3 hover:bg-primary/10"
              title="카테고리 관리"
            >
              <PieChart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 개별 카테고리 아이템 컴포넌트
 */
function CategoryItem({
  category,
  maxCount,
}: {
  category: CategoryData;
  maxCount: number;
}) {
  const IconComponent = category.icon || Bookmark;

  // 전체 카테고리 중에서 이 카테고리의 상대적 비율 계산 (시각화용)
  const progressValue = maxCount > 0 ? (category.count / maxCount) * 100 : 0;

  // 카테고리가 비어있는지 확인
  const isEmpty = category.count === 0;

  // 최근 활동이 있는지 확인
  const hasRecentActivity = category.recentCount > 0;

  return (
    <div
      className={cn(
        "group card-enhanced space-y-3 rounded-lg border bg-card p-4 transition-all duration-200",
        "interactive-hover-subtle hover:border-accent-foreground/20 hover:bg-accent/50 hover:shadow-md",
        isEmpty && "border-dashed border-muted-foreground/30",
      )}
    >
      {/* 상단: 아이콘, 제목, 액션 버튼 */}
      <div className="flex items-center justify-between">
        <div className="flex-consistent">
          <div
            className={cn(
              "rounded-md p-2 transition-colors",
              isEmpty ? "bg-muted/50" : "bg-opacity-20",
            )}
            style={{
              backgroundColor:
                !isEmpty && category.color ? `${category.color}20` : undefined,
            }}
          >
            <IconComponent
              className={cn(
                "icon-sm transition-colors",
                isEmpty ? "text-muted-foreground" : "",
              )}
              style={{ color: !isEmpty ? category.color : undefined }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4
                className={cn(
                  "text-hierarchy-4",
                  isEmpty ? "text-accessible-muted" : "",
                )}
              >
                {category.name}
              </h4>
              {hasRecentActivity && (
                <div className="status-indicator status-success">
                  <div className="flex h-2 w-2 animate-pulse rounded-full bg-green-500" />
                </div>
              )}
            </div>
            {category.description && (
              <p className="text-hierarchy-5">{category.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            asChild
            title={`${category.name} 상세 보기`}
            className="focus-visible-enhanced touch-target-sm h-8 w-8 p-0"
          >
            <a href={category.href}>
              <Eye className="icon-xs" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            title={`${category.name} 바로가기`}
            className="focus-visible-enhanced touch-target-sm h-8 w-8 p-0"
          >
            <a href={category.href}>
              <ArrowRight className="icon-xs" />
            </a>
          </Button>
        </div>
      </div>

      {/* 중간: 통계 정보와 시각화 */}
      {!isEmpty ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">총 북마크</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{category.count}개</span>
              {hasRecentActivity && (
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="mr-1 h-3 w-3" />+{category.recentCount}
                </Badge>
              )}
            </div>
          </div>

          {/* 향상된 시각화: 프로그레스 바와 미니 차트 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>활동 수준</span>
              <span>{Math.round(progressValue)}%</span>
            </div>
            <div className="relative">
              <Progress
                value={progressValue}
                className="h-2"
                style={
                  {
                    "--progress-background": category.color || "#3b82f6",
                  } as React.CSSProperties
                }
              />
              {/* 미니 차트 표시 (최근 활동이 있을 때) */}
              {hasRecentActivity && (
                <div className="absolute -top-1 right-0 flex items-center gap-1">
                  <div className="flex h-3 items-end gap-px">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-green-500 opacity-60"
                        style={{
                          height: `${Math.random() * 8 + 4}px`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 빈 카테고리 상태 */
        <div className="py-4 text-center">
          <div className="mb-2 text-xs text-muted-foreground">
            이 카테고리는 비어있습니다
          </div>
          <div className="text-xs text-muted-foreground">
            첫 번째 북마크를 추가해보세요
          </div>
        </div>
      )}

      {/* 하단: 향상된 액션 버튼들 */}
      <div className="flex gap-2 border-t pt-3">
        {!isEmpty ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 transition-colors group-hover:border-primary/50"
              asChild
            >
              <a href={category.href}>
                <BarChart3 className="mr-2 h-3 w-3" />
                상세 보기
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="px-3"
              title="새 북마크 추가"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <Button variant="default" size="sm" className="flex-1 gap-2">
            <Plus className="h-3 w-3" />첫 북마크 추가
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * 로딩 스켈레톤 컴포넌트
 */
function CategorySummarySkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-20" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-3 rounded-lg border bg-card p-4">
            {/* 상단: 아이콘, 제목, 액션 버튼 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-md" />
                <div>
                  <Skeleton className="mb-1 h-4 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-8 w-8" />
            </div>

            {/* 중간: 통계 정보와 프로그레스 바 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </div>
              <div className="space-y-1">
                <Skeleton className="h-2 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-8" />
                </div>
              </div>
            </div>

            {/* 하단: 액션 버튼들 */}
            <div className="flex gap-2 border-t pt-2">
              <Skeleton className="h-8 flex-1" />
            </div>
          </div>
        ))}
        <div className="border-t pt-4">
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export default CategorySummary;
