import ContentCard from "@/components/common/ContentCard";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";

type StatisticsSummaryData = {
  totalTradeValue: number;
  exportValue: number;
  importValue: number;
  tradeBalance: number;
  exportGrowth: number;
  importGrowth: number;
  period: string;
};

type StatisticsSummaryCardProps = {
  data: StatisticsSummaryData;
  className?: string;
};

// 통계 아이템 스타일 상수
const STAT_ITEM_CLASSES =
  "rounded-lg border bg-card p-4 text-center hover:bg-neutral-50 transition-colors";
const STAT_VALUE_CLASSES = "text-2xl font-bold";
const STAT_LABEL_CLASSES = "text-sm text-neutral-600 mt-1";
const STAT_CHANGE_CLASSES = "text-xs mt-1 flex items-center justify-center";

// 값 포맷팅 함수
const formatValue = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toFixed(0);
};

// 성장률 포맷팅 함수
const formatGrowthRate = (rate: number): string => {
  const sign = rate >= 0 ? "+" : "";
  return `${sign}${rate.toFixed(1)}%`;
};

// 성장률 스타일 결정 함수
const getGrowthStyle = (rate: number): string => {
  return rate >= 0 ? "text-info-500" : "text-danger-500";
};

// 개별 통계 아이템 컴포넌트
const StatItem = ({
  icon: Icon,
  value,
  label,
  growth,
  showGrowth = false,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: number;
  label: string;
  growth?: number;
  showGrowth?: boolean;
}) => (
  <div className={STAT_ITEM_CLASSES}>
    <div className="mb-2 flex items-center justify-center">
      <Icon size={24} className="text-primary-600" />
    </div>
    <div className={cn(STAT_VALUE_CLASSES, "text-neutral-800")}>
      ${formatValue(value)}
    </div>
    <div className={STAT_LABEL_CLASSES}>{label}</div>
    {showGrowth && growth !== undefined && (
      <div className={cn(STAT_CHANGE_CLASSES, getGrowthStyle(growth))}>
        {growth >= 0 ? (
          <TrendingUp size={12} className="mr-1" />
        ) : (
          <TrendingDown size={12} className="mr-1" />
        )}
        {formatGrowthRate(growth)}
      </div>
    )}
  </div>
);

const StatisticsSummaryCard = ({
  data,
  className = "",
}: StatisticsSummaryCardProps) => {
  return (
    <ContentCard
      title="무역 통계 요약"
      className={className}
      titleRightElement={
        <span className="text-xs text-neutral-500">{data.period}</span>
      }
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatItem
          icon={DollarSign}
          value={data.totalTradeValue}
          label="총 무역액"
        />
        <StatItem
          icon={TrendingUp}
          value={data.exportValue}
          label="수출액"
          growth={data.exportGrowth}
          showGrowth={true}
        />
        <StatItem
          icon={TrendingDown}
          value={data.importValue}
          label="수입액"
          growth={data.importGrowth}
          showGrowth={true}
        />
        <StatItem
          icon={BarChart3}
          value={Math.abs(data.tradeBalance)}
          label={data.tradeBalance >= 0 ? "무역수지 (흑자)" : "무역수지 (적자)"}
        />
      </div>
    </ContentCard>
  );
};

export default StatisticsSummaryCard;
export type { StatisticsSummaryData };
