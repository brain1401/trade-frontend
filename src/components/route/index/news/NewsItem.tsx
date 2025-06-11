import { Badge } from "@/components/ui/badge";
import type { TradeNews } from "@/types";
import { Link } from "@tanstack/react-router";

const SOURCE_TEXT_CLASSES = "text-black";

type NewsItemProps = TradeNews;

const NewsItem = ({
  title,
  summary,
  source,
  date,
  type,
  hscode,
  uuid,
}: NewsItemProps) => {
  let badgeVariant: "secondary" | "destructive" | "default" = "secondary";
  if (type === "규제") badgeVariant = "destructive";
  else if (type === "관세") badgeVariant = "default";

  return (
    <div className="border-b border-gray-100 py-3 last:border-b-0">
      <Link to="/news/$uuid" params={{ uuid }}>
        <div className="mb-1 flex items-start justify-between">
          <h4 className="cursor-pointer pr-2 font-semibold text-gray-800">
            {title}
          </h4>
          {
            <Badge
              variant={badgeVariant}
              className="rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
            >
              {type}
            </Badge>
          }
        </div>
        {hscode && (
          <p className="mb-1 text-xs text-gray-500">HS Code : {hscode}</p>
        )}
        <p className="text-sm leading-relaxed text-gray-600">{summary}</p>
      </Link>

      <div className="mt-1.5 text-xs text-gray-400">
        <span className={SOURCE_TEXT_CLASSES}>{source}</span> |{" "}
        <span className={SOURCE_TEXT_CLASSES}>{date}</span>
      </div>
    </div>
  );
};

export default NewsItem;
