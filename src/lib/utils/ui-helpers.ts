/**
 * UI 컴포넌트에서 공통으로 사용되는 헬퍼 함수들
 *
 * 각 컴포넌트마다 중복되던 색상, 아이콘, 타입 변환 로직들을
 * 모듈화하여 일관성과 재사용성을 높임
 */

/**
 * 북마크 타입별 색상 및 스타일 정보 반환
 *
 * @param type - 북마크 타입 ("HS_CODE", "CARGO" 등)
 * @returns 색상 정보 객체 (badge, icon 클래스)
 *
 * @example
 * ```typescript
 * const color = getBookmarkTypeColor("HS_CODE");
 * // { badge: "bg-primary-100 text-primary-800", icon: "text-primary-600" }
 * ```
 */
export const getBookmarkTypeColor = (type: string) => {
  switch (type) {
    case "HS_CODE":
      return {
        badge: "bg-primary-100 text-primary-800",
        icon: "text-primary-600",
      };
    case "CARGO":
      return {
        badge: "bg-info-100 text-info-800",
        icon: "text-info-600",
      };
    default:
      return {
        badge: "bg-neutral-100 text-neutral-800",
        icon: "text-neutral-600",
      };
  }
};

/**
 * 북마크 타입명 표시명 변환
 *
 * @param type - 내부 타입명
 * @returns 사용자 친화적 표시명
 *
 * @example
 * ```typescript
 * const displayName = getBookmarkTypeName("HS_CODE");
 * // "HS Code"
 * ```
 */
export const getBookmarkTypeName = (type: string) => {
  switch (type) {
    case "HS_CODE":
      return "HS Code";
    case "CARGO":
      return "화물추적";
    default:
      return type;
  }
};

/**
 * 뉴스 중요도별 색상 클래스 반환
 *
 * @param importance - 중요도 레벨 ("HIGH", "MEDIUM", "LOW")
 * @returns Tailwind CSS 클래스 문자열
 *
 * @example
 * ```typescript
 * const color = getNewsImportanceColor("HIGH");
 * // "text-danger-600 bg-danger-50 border-danger-200"
 * ```
 */
export const getNewsImportanceColor = (importance: string) => {
  switch (importance) {
    case "HIGH":
      return "text-danger-600 bg-danger-50 border-danger-200";
    case "MEDIUM":
      return "text-warning-600 bg-warning-50 border-warning-200";
    case "LOW":
      return "text-info-600 bg-info-50 border-info-200";
    default:
      return "text-neutral-600 bg-neutral-50 border-neutral-200";
  }
};

/**
 * 뉴스 중요도 표시명 변환
 *
 * @param importance - 중요도 레벨
 * @returns 한국어 표시명
 *
 * @example
 * ```typescript
 * const label = getNewsImportanceLabel("HIGH");
 * // "긴급"
 * ```
 */
export const getNewsImportanceLabel = (importance: string) => {
  switch (importance) {
    case "HIGH":
      return "긴급";
    case "MEDIUM":
      return "중요";
    case "LOW":
      return "일반";
    default:
      return "일반";
  }
};

/**
 * 검색 결과 타입명 변환
 *
 * @param type - 검색 결과 타입 ("hscode", "product", "regulation", "company")
 * @returns 한국어 표시명
 *
 * @example
 * ```typescript
 * const displayName = getSearchResultTypeName("hscode");
 * // "HS Code"
 * ```
 */
export const getSearchResultTypeName = (type: string) => {
  switch (type) {
    case "hscode":
      return "HS Code";
    case "product":
      return "상품";
    case "regulation":
      return "규제";
    case "company":
      return "기업";
    default:
      return "기타";
  }
};

/**
 * 트렌드 값에 따른 색상 클래스 반환
 * 상승/하락/중립에 따라 다른 색상 적용
 *
 * @param value - 트렌드 값 (양수: 상승, 음수: 하락, 0: 중립)
 * @returns Tailwind CSS 색상 클래스
 *
 * @example
 * ```typescript
 * const color = getTrendColor(5.2);   // "text-success-600"
 * const color = getTrendColor(-3.1);  // "text-danger-600"
 * const color = getTrendColor(0);     // "text-neutral-600"
 * ```
 */
export const getTrendColor = (value: number) => {
  if (value > 0) return "text-success-600";
  if (value < 0) return "text-danger-600";
  return "text-neutral-600";
};

/**
 * 대시보드 카드 색상 테마별 스타일 정보 반환
 *
 * @param color - 색상 테마 ("primary", "success", "warning", "info", "neutral", "brand")
 * @returns 색상별 스타일 객체
 *
 * @example
 * ```typescript
 * const styles = getDashboardCardStyles("primary");
 * // {
 * //   hover: "hover:border-primary-200 hover:bg-primary-50/50",
 * //   icon: "text-primary-600"
 * // }
 * ```
 */
export const getDashboardCardStyles = (
  color: "primary" | "success" | "warning" | "info" | "neutral" | "brand",
) => {
  const colorStyles = {
    primary: {
      hover:
        "hover:border-primary-200 hover:bg-primary-50/50 focus-within:ring-primary-500",
      icon: "text-primary-600",
    },
    success: {
      hover:
        "hover:border-success-200 hover:bg-success-50/50 focus-within:ring-success-500",
      icon: "text-success-600",
    },
    warning: {
      hover:
        "hover:border-warning-200 hover:bg-warning-50/50 focus-within:ring-warning-500",
      icon: "text-warning-600",
    },
    info: {
      hover:
        "hover:border-info-200 hover:bg-info-50/50 focus-within:ring-info-500",
      icon: "text-info-600",
    },
    neutral: {
      hover:
        "hover:border-neutral-200 hover:bg-neutral-50/50 focus-within:ring-neutral-500",
      icon: "text-neutral-600",
    },
    brand: {
      hover:
        "hover:border-brand-200 hover:bg-brand-50/50 focus-within:ring-brand-500",
      icon: "text-brand-600",
    },
  };

  return colorStyles[color];
};
