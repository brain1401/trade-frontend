import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Calendar, Search, Star, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/popular-hscodes/")({
  component: RouteComponent,
});

const popularCodes = [
  {
    rank: 1,
    code: "8517.12",
    name: "스마트폰 및 기타 휴대폰",
    category: "전자/통신",
    searchCount: 15420,
    change: "+12%",
    trend: "up",
  },
  {
    rank: 2,
    code: "8471.30",
    name: "휴대용 자동자료처리기계",
    category: "컴퓨터/IT",
    searchCount: 12380,
    change: "+8%",
    trend: "up",
  },
  {
    rank: 3,
    code: "2710.12",
    name: "경유",
    category: "석유/화학",
    searchCount: 11250,
    change: "-5%",
    trend: "down",
  },
  {
    rank: 4,
    code: "8708.29",
    name: "자동차 차체부품",
    category: "자동차/부품",
    searchCount: 9840,
    change: "+15%",
    trend: "up",
  },
  {
    rank: 5,
    code: "6204.62",
    name: "면제 여성용 바지",
    category: "섬유/의류",
    searchCount: 8920,
    change: "+22%",
    trend: "up",
  },
];

const categoryStats = [
  { category: "전자/통신", count: 1840, percentage: 22 },
  { category: "자동차/부품", count: 1320, percentage: 16 },
  { category: "섬유/의류", count: 1150, percentage: 14 },
  { category: "화학/플라스틱", count: 980, percentage: 12 },
  { category: "기계/장비", count: 850, percentage: 10 },
  { category: "기타", count: 2160, percentage: 26 },
];

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col justify-center space-y-3">
      {/* 통계 개요 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg">
          <CardContent className="text-center">
            <Search className="mx-auto mb-2 h-8 w-8 text-blue-500" />
            <p className="text-2xl font-bold text-gray-800">127,450</p>
            <p className="text-sm text-gray-600">오늘 총 검색 수</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="text-center">
            <TrendingUp className="mx-auto mb-2 h-8 w-8 text-green-500" />
            <p className="text-2xl font-bold text-gray-800">+18%</p>
            <p className="text-sm text-gray-600">전주 대비 증가율</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="text-center">
            <Star className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
            <p className="text-2xl font-bold text-gray-800">342</p>
            <p className="text-sm text-gray-600">신규 인기 코드</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="text-center">
            <BarChart3 className="mx-auto mb-2 h-8 w-8 text-purple-500" />
            <p className="text-2xl font-bold text-gray-800">21</p>
            <p className="text-sm text-gray-600">주요 카테고리</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* 인기 HS Code 순위 */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-brand-700">
                <TrendingUp className="h-6 w-6" />
                인기 HS Code TOP 50
              </CardTitle>
              <p className="text-sm text-gray-600">
                <Calendar className="mr-1 inline h-4 w-4" />
                최근 7일 기준
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {popularCodes.map((item) => (
                  <div
                    key={item.rank}
                    className="flex items-center rounded-lg bg-gray-50 p-2 transition-colors hover:bg-gray-100"
                  >
                    <div className="w-12 text-2xl font-bold text-brand-700">
                      {item.rank}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-mono text-lg font-bold">
                          {item.code}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-gray-700">{item.name}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        검색 수: {item.searchCount.toLocaleString()}회
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-semibold ${
                          item.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.change}
                      </span>
                      <div className="mt-2">
                        <Button variant="outline" size="sm">
                          상세보기
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline">더 많은 순위 보기</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 카테고리별 분석 */}
        <div className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-brand-700">카테고리별 분석</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {categoryStats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {stat.category}
                      </span>
                      <span className="text-sm text-gray-600">
                        {stat.count}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-brand-700"
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      {stat.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-brand-700">트렌드 알림</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600">
                관심 있는 HS Code의 인기도 변화를 실시간으로 받아보세요.
              </p>
              <Button className="w-full bg-brand-700 hover:bg-brand-800">
                알림 설정하기
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-brand-700">빠른 검색</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="link"
                  className="h-auto justify-start p-0 text-blue-600"
                >
                  • 전자제품 관련 코드
                </Button>
                <Button
                  variant="link"
                  className="h-auto justify-start p-0 text-blue-600"
                >
                  • 자동차 부품 코드
                </Button>
                <Button
                  variant="link"
                  className="h-auto justify-start p-0 text-blue-600"
                >
                  • 의류/섬유 코드
                </Button>
                <Button
                  variant="link"
                  className="h-auto justify-start p-0 text-blue-600"
                >
                  • 화학 제품 코드
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
