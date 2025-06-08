import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { Bookmark, Calendar, Filter } from "lucide-react";

export const Route = createFileRoute("/user/bookmarks/")({
  component: RouteComponent,
});

function RouteComponent() {
  const bookmarks = [
    {
      id: 1,
      title: "EU CBAM 탄소국경조정메커니즘",
      type: "규제",
      category: "환경/에너지",
      date: "2024.12.10",
      summary: "철강, 시멘트, 알루미늄 등 탄소집약적 제품에 대한 탄소비용 부과",
    },
    {
      id: 2,
      title: "8517.12 - 스마트폰 및 기타 휴대폰",
      type: "HS Code",
      category: "전자/통신",
      date: "2024.12.08",
      summary: "무선 통신기기 분류 및 관세율 정보",
    },
    {
      id: 3,
      title: "중국 수출 동향 분석",
      type: "통계",
      category: "무역통계",
      date: "2024.12.05",
      summary: "2024년 3분기 중국 수출입 현황 및 전망",
    },
  ];

  return (
    <div className="space-y-3">
      {/* 필터 및 검색 */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-brand-700">
            <Filter className="h-6 w-6" />
            필터 및 검색
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" size="sm">
              전체
            </Button>
            <Button variant="outline" size="sm">
              규제
            </Button>
            <Button variant="outline" size="sm">
              HS Code
            </Button>
            <Button variant="outline" size="sm">
              통계
            </Button>
            <Button variant="outline" size="sm">
              뉴스
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 북마크 목록 */}
      <div className="space-y-6">
        {bookmarks.map((bookmark) => (
          <Card
            key={bookmark.id}
            className="shadow-lg transition-shadow hover:shadow-xl"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="mb-2 text-xl text-gray-800">
                    {bookmark.title}
                  </CardTitle>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge variant="outline">{bookmark.type}</Badge>
                    <Badge variant="outline">{bookmark.category}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="mb-2 text-sm text-gray-500">
                    <Calendar className="mr-1 inline h-4 w-4" />
                    {bookmark.date}
                  </p>
                  <Bookmark className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">{bookmark.summary}</p>
              <div className="flex items-center justify-between">
                <Button variant="link" className="p-0 text-blue-600">
                  상세 보기 →
                </Button>
                <Button variant="outline" size="sm">
                  북마크 해제
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 빈 상태 메시지 (북마크가 없을 때) */}
      {bookmarks.length === 0 && (
        <Card className="shadow-lg">
          <CardContent className="py-12 text-center">
            <Bookmark className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-800">
              아직 북마크가 없습니다
            </h3>
            <p className="mb-6 text-gray-600">
              관심 있는 콘텐츠를 북마크하여 나중에 쉽게 찾아보세요
            </p>
            <Button className="bg-brand-700 hover:bg-brand-800">
              콘텐츠 둘러보기
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
