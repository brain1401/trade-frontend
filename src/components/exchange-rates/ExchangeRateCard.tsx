import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTrendColor } from "@/lib/utils/ui-helpers";
import { getTrendIcon } from "@/lib/utils/icon-helpers";

/**
 * 환율 카드 프로퍼티 타입
 */
export type ExchangeRateCardProps = {
  /** 통화 코드 (예: USD, EUR) */
  currencyCode: string;
  /** 통화 이름 (예: 미국 달러) */
  currencyName: string;
  /** 현재 환율 */
  rate: number;
  /** 변동폭 */
  change: number;
  /** 국기 이모지 */
  flag: string;
  /** 마지막 업데이트 시간 */
  lastUpdated: string;
};

/**
 * 환율 카드 컴포넌트
 *
 * 개별 통화의 환율 정보를 카드 형태로 표시
 * 현재 환율, 변동폭, 트렌드 아이콘 등을 포함
 */
export function ExchangeRateCard({
  currencyCode,
  currencyName,
  rate,
  change,
  flag,
  lastUpdated,
}: ExchangeRateCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{flag}</span>
            <CardTitle className="text-lg">{currencyCode}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {currencyName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* 현재 환율 */}
          <div>
            <div className="text-2xl font-bold text-neutral-900">
              ₩{rate.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-sm">
              {getTrendIcon(change)}
              <span className={getTrendColor(change)}>
                {change > 0 ? "+" : ""}
                {change.toFixed(2)}
              </span>
            </div>
          </div>

          {/* 마지막 업데이트 시간 */}
          <div className="text-xs text-neutral-500">
            마지막 업데이트: {new Date(lastUpdated).toLocaleString("ko-KR")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
