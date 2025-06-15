import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// 임시 데이터 (실제로는 API에서 가져올 예정)
const tradeData = {
  monthly: [
    { month: "1월", export: 45000, import: 38000 },
    { month: "2월", export: 52000, import: 41000 },
    { month: "3월", export: 48000, import: 45000 },
    { month: "4월", export: 61000, import: 48000 },
    { month: "5월", export: 55000, import: 52000 },
    { month: "6월", export: 67000, import: 55000 },
  ],
  summary: {
    totalExport: 328000,
    totalImport: 279000,
    tradeBalance: 49000,
    activePartners: 156,
  },
  topProducts: [
    { name: "반도체", value: 35, color: "var(--color-chart-primary)" },
    { name: "자동차", value: 28, color: "var(--color-chart-secondary)" },
    { name: "화학제품", value: 20, color: "var(--color-chart-tertiary)" },
    { name: "기계류", value: 17, color: "var(--color-chart-quaternary)" },
  ],
  tradePartners: [
    { country: "중국", volume: 89000 },
    { country: "미국", volume: 76000 },
    { country: "일본", volume: 54000 },
    { country: "독일", volume: 43000 },
    { country: "베트남", volume: 38000 },
  ],
};

export const StatisticCharts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">무역 통계</h1>
        <p className="text-muted-foreground">
          한국의 주요 무역 통계 및 동향을 확인하세요
        </p>
      </div>

      {/* 통계 요약 카드 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 수출액</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tradeData.summary.totalExport.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+12% 전월 대비</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 수입액</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tradeData.summary.totalImport.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+8% 전월 대비</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">무역 수지</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{tradeData.summary.tradeBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+25% 전월 대비</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">무역 파트너</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tradeData.summary.activePartners}
            </div>
            <p className="text-xs text-muted-foreground">활성 거래국</p>
          </CardContent>
        </Card>
      </div>

      {/* 월별 무역 수출입 동향 차트 */}
      <Card>
        <CardHeader>
          <CardTitle>월별 무역 수출입 동향</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={tradeData.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toLocaleString()}백만 달러`,
                  "",
                ]}
                labelStyle={{ color: "#000" }}
              />
              <Legend />
              <Bar
                dataKey="export"
                fill="var(--color-chart-primary)"
                name="수출"
              />
              <Bar
                dataKey="import"
                fill="var(--color-chart-secondary)"
                name="수입"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 주요 수출 품목 파이 차트 */}
        <Card>
          <CardHeader>
            <CardTitle>주요 수출 품목</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tradeData.topProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="var(--color-chart-accent)"
                  dataKey="value"
                >
                  {tradeData.topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, "비중"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 주요 무역 파트너 바 차트 */}
        <Card>
          <CardHeader>
            <CardTitle>주요 무역 파트너</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tradeData.tradePartners} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="country" type="category" width={60} />
                <Tooltip
                  formatter={(value: number) => [
                    `${value.toLocaleString()}백만 달러`,
                    "무역량",
                  ]}
                  labelStyle={{ color: "#000" }}
                />
                <Bar dataKey="volume" fill="var(--color-chart-accent)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 월별 무역수지 라인 차트 */}
      <Card>
        <CardHeader>
          <CardTitle>월별 무역수지 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tradeData.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toLocaleString()}백만 달러`,
                  "무역수지",
                ]}
                labelStyle={{ color: "#000" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={(data: any) => data.export - data.import}
                stroke="var(--color-chart-highlight)"
                strokeWidth={2}
                name="무역수지"
                dot={{ fill: "var(--color-chart-highlight)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 수출입 동향 분석 */}
      <Card>
        <CardHeader>
          <CardTitle>무역 동향 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">긍정적 요인</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 주력 수출품목 경쟁력 강화</li>
                <li>• 신규 시장 개척 성과</li>
                <li>• 고부가가치 제품 비중 증가</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-red-600">주의 요인</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 원자재 가격 상승 압력</li>
                <li>• 주요국 보호무역주의 확산</li>
                <li>• 환율 변동성 증가</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">전망</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 디지털 전환 가속화</li>
                <li>• 친환경 제품 수요 증가</li>
                <li>• 아시아 역내 무역 확대</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
