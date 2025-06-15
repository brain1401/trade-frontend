import { Badge } from "@/components/ui/badge";

type NewsArticle = {
  id: string;
  title: string;
  content: string;
  category: string;
  publishedAt: string;
  source: string;
  author?: string;
  viewCount?: number;
  tags?: string[];
};

type NewsArticleContentProps = {
  article: NewsArticle;
  loading?: boolean;
};

export function NewsArticleContent({
  article,
  loading = false,
}: NewsArticleContentProps) {
  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="border-b border-neutral-100 pb-4">
            <div className="mb-3 h-6 w-3/4 rounded bg-neutral-200"></div>
            <div className="flex gap-4">
              <div className="h-4 w-20 rounded bg-neutral-200"></div>
              <div className="h-4 w-24 rounded bg-neutral-200"></div>
              <div className="h-4 w-16 rounded bg-neutral-200"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-neutral-200"></div>
            <div className="h-4 w-full rounded bg-neutral-200"></div>
            <div className="h-4 w-2/3 rounded bg-neutral-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="space-y-4">
        {/* 헤더 */}
        <div className="border-b border-neutral-100 pb-4">
          <div className="mb-3 flex items-center gap-2">
            <Badge
              variant="secondary"
              className="rounded-full px-2 py-0.5 text-xs"
            >
              {article.category}
            </Badge>
          </div>

          <h1 className="mb-3 text-xl font-semibold text-neutral-800">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <span>출처: {article.source}</span>
            {article.author && (
              <>
                <span>•</span>
                <span>작성자: {article.author}</span>
              </>
            )}
            <span>•</span>
            <span>{article.publishedAt}</span>
            {article.viewCount && (
              <>
                <span>•</span>
                <span>조회수: {article.viewCount.toLocaleString()}</span>
              </>
            )}
          </div>
        </div>

        {/* 본문 */}
        <div className="prose max-w-none">
          <div
            className="leading-relaxed whitespace-pre-wrap text-neutral-700"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* 태그 */}
        {article.tags && article.tags.length > 0 && (
          <div className="border-t border-neutral-100 pt-4">
            <h3 className="mb-2 text-sm font-semibold text-neutral-800">
              태그
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="rounded-full px-3 py-1 text-xs"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
