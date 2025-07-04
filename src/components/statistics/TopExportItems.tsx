import type { Top } from "@/lib/api/statistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

type TopExportItemsProps = {
  title: string;
  data: Top[];
};

function ExportItem({ item, index }: { item: Top; index: number }) {
  const translatedName = useTranslation(item.itemName);

  return (
    <div key={item.itemName} className="space-y-2">
      <div className="flex items-start justify-between gap-4">
        {" "}
        <div className="flex min-w-0 items-start gap-2">
          {" "}
          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-100 text-xs font-medium text-success-800">
            {index + 1}
          </span>
          <span className="font-medium break-words text-neutral-800">
            {translatedName}
          </span>
        </div>
        <div className="text-right">
          <div className="font-semibold whitespace-nowrap text-neutral-900">
            ${(item.totalValue / 1000000000).toFixed(1)}B
          </div>
        </div>
      </div>
    </div>
  );
}

export function TopExportItems({ title, data }: TopExportItemsProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-success-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col space-y-4">
        {data.length > 0 ? (
          data.map((item, index) => (
            <ExportItem key={index} item={item} index={index} />
          ))
        ) : (
          <p className="text-sm text-neutral-500">데이터가 없습니다.</p>
        )}
      </CardContent>
    </Card>
  );
}
