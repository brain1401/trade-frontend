import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, TrendingUp } from "lucide-react";
import { getTrendColor } from "@/lib/utils/ui-helpers";
import { getTrendIcon } from "@/lib/utils/icon-helpers";
/**
 * 무역품목 타입
 */
export type TradeItem = {
  /** HS Code */
  hsCode: string;
  /** 품목명 */
  itemName: string;
  /** 금액 (달러) */
  value: number;
  /** 점유율 (%) */
  share: number;
  /** 성장률 (%) */
  growthRate: number;
};

/**
 * 상위 무역품목 카드 프로퍼티 타입
 */
export type TopTradeItemsCardProps = {
  /** 카드 제목 */
  title: string;
  /** 무역품목 데이터 배열 */
  items: TradeItem[];
  /** 무역 타입 (수출/수입) */
  tradeType: "export" | "import";
  /** 표시할 최대 품목 수 */
  maxItems?: number;
};

/**
 * 상위 무역품목 카드 컴포넌트
 *
 * 수출/수입 상위 품목을 순위별로 표시
 * HS Code, 품목명, 금액, 성장률, 점유율 정보 포함
 */
export function TopTradeItemsCard({
  title,
  items,
  tradeType,
  maxItems = 5,
}: TopTradeItemsCardProps) {
  const displayItems = items.slice(0, maxItems);
  const TitleIcon = tradeType === "export" ? TrendingUp : TrendingDown;
  const iconColor =
    tradeType === "export" ? "text-success-600" : "text-info-600";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TitleIcon className={`h-5 w-5 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayItems.map((item, index) => (
          <div key={item.hsCode} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-800">
                  {index + 1}
                </span>
                <div>
                  <span className="font-medium text-neutral-800">
                    {item.itemName}
                  </span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {item.hsCode}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-neutral-900">
                  ${(item.value / 1000000000).toFixed(1)}B
                </div>
                <div className="flex items-center text-xs">
                  {getTrendIcon(item.growthRate)}
                  <span className={getTrendColor(item.growthRate)}>
                    {item.growthRate > 0 ? "+" : ""}
                    {item.growthRate}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={item.share} className="flex-1" />
              <span className="text-xs text-neutral-500">{item.share}%</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
