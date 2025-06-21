import { Badge } from "@/components/ui/badge";
import type { TradeNews } from "../../types";
import { Link } from "@tanstack/react-router";

const SOURCE_TEXT_CLASSES = "text-black";

type NewsItemProps = TradeNews;

export default function TradeNewsItem({
  title,
  summary,
  source,
  published_at,
  category,
  tags,
  uuid,
}: NewsItemProps) {
  // published_at을 date로 변환
  const date = new Date(published_at || "2025-01-01").toLocaleDateString(
    "ko-KR",
  );
  // category를 type으로 사용
  const type = category;
  // tags에서 hscode 추출 (있다면)
  const hscode = tags.find((tag) => tag && tag.startsWith("HS"));
  let badgeVariant: "secondary" | "destructive" | "default" = "secondary";
  if (type === "규제") badgeVariant = "destructive";
  else if (type === "관세") badgeVariant = "default";

  return (
    <div className="border-b border-neutral-100 py-3 last:border-b-0">
      <Link to="/news/$newsId" params={{ newsId: uuid }}>
        <div className="mb-1 flex items-start justify-between">
          <h4 className="cursor-pointer pr-2 font-semibold text-neutral-800">
            {title}
          </h4>
          <Badge
              variant={badgeVariant}
              className="rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
          >
              {type}
            </Badge>
        </div>
        {hscode && (
          <p className="mb-1 text-xs text-neutral-500">HS Code : {hscode}</p>
        )}
        <p className="text-sm leading-relaxed text-neutral-600">{summary}</p>
      </Link>

      <div className="mt-1.5 text-xs text-neutral-400">
        <span className={SOURCE_TEXT_CLASSES}>{source}</span> |{" "}
        <span className={SOURCE_TEXT_CLASSES}>{date}</span>
      </div>
    </div>
  );
}
