import React from "react";

// 환율 변동률 포매팅 함수
export const formatChange = (change: number): React.ReactNode => {
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
