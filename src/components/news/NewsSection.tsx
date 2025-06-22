import { NewsCard } from "./NewsCard";
import type { TradeNews, HSCodeNews } from "@/types/news";

/**
 * 뉴스 섹션 프로퍼티 타입
 */
export type NewsSectionProps = {
  /** 섹션 제목 */
  title: string;
  /** 섹션 아이콘 */
  icon: React.ReactNode;
  /** 뉴스 데이터 배열 */
  news: (TradeNews | HSCodeNews)[];
  /** 외부 링크 클릭 핸들러 */
  onExternalLinkClick?: (news: TradeNews | HSCodeNews) => void;
  /** 표시할 최대 뉴스 수 */
  maxItems?: number;
};

/**
 * 뉴스 섹션 컴포넌트
 *
 * 뉴스 목록을 카테고리별로 그룹화하여 표시
 * 각 뉴스는 NewsCard 컴포넌트로 렌더링
 */
export function NewsSection({
  title,
  icon,
  news,
  onExternalLinkClick,
  maxItems,
}: NewsSectionProps) {
  const displayNews = maxItems ? news.slice(0, maxItems) : news;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
        <span className="text-sm text-neutral-500">({news.length})</span>
      </div>
      <div className="space-y-4">
        {displayNews.map((newsItem) => (
          <NewsCard
            key={newsItem.uuid}
            news={newsItem}
            onExternalLinkClick={onExternalLinkClick}
          />
        ))}
      </div>
    </div>
  );
}
