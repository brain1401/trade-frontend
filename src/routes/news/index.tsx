import { createFileRoute, useSearch } from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";

import { newsQueries } from "@/lib/api";
import { useState, useEffect } from "react";
import { z } from "zod";
import NewsCard from "@/components/news/NewsCard";
import NewsPagination from "@/components/news/NewsPagination";
import NewsPageSkeleton from "@/components/news/NewsSkeleton";

/**
 * 뉴스 라우트 검색 파라미터 유효성 검사 스키마
 */
const newsSearchSchema = z.object({
  page: z.number().catch(1),
});

/**
 * 뉴스 라우트 정의
 */
export const Route = createFileRoute("/news/")({
  validateSearch: (search: Record<string, unknown>) =>
    newsSearchSchema.parse(search),
  component: NewsPage,
});

function NewsPage() {
  const searchParams = useSearch({ from: "/news/" });
  const page = searchParams.page;
  const [limit, setLimit] = useState(6);

  useEffect(() => {
    const getLimit = () => {
      if (window.innerWidth >= 1024) return 6; // 대형 화면: 3열
      if (window.innerWidth >= 768) return 4; // 중형 화면: 2열
      return 2; // 소형 화면: 1열
    };

    const handleResize = () => {
      setLimit(getLimit());
    };

    setLimit(getLimit());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const offset = (page - 1) * limit;

  const { data: newsResponse, isLoading } = useQuery(
    newsQueries.list({ offset, limit }),
  );

  if (isLoading) {
    return <NewsPageSkeleton />;
  }

  if (!newsResponse || newsResponse.content.length === 0) {
    return <div>뉴스가 없습니다.</div>;
  }

  console.log(newsResponse);

  return (
    <div className="container mx-auto space-y-12 p-4 md:p-6">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 lg:text-5xl">
          Trade News Center
        </h1>
        <p className="mt-3 text-lg text-neutral-600">
          글로벌 무역의 최신 동향과 소식을 한눈에 파악하세요.
        </p>
      </header>

      <div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsResponse.content.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <NewsPagination page={page} totalPages={newsResponse.totalPages} />
      </div>
    </div>
  );
}
