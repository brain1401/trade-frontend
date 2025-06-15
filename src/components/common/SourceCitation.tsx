import { ExternalLink, Shield, Calendar, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type SourceInfo = {
  title: string;
  organization: string;
  url: string;
  publishedAt: string;
  reliability: "high" | "medium" | "low";
  type: "regulation" | "news" | "official" | "statistics" | "guide";
};

type SourceCitationProps = {
  sources: SourceInfo[];
  title?: string;
  showTitle?: boolean;
  compact?: boolean;
};

export function SourceCitation({
  sources,
  title = "참고 자료",
  showTitle = true,
  compact = false,
}: SourceCitationProps) {
  if (sources.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => (
          <Button
            key={index}
            variant="link"
            size="sm"
            className="h-auto p-1 text-xs text-primary-600 hover:underline"
            asChild
          >
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <ReliabilityIndicator
                reliability={source.reliability}
                size={12}
              />
              {source.organization}
              <ExternalLink size={10} />
            </a>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="space-y-3">
        {showTitle && (
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary-600" />
            <h4 className="text-sm font-semibold text-neutral-800">{title}</h4>
          </div>
        )}

        <div className="space-y-2">
          {sources.map((source, index) => (
            <SourceItem key={index} source={source} />
          ))}
        </div>

        {sources.length > 0 && (
          <div className="border-t border-neutral-100 pt-2 text-xs text-neutral-500">
            ℹ️ 모든 정보는 공식 출처에서 확인되었습니다.
          </div>
        )}
      </div>
    </div>
  );
}

function SourceItem({ source }: { source: SourceInfo }) {
  return (
    <div className="flex items-start gap-3 rounded p-2 transition-colors hover:bg-neutral-50">
      <ReliabilityIndicator reliability={source.reliability} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Button
              variant="link"
              className="h-auto justify-start p-0 text-left text-sm font-medium text-neutral-800 hover:text-primary-600"
              asChild
            >
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate"
              >
                {source.title}
              </a>
            </Button>

            <div className="mt-1 flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-neutral-500">
                <Building size={10} />
                {source.organization}
              </div>

              <div className="flex items-center gap-1 text-xs text-neutral-500">
                <Calendar size={10} />
                {source.publishedAt}
              </div>

              <SourceTypeBadge type={source.type} />
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 text-neutral-400 hover:text-primary-600"
            asChild
          >
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={14} />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ReliabilityIndicator({
  reliability,
  size = 16,
}: {
  reliability: SourceInfo["reliability"];
  size?: number;
}) {
  const config = {
    high: {
      color: "text-success-500",
      bg: "bg-success-100",
      icon: "🟢",
    },
    medium: {
      color: "text-warning-500",
      bg: "bg-warning-100",
      icon: "🟡",
    },
    low: {
      color: "text-danger-500",
      bg: "bg-danger-100",
      icon: "🔴",
    },
  };

  const { color, bg } = config[reliability];

  return (
    <div
      className={`flex-shrink-0 rounded-full ${bg} flex items-center justify-center`}
      style={{ width: size + 4, height: size + 4 }}
      title={`신뢰도: ${reliability === "high" ? "높음" : reliability === "medium" ? "보통" : "낮음"}`}
    >
      <Shield size={size - 4} className={color} />
    </div>
  );
}

function SourceTypeBadge({ type }: { type: SourceInfo["type"] }) {
  const config = {
    regulation: { label: "규제", variant: "destructive" as const },
    news: { label: "뉴스", variant: "secondary" as const },
    official: { label: "공식", variant: "default" as const },
    statistics: { label: "통계", variant: "outline" as const },
    guide: { label: "가이드", variant: "secondary" as const },
  };

  const { label, variant } = config[type];

  return (
    <Badge
      variant={variant}
      className="rounded-full px-2 py-0 text-xs font-normal"
    >
      {label}
    </Badge>
  );
}

// 미리 정의된 소스 템플릿
export const COMMON_SOURCES = {
  KOREA_CUSTOMS: {
    organization: "관세청",
    reliability: "high" as const,
    type: "official" as const,
  },
  KITA: {
    organization: "한국무역협회",
    reliability: "high" as const,
    type: "statistics" as const,
  },
  MOTIE: {
    organization: "산업통상자원부",
    reliability: "high" as const,
    type: "regulation" as const,
  },
  KOTRA: {
    organization: "KOTRA",
    reliability: "high" as const,
    type: "guide" as const,
  },
};
