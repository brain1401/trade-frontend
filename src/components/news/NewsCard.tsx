import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar, ExternalLink } from "lucide-react";
import type { NewsContent } from "@/lib/api/news/types";
import { priorityConfig, categoryConfig } from "@/lib/utils/news";

const getPriorityLevel = (priority: number): keyof typeof priorityConfig => {
  if (priority >= 7) return "HIGH";
  if (priority >= 4) return "MEDIUM";
  return "LOW";
};

// 일반 뉴스 카드
export default function NewsCard({ item }: { item: NewsContent }) {
  const priorityLevel = getPriorityLevel(item.priority);
  const priorityInfo = priorityConfig[priorityLevel];
  const categoryInfo = categoryConfig[item.category];

  return (
    <Card
      key={item.id}
      className="flex flex-col overflow-hidden transition-all hover:shadow-lg"
    >
      <CardHeader>
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="secondary" className="flex items-center">
            {categoryInfo?.icon ?? null}
            <span>{categoryInfo?.label ?? null}</span>
          </Badge>
          <Badge className={cn("flex items-center", priorityInfo.badgeClass)}>
            {priorityInfo.icon}
            <span>{priorityInfo.label}</span>
          </Badge>
        </div>
        <CardTitle className="text-lg leading-snug">{item.title}</CardTitle>
        <CardDescription className="flex items-center pt-1 text-xs text-neutral-500">
          <Calendar className="mr-1.5 h-3.5 w-3.5" />
          {format(new Date(item.publishedAt), "yyyy년 MM월 dd일")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow text-sm text-neutral-700">
        <p>{item.summary}</p>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <span className="text-xs text-neutral-600">
          출처: {item.sourceName}
        </span>
        <Button asChild variant="ghost" size="sm">
          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
            더보기
            <ExternalLink className="ml-1.5 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
