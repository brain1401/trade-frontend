import type { Top } from "@/lib/api/statistics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { formatUsdInBillions } from "@/lib/utils/formatters";

type MajorTradingPartnersProps = {
  data: Top[];
};

/**
 * 주요 교역국 컴포넌트
 */
export function MajorTradingPartners({ data }: MajorTradingPartnersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-info-600" />
          주요 수출 상대국
        </CardTitle>
        <CardDescription>총 수출액 기준 상위 국가</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.length > 0 ? (
          data.map((partner) => (
            <div key={partner.itemName}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-neutral-800">
                      {partner.itemName}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-medium text-neutral-800">
                  ${formatUsdInBillions(partner.totalValue)}B
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
