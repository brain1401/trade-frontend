import React from "react";
import { mockExchangeRates } from "../../data/mockData";
import ContentCard from "./ContentCard";

// 환율 변동률 포매팅 함수
const formatChange = (change: number): React.ReactNode => {
  const sign = change > 0 ? "+" : change < 0 ? "" : "";
  const color =
    change > 0
      ? "text-red-500"
      : change < 0
        ? "text-blue-500"
        : "text-gray-500";
  return (
    <span className={`${color} text-xs`}>
      {sign}
      {change.toFixed(2)}%
    </span>
  );
};

const ExchangeRateCard = () => (
  <ContentCard title="실시간 환율 정보">
    <ul className="space-y-1">
      {mockExchangeRates.map((item) => (
        <li
          key={item.currency}
          className="flex items-center justify-between border-b border-gray-100 py-2 last:border-b-0"
        >
          <div className="flex items-center">
            <span className="font-medium text-gray-700">{item.currency}</span>
            <span className="ml-2 text-sm text-gray-500">{item.symbol}</span>
          </div>
          <div className="text-right">
            <span className="font-semibold text-gray-800">
              {item.rate.toFixed(2)}
            </span>
            <span className="ml-2">{formatChange(item.change)}</span>
          </div>
        </li>
      ))}
    </ul>
    <p className="mt-2 text-right text-xs text-gray-400">
      데이터 제공: 관세청 API (Mock)
    </p>
  </ContentCard>
);

export default ExchangeRateCard;
