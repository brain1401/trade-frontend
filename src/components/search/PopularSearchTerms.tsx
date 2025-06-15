import { useState } from "react";
import { TrendingUp, Search, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type SearchTerm = {
  term: string;
  count: number;
  trend: "up" | "down" | "stable";
  category: "hscode" | "trade" | "news" | "general";
  rank: number;
};

type PopularSearchTermsProps = {
  searchTerms: SearchTerm[];
  loading?: boolean;
  onTermClick: (term: string) => void;
  showCategory?: boolean;
  maxItems?: number;
  timeRange?: "1h" | "24h" | "7d" | "30d";
  onTimeRangeChange?: (range: "1h" | "24h" | "7d" | "30d") => void;
};

export function PopularSearchTerms({
  searchTerms,
  loading = false,
  onTermClick,
  showCategory = true,
  maxItems = 10,
  timeRange = "24h",
  onTimeRangeChange,
}: PopularSearchTermsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTerms = selectedCategory
    ? searchTerms.filter((term) => term.category === selectedCategory)
    : searchTerms;

  const displayTerms = filteredTerms.slice(0, maxItems);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-pulse rounded bg-neutral-200"></div>
          <div className="h-4 w-24 animate-pulse rounded bg-neutral-200"></div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-8 animate-pulse rounded bg-neutral-200"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (searchTerms.length === 0) {
    return (
      <div className="py-6 text-center">
        <Search className="mx-auto mb-2 h-8 w-8 text-neutral-300" />
        <p className="text-sm text-neutral-500">아직 인기 검색어가 없습니다</p>
      </div>
    );
  }

  const categories = Array.from(
    new Set(searchTerms.map((term) => term.category)),
  );

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary-600" />
          <h3 className="text-sm font-semibold text-neutral-800">
            인기 검색어
          </h3>
        </div>

        {onTimeRangeChange && (
          <TimeRangeSelector value={timeRange} onChange={onTimeRangeChange} />
        )}
      </div>

      {/* 카테고리 필터 */}
      {showCategory && categories.length > 1 && (
        <div className="flex flex-wrap gap-1">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            className="h-7 rounded-full px-3 text-xs"
            onClick={() => setSelectedCategory(null)}
          >
            전체
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="h-7 rounded-full px-3 text-xs"
              onClick={() => setSelectedCategory(category)}
            >
              {getCategoryLabel(category)}
            </Button>
          ))}
        </div>
      )}

      {/* 검색어 목록 */}
      <div className="space-y-1">
        {displayTerms.map((term) => (
          <SearchTermItem
            key={term.term}
            term={term}
            onTermClick={onTermClick}
            showCategory={showCategory && !selectedCategory}
          />
        ))}
      </div>

      {filteredTerms.length > maxItems && (
        <div className="pt-2 text-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-neutral-500"
          >
            더 보기 ({filteredTerms.length - maxItems}개 더)
            <ArrowRight size={12} className="ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}

function SearchTermItem({
  term,
  onTermClick,
  showCategory,
}: {
  term: SearchTerm;
  onTermClick: (term: string) => void;
  showCategory: boolean;
}) {
  return (
    <button
      onClick={() => onTermClick(term.term)}
      className="group flex w-full items-center justify-between rounded p-2 text-left transition-colors hover:bg-neutral-50"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <RankBadge rank={term.rank} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm text-neutral-800 group-hover:text-primary-600">
              {term.term}
            </span>
            {showCategory && <CategoryBadge category={term.category} />}
          </div>

          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-xs text-neutral-500">
              {term.count.toLocaleString()}회 검색
            </span>
            <TrendIndicator trend={term.trend} />
          </div>
        </div>
      </div>

      <Search
        size={14}
        className="text-neutral-400 group-hover:text-primary-600"
      />
    </button>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const isTop3 = rank <= 3;

  return (
    <div
      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium ${
        isTop3 ? "bg-primary-600 text-white" : "bg-neutral-200 text-neutral-600"
      } `}
    >
      {rank}
    </div>
  );
}

function TrendIndicator({ trend }: { trend: SearchTerm["trend"] }) {
  const config = {
    up: { icon: "📈", color: "text-success-600", label: "상승" },
    down: { icon: "📉", color: "text-danger-600", label: "하락" },
    stable: { icon: "➡️", color: "text-neutral-500", label: "보합" },
  };

  const { icon, color } = config[trend];

  return (
    <span className={`text-xs ${color}`} title={config[trend].label}>
      {icon}
    </span>
  );
}

function CategoryBadge({ category }: { category: SearchTerm["category"] }) {
  const config = {
    hscode: { label: "HS코드", variant: "default" as const },
    trade: { label: "무역", variant: "secondary" as const },
    news: { label: "뉴스", variant: "outline" as const },
    general: { label: "일반", variant: "secondary" as const },
  };

  const { label, variant } = config[category];

  return (
    <Badge
      variant={variant}
      className="h-4 rounded-sm px-1 py-0 text-xs font-normal"
    >
      {label}
    </Badge>
  );
}

function TimeRangeSelector({
  value,
  onChange,
}: {
  value: "1h" | "24h" | "7d" | "30d";
  onChange: (value: "1h" | "24h" | "7d" | "30d") => void;
}) {
  const options = [
    { value: "1h" as const, label: "1시간" },
    { value: "24h" as const, label: "24시간" },
    { value: "7d" as const, label: "7일" },
    { value: "30d" as const, label: "30일" },
  ];

  return (
    <div className="flex items-center gap-1">
      <Clock size={12} className="text-neutral-500" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as typeof value)}
        className="border-none bg-transparent text-xs text-neutral-600 outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function getCategoryLabel(category: string): string {
  const labels = {
    hscode: "HS코드",
    trade: "무역",
    news: "뉴스",
    general: "일반",
  };
  return labels[category as keyof typeof labels] || category;
}

// 예시 데이터 생성 함수 (개발용)
export function createMockSearchTerms(): SearchTerm[] {
  return [
    {
      term: "스마트폰 HS Code",
      count: 1247,
      trend: "up",
      category: "hscode",
      rank: 1,
    },
    {
      term: "화장품 수출 규정",
      count: 892,
      trend: "stable",
      category: "trade",
      rank: 2,
    },
    {
      term: "반도체 관세율",
      count: 734,
      trend: "up",
      category: "trade",
      rank: 3,
    },
    {
      term: "의료기기 분류",
      count: 623,
      trend: "down",
      category: "hscode",
      rank: 4,
    },
    {
      term: "FTA 원산지 증명",
      count: 581,
      trend: "up",
      category: "trade",
      rank: 5,
    },
    {
      term: "농산물 검역",
      count: 456,
      trend: "stable",
      category: "trade",
      rank: 6,
    },
    {
      term: "전자제품 안전인증",
      count: 398,
      trend: "down",
      category: "news",
      rank: 7,
    },
    {
      term: "코로나 방역용품",
      count: 345,
      trend: "down",
      category: "hscode",
      rank: 8,
    },
    {
      term: "중국 수입 규제",
      count: 289,
      trend: "up",
      category: "news",
      rank: 9,
    },
    {
      term: "RCEP 관세혜택",
      count: 234,
      trend: "stable",
      category: "general",
      rank: 10,
    },
  ];
}
