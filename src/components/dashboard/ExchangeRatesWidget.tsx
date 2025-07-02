import { mockExchangeRates } from "@/data/mock/exchange-rates";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp } from "lucide-react";

/**
 * 주요 환율 정보 컴포넌트
 * 무역에 중요한 주요 통화의 환율 정보 표시
 */
export default function ExchangeRatesWidget() {
  const exchangeRates = mockExchangeRates.slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-info-600" />
          주요 환율
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {exchangeRates.map((rate) => (
          <div
            key={rate.currencyCode}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-900">
                {rate.currencyCode}
              </span>
              <span className="text-xs text-neutral-500">
                {rate.currencyName}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-900">
                {rate.exchangeRate.toLocaleString()}원
              </p>
              <p
                className={`text-xs ${
                  rate.changeAmount && rate.changeAmount > 0
                    ? "text-danger-600"
                    : rate.changeAmount && rate.changeAmount < 0
                      ? "text-success-600"
                      : "text-neutral-500"
                }`}
              >
                {rate.changeAmount
                  ? `${rate.changeAmount > 0 ? "+" : ""}${rate.changeAmount.toFixed(2)}`
                  : "변동 없음"}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
