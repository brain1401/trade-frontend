import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, ExternalLink, Globe } from "lucide-react";
import type { TradeNews, HSCodeNews } from "@/types/news";
import {
  getNewsImportanceColor,
  getNewsImportanceLabel,
} from "@/lib/utils/ui-helpers";
import {
  getNewsImportanceIcon,
  getNewsCategoryIcon,
} from "@/lib/utils/icon-helpers";

/**
 * 뉴스 카드 프로퍼티 타입
 */
export type NewsCardProps = {
  /** 뉴스 데이터 */
  news: TradeNews | HSCodeNews;
  /** 외부 링크 클릭 핸들러 */
  onExternalLinkClick?: (news: TradeNews | HSCodeNews) => void;
};

/**
 * 뉴스 카드 컴포넌트
 *
 * 개별 뉴스 항목을 카드 형태로 표시
 * 중요도별 색상, 카테고리별 아이콘, 관련 산업/국가 정보 포함
 */
export function NewsCard({ news, onExternalLinkClick }: NewsCardProps) {
  const importanceColor = getNewsImportanceColor(news.importance);
  const importanceIcon = getNewsImportanceIcon(news.importance);
  const categoryIcon = getNewsCategoryIcon(news.category);
  const importanceLabel = getNewsImportanceLabel(news.importance);

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
                <span className="ml-1">{importanceLabel}</span>
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
                {news.tags.join(", ")}
              </Badge>
              <ExternalLink
                className="h-4 w-4 cursor-pointer text-primary-600 hover:text-primary-700"
                onClick={() => onExternalLinkClick?.(news)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
