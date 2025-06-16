import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

// 환율 변동률 포매팅 함수
export const formatChange = (change: number): React.ReactNode => {
  const sign = change > 0 ? "+" : change < 0 ? "" : "";

  let color = "text-neutral-500";
  if (change > 0) {
    color = "text-danger-500";
  } else if (change < 0) {
    color = "text-info-500";
  }

  let icon: React.ReactNode = null;
  if (change > 0) {
    icon = React.createElement(TrendingUp, { size: 12, className: "ml-0.5" });
  } else if (change < 0) {
    icon = React.createElement(TrendingDown, { size: 12, className: "ml-0.5" });
  }

  return React.createElement(
    "div",
    { className: cn("flex items-center text-xs", color) },
    sign,
    change.toFixed(2) + "%",
    icon,
  );
};

// 환율 포매팅 함수
export const formatRate = (rate: number): string => {
  return rate.toLocaleString("ko-KR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
