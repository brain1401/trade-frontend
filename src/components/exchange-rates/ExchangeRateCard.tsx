import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlagIcon } from "@/components/common/FlagIcon";

/**
 * 환율 카드에 전달될 단일 환율 정보 타입
 */
type RateInfo = {
  currencyName: string;
  exchangeRate: number;
  lastUpdated: string;
} | null;

/**
 * 환율 카드 컴포넌트 프로퍼티
 */
export type ExchangeRateCardProps = {
  currencyCode: string;
  koreanName: string;
  flagUrl: string;
  importRate: RateInfo;
  exportRate: RateInfo;
};

/**
 * 환율 카드 컴포넌트
 *
 * 단일 통화에 대한 수입/수출 환율 정보를 카드 형태로 표시
 * @param currencyCode 통화 코드 (e.g., "USD")
 * @param koreanName 국가/지역 한글 이름 (e.g., "미국")
 * @param flagUrl 국기 이미지 URL
 * @param importRate 수입 환율 정보
 * @param exportRate 수출 환율 정보
 */
export function ExchangeRateCard({
  currencyCode,
  koreanName,
  flagUrl,
  importRate,
  exportRate,
}: ExchangeRateCardProps) {
  // 마지막 업데이트 시간은 수입 또는 수출 데이터 중 최신 시간을 사용
  const lastUpdated = importRate?.lastUpdated || exportRate?.lastUpdated || "";

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex w-full items-center justify-center">
          <div className="flex h-fit items-center justify-center gap-x-3">
            <FlagIcon src={flagUrl} alt={`${koreanName} 국기`} />
            <div>{koreanName}</div>
            <CardTitle className="text-lg">{currencyCode}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* 수입 환율 섹션 */}
          {importRate && (
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-700">
                  수입{" "}
                  <Badge variant="outline" className="text-xs">
                    {importRate.currencyName}
                  </Badge>
                </span>
                <div className="text-xl font-bold text-neutral-900">
                  ₩{importRate.exchangeRate.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* 수출 환율 섹션 */}
          {exportRate && (
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-700">
                  수출{" "}
                  <Badge variant="outline" className="text-xs">
                    {exportRate.currencyName}
                  </Badge>
                </span>
                <div className="text-xl font-bold text-neutral-900">
                  ₩{exportRate.exchangeRate.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* 마지막 업데이트 시간 */}
          {lastUpdated && (
            <div className="pt-2 text-right text-xs text-neutral-500">
              기준 시간: {new Date(lastUpdated).toLocaleString("ko-KR")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
