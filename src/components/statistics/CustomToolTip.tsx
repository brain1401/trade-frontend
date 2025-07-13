import type { CustomTooltipProps } from "@tremor/react";

type LocalCustomTooltipProps = {
  payload: CustomTooltipProps;
  active: boolean;
  category: string;
};

export default function CustomTooltip({
  payload,
  active,
  category,
}: LocalCustomTooltipProps) {
  if (!active || !payload.payload || payload.payload.length === 0) {
    return null;
  }
  const categoryPayload = payload.payload[0];
  const value = categoryPayload.value;
  if (typeof value !== "number") {
    return null;
  }
  const originalName = categoryPayload.payload.originalName;
  const formattedValue = `$${(value / 10).toFixed(1)}B`;

  return (
    <div className="rounded-tremor-default border-tremor-border bg-tremor-background text-tremor-content-strong shadow-tremor-dropdown max-w-xs translate-x-15 -translate-y-15 transform border p-2 whitespace-normal">
      <p className="font-semibold">{originalName}</p>
      <p className="text-tremor-content">
        {category} : {formattedValue}
      </p>
    </div>
  );
}
