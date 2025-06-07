import {
  Filter,
  Calendar,
  Globe,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RegulationsPage() {
  const regulations = [
    {
      id: 1,
      title: "중국 전자제품 수입 규제 강화",
      category: "전자/IT",
      country: "중국",
      date: "2024.12.15",
      type: "긴급",
      status: "신규",
      summary: "리튬배터리 포함 전자제품의 안전인증 요구사항이 강화되었습니다.",
      impact: "높음",
    },
    {
      id: 2,
      title: "EU CBAM 탄소국경조정메커니즘 시행",
      category: "환경/에너지",
      country: "EU",
      date: "2024.12.10",
      type: "정기",
      status: "업데이트",
      summary: "철강, 시멘트, 알루미늄 등 탄소집약적 제품에 대한 탄소비용 부과",
      impact: "매우 높음",
    },
    {
      id: 3,
      title: "미국 반도체 수출통제 품목 확대",
      category: "반도체",
      country: "미국",
      date: "2024.12.08",
      type: "긴급",
      status: "신규",
      summary: "AI 칩 및 관련 장비의 중국 수출 제한이 추가로 확대되었습니다.",
      impact: "높음",
    },
    {
      id: 4,
      title: "인도 플라스틱 포장재 수입 제한",
      category: "화학/플라스틱",
      country: "인도",
      date: "2024.12.05",
      type: "정기",
      status: "신규",
      summary: "일회용 플라스틱 포장재의 수입이 전면 금지되었습니다.",
      impact: "중간",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "신규":
        return "bg-red-100 text-red-800";
      case "업데이트":
        return "bg-yellow-100 text-yellow-800";
      case "해제":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "매우 높음":
        return "text-red-600";
      case "높음":
        return "text-orange-600";
      case "중간":
        return "text-yellow-600";
      case "낮음":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-2">
      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg">
          <CardContent className="text-center">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-500" />
            <p className="text-2xl font-bold text-gray-800">24</p>
            <p className="text-sm text-gray-600">이번 주 신규 규제</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="text-center">
            <TrendingUp className="mx-auto mb-2 h-8 w-8 text-blue-500" />
            <p className="text-2xl font-bold text-gray-800">156</p>
            <p className="text-sm text-gray-600">이번 달 전체 규제</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="text-center">
            <Globe className="mx-auto mb-2 h-8 w-8 text-green-500" />
            <p className="text-2xl font-bold text-gray-800">45</p>
            <p className="text-sm text-gray-600">모니터링 국가</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent className="text-center">
            <Filter className="mx-auto mb-2 h-8 w-8 text-purple-500" />
            <p className="text-2xl font-bold text-gray-800">12</p>
            <p className="text-sm text-gray-600">주요 품목 카테고리</p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 섹션 */}
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-brand-700">
            <Filter className="h-6 w-6" />
            필터 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              전체
            </Button>
            <Button variant="outline" size="sm">
              긴급
            </Button>
            <Button variant="outline" size="sm">
              신규
            </Button>
            <Button variant="outline" size="sm">
              높은 영향도
            </Button>
            <Button variant="outline" size="sm">
              중국
            </Button>
            <Button variant="outline" size="sm">
              미국
            </Button>
            <Button variant="outline" size="sm">
              EU
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 규제 목록 */}
      <div className="space-y-4">
        {regulations.map((regulation) => (
          <Card
            key={regulation.id}
            className="shadow-lg transition-shadow hover:shadow-xl"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="mb-2 text-xl text-gray-800">
                    {regulation.title}
                  </CardTitle>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge className={getStatusColor(regulation.status)}>
                      {regulation.status}
                    </Badge>
                    <Badge variant="outline">{regulation.type}</Badge>
                    <Badge variant="outline">{regulation.category}</Badge>
                    <Badge variant="outline">{regulation.country}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="mb-1 text-sm text-gray-500">
                    <Calendar className="mr-1 inline h-4 w-4" />
                    {regulation.date}
                  </p>
                  <p
                    className={`text-sm font-semibold ${getImpactColor(regulation.impact)}`}
                  >
                    영향도: {regulation.impact}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">{regulation.summary}</p>
              <div className="flex items-center justify-between">
                <Button variant="link" className="p-0 text-blue-600">
                  자세히 보기 →
                </Button>
                <Button variant="outline" size="sm">
                  북마크
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 알림 설정 */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-brand-700">
            맞춤형 알림 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 leading-relaxed text-gray-600">
            관심 있는 국가나 품목의 규제 변경사항을 실시간으로 받아보세요.
          </p>
          <Button className="bg-brand-700 hover:bg-brand-800">
            알림 설정하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
