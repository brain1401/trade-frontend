import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  FileText,
  Globe,
  Hash,
  Newspaper,
  Package,
  TrendingUp,
} from "lucide-react";

/**
 * 아이콘 관련 헬퍼 함수들
 *
 * 각 컴포넌트에서 타입/상태에 따른 아이콘 선택 로직을 모듈화
 */

/**
 * 뉴스 중요도별 아이콘 반환
 *
 * @param importance - 중요도 레벨 ("HIGH", "MEDIUM", "LOW")
 * @returns React 아이콘 컴포넌트
 *
 * @example
 * ```tsx
 * const icon = getNewsImportanceIcon("HIGH");
 * // <AlertCircle className="h-4 w-4" />
 * ```
 */
export const getNewsImportanceIcon = (importance: number) => {
  switch (importance) {
    case 1:
      return <AlertCircle className="h-4 w-4" />;
    case 2:
      return <TrendingUp className="h-4 w-4" />;
    case 3:
      return <FileText className="h-4 w-4" />;
    default:
      return <Newspaper className="h-4 w-4" />;
  }
};

/**
 * 뉴스 카테고리별 아이콘 반환
 *
 * @param category - 뉴스 카테고리 ("무역", "규제", "관세", "인증", "정책")
 * @returns React 아이콘 컴포넌트
 *
 * @example
 * ```tsx
 * const icon = getNewsCategoryIcon("무역");
 * // <Globe className="h-4 w-4 text-primary-600" />
 * ```
 */
export const getNewsCategoryIcon = (category: string) => {
  switch (category) {
    case "무역":
      return <Globe className="h-4 w-4 text-primary-600" />;
    case "규제":
      return <AlertCircle className="h-4 w-4 text-warning-600" />;
    case "관세":
      return <FileText className="h-4 w-4 text-info-600" />;
    case "인증":
      return <TrendingUp className="h-4 w-4 text-success-600" />;
    case "정책":
      return <Newspaper className="text-brand-600 h-4 w-4" />;
    default:
      return <Newspaper className="h-4 w-4 text-neutral-600" />;
  }
};

/**
 * 검색 결과 타입별 아이콘 반환
 *
 * @param type - 검색 결과 타입 ("hscode", "product", "regulation", "company")
 * @returns React 아이콘 컴포넌트
 *
 * @example
 * ```tsx
 * const icon = getSearchResultIcon("hscode");
 * // <Hash className="h-4 w-4 text-primary-600" />
 * ```
 */
export const getSearchResultIcon = (type: string) => {
  switch (type) {
    case "hscode":
      return <Hash className="h-4 w-4 text-primary-600" />;
    case "product":
      return <Package className="h-4 w-4 text-success-600" />;
    case "regulation":
      return <FileText className="h-4 w-4 text-warning-600" />;
    case "company":
      return <Building2 className="h-4 w-4 text-info-600" />;
    default:
      return <FileText className="h-4 w-4 text-neutral-600" />;
  }
};

/**
 * 트렌드 값에 따른 화살표 아이콘 반환
 *
 * @param value - 트렌드 값 (양수: 상승, 음수: 하락, 0: 중립)
 * @returns React 아이콘 컴포넌트 또는 빈 div
 *
 * @example
 * ```tsx
 * const icon = getTrendIcon(5.2);
 * // <ArrowUpRight className="h-4 w-4 text-success-600" />
 * ```
 */
export const getTrendIcon = (value: number) => {
  if (value > 0) {
    return <ArrowUpRight className="h-4 w-4 text-success-600" />;
  } else if (value < 0) {
    return <ArrowDownRight className="text-danger-600 h-4 w-4" />;
  }
  return <div className="h-4 w-4" />;
};
