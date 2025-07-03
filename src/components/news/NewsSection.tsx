import type { News } from "@/lib/api";
import { Badge } from "../ui/badge";
import NewsCard from "./NewsCard";

/**
 * 뉴스 섹션 컴포넌트
 */
type NewsSectionProps = {
  title: string;
  icon: React.ReactNode;
  news: News;
};

export default function NewsSection({
  title,
  icon,
  news: { content: news },
}: NewsSectionProps) {
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
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
