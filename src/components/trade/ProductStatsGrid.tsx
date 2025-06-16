import ContentCard from "@/components/common/ContentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Package,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react";

type ProductStatsData = {
  hsCode: string;
  productName: string;
  category: string;
  exportValue: number;
  importValue: number;
  tradeBalance: number;
  exportGrowth: number;
  importGrowth: number;
  globalRank: number;
  marketShare: number;
};

type ProductStatsGridProps = {
  data: ProductStatsData[];
  title: string;
  className?: string;
};

// 그리드 아이템 스타일 상수 (THEME_GUIDE.md 기준)
const GRID_ITEM_CLASSES =
  "rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow";
const GRID_HEADER_CLASSES = "flex items-center justify-between mb-3";
const GRID_TITLE_CLASSES = "font-semibold text-neutral-800 text-sm";
const GRID_SUBTITLE_CLASSES = "text-xs text-neutral-500 mt-0.5";

// 값 포맷팅 함수
const formatValue = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  return `${(value / 1_000).toFixed(0)}K`;
};

// 성장률 포맷팅 함수
const formatGrowthRate = (rate: number): string => {
  const sign = rate >= 0 ? "+" : "";
  return `${sign}${rate.toFixed(1)}%`;
};

// 성장률 색상 결정 함수
const getGrowthColor = (rate: number): string => {
  return rate >= 0 ? "text-info-500" : "text-danger-500";
};

// 카테고리 뱃지 색상 결정 함수
const getCategoryBadgeVariant = (
  category: string,
): "default" | "secondary" | "destructive" => {
  switch (category) {
    case "전자제품":
      return "default";
    case "화학제품":
      return "secondary";
    case "기계류":
      return "destructive";
    default:
      return "secondary";
  }
};

// 순위 뱃지 컴포넌트
const RankBadge = ({ rank }: { rank: number }) => {
  const getRankStyle = (rank: number): string => {
    if (rank <= 3) return "bg-brand-500 text-white";
    if (rank <= 10) return "bg-info-100 text-info-700";
    return "bg-neutral-100 text-neutral-600";
  };

  return (
    <div
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
        getRankStyle(rank),
      )}
    >
      {rank}
    </div>
  );
};

// 통계 아이템 컴포넌트
const StatItem = ({
  icon: Icon,
  label,
  value,
  growth,
  showGrowth = false,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  growth?: number;
  showGrowth?: boolean;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <Icon size={14} className="mr-1.5 text-neutral-500" />
      <span className="text-xs text-neutral-600">{label}</span>
    </div>
    <div className="text-right">
      <div className="text-sm font-medium text-neutral-800">
        ${formatValue(value)}
      </div>
      {showGrowth && growth !== undefined && (
        <div className={cn("text-xs", getGrowthColor(growth))}>
          {formatGrowthRate(growth)}
        </div>
      )}
    </div>
  </div>
);

// 개별 제품 카드 컴포넌트
const ProductCard = ({ product }: { product: ProductStatsData }) => (
  <div className={GRID_ITEM_CLASSES}>
    {/* 헤더 */}
    <div className={GRID_HEADER_CLASSES}>
      <div className="flex items-center">
        <Package size={16} className="mr-2 text-primary-600" />
        <div className="flex-1">
          <div className={GRID_TITLE_CLASSES}>{product.productName}</div>
          <div className={GRID_SUBTITLE_CLASSES}>HS Code: {product.hsCode}</div>
        </div>
      </div>
      <RankBadge rank={product.globalRank} />
    </div>

    {/* 카테고리 및 시장 점유율 */}
    <div className="mb-3 flex items-center justify-between">
      <Badge
        variant={getCategoryBadgeVariant(product.category)}
        className="rounded-full px-2 py-0.5 text-xs"
      >
        {product.category}
      </Badge>
      <div className="text-right">
        <div className="text-xs text-neutral-500">시장 점유율</div>
        <div className="text-sm font-medium text-neutral-800">
          {product.marketShare.toFixed(1)}%
        </div>
      </div>
    </div>

    {/* 통계 정보 */}
    <div className="space-y-2">
      <StatItem
        icon={TrendingUp}
        label="수출"
        value={product.exportValue}
        growth={product.exportGrowth}
        showGrowth={true}
      />
      <StatItem
        icon={TrendingDown}
        label="수입"
        value={product.importValue}
        growth={product.importGrowth}
        showGrowth={true}
      />
      <StatItem
        icon={BarChart3}
        label="무역수지"
        value={Math.abs(product.tradeBalance)}
      />
    </div>

    {/* 무역수지 상태 표시 */}
    <div className="mt-3 border-t border-neutral-100 pt-3">
      <div className="flex items-center justify-center">
        <span className="mr-2 text-xs text-neutral-500">무역수지:</span>
        <span
          className={cn(
            "text-sm font-medium",
            product.tradeBalance >= 0 ? "text-info-500" : "text-danger-500",
          )}
        >
          {product.tradeBalance >= 0 ? "흑자" : "적자"} $
          {formatValue(Math.abs(product.tradeBalance))}
        </span>
      </div>
    </div>
  </div>
);

const ProductStatsGrid = ({
  data,
  title,
  className = "",
}: ProductStatsGridProps) => {
  return (
    <ContentCard
      title={title}
      className={className}
      titleRightElement={
        <Button
          variant="link"
          size="sm"
          className="flex h-auto items-center p-0 text-sm text-primary-600 hover:underline"
        >
          전체보기 <ChevronRight size={16} className="ml-0.5" />
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((product) => (
          <ProductCard key={product.hsCode} product={product} />
        ))}
      </div>
    </ContentCard>
  );
};

export default ProductStatsGrid;
export type { ProductStatsData };
