/**
 * 북마크 타입별 색상 매핑
 * 각 북마크 타입에 따라 다른 시각적 구분을 제공
 */
export const getTypeColor = (type: string) => {
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
    case "REGULATION":
      return {
        badge: "bg-warning-100 text-warning-800",
        icon: "text-warning-600",
      };
    default:
      return {
        badge: "bg-neutral-100 text-neutral-800",
        icon: "text-neutral-600",
      };
  }
};

/**
 * 북마크 타입 표시명 매핑
 * 내부 타입명을 사용자 친화적인 표시명으로 변환
 */
export const getTypeName = (type: string) => {
  switch (type) {
    case "HS_CODE":
      return "HS Code";
    case "CARGO":
      return "화물추적";
    case "REGULATION":
      return "규제정보";
    default:
      return type;
  }
};
