import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Newspaper,
  ExternalLink,
  Calendar,
  TrendingUp,
  AlertCircle,
  Globe,
  FileText,
} from "lucide-react";
import {
  getRecentNews,
  getNewsByHSCode,
  mockTradeNews,
  mockHSCodeNews,
} from "@/data/mock/news";
import type { TradeNews, HSCodeNews } from "@/types/news";

/**
 * 뉴스 라우트 정의
 */
export const Route = createFileRoute("/news/")({
  component: NewsPage,
});

/**
 * 뉴스 중요도별 색상 반환 함수
 */
const getImportanceColor = (importance: string) => {
  switch (importance) {
    case "HIGH":
      return "text-danger-600 bg-danger-50 border-danger-200";
    case "MEDIUM":
      return "text-warning-600 bg-warning-50 border-warning-200";
    case "LOW":
      return "text-info-600 bg-info-50 border-info-200";
    default:
      return "text-neutral-600 bg-neutral-50 border-neutral-200";
  }
};

/**
 * 뉴스 중요도별 아이콘 반환 함수
 */
const getImportanceIcon = (importance: string) => {
  switch (importance) {
    case "HIGH":
      return <AlertCircle className="h-4 w-4" />;
    case "MEDIUM":
      return <TrendingUp className="h-4 w-4" />;
    case "LOW":
      return <FileText className="h-4 w-4" />;
    default:
      return <Newspaper className="h-4 w-4" />;
  }
};

/**
 * 뉴스 카테고리별 아이콘 반환 함수
 */
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "무역":
      return <Globe className="h-4 w-4 text-primary-600" />;
    case "규제":
      return <AlertCircle className="h-4 w-4 text-warning-600" />;
    case "관세":
      return <FileText className="h-4 w-4 text-info-600" />;
    case "인증":
      return <TrendingUp className="h-4 w-4 text-success-600" />;
    case "정책":
      return <Newspaper className="text-brand-600 h-4 w-4" />;
    default:
      return <Newspaper className="h-4 w-4 text-neutral-600" />;
  }
};

/**
 * 개별 뉴스 카드 컴포넌트
 */
type NewsCardProps = {
  news: TradeNews | HSCodeNews;
};

function NewsCard({ news }: NewsCardProps) {
  const importanceColor = getImportanceColor(news.importance);
  const importanceIcon = getImportanceIcon(news.importance);
  const categoryIcon = getCategoryIcon(news.category);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              {categoryIcon}
              <Badge variant="outline" className="text-xs">
                {news.category}
              </Badge>
              <Badge className={`text-xs ${importanceColor}`}>
                {importanceIcon}
                <span className="ml-1">
                  {news.importance === "HIGH"
                    ? "긴급"
                    : news.importance === "MEDIUM"
                      ? "중요"
                      : "일반"}
                </span>
              </Badge>
            </div>
            <CardTitle className="text-lg leading-tight">
              {news.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 뉴스 요약 */}
          <p className="leading-relaxed text-neutral-600">{news.summary}</p>

          {/* 관련 산업 (TradeNews의 경우) */}
          {"affectedIndustries" in news &&
            news.affectedIndustries &&
            news.affectedIndustries.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-medium text-neutral-800">
                  영향 산업
                </h4>
                <div className="flex flex-wrap gap-1">
                  {news.affectedIndustries
                    .slice(0, 3)
                    .map((industry, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {industry}
                      </Badge>
                    ))}
                  {news.affectedIndustries.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{news.affectedIndustries.length - 3}개
                    </Badge>
                  )}
                </div>
              </div>
            )}

          {/* 관련 국가 (TradeNews의 경우) */}
          {"relatedCountries" in news &&
            news.relatedCountries &&
            news.relatedCountries.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-medium text-neutral-800">
                  관련 국가
                </h4>
                <div className="flex flex-wrap gap-1">
                  {news.relatedCountries.slice(0, 4).map((country, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {country}
                    </Badge>
                  ))}
                  {news.relatedCountries.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{news.relatedCountries.length - 4}개국
                    </Badge>
                  )}
                </div>
              </div>
            )}

          <Separator />

          {/* 하단 정보 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(news.publishedAt).toLocaleDateString("ko-KR")}
              </div>
              <span>출처: {news.source}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {news.tags?.join(", ")}
              </Badge>
              <ExternalLink className="h-4 w-4 cursor-pointer text-primary-600 hover:text-primary-700" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 뉴스 섹션 컴포넌트
 */
type NewsSectionProps = {
  title: string;
  icon: React.ReactNode;
  news: (TradeNews | HSCodeNews)[];
};

function NewsSection({ title, icon, news }: NewsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
        <Badge variant="secondary" className="text-xs">
          {news.length}건
        </Badge>
      </div>
      <div className="grid gap-6">
        {news.map((item) => (
          <NewsCard key={item.uuid} news={item} />
        ))}
      </div>
    </div>
  );
}

/**
 * 뉴스 페이지 컴포넌트
 */
function NewsPage() {
  const recentNews = getRecentNews(5);
  const tradeNews = mockTradeNews
    .filter((news) => news.category === "무역")
    .slice(0, 3);
  const hsCodeNews = mockHSCodeNews.slice(0, 3);

  return (
    <div className="container mx-auto space-y-8 p-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">무역 뉴스</h1>
        <p className="text-neutral-600">
          최신 무역 정책, 규제 변경사항, HS Code 관련 뉴스를 확인하세요
        </p>
      </div>

      {/* 최신 뉴스 */}
      <NewsSection
        title="최신 뉴스"
        icon={<Newspaper className="h-6 w-6 text-primary-600" />}
        news={recentNews}
      />

      <Separator className="my-8" />

      {/* 무역 뉴스 */}
      <NewsSection
        title="무역 동향"
        icon={<Globe className="h-6 w-6 text-success-600" />}
        news={tradeNews}
      />

      <Separator className="my-8" />

      {/* HS Code 뉴스 */}
      <NewsSection
        title="HS Code 관련"
        icon={<FileText className="h-6 w-6 text-info-600" />}
        news={hsCodeNews}
      />

      {/* 뉴스 안내 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning-600" />
            뉴스 정보 안내
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 text-sm text-neutral-700">
            <div className="flex items-start gap-2">
              <span className="font-medium">• 업데이트:</span>
              <span>실시간으로 수집되는 무역 관련 뉴스입니다</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">• 중요도:</span>
              <span>긴급, 중요, 일반으로 분류하여 우선순위를 표시합니다</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">• 활용:</span>
              <span>
                무역 업무에 영향을 미칠 수 있는 정보들이므로 정기적으로
                확인하시기 바랍니다
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
