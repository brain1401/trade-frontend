import { createFileRoute, Link } from "@tanstack/react-router";
import { StatisticCharts } from "@/components/trade/StatisticCharts";
import ContentCard from "@/components/common/ContentCard";
import ExchangeRateCard from "@/components/trade/ExchangeRateCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  Globe,
  BarChart3,
} from "lucide-react";

export const Route = createFileRoute("/trade/statistics")({
  component: TradeStatisticsPage,
});

const LINK_BUTTON_BASE_CLASSES = "h-auto p-0 text-sm hover:underline";
const CARD_SPACING_CLASSES = "mt-8";

// 목업 데이터
const quickStats = [
  { label: "이번 달 수출", value: "567억 달러", change: "+12%", trend: "up" },
  { label: "이번 달 수입", value: "489억 달러", change: "+8%", trend: "up" },
  { label: "무역 수지", value: "+78억 달러", change: "+25%", trend: "up" },
];

const recentReports = [
  {
    title: "2024년 11월 무역 동향 보고서",
    category: "월간 보고서",
    date: "2024-12-01",
    size: "2.3MB",
  },
  {
    title: "반도체 수출 동향 분석",
    category: "품목별 분석",
    date: "2024-11-28",
    size: "1.8MB",
  },
  {
    title: "중국 무역 현황 리포트",
    category: "국가별 분석",
    date: "2024-11-25",
    size: "3.1MB",
  },
  {
    title: "Q3 무역 통계 요약",
    category: "분기별 요약",
    date: "2024-11-20",
    size: "1.2MB",
  },
];

const popularSearches = [
  "반도체 수출 통계",
  "중국 무역 현황",
  "자동차 부품 수입",
  "화학제품 동향",
  "무역 수지 분석",
];

function TradeStatisticsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-2/3">
          {/* 페이지 헤더 */}
          <ContentCard
            title="무역 통계 대시보드"
            titleRightElement={
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-3 py-2 text-xs"
                >
                  <Filter size={14} className="mr-1" />
                  필터
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-3 py-2 text-xs"
                >
                  <Calendar size={14} className="mr-1" />
                  기간 설정
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-3 py-2 text-xs"
                >
                  <Download size={14} className="mr-1" />
                  다운로드
                </Button>
              </div>
            }
          >
            <p className="text-sm leading-relaxed text-neutral-600">
              한국의 최신 무역 통계와 동향을 실시간으로 확인하세요. 수출입 현황,
              주요 품목별 데이터, 국가별 무역량 등 상세한 분석 자료를
              제공합니다.
            </p>

            {/* 빠른 통계 */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {quickStats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-neutral-100 bg-neutral-50 p-3 text-center"
                >
                  <div className="mb-1 text-xs text-neutral-500">
                    {stat.label}
                  </div>
                  <div className="text-lg font-semibold text-neutral-800">
                    {stat.value}
                  </div>
                  <div className="mt-1 flex items-center justify-center">
                    <TrendingUp size={12} className="mr-1 text-primary-600" />
                    <span className="text-xs text-primary-600">
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>

          {/* 메인 차트 */}
          <div className={CARD_SPACING_CLASSES}>
            <StatisticCharts />
          </div>
        </div>

        <aside className="mt-8 lg:mt-0 lg:w-1/3">
          {/* 환율 정보 */}
          <ExchangeRateCard />

          {/* 최근 보고서 */}
          <ContentCard
            title="최근 무역 보고서"
            className={CARD_SPACING_CLASSES}
          >
            <ScrollArea className="h-80 pr-3">
              <div className="space-y-2">
                {recentReports.map((report, index) => (
                  <div
                    key={index}
                    className="border-b border-neutral-100 py-3 last:border-b-0"
                  >
                    <Button
                      variant="link"
                      asChild
                      className={cn(
                        LINK_BUTTON_BASE_CLASSES,
                        "h-auto w-full cursor-pointer justify-start p-0 pr-2 text-left font-semibold text-neutral-800",
                      )}
                    >
                      <div>
                        <div className="line-clamp-2">{report.title}</div>
                      </div>
                    </Button>
                    <div className="mt-1 flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
                      >
                        {report.category}
                      </Badge>
                      <div className="text-xs text-neutral-400">
                        {report.size} •{" "}
                        {new Date(report.date).toLocaleDateString("ko-KR")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-3 text-right">
              <Button
                variant="link"
                asChild
                className={cn(
                  LINK_BUTTON_BASE_CLASSES,
                  "flex items-center justify-end text-primary-600",
                )}
              >
                <Link to="/trade">
                  전체 보고서 보기 <ChevronRight size={16} className="ml-0.5" />
                </Link>
              </Button>
            </div>
          </ContentCard>

          {/* 인기 검색어 */}
          <ContentCard
            title="인기 통계 검색어"
            className={CARD_SPACING_CLASSES}
          >
            <div className="space-y-1">
              {popularSearches.map((keyword, index) => (
                <div key={index} className="py-1">
                  <Button
                    variant="link"
                    asChild
                    className={cn(LINK_BUTTON_BASE_CLASSES, "text-primary-600")}
                  >
                    <Link to="/search" search={{ q: keyword }}>
                      <span className="mr-1.5 text-neutral-500">
                        {index + 1}.
                      </span>
                      {keyword}
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </ContentCard>

          {/* 빠른 링크 */}
          <ContentCard title="관련 서비스" className={CARD_SPACING_CLASSES}>
            <div className="space-y-2">
              <Button
                variant="link"
                asChild
                className={cn(
                  LINK_BUTTON_BASE_CLASSES,
                  "flex w-full items-center justify-between text-neutral-700 hover:text-primary-600",
                )}
              >
                <Link to="/trade/exchange-rates">
                  <div className="flex items-center">
                    <Globe size={16} className="mr-2" />
                    관세 환율 정보
                  </div>
                  <ChevronRight size={14} />
                </Link>
              </Button>

              <Button
                variant="link"
                asChild
                className={cn(
                  LINK_BUTTON_BASE_CLASSES,
                  "flex w-full items-center justify-between text-neutral-700 hover:text-primary-600",
                )}
              >
                <Link to="/trade/regulations">
                  <div className="flex items-center">
                    <BarChart3 size={16} className="mr-2" />
                    무역 규제 정보
                  </div>
                  <ChevronRight size={14} />
                </Link>
              </Button>
            </div>
          </ContentCard>
        </aside>
      </div>
    </div>
  );
}
