import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
// Mock 데이터 import
import {
  mockTradeNews,
  mockPopularKeywords,
  mockRecentItems,
} from "@/data/mockData";
import UserInfoCard from "../cards/UserInfoCard";
import ContentCard from "../cards/ContentCard";
import NewsItem from "../news/NewsItem";
import HSCodeNewsSection from "../news/HSCodeNewsSection";
import ExchangeRateCard from "../cards/ExchangeRateCard";

const LINK_BUTTON_BASE_CLASSES = "h-auto p-0 text-sm hover:underline";
const CARD_SPACING_CLASSES = "mt-4";
const LIST_SPACING_CLASSES = "space-y-1";

export default function MainComponent() {
  return (
    <main className="container mx-auto mt-6 p-4">
      <div className="block lg:hidden">
        <UserInfoCard />
      </div>
      <div className="lg:flex lg:space-x-6">
        <div className="lg:w-2/3">
          <ContentCard title="주요 무역 뉴스">
            <ScrollArea className="h-[32rem] pr-3">
              <div className="space-y-2">
                {mockTradeNews.map((news) => (
                  <NewsItem key={news.id} {...news} />
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
                <a href="#">
                  더보기 <ChevronRight size={16} className="ml-0.5" />
                </a>
              </Button>
            </div>
          </ContentCard>

          <HSCodeNewsSection />
        </div>

        <aside className="mt-4 lg:mt-0 lg:w-1/3">
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
                    <a href="#">
                      <span className="mr-1.5 text-gray-500">{index + 1}.</span>
                      {keyword}
                    </a>
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
                    <a href={`/hscode/${hscode}`}>{text}</a>
                  </Button>
                </li>
              ))}
            </ul>
          </ContentCard>
        </aside>
      </div>
    </main>
  );
}
