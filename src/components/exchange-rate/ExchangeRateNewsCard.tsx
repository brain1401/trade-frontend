import ContentCard from "@/components/common/ContentCard";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockExchangeRateNews } from "@/data/mockData";

// 환율 뉴스 컴포넌트
const ExchangeRateNewsCard = () => (
  <ContentCard title="환율 관련 뉴스">
    <ScrollArea className="h-64">
      <div className="space-y-3">
        {mockExchangeRateNews.map((news) => (
          <div
            key={news.id}
            className="border-b border-neutral-100 pb-3 last:border-b-0"
          >
            <div className="mb-2 flex items-start justify-between">
              <Badge
                variant={
                  news.impact === "high"
                    ? "destructive"
                    : news.impact === "medium"
                      ? "default"
                      : "secondary"
                }
                className="rounded-full px-2 py-0.5 text-xs"
              >
                {news.impact === "high"
                  ? "높음"
                  : news.impact === "medium"
                    ? "보통"
                    : "낮음"}
              </Badge>
              <span className="text-xs text-neutral-400">
                {new Date(news.publishedAt).toLocaleDateString("ko-KR")}
              </span>
            </div>
            <h4 className="mb-1 cursor-pointer text-sm font-semibold text-neutral-800 hover:text-primary-600">
              {news.title}
            </h4>
            <p className="mb-1 text-xs leading-relaxed text-neutral-600">
              {news.summary}
            </p>
            <p className="text-xs text-neutral-400">출처: {news.source}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  </ContentCard>
);

export default ExchangeRateNewsCard;
