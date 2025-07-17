/**
 * CSS 변수 조작을 위한 유틸리티 함수들
 *
 * @example CSS 차트 색상 가져오기
 * ```typescript
 * const primaryColor = getChartColor("primary");
 * const colors = getChartColors(["primary", "secondary", "tertiary"]);
 * ```
 *
 * @example 일반 CSS 변수 가져오기
 * ```typescript
 * const bgColor = getCSSVariable("background");
 * const borderRadius = getCSSVariable("radius");
 * ```
 */

/**
 * CSS 변수 값을 가져오는 기본 함수
 *
 * @param variableName - CSS 변수 이름 (--prefix 없이)
 * @param prefix - 변수 접두사 (기본값: "color")
 * @returns CSS 변수 값 또는 빈 문자열
 */
export const getCSSVariable = (
  variableName: string,
  prefix: string = "color",
): string => {
  try {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--${prefix}-${variableName}`)
      .trim();
  } catch (error) {
    console.warn(
      `CSS 변수 --${prefix}-${variableName}을 찾을 수 없습니다:`,
      error,
    );
    return "";
  }
};

/**
 * 차트 색상을 가져오는 특화 함수
 *
 * @param colorName - 차트 색상 이름 (primary, secondary, tertiary, quaternary, accent, highlight)
 * @returns 차트 색상 값
 *
 * @example
 * ```typescript
 * const exportColor = getChartColor("primary");
 * const importColor = getChartColor("quaternary");
 * ```
 */
export const getChartColor = (colorName: string): string => {
  return getCSSVariable(colorName, "color-chart");
};

/**
 * 여러 차트 색상을 한 번에 가져오는 함수
 *
 * @param colorNames - 차트 색상 이름 배열
 * @returns 색상 이름을 키로 하는 색상 값 객체
 *
 * @example
 * ```typescript
 * const colors = getChartColors(["primary", "secondary", "tertiary"]);
 * // { primary: "#0088fe", secondary: "#00c49f", tertiary: "#ffbb28" }
 * ```
 */
export const getChartColors = (
  colorNames: string[],
): Record<string, string> => {
  return colorNames.reduce(
    (colors, name) => {
      colors[name] = getChartColor(name);
      return colors;
    },
    {} as Record<string, string>,
  );
};

/**
 * 테마 색상을 가져오는 함수
 *
 * @param colorName - 테마 색상 이름 (primary, secondary, accent, muted 등)
 * @returns 테마 색상 값
 */
export const getThemeColor = (colorName: string): string => {
  return getCSSVariable(colorName);
};

/**
 * 브랜드 색상을 가져오는 함수
 *
 * @param shade - 색상 강도 (50, 100, 200, ..., 900, 950)
 * @returns 브랜드 색상 값
 */
export const getBrandColor = (shade: number): string => {
  return getCSSVariable(shade.toString(), "color-brand");
};

/**
 * 시맨틱 색상을 가져오는 함수
 *
 * @param type - 시맨틱 색상 타입 (success, warning, danger, info)
 * @param shade - 색상 강도 (기본값: 500)
 * @returns 시맨틱 색상 값
 */
export const getSemanticColor = (type: string, shade: number = 500): string => {
  return getCSSVariable(`${shade}`, `color-${type}`);
};
