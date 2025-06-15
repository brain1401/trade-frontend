import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 임시 환율 데이터 (실제로는 API에서 가져올 예정)
const exchangeRatesData = {
  usd: {
    rate: 1328.5,
    change: +12.3,
    changePercent: +0.93,
  },
  eur: {
    rate: 1445.2,
    change: -8.7,
    changePercent: -0.6,
  },
  jpy: {
    rate: 9.48,
    change: +0.15,
    changePercent: +1.61,
  },
  cny: {
    rate: 184.25,
    change: +2.8,
    changePercent: +1.54,
  },
  gbp: {
    rate: 1689.75,
    change: -15.4,
    changePercent: -0.9,
  },
};

const historicalData = [
  { date: "2024-01-01", usd: 1305.2, eur: 1432.8 },
  { date: "2024-01-02", usd: 1308.4, eur: 1428.9 },
  { date: "2024-01-03", usd: 1312.1, eur: 1441.2 },
  { date: "2024-01-04", usd: 1320.75, eur: 1438.6 },
  { date: "2024-01-05", usd: 1328.5, eur: 1445.2 },
];

type CurrencyCode = keyof typeof exchangeRatesData;

const currencyNames: Record<CurrencyCode, string> = {
  usd: "미국 달러",
  eur: "유럽연합 유로",
  jpy: "일본 엔",
  cny: "중국 위안",
  gbp: "영국 파운드",
};

export const ExchangeRates: React.FC = () => {
  const formatRate = (rate: number, currency: CurrencyCode) => {
    if (currency === "jpy") {
      return `${rate.toFixed(2)}원`;
    }
    return `${rate.toLocaleString()}원`;
  };

  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-red-600" : "text-blue-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">환율 정보</h1>
        <p className="text-muted-foreground">
          주요 통화의 실시간 환율 정보를 확인하세요
        </p>
      </div>

      {/* 주요 환율 카드 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(exchangeRatesData).map(([currency, data]) => (
          <Card key={currency}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {currencyNames[currency as CurrencyCode]}
              </CardTitle>
              <span className="text-xs text-muted-foreground uppercase">
                {currency}/KRW
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatRate(data.rate, currency as CurrencyCode)}
              </div>
              <p className={`text-xs ${getChangeColor(data.change)}`}>
                {formatChange(data.change, data.changePercent)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 환율 동향 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 5일 환율 동향</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">날짜</th>
                  <th className="p-2 text-right">USD/KRW</th>
                  <th className="p-2 text-right">EUR/KRW</th>
                  <th className="p-2 text-right">전일 대비 (USD)</th>
                </tr>
              </thead>
              <tbody>
                {historicalData.map((item, index) => {
                  const prevData = historicalData[index - 1];
                  const usdChange = prevData ? item.usd - prevData.usd : 0;

                  return (
                    <tr key={item.date} className="border-b">
                      <td className="p-2">{item.date}</td>
                      <td className="p-2 text-right">
                        {item.usd.toLocaleString()}원
                      </td>
                      <td className="p-2 text-right">
                        {item.eur.toLocaleString()}원
                      </td>
                      <td
                        className={`p-2 text-right ${getChangeColor(usdChange)}`}
                      >
                        {index > 0
                          ? `${usdChange >= 0 ? "+" : ""}${usdChange.toFixed(2)}`
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 환율 정보 안내 */}
      <Card>
        <CardHeader>
          <CardTitle>환율 정보 안내</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold">업데이트 주기</h4>
              <p className="text-sm text-muted-foreground">
                환율 정보는 매일 오전 11시에 업데이트됩니다.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">기준 환율</h4>
              <p className="text-sm text-muted-foreground">
                한국은행에서 고시하는 기준환율을 기준으로 합니다.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">환율 변동</h4>
              <p className="text-sm text-muted-foreground">
                <span className="text-red-600">상승</span>은 원화 가치 하락,
                <span className="ml-1 text-blue-600">하락</span>은 원화 가치
                상승을 의미합니다.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">활용 안내</h4>
              <p className="text-sm text-muted-foreground">
                무역 계약 시 환율 변동 리스크를 고려하여 계약하시기 바랍니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
