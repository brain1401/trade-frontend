import ContentCard from "@/components/common/ContentCard";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type TradeBalanceData = {
  month: string;
  export: number;
  import: number;
  balance: number;
};

type TradeBalanceChartProps = {
  data: TradeBalanceData[];
  className?: string;
};

// 차트 색상 상수 (styles.css @theme 기준)
const CHART_COLORS = {
  export: "#0088fe", // chart-primary
  import: "#ff8042", // chart-quaternary
  balance: "#00c49f", // chart-secondary
};

// 필터 버튼 스타일 상수
const FILTER_BUTTON_CLASSES = "rounded-full px-3 py-2 text-xs";

// 값 포맷팅 함수
const formatChartValue = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  return `${(value / 1_000).toFixed(0)}K`;
};

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-3 shadow-lg">
        <p className="mb-2 text-sm font-semibold text-neutral-800">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center text-xs">
            <div
              className="mr-2 h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="mr-2 text-neutral-600">{entry.name}:</span>
            <span className="font-medium text-neutral-800">
              ${formatChartValue(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// 범례 데이터
const legendData = [
  { key: "export", label: "수출", color: CHART_COLORS.export },
  { key: "import", label: "수입", color: CHART_COLORS.import },
  { key: "balance", label: "무역수지", color: CHART_COLORS.balance },
];

const TradeBalanceChart = ({
  data,
  className = "",
}: TradeBalanceChartProps) => {
  return (
    <ContentCard
      title="월별 무역 수지 추이"
      className={className}
      titleRightElement={
        <div className="flex space-x-2">
          <Button variant="default" size="sm" className={FILTER_BUTTON_CLASSES}>
            6개월
          </Button>
          <Button variant="outline" size="sm" className={FILTER_BUTTON_CLASSES}>
            1년
          </Button>
          <Button variant="outline" size="sm" className={FILTER_BUTTON_CLASSES}>
            3년
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* 범례 */}
        <div className="flex justify-center space-x-6">
          {legendData.map(({ key, label, color }) => (
            <div key={key} className="flex items-center">
              <div
                className="mr-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-neutral-600">{label}</span>
            </div>
          ))}
        </div>

        {/* 차트 */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="exportGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS.export}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS.export}
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient id="importGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS.import}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS.import}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={{ stroke: "#d1d5db" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={{ stroke: "#d1d5db" }}
                tickFormatter={formatChartValue}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="export"
                name="수출"
                stroke={CHART_COLORS.export}
                fill="url(#exportGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="import"
                name="수입"
                stroke={CHART_COLORS.import}
                fill="url(#importGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ContentCard>
  );
};

export default TradeBalanceChart;
export type { TradeBalanceData };
