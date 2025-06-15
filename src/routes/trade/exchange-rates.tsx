import { createFileRoute, Link } from "@tanstack/react-router";
import { ExchangeRates } from "@/components/trade/ExchangeRates";
import ContentCard from "@/components/common/ContentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  RefreshCw,
  Bell,
  Calculator,
  TrendingUp,
  TrendingDown,
  Clock,
  Info,
  BarChart3,
  Globe,
} from "lucide-react";

export const Route = createFileRoute("/trade/exchange-rates")({
  component: ExchangeRatesPage,
});

const LINK_BUTTON_BASE_CLASSES = "h-auto p-0 text-sm hover:underline";
const CARD_SPACING_CLASSES = "mt-8";

// 목업 데이터
const majorCurrencies = [
  {
    code: "USD",
    name: "미국 달러",
    rate: "1,328.50",
    change: "+12.30",
    changePercent: "+0.93%",
    trend: "up",
  },
  {
    code: "EUR",
    name: "유럽연합 유로",
    rate: "1,445.20",
    change: "-8.70",
    changePercent: "-0.60%",
    trend: "down",
  },
  {
    code: "JPY",
    name: "일본 엔",
    rate: "9.48",
    change: "+0.15",
    changePercent: "+1.61%",
    trend: "up",
  },
  {
    code: "CNY",
    name: "중국 위안",
    rate: "184.25",
    change: "+2.80",
    changePercent: "+1.54%",
    trend: "up",
  },
];

const exchangeNews = [
  {
    title: "연준 금리 동결로 원달러 환율 안정세",
    summary:
      "미국 연방준비제도 금리 결정 이후 원달러 환율이 1,320원대에서 안정적인 움직임을 보이고 있습니다.",
    time: "2시간 전",
    category: "환율 뉴스",
  },
  {
    title: "유로존 경제지표 악화로 원유로 환율 하락",
    summary:
      "유럽 제조업 PMI 지수 하락으로 유로화 약세가 지속되며 원유로 환율이 1,440원대까지 하락했습니다.",
    time: "4시간 전",
    category: "환율 뉴스",
  },
  {
    title: "중국 경기 회복 기대감으로 위안화 강세",
    summary:
      "중국 정부의 부양책 발표로 위안화가 강세를 보이며 원위안 환율이 상승했습니다.",
    time: "6시간 전",
    category: "환율 뉴스",
  },
  {
    title: "엔캐리 트레이드 영향으로 엔화 변동성 확대",
    summary:
      "일본 중앙은행의 통화정책 변화 가능성으로 엔화 변동성이 크게 확대되고 있습니다.",
    time: "8시간 전",
    category: "환율 뉴스",
  },
];

const quickCalculator = [
  { amount: "1,000", currency: "USD", result: "1,328,500" },
  { amount: "5,000", currency: "EUR", result: "7,226,000" },
  { amount: "100,000", currency: "JPY", result: "948,000" },
  { amount: "10,000", currency: "CNY", result: "1,842,500" },
];

const relatedServices = [
  {
    name: "환율 알림 설정",
    description: "원하는 환율 도달 시 알림 받기",
    icon: Bell,
  },
  {
    name: "환율 계산기",
    description: "실시간 환율로 금액 계산",
    icon: Calculator,
  },
  {
    name: "환율 동향 분석",
    description: "주요 통화 동향 리포트",
    icon: TrendingUp,
  },
];

function ExchangeRatesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-2/3">
          {/* 페이지 헤더 */}
          <ContentCard
            title="환율 정보 센터"
            titleRightElement={
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-3 py-2 text-xs"
                >
                  <RefreshCw size={14} className="mr-1" />
                  새로고침
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-3 py-2 text-xs"
                >
                  <Bell size={14} className="mr-1" />
                  알림 설정
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-3 py-2 text-xs"
                >
                  <Calculator size={14} className="mr-1" />
                  계산기
                </Button>
              </div>
            }
          >
            <div className="mb-4 flex items-center space-x-2">
              <Clock size={16} className="text-neutral-500" />
              <span className="text-sm text-neutral-600">
                마지막 업데이트: 2024년 12월 1일 오전 11:00 (한국은행 기준)
              </span>
            </div>

            <p className="text-sm leading-relaxed text-neutral-600">
              한국은행에서 제공하는 공식 환율 정보를 실시간으로 확인하세요. 무역
              업무나 해외 송금 시 참고할 수 있는 정확한 환율 데이터를
              제공합니다.
            </p>

            {/* 주요 환율 요약 */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {majorCurrencies.map((currency, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-neutral-100 bg-neutral-50 p-3 text-center"
                >
                  <div className="mb-1 flex items-center justify-center space-x-1">
                    <span className="text-xs font-medium text-neutral-700">
                      {currency.code}
                    </span>
                    {currency.trend === "up" ? (
                      <TrendingUp size={12} className="text-danger-500" />
                    ) : (
                      <TrendingDown size={12} className="text-info-500" />
                    )}
                  </div>
                  <div className="text-sm font-semibold text-neutral-800">
                    {currency.rate}원
                  </div>
                  <div
                    className={`text-xs ${currency.trend === "up" ? "text-danger-500" : "text-info-500"}`}
                  >
                    {currency.change} ({currency.changePercent})
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>

          {/* 메인 환율 정보 */}
          <div className={CARD_SPACING_CLASSES}>
            <ExchangeRates />
          </div>
        </div>

        <aside className="mt-8 lg:mt-0 lg:w-1/3">
          {/* 환율 뉴스 */}
          <ContentCard title="환율 관련 뉴스">
            <ScrollArea className="h-80 pr-3">
              <div className="space-y-2">
                {exchangeNews.map((news, index) => (
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
                        <div className="line-clamp-2">{news.title}</div>
                      </div>
                    </Button>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-neutral-600">
                      {news.summary}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
                      >
                        {news.category}
                      </Badge>
                      <div className="text-xs text-neutral-400">
                        {news.time}
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
                <Link to="/search" search={{ q: "환율 뉴스" }}>
                  더 많은 뉴스 보기{" "}
                  <ChevronRight size={16} className="ml-0.5" />
                </Link>
              </Button>
            </div>
          </ContentCard>

          {/* 빠른 계산기 */}
          <ContentCard title="빠른 환율 계산" className={CARD_SPACING_CLASSES}>
            <div className="space-y-2">
              {quickCalculator.map((calc, index) => (
                <div
                  key={index}
                  className="border-b border-neutral-100 py-1.5 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-700">
                      {calc.amount} {calc.currency}
                    </span>
                    <span className="text-sm font-medium text-neutral-800">
                      {calc.result}원
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
                  상세 계산기 <ChevronRight size={16} className="ml-0.5" />
                </Link>
              </Button>
            </div>
          </ContentCard>

          {/* 관련 서비스 */}
          <ContentCard title="관련 서비스" className={CARD_SPACING_CLASSES}>
            <div className="space-y-2">
              {relatedServices.map((service, index) => (
                <div
                  key={index}
                  className="border-b border-neutral-100 py-2 last:border-0"
                >
                  <Button
                    variant="link"
                    asChild
                    className={cn(
                      LINK_BUTTON_BASE_CLASSES,
                      "flex w-full items-start justify-between text-neutral-700 hover:text-primary-600",
                    )}
                  >
                    <div>
                      <div className="flex items-center">
                        <service.icon
                          size={16}
                          className="mr-2 text-neutral-500"
                        />
                        <div className="text-left">
                          <div className="font-medium">{service.name}</div>
                          <div className="text-xs text-neutral-500">
                            {service.description}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={14} className="ml-auto" />
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          </ContentCard>

          {/* 빠른 링크 */}
          <ContentCard title="무역 정보" className={CARD_SPACING_CLASSES}>
            <div className="space-y-2">
              <Button
                variant="link"
                asChild
                className={cn(
                  LINK_BUTTON_BASE_CLASSES,
                  "flex w-full items-center justify-between text-neutral-700 hover:text-primary-600",
                )}
              >
                <Link to="/trade/statistics">
                  <div className="flex items-center">
                    <BarChart3 size={16} className="mr-2" />
                    무역 통계
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
                    <Globe size={16} className="mr-2" />
                    무역 규제 정보
                  </div>
                  <ChevronRight size={14} />
                </Link>
              </Button>
            </div>
          </ContentCard>

          {/* 안내 정보 */}
          <ContentCard title="환율 정보 안내" className={CARD_SPACING_CLASSES}>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Info
                  size={16}
                  className="mt-0.5 flex-shrink-0 text-info-500"
                />
                <div>
                  <h4 className="text-sm font-medium text-neutral-800">
                    업데이트 주기
                  </h4>
                  <p className="text-xs text-neutral-600">
                    매일 오전 11시 한국은행 기준환율 반영
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Info
                  size={16}
                  className="mt-0.5 flex-shrink-0 text-info-500"
                />
                <div>
                  <h4 className="text-sm font-medium text-neutral-800">
                    환율 표시
                  </h4>
                  <p className="text-xs text-neutral-600">
                    <span className="text-danger-500">상승(빨간색)</span>은 원화
                    약세,
                    <span className="ml-1 text-info-500">하락(파란색)</span>은
                    원화 강세
                  </p>
                </div>
              </div>
            </div>
          </ContentCard>
        </aside>
      </div>
    </div>
  );
}
