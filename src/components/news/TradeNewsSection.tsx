import ContentCard from "@/components/common/ContentCard";
import TradeNewsItem from "./TradeNewsItem";
import { mockTradeNews } from "@/data/mockData";
import {
  useFilteredPagination,
  type FilterConfig,
} from "@/hooks/common/useFilteredPagination";
import type { TradeNews } from "@/types";

type FilterOptionType = "latest" | "bookmarked";

export default function TradeNewsSection() {
  // 필터 설정 배열
  const filterConfigs: FilterConfig<FilterOptionType>[] = [
    { key: "latest", label: "최신순" },
    { key: "bookmarked", label: "북마크" },
  ];

  // 필터링 함수 정의 - TradeNews 배열에 대한 비즈니스 로직
  const filterTradeNews = (news: TradeNews[], filterKey: FilterOptionType) => {
    switch (filterKey) {
      case "latest":
        return [...news].sort(
          (a, b) =>
            new Date(b.published_at).getTime() -
            new Date(a.published_at).getTime(),
        );
      case "bookmarked":
        // 현재는 모든 뉴스 표시 (북마크 기능은 추후 구현)
        return news;
      default:
        return news;
    }
  };

  // 제네릭 훅 사용
  // TODO : 제대로 작동 안 함. 로직 수정 필요.
  const {
    displayedItems: tradeNewsToShow,
    FilterButtons,
    LoadMoreButton,
    currentFilter,
  } = useFilteredPagination({
    data: mockTradeNews,
    filterFunction: filterTradeNews,
    filterConfigs,
    defaultFilter: "bookmarked" as FilterOptionType,
    initialItemsPerPage: 3,
    incrementSize: 3,
  });

  return (
    <ContentCard title="HS Code별 최신 정보" titleRightElement={FilterButtons}>
      {tradeNewsToShow.length > 0 ? (
        <div className="space-y-2">
          {tradeNewsToShow.map((news) => (
            <TradeNewsItem
              key={news.uuid}
              uuid={news.uuid}
              date={news.date}
              type={news.category}
              url={news.url}
              title={news.title}
              summary={news.summary}
              tags={news.tags}
              published_at={news.published_at}
              source={news.source}
              category={news.category}
              content={news.content}
              importance={news.importance}
            />
          ))}
        </div>
      ) : (
        <p className="py-4 text-center text-sm text-neutral-500">
          {currentFilter === "bookmarked"
            ? "북마크된 정보가 없습니다."
            : "표시할 정보가 없습니다."}
        </p>
      )}
      {LoadMoreButton && (
        <div className="mt-3 text-right">{LoadMoreButton}</div>
      )}
    </ContentCard>
  );
}
