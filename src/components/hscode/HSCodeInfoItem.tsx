import { Badge } from "@/components/ui/badge";
import {
  Clock,
  ExternalLink,
  AlertTriangle,
  Award,
  DollarSign,
  FileText,
} from "lucide-react";
import type { HSCodeInfo } from "@/types";

type HSCodeInfoItemProps = HSCodeInfo;

function HSCodeInfoItem({
  hsCode,
  title,
  summary,
  type,
  source,
  published_at,
  tags,
  importance,
  effectiveDate,
  relatedRegulations,
  url,
}: HSCodeInfoItemProps) {
  // 날짜 포맷팅
  const publishedDate = new Date(published_at).toLocaleDateString("ko-KR");
  const effectiveDisplayDate = effectiveDate
    ? new Date(effectiveDate).toLocaleDateString("ko-KR")
    : null;

  // 타입별 스타일 및 아이콘 설정
  const getTypeConfig = (type: HSCodeInfo["type"]) => {
    switch (type) {
      case "regulation":
        return {
          variant: "destructive" as const,
          icon: <AlertTriangle className="h-3 w-3" />,
          label: "규제",
        };
      case "tariff":
        return {
          variant: "default" as const,
          icon: <DollarSign className="h-3 w-3" />,
          label: "관세",
        };
      case "certification":
        return {
          variant: "secondary" as const,
          icon: <Award className="h-3 w-3" />,
          label: "인증",
        };
      case "news":
        return {
          variant: "outline" as const,
          icon: <FileText className="h-3 w-3" />,
          label: "뉴스",
        };
    }
  };

  // 중요도별 스타일 설정
  const getImportanceStyle = (importance: HSCodeInfo["importance"]) => {
    switch (importance) {
      case "high":
        return "border-l-4 border-l-danger-500 bg-danger-50";
      case "medium":
        return "border-l-4 border-l-warning-500 bg-warning-50";
      case "low":
        return "border-l-4 border-l-info-500 bg-info-50";
    }
  };

  const typeConfig = getTypeConfig(type);
  const importanceStyle = getImportanceStyle(importance);

  return (
    <div
      className={`rounded-lg border p-4 transition-colors hover:bg-neutral-50 ${importanceStyle}`}
    >
      {/* 헤더 영역 */}
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex-1">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer font-semibold text-neutral-800 hover:text-primary-600"
          >
            {title}
          </a>

          {/* HS Code 표시 */}
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs font-medium text-primary-600">
              HS Code: {hsCode}
            </span>
            {effectiveDisplayDate && (
              <div className="flex items-center gap-1 text-xs text-neutral-500">
                <Clock className="h-3 w-3" />
                <span>시행일: {effectiveDisplayDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* 타입 배지 */}
        <Badge
          variant={typeConfig.variant}
          className="flex items-center gap-1 whitespace-nowrap"
        >
          {typeConfig.icon}
          {typeConfig.label}
        </Badge>
      </div>

      {/* 요약 내용 */}
      <p className="mb-3 text-sm leading-relaxed text-neutral-600">{summary}</p>

      {/* 관련 규제 표시 */}
      {relatedRegulations && relatedRegulations.length > 0 && (
        <div className="mb-3">
          <p className="mb-1 text-xs font-medium text-neutral-700">
            관련 규제:
          </p>
          <div className="flex flex-wrap gap-1">
            {relatedRegulations.map((regulation, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {regulation}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 태그 표시 */}
      {tags.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 3}개
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* 하단 메타 정보 */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="text-neutral-600">{source}</span>
          <span>|</span>
          <span>{publishedDate}</span>
        </div>

        {/* 외부 링크 */}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3" />
            <span>원문보기</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default HSCodeInfoItem;
