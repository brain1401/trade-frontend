import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Globe,
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  mockTradeStatisticsSummary,
  mockTradeBalanceChart,
  mockTradeStatistics,
  getTradeStatisticsSummary,
  getTradeBalanceChart,
} from "@/data/mock/trade-statistics";

/**
 * 통계 라우트 정의
 */
export const Route = createFileRoute("/statistics/")({
  component: StatisticsPage,
});

/**
 * 트렌드 아이콘 반환 함수
 */
const getTrendIcon = (value: number) => {
  if (value > 0) {
    return <ArrowUpRight className="h-4 w-4 text-success-600" />;
  } else if (value < 0) {
    return <ArrowDownRight className="text-danger-600 h-4 w-4" />;
  }
  return <div className="h-4 w-4" />;
};

/**
 * 트렌드 색상 반환 함수
 */
const getTrendColor = (value: number) => {
  if (value > 0) return "text-success-600";
  if (value < 0) return "text-danger-600";
  return "text-neutral-600";
};

/**
 * 전체 무역 통계 요약 컴포넌트
 */
function TradeOverviewSummary() {
  const summary = getTradeStatisticsSummary();
  const overallTrade = summary.overallTrade;
  const growthRates = summary.growthRates;

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            총 수출액
          </CardTitle>
          <DollarSign className="h-4 w-4 text-primary-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            ${(overallTrade.totalExport / 1000000000).toFixed(0)}B
          </div>
          <div className="flex items-center text-xs">
            {getTrendIcon(growthRates.exportGrowth)}
            <span className={getTrendColor(growthRates.exportGrowth)}>
              {growthRates.exportGrowth > 0 ? "+" : ""}
              {growthRates.exportGrowth}% 전년 대비
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            총 수입액
          </CardTitle>
          <Package className="h-4 w-4 text-info-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            ${(overallTrade.totalImport / 1000000000).toFixed(0)}B
          </div>
          <div className="flex items-center text-xs">
            {getTrendIcon(growthRates.importGrowth)}
            <span className={getTrendColor(growthRates.importGrowth)}>
              {growthRates.importGrowth > 0 ? "+" : ""}
              {growthRates.importGrowth}% 전년 대비
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            무역수지
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-success-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            ${(overallTrade.tradeBalance / 1000000000).toFixed(0)}B
          </div>
          <p className="text-xs text-success-600">
            {overallTrade.tradeBalance > 0 ? "흑자" : "적자"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            무역규모
          </CardTitle>
          <Globe className="text-brand-600 h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            ${(overallTrade.tradeVolume / 1000000000000).toFixed(2)}T
          </div>
          <div className="flex items-center text-xs">
            {getTrendIcon(growthRates.volumeGrowth)}
            <span className={getTrendColor(growthRates.volumeGrowth)}>
              {growthRates.volumeGrowth > 0 ? "+" : ""}
              {growthRates.volumeGrowth}% 전년 대비
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 주요 수출품목 컴포넌트
 */
function TopExportItems() {
  const summary = getTradeStatisticsSummary();
  const topExports = summary.topExportItems;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-success-600" />
          주요 수출품목
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topExports.map((item, index) => (
          <div key={item.hsCode} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-800">
                  {index + 1}
                </span>
                <div>
                  <span className="font-medium text-neutral-800">
                    {item.itemName}
                  </span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {item.hsCode}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-neutral-900">
                  ${(item.value / 1000000000).toFixed(1)}B
                </div>
                <div className="flex items-center text-xs">
                  {getTrendIcon(item.growthRate)}
                  <span className={getTrendColor(item.growthRate)}>
                    {item.growthRate > 0 ? "+" : ""}
                    {item.growthRate}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={item.share} className="flex-1" />
              <span className="text-xs text-neutral-500">{item.share}%</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * 주요 수입품목 컴포넌트
 */
function TopImportItems() {
  const summary = getTradeStatisticsSummary();
  const topImports = summary.topImportItems;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-info-600" />
          주요 수입품목
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topImports.map((item, index) => (
          <div key={item.hsCode} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-info-100 text-xs font-medium text-info-800">
                  {index + 1}
                </span>
                <div>
                  <span className="font-medium text-neutral-800">
                    {item.itemName}
                  </span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {item.hsCode}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-neutral-900">
                  ${(item.value / 1000000000).toFixed(1)}B
                </div>
                <div className="flex items-center text-xs">
                  {getTrendIcon(item.growthRate)}
                  <span className={getTrendColor(item.growthRate)}>
                    {item.growthRate > 0 ? "+" : ""}
                    {item.growthRate}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={item.share} className="flex-1" />
              <span className="text-xs text-neutral-500">{item.share}%</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * 월별 무역수지 차트 컴포넌트
 */
function TradeBalanceChart() {
  const chartData = getTradeBalanceChart();
  const recentMonths = chartData.slice(-6); // 최근 6개월

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary-600" />
          월별 무역수지 추이
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentMonths.map((data) => (
            <div key={data.month} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-800">
                  {new Date(data.month).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
                <div className="text-right">
                  <div
                    className={`font-semibold ${
                      data.balance > 0 ? "text-success-600" : "text-danger-600"
                    }`}
                  >
                    ${(Math.abs(data.balance) / 1000000000).toFixed(1)}B{" "}
                    {data.balance > 0 ? "흑자" : "적자"}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">수출</span>
                  <span className="font-medium text-success-700">
                    ${(data.export / 1000000000).toFixed(1)}B
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">수입</span>
                  <span className="font-medium text-info-700">
                    ${(data.import / 1000000000).toFixed(1)}B
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 주요 교역국 정보 컴포넌트
 */
function MajorTradingPartners() {
  const summary = getTradeStatisticsSummary();
  const partners = summary.majorTradingPartners;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="text-brand-600 h-5 w-5" />
          주요 교역국
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {partners.map((partner) => (
          <div key={partner.country.code} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{partner.country.flag}</span>
                <div>
                  <h4 className="font-medium text-neutral-800">
                    {partner.country.name}
                  </h4>
                  <p className="text-xs text-neutral-500">
                    무역수지:{" "}
                    <span
                      className={
                        partner.tradeBalance > 0
                          ? "text-success-600"
                          : "text-danger-600"
                      }
                    >
                      $
                      {(Math.abs(partner.tradeBalance) / 1000000000).toFixed(1)}
                      B {partner.tradeBalance > 0 ? "흑자" : "적자"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-500">수출</p>
                <p className="font-semibold text-success-700">
                  ${(partner.exportStats.value / 1000000000).toFixed(1)}B
                </p>
                <p className="text-xs text-neutral-500">
                  점유율 {partner.exportStats.share}%
                </p>
              </div>
              <div>
                <p className="text-neutral-500">수입</p>
                <p className="font-semibold text-info-700">
                  ${(partner.importStats.value / 1000000000).toFixed(1)}B
                </p>
                <p className="text-xs text-neutral-500">
                  점유율 {partner.importStats.share}%
                </p>
              </div>
            </div>

            {partner.tariffInfo && (
              <div className="rounded-lg bg-neutral-50 p-3">
                <p className="text-xs font-medium text-neutral-700">
                  관세 정보
                </p>
                <p className="text-xs text-neutral-600">
                  평균 관세율: {partner.tariffInfo.averageRate}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {partner.tariffInfo.applicableAgreements.map((agreement) => (
                    <Badge
                      key={agreement}
                      variant="outline"
                      className="text-xs"
                    >
                      {agreement}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * 통계 페이지
 */
function StatisticsPage() {
  return (
    <div className="container mx-auto py-8">
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          무역 통계
        </h1>
        <p className="mt-2 text-neutral-600">
          한국의 주요 무역 지표와 품목별 통계를 확인하세요
        </p>
      </div>

      {/* 전체 무역 통계 요약 */}
      <TradeOverviewSummary />

      {/* 메인 콘텐츠 그리드 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 왼쪽 컬럼 - 품목별 통계 */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
            <TopExportItems />
            <TopImportItems />
          </div>
          <TradeBalanceChart />
        </div>

        {/* 오른쪽 컬럼 - 교역국 정보 */}
        <div>
          <MajorTradingPartners />
        </div>
      </div>
    </div>
  );
}
