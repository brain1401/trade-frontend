import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 임시 시장 동향 데이터 (실제로는 API에서 가져올 예정)
const marketTrendsData = {
  indices: [
    {
      name: "KOSPI",
      value: 2485.97,
      change: +12.45,
      changePercent: +0.5,
    },
    {
      name: "KOSDAQ",
      value: 854.32,
      change: -8.76,
      changePercent: -1.01,
    },
    {
      name: "WTI 원유",
      value: 78.25,
      change: +1.85,
      changePercent: +2.42,
    },
    {
      name: "금 (온스)",
      value: 2045.3,
      change: -15.4,
      changePercent: -0.75,
    },
  ],
  commodities: [
    { name: "구리", price: 8250, change: +125, unit: "달러/톤" },
    { name: "알루미늄", price: 2180, change: -45, unit: "달러/톤" },
    { name: "아연", price: 2650, change: +85, unit: "달러/톤" },
    { name: "니켈", price: 16800, change: -320, unit: "달러/톤" },
  ],
  news: [
    {
      title: "중국 경제 성장률 예상치 상회, 무역 전망 밝아져",
      summary:
        "중국의 1분기 GDP 성장률이 예상을 상회하면서 한중 무역 증가 전망이 밝아지고 있다.",
      time: "2시간 전",
      impact: "positive",
    },
    {
      title: "미 연준 금리 동결 시사, 달러 약세로 수출 기업 수혜",
      summary:
        "미국 연방준비제도의 금리 동결 시사로 달러 약세가 예상되며, 수출 기업들에게 호재로 작용할 전망이다.",
      time: "4시간 전",
      impact: "positive",
    },
    {
      title: "원자재 가격 상승, 제조업 비용 부담 증가 우려",
      summary:
        "국제 원자재 가격 상승으로 제조업체들의 생산 비용 부담이 증가할 것으로 예상된다.",
      time: "6시간 전",
      impact: "negative",
    },
  ],
};

export const MarketTrends: React.FC = () => {
  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-red-600" : "text-blue-600";
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return "↗";
      case "negative":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">시장 동향</h1>
        <p className="text-muted-foreground">
          무역에 영향을 미치는 주요 시장 지표와 동향을 확인하세요
        </p>
      </div>

      {/* 주요 지수 카드 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {marketTrendsData.indices.map((index) => (
          <Card key={index.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {index.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {index.value.toLocaleString()}
              </div>
              <p className={`text-xs ${getChangeColor(index.change)}`}>
                {index.change >= 0 ? "+" : ""}
                {index.change.toFixed(2)} ({index.change >= 0 ? "+" : ""}
                {index.changePercent.toFixed(2)}%)
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 원자재 가격 */}
        <Card>
          <CardHeader>
            <CardTitle>주요 원자재 가격</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketTrendsData.commodities.map((commodity) => (
                <div
                  key={commodity.name}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{commodity.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {commodity.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {commodity.price.toLocaleString()}
                    </div>
                    <div
                      className={`text-sm ${getChangeColor(commodity.change)}`}
                    >
                      {commodity.change >= 0 ? "+" : ""}
                      {commodity.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 시장 뉴스 */}
        <Card>
          <CardHeader>
            <CardTitle>시장 뉴스</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketTrendsData.news.map((newsItem, index) => (
                <div
                  key={index}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="mb-1 text-sm font-medium">
                        {newsItem.title}
                      </h4>
                      <p className="mb-2 text-xs text-muted-foreground">
                        {newsItem.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {newsItem.time}
                        </span>
                        <span
                          className={`text-xs ${getImpactColor(newsItem.impact)}`}
                        >
                          {getImpactIcon(newsItem.impact)}{" "}
                          {newsItem.impact === "positive"
                            ? "호재"
                            : newsItem.impact === "negative"
                              ? "악재"
                              : "중립"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 시장 분석 요약 */}
      <Card>
        <CardHeader>
          <CardTitle>시장 분석 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">긍정적 요인</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 중국 경제 성장률 회복</li>
                <li>• 미 연준 금리 동결 시사</li>
                <li>• 주요국 무역 협정 진전</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-red-600">부정적 요인</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 원자재 가격 상승 압력</li>
                <li>• 지정학적 리스크 증가</li>
                <li>• 글로벌 인플레이션 우려</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">주목 요인</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 환율 변동성 확대</li>
                <li>• 탄소국경조정제도 시행</li>
                <li>• 디지털 무역 규범 변화</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
