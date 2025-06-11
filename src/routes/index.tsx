import ContentCard from "@/components/route/index/cards/ContentCard";
import ExchangeRateCard from "@/components/route/index/cards/ExchangeRateCard";
import UserInfoCard from "@/components/route/index/cards/UserInfoCard";
import HSCodeNewsSection from "@/components/route/index/news/HSCodeNewsSection";
import NewsItem from "@/components/route/index/news/NewsItem";
import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  mockPopularKeywords,
  mockRecentItems,
  mockTradeNews,
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: App,
});

const LINK_BUTTON_BASE_CLASSES = "h-auto p-0 text-sm hover:underline";
const CARD_SPACING_CLASSES = "mt-8";
const LIST_SPACING_CLASSES = "space-y-1";

function App() {
  return (
    <>
      <div className="block lg:hidden">
        <UserInfoCard />
      </div>
      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-2/3">
          <ContentCard title="주요 무역 뉴스">
            <ScrollArea className="h-[32rem] pr-3">
              <div className="space-y-2">
                {mockTradeNews.map((news) => (
                  <NewsItem key={news.uuid} {...news} />
                ))}
              </div>
            </ScrollArea>
            <div className="mt-3 text-right">
              <Button
                variant="link"
                asChild
                className={cn(
                  LINK_BUTTON_BASE_CLASSES,
                  "flex items-center justify-end text-blue-600",
                )}
              >
                <Link to="/news">
                  더보기 <ChevronRight size={16} className="ml-0.5" />
                </Link>
              </Button>
            </div>
          </ContentCard>

          <div className={CARD_SPACING_CLASSES}>
            <HSCodeNewsSection />
          </div>
        </div>

        <aside className="mt-8 lg:mt-0 lg:w-1/3">
          <div className="hidden lg:block">
            <UserInfoCard />
          </div>
          <ExchangeRateCard />
          <ContentCard title="인기 검색어" className={CARD_SPACING_CLASSES}>
            <ul className={LIST_SPACING_CLASSES}>
              {mockPopularKeywords.map((keyword, index) => (
                <li key={index} className="py-1">
                  <Button
                    variant="link"
                    asChild
                    className={cn(LINK_BUTTON_BASE_CLASSES, "text-blue-600")}
                  >
                    <Link to="/popular-hscodes">
                      <span className="mr-1.5 text-gray-500">{index + 1}.</span>
                      {keyword}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </ContentCard>
          <ContentCard title="최근 분석 품목" className={CARD_SPACING_CLASSES}>
            <ul className={LIST_SPACING_CLASSES}>
              {mockRecentItems.map(({ hscode, text }) => (
                <li
                  key={hscode}
                  className="border-b border-gray-100 py-1.5 last:border-0"
                >
                  <Button
                    variant="link"
                    asChild
                    className={cn(
                      LINK_BUTTON_BASE_CLASSES,
                      "text-gray-700 hover:text-blue-600",
                    )}
                  >
                    <Link to="/hscode-info/$hscode" params={{ hscode }}>
                      {text}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </ContentCard>
        </aside>
      </div>
    </>
  );
}
