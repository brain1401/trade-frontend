import React, { useState } from "react";
import { ChevronRight, ListFilter, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContentCard from "../cards/ContentCard";
import NewsItem from "./NewsItem";
import type { FilterOption } from "@/types";
import { mockHSCodeNewsAll } from "@/data/mockData";

const HSCodeNewsSection = () => {
  const [filterOption, setFilterOption] = useState<FilterOption>("bookmarked");
  const [displayCount, setDisplayCount] = useState(3);

  const allFilteredNews = mockHSCodeNewsAll
    .filter((news) => (filterOption === "bookmarked" ? news.bookmarked : true))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const newsToShow = allFilteredNews.slice(0, displayCount);

  const toggleFilter = (option: FilterOption) => {
    setFilterOption(option);
    setDisplayCount(3);
  };

  const loadMoreNews = () => {
    setDisplayCount((prevCount) => prevCount + 3);
  };

  const allNewsLoaded = displayCount >= allFilteredNews.length;

  const renderFilterButton = (
    option: FilterOption,
    IconComponent: React.ComponentType<{ size?: number; className?: string }>,
    label: string,
  ) => (
    <Button
      onClick={() => toggleFilter(option)}
      variant={filterOption === option ? "default" : "outline"}
      className={`flex h-auto items-center rounded-full px-3 py-2 text-xs transition-colors ${
        filterOption === option
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "border-gray-300 bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      <IconComponent size={14} className="mr-1" /> {label}
    </Button>
  );

  const filterButtons = (
    <div className="flex items-center space-x-2">
      {renderFilterButton("latest", ListFilter, "최신순")}
      {renderFilterButton("bookmarked", Bookmark, "북마크")}
    </div>
  );

  return (
    <ContentCard title="HS Code별 최신 정보" titleRightElement={filterButtons}>
      {newsToShow.length > 0 ? (
        <div className="space-y-2">
          {newsToShow.map((news) => (
            <NewsItem key={news.uuid} {...news} />
          ))}
        </div>
      ) : (
        <p className="py-4 text-center text-sm text-gray-500">
          {filterOption === "bookmarked"
            ? "북마크된 정보가 없습니다."
            : "표시할 정보가 없습니다."}
        </p>
      )}
      {!allNewsLoaded && newsToShow.length > 0 && (
        <div className="mt-3 text-right">
          <Button
            variant="link"
            onClick={loadMoreNews}
            className="ml-auto flex h-auto cursor-pointer items-center justify-end p-0 text-sm text-blue-600 hover:underline"
          >
            더보기 <ChevronRight size={16} className="ml-0.5" />
          </Button>
        </div>
      )}
    </ContentCard>
  );
};

export default HSCodeNewsSection;
