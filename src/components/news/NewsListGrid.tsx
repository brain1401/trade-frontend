import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  source: string;
};

type NewsListGridProps = {
  news: NewsItem[];
  loading?: boolean;
};

export function NewsListGrid({ news, loading = false }: NewsListGridProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="border-b border-neutral-100 py-3 last:border-b-0"
          >
            <div className="animate-pulse space-y-2">
              <div className="h-4 w-3/4 rounded bg-neutral-200"></div>
              <div className="h-3 w-1/2 rounded bg-neutral-200"></div>
              <div className="h-3 w-full rounded bg-neutral-200"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {news.map((item) => (
        <NewsListItem key={item.id} item={item} />
      ))}

      {news.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-neutral-500">표시할 뉴스가 없습니다.</p>
        </div>
      )}
    </div>
  );
}

function NewsListItem({ item }: { item: NewsItem }) {
  return (
    <div className="border-b border-neutral-100 py-3 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-xs text-neutral-500">
            <Badge
              variant="secondary"
              className="rounded-full px-2 py-0.5 text-xs"
            >
              {item.category}
            </Badge>
          </div>

          <Link
            to="/news/$newsId"
            params={{ newsId: item.id }}
            className="block cursor-pointer pr-2 font-semibold text-neutral-800 hover:text-primary-600"
          >
            {item.title}
          </Link>

          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-neutral-600">
            {item.summary}
          </p>

          <div className="mt-1.5 text-xs text-neutral-400">
            <span>{item.source}</span>
            <span className="mx-1">•</span>
            <span>{item.publishedAt}</span>
          </div>
        </div>

        <Button
          variant="link"
          className="h-auto p-0 text-neutral-400 hover:text-primary-600"
          asChild
        >
          <Link to="/news/$newsId" params={{ newsId: item.id }}>
            <ChevronRight size={16} />
          </Link>
        </Button>
      </div>
    </div>
  );
}
