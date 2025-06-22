import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";
import {
  getPopularCurrencies,
  type EnhancedExchangeRate,
} from "@/data/mock/exchange-rates";

/**
 * 환율 정보 라우트 정의
 */
export const Route = createFileRoute("/exchange-rates/")({
  component: ExchangeRatesPage,
});

/**
 * 트렌드 아이콘 반환 함수
 */
const getTrendIcon = (change: number) => {
  if (change > 0) {
    return <ArrowUpRight className="h-4 w-4 text-success-600" />;
  } else if (change < 0) {
    return <ArrowDownRight className="text-danger-600 h-4 w-4" />;
  }
  return <div className="h-4 w-4" />;
};

/**
 * 트렌드 색상 반환 함수
 */
const getTrendColor = (change: number) => {
  if (change > 0) return "text-success-600";
  if (change < 0) return "text-danger-600";
  return "text-neutral-600";
};

/**
 * 환율 카드 컴포넌트
 */
type ExchangeRateCardProps = {
  currencyCode: string;
  currencyName: string;
  rate: number;
  change: number;
  flag: string;
  lastUpdated: string;
};

function ExchangeRateCard({
  currencyCode,
  currencyName,
  rate,
  change,
  flag,
  lastUpdated,
}: ExchangeRateCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{flag}</span>
            <CardTitle className="text-lg">{currencyCode}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {currencyName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* 현재 환율 */}
          <div>
            <div className="text-2xl font-bold text-neutral-900">
              ₩{rate.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-sm">
              {getTrendIcon(change)}
              <span className={getTrendColor(change)}>
                {change > 0 ? "+" : ""}
                {change.toFixed(2)}
              </span>
            </div>
          </div>

          {/* 마지막 업데이트 시간 */}
          <div className="text-xs text-neutral-500">
            마지막 업데이트: {new Date(lastUpdated).toLocaleString("ko-KR")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 환율 정보 페이지 컴포넌트
 */
function ExchangeRatesPage() {
  const exchangeRates = getPopularCurrencies();

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">실시간 환율</h1>
          <p className="text-neutral-600">
            주요 통화의 현재 환율과 변동 현황을 확인하세요
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <RefreshCw className="h-4 w-4" />
          실시간 업데이트
        </div>
      </div>

      {/* 주요 환율 카드 그리드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exchangeRates.map((rate: EnhancedExchangeRate) => (
          <ExchangeRateCard
            key={rate.currency}
            currencyCode={rate.currency}
            currencyName={rate.currencyName}
            rate={rate.rate}
            change={rate.change}
            flag={rate.flag}
            lastUpdated={rate.lastUpdated}
          />
        ))}
      </div>

      {/* 환율 정보 안내 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-info-600" />
            환율 정보 안내
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 text-sm text-neutral-700">
            <div className="flex items-start gap-2">
              <span className="font-medium">• 기준 통화:</span>
              <span>원화(KRW) 기준 외국환 매매기준율</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">• 업데이트:</span>
              <span>실시간으로 업데이트되며, 영업일 기준으로 제공됩니다</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">• 활용:</span>
              <span>무역 거래 시 참고용으로 활용하시기 바랍니다</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
