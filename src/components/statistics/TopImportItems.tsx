import type { Top } from "@/lib/api/statistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type TopImportItemsProps = {
  data: Top[];
};

/**
 * 주요 수입품목 컴포넌트
 * @param data - 상위 수입 품목 데이터 배열
 */
export function TopImportItems({ data }: TopImportItemsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-info-600" />
          주요 수입품목
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={item.itemName} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-info-100 text-xs font-medium text-info-800">
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-medium text-neutral-800">
                      {item.itemName}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-neutral-900">
                    ${(item.totalValue / 1000000000).toFixed(1)}B
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-neutral-500">데이터가 없습니다.</p>
        )}
      </CardContent>
    </Card>
  );
}
