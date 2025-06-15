import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContentCard from "@/components/common/ContentCard";
import { mockExchangeRates } from "@/data/mockData";
import { Link } from "@tanstack/react-router";

const rateClasses = "px-[.2rem] text-center";

// 환율 변동률 포매팅 함수
const formatChange = (change: number): React.ReactNode => {
  const sign = change > 0 ? "+" : change < 0 ? "" : "";
  const color =
    change > 0
      ? "text-red-500"
      : change < 0
        ? "text-blue-500"
        : "text-neutral-500";
  return (
    <span className={`${color} text-xs`}>
      {sign}
      {change.toFixed(2)}%
    </span>
  );
};

// 기존 방식 환율 포매팅 함수 (콤마 추가)
const formatOriginalRate = (rate: number): string => {
  return rate.toLocaleString("ko-KR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// 1000원당 환율 계산 함수
const calculateRateFor1000Won = (rate: number, currency: string): string => {
  const converted = 1000 / rate;

  // 통화별 소수점 자릿수 설정
  if (currency === "JPY") {
    return converted.toFixed(0); // 엔화는 소수점 없음
  } else if (currency === "CNY") {
    return converted.toFixed(1); // 위안화는 소수점 1자리
  } else {
    return converted.toFixed(2); // USD, EUR은 소수점 2자리
  }
};

const ExchangeRateCard = () => (
  <ContentCard title="실시간 환율 정보">
    <table className="w-full space-y-2">
      <tbody>
        {mockExchangeRates.map((item) => (
          <tr
            key={item.currency}
            className="border-b border-neutral-100 pb-2 last:border-b-0"
          >
            <td>
              <div className="flex items-center justify-center">
                <span className="font-medium text-neutral-700">
                  {item.currency}
                </span>
                <span className="text-md ml-2 text-neutral-500">
                  {item.symbol}
                </span>
              </div>
            </td>
            <td className="w-full"></td>
            <td className="py-[.8rem]">
              <div className="flex flex-col justify-center">
                <div className="flex items-center justify-between">
                  <div className="flex font-semibold text-nowrap text-neutral-800">
                    <div className="">1 {item.currency}</div>
                    <div className={rateClasses}>=</div>
                    <div className="flex-1 pl-[.2rem]">
                      {formatOriginalRate(item.rate)} 원
                    </div>
                  </div>
                  <div className={rateClasses}>{formatChange(item.change)}</div>
                </div>
                <div className="mt-0.5 self-end text-xs text-neutral-500">
                  1,000원 = {calculateRateFor1000Won(item.rate, item.currency)}{" "}
                  {item.currency}
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <p className="mt-2 text-right text-xs text-neutral-400">
      데이터 제공 : 관세청 API (Mock)
    </p>
    <div className="mt-3 text-right">
      <Link to="/trade/exchange-rates">
        더보기 <ChevronRight size={16} className="ml-0.5" />
      </Link>
    </div>
  </ContentCard>
);

export default ExchangeRateCard;
