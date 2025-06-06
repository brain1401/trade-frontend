import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// 분리된 컴포넌트들 import
import { TopNavBar, QuickLinksBar, Footer } from "./layout";
import { SearchBarHeader } from "./search";
import { ContentCard, UserInfoCard, ExchangeRateCard } from "./cards";
import { NewsItem, HSCodeNewsSection } from "./news";

// Mock 데이터 import
import {
  mockTradeNews,
  mockPopularKeywords,
  mockRecentItems,
} from "../data/mockData";

export default function HomePage() {
  return (
    <div className="font-nanum_square_neo_variable min-h-screen bg-slate-100 font-[550] !antialiased md:!subpixel-antialiased">
      <TopNavBar />
      <QuickLinksBar />
      <SearchBarHeader />

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
                  className="flex h-auto items-center justify-end p-0 text-sm text-blue-600 hover:underline"
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
            <ContentCard title="인기 검색어" className="mt-4">
              <ul className="space-y-1">
                {mockPopularKeywords.map((keyword, index) => (
                  <li key={index} className="py-1">
                    <Button
                      variant="link"
                      asChild
                      className="h-auto p-0 text-sm text-blue-600 hover:underline"
                    >
                      <a href="#">
                        <span className="mr-1.5 text-gray-500">
                          {index + 1}.
                        </span>
                        {keyword}
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            </ContentCard>
            <ContentCard title="최근 분석 품목" className="mt-4">
              <ul className="space-y-1">
                {mockRecentItems.map((item, index) => (
                  <li
                    key={item.hscode}
                    className="border-b border-gray-100 py-1.5 last:border-0"
                  >
                    <Button
                      variant="link"
                      asChild
                      className="h-auto p-0 text-sm text-gray-700 hover:text-blue-600"
                    >
                      <a href={`/hscode/${item.hscode}`}>{item.text}</a>
                    </Button>
                  </li>
                ))}
              </ul>
            </ContentCard>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
