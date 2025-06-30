import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { exchangeRatesApi } from "@/lib/api";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";
import React, { useEffect, useState, type ReactNode } from "react"; // useState, useEffect 임포트
import { useQuery } from "@tanstack/react-query";

// --- 타입 정의: 백엔드 DTO에 맞춰 정확하게 정의 ---
// 백엔드의 ExchangeRateDto와 일치해야 합니다.
interface ExchangeRateDto {
  currencyCode: string;
  currencyName: string;
  exchangeRate: number; // BigDecimal이 넘어오면 JS에서는 number 또는 string으로 처리됩니다.
  sourceApi: string;
  expiresAt: string; // LocalDateTime (ISO 8601 문자열)
  // 백엔드 ExchangeRateDto에는 changeAmount, flag, lastUpdated 필드가 직접 없으므로,
  // 프론트엔드에서 필요에 따라 추가/계산해야 합니다.
  // 여기서는 lastUpdated를 expiresAt으로 대체하고, flag와 changeAmount는 임시값/계산 로직을 가정합니다.
}

// 프론트엔드에서 사용할 Enhanced 타입 (optional)
// 백엔드에서 직접 주지 않는 필드들을 포함할 수 있습니다.
interface EnhancedExchangeRate extends ExchangeRateDto {
  lastUpdated: string;
  flag: string; // 통화 국기 이모지 (프론트에서 매핑)
  changeAmount: number; // 전일 대비 변화량 (프론트에서 계산 또는 임시값)
  // lastUpdated는 ExchangeRateDto의 expiresAt으로 대체
}
// --- END: 타입 정의 ---

/**
 * 환율 정보 라우트 정의
 */
export const Route = createFileRoute("/exchange-rates/")({
  component: ExchangeRatesPage,
});

/**
 * 통화 코드에 따른 국기 이모지 반환 (임시)
 * 실제로는 더 견고한 매핑 로직이나 API를 사용해야 합니다.
 */

type Sd = { koreanName: string, flag: ReactNode };
const getFlagByCurrencyCode = (code: string): Sd => {
  switch (code.toUpperCase()) {
    case "USD": return { koreanName: "미국", flag: <img src="/public/test.png"></img> };
    case "JPY": return { koreanName: "미국", flag: <img src="/public/test.png"></img> };
    case "EUR": return { koreanName: "미국", flag: <img src="/public/test.png"></img> };
    case "CNY": return { koreanName: "미국", flag: <img src="/public/test.png"></img> };
    case "GBP": return { koreanName: "미국", flag: <img src="/public/test.png"></img> };
    case "CAD": return { koreanName: "미국", flag: <img src="/public/test.png"></img> };
    case "AUD": return { koreanName: "미국", flag: <img src="/public/test.png"></img> };
    case "CHF": return { koreanName: "미국", flag: <img src="/public/test.png"></img> };
    case "SGD": return { koreanName: "미국", flag: <img src="/public/test.png"></img> };
    case "HKD": return { koreanName: "미국", flag: <img src="/public/test.png"></img> };
    // 필요한 다른 통화 코드 추가
    default: return { koreanName: "미국", flag: <img src=""></img> }; // 알 수 없는 통화
  }
};

/**
 * 트렌드 아이콘 반환 함수
 */
const getTrendIcon = (change: number) => {
  if (change > 0) {
    return <ArrowUpRight className="h-4 w-4 text-emerald-600" />;
  } else if (change < 0) {
    return <ArrowDownRight className="text-red-600 h-4 w-4" />;
  }
  return <div className="h-4 w-4" />; // 변화 없는 경우 (또는 0인 경우)
};

/**
 * 트렌드 색상 반환 함수
 */
const getTrendColor = (change: number) => {
  if (change > 0) return "text-emerald-600";
  if (change < 0) return "text-red-600";
  return "text-gray-600"; // 변화 없는 경우 (또는 0인 경우)
};

/**
 * 환율 카드 컴포넌트 Props
 */
type ExchangeRateCardProps = {
  currencyCode: string;
  currencyName: string;
  exchangeRate: number;
  changeAmount: number;
  koreanName: string;
  flag: ReactNode;
  lastUpdated: string; // 백엔드의 expiresAt을 활용
};

function ExchangeRateCard({
  currencyCode,
  currencyName,
  exchangeRate,
  changeAmount,
  koreanName,
  flag,
  lastUpdated,
}: ExchangeRateCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-[3rem] h-[3rem]">{flag}</div >
            <div>{koreanName}</div>
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
            <div className="text-2xl font-bold text-gray-900">
              ₩{exchangeRate.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-sm">
              {/* changeAmount가 0이 아닌 경우에만 아이콘 및 색상 표시 */}
              {changeAmount !== 0 ? getTrendIcon(changeAmount) : <div className="h-4 w-4" />}
              <span className={getTrendColor(changeAmount)}>
                {changeAmount > 0 ? "+" : ""}
                {changeAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* 마지막 업데이트 시간 */}
          <div className="text-xs text-gray-500">
            기준 시간: {new Date(lastUpdated).toLocaleString("ko-KR")}
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


  const { data: exchangeRates, isLoading, error } = useQuery({
    queryKey: ["exchange_rate"],
    queryFn: () => exchangeRatesApi.getExchangeRates()
  })



  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center text-gray-700">
        환율 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-600">
        오류: {error.message}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          새로고침
        </button>
      </div>
    );
  }

  if (exchangeRates)
    return (
      <div className="container mx-auto space-y-6 p-6">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">실시간 환율</h1>
            <p className="text-gray-600">
              주요 통화의 현재 환율을 확인하세요
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <RefreshCw className="h-4 w-4" />
            실시간 업데이트
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exchangeRates.length > 0 ? (
            exchangeRates?.map((rate) => {
              const { flag, koreanName } = getFlagByCurrencyCode(rate.currencyCode);
              return (
                <ExchangeRateCard
                  // 백엔드의 currencyName에 (수입)/(수출)이 포함되므로, key는 이 둘을 합쳐 고유하게 만듭니다.
                  key={`${rate.currencyCode}-${rate.currencyName.includes('(수입)') ? 'import' : 'export'}`}
                  currencyCode={rate.currencyCode}
                  currencyName={rate.currencyName}
                  exchangeRate={rate.exchangeRate}
                  changeAmount={rate.changeRate ?? 0} // 현재는 0으로 고정
                  koreanName={koreanName}
                  flag={flag}
                  lastUpdated={rate.lastUpdated}
                />)
            }
            ))
            : (
              <div className="col-span-full text-center text-gray-600">
                표시할 환율 정보가 없습니다.
              </div>
            )}
        </div>

        {/* 환율 정보 안내 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              환율 정보 안내
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 text-sm text-gray-700">
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