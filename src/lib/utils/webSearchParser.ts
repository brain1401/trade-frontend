import type {
  WebSearchResult,
  ParsedWebSearchResults,
} from "@/lib/api/chat/types";

/**
 * 🚀 v2.2: 근본적으로 개선된 웹 검색 결과 파싱 유틸리티
 *
 * 핵심 개선사항:
 * - 웹 검색 데이터 감지 시 완전 제거 (파싱 시도하지 않음)
 * - 견고한 패턴 매칭으로 "[,,]" 잔여물 방지
 * - SSE 이벤트 기반 분리 지원
 * - 안전한 fallback 메커니즘
 */

/**
 * 🔍 웹 검색 결과 패턴들 (순서대로 검사)
 */
const WEB_SEARCH_PATTERNS = [
  // 1. 배열 형태 (가장 일반적)
  /\[\s*\{[^[\]]*['"]type['"]:\s*['"]web_search_result['"][^[\]]*\}[^[\]]*\]/gs,

  // 2. 단일 딕셔너리 형태
  /\{[^{}]*['"]encrypted_content['"][^{}]*['"]type['"]:\s*['"]web_search_result['"][^{}]*\}/gs,

  // 3. 부분적 배열 (스트리밍 중 잘린 형태)
  /\[\s*\{[^[\]]*['"]encrypted_content['"][^[\]]*$/gs,

  // 4. 단순 배열 표시 (파싱 실패 후 남은 형태)
  /\[\s*,\s*,\s*,\s*\]/gs,
  /\[\s*(,\s*)*\]/gs,

  // 5. 매우 긴 암호화 데이터 (특정 패턴)
  /\[\s*\{[^}]*['"]encrypted_content['"]:\s*['"][A-Za-z0-9+/=]{100,}['"][^}]*\}[^[\]]*\]/gs,
];

/**
 * 🚀 빠른 웹 검색 데이터 감지 (파싱하지 않고 존재만 확인)
 */
export function containsWebSearchData(text: string): boolean {
  if (!text || typeof text !== "string") {
    return false;
  }

  // 빠른 키워드 검사
  const hasWebSearchKeywords =
    text.includes("web_search_result") ||
    text.includes("encrypted_content") ||
    text.includes("page_age") ||
    (text.includes("[") && text.includes(",") && text.length > 50);

  if (!hasWebSearchKeywords) {
    return false;
  }

  // 패턴 매칭으로 확실히 확인
  return WEB_SEARCH_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * 🧹 웹 검색 데이터 완전 제거 (파싱 없이 안전하게 제거)
 */
export function removeWebSearchData(text: string): string {
  if (!text || typeof text !== "string") {
    return text || "";
  }

  // 웹 검색 데이터가 없으면 원본 반환
  if (!containsWebSearchData(text)) {
    return text;
  }

  let cleanText = text;

  // 모든 패턴에 대해 제거 시도
  for (const pattern of WEB_SEARCH_PATTERNS) {
    pattern.lastIndex = 0; // 정규식 상태 초기화
    cleanText = cleanText.replace(pattern, "");
  }

  // 추가 정리: 연속된 공백, 빈 줄 등 정리
  cleanText = cleanText
    .replace(/\s+/g, " ") // 연속 공백을 하나로
    .replace(/^\s+|\s+$/g, "") // 앞뒤 공백 제거
    .replace(/\n\s*\n/g, "\n"); // 빈 줄 정리

  return cleanText;
}

/**
 * 🎯 v2.2: 스트리밍 텍스트에서 웹 검색 데이터 완전 분리
 *
 * 파싱 시도하지 않고 완전히 제거하는 방식으로 "[,,]" 문제 해결
 */
export function processStreamingText(text: string): {
  cleanText: string;
  hasWebSearchData: boolean;
  shouldIgnore: boolean; // 이 델타를 무시해야 하는지
} {
  if (!text || typeof text !== "string") {
    return {
      cleanText: text || "",
      hasWebSearchData: false,
      shouldIgnore: false,
    };
  }

  const hasWebSearchData = containsWebSearchData(text);

  if (!hasWebSearchData) {
    return {
      cleanText: text,
      hasWebSearchData: false,
      shouldIgnore: false,
    };
  }

  // 웹 검색 데이터가 포함된 경우
  const cleanText = removeWebSearchData(text);

  // 정리 후 의미있는 텍스트가 남았는지 확인
  const hasUsefulText = cleanText.trim().length > 0;

  // 웹 검색 데이터만 있고 의미있는 텍스트가 없으면 이 델타를 무시
  const shouldIgnore = !hasUsefulText;

  return {
    cleanText: cleanText,
    hasWebSearchData: true,
    shouldIgnore,
  };
}

/**
 * 🆕 텍스트에 웹 검색 결과가 포함되어 있는지 빠르게 확인
 */
export function containsPythonDict(text: string): boolean {
  return containsWebSearchData(text);
}

/**
 * 🔧 v2.1 호환: Context7 기반 실시간 스트리밍 웹 검색 결과 처리
 * 🚀 v2.2: 파싱 대신 완전 제거 방식으로 변경
 */
export function parseStreamingWebSearchResults(text: string): {
  cleanText: string;
  hasWebSearchData: boolean;
  partialResults?: WebSearchResult[];
} {
  const result = processStreamingText(text);

  // v2.2: 파싱하지 않고 완전 제거만 수행
  return {
    cleanText: result.cleanText,
    hasWebSearchData: result.hasWebSearchData,
    // partialResults는 더 이상 제공하지 않음 (별도 이벤트에서 처리)
  };
}

/**
 * 🆕 Context7 기반: JSON 배열 형태 웹 검색 결과 파싱
 */
function parseJSONArrayResults(jsonArrayStr: string): WebSearchResult[] {
  try {
    // 기본 JSON 변환 시도
    const cleanJsonStr = convertPythonToJSON(jsonArrayStr);
    const parsed = JSON.parse(cleanJsonStr);

    if (!Array.isArray(parsed)) {
      console.warn("파싱된 결과가 배열이 아님:", parsed);
      return [];
    }

    return parsed
      .filter(
        (item: any) =>
          item && item.type === "web_search_result" && item.title && item.url,
      )
      .map((item: any) => ({
        title: item.title,
        url: item.url,
        type: item.type,
        encrypted_content: item.encrypted_content,
        page_age: item.page_age,
      }));
  } catch (error) {
    console.error("JSON 배열 파싱 실패:", error, "원본:", jsonArrayStr);
    return [];
  }
}

/**
 * 🆕 파이썬 스타일을 JSON으로 변환하는 함수 (Context7 기반 견고함 개선)
 */
function convertPythonToJSON(pythonStr: string): string {
  return pythonStr
    .replace(/'/g, '"') // 작은따옴표를 큰따옴표로
    .replace(/None/g, "null") // None을 null로
    .replace(/True/g, "true") // True를 true로
    .replace(/False/g, "false"); // False를 false로
}

/**
 * 🆕 Context7 기반: 고급 파이썬 딕셔너리 파싱 (기존 개선)
 */
function parseAdvancedPythonDict(dictStr: string): Record<string, any> | null {
  try {
    // 기본 JSON 변환 시도
    const basicJsonStr = convertPythonToJSON(dictStr);
    return JSON.parse(basicJsonStr);
  } catch (error) {
    // 실패시 수동 파싱 시도 (견고한 fallback)
    try {
      const result: Record<string, any> = {};

      // 키-값 쌍 추출 정규식 (더 견고함)
      const keyValuePattern = /'([^']+)':\s*('([^']*)'|([^,}]+))/g;
      let match;

      while ((match = keyValuePattern.exec(dictStr)) !== null) {
        const key = match[1];
        let value: any;

        if (match[3] !== undefined) {
          // 문자열 값
          value = match[3];
        } else {
          // 다른 값들 (None, 숫자 등)
          const rawValue = match[4];
          if (rawValue === "None") {
            value = null;
          } else if (rawValue === "True") {
            value = true;
          } else if (rawValue === "False") {
            value = false;
          } else if (!isNaN(Number(rawValue))) {
            value = Number(rawValue);
          } else {
            value = rawValue;
          }
        }

        result[key] = value;
      }

      return Object.keys(result).length > 0 ? result : null;
    } catch (parseError) {
      console.error("수동 파싱도 실패:", parseError);
      return null;
    }
  }
}

/**
 * 🔧 Context7 기반: 통합 웹 검색 결과 감지 및 파싱
 * JSON 배열과 개별 파이썬 딕셔너리 모두 처리
 */
export function detectAndParseWebSearchResults(text: string): {
  hasWebSearchData: boolean;
  cleanText: string;
  webSearchResults: WebSearchResult[];
} {
  if (!text || typeof text !== "string") {
    return {
      hasWebSearchData: false,
      cleanText: text || "",
      webSearchResults: [],
    };
  }

  let cleanText = text;
  const webSearchResults: WebSearchResult[] = [];
  let hasWebSearchData = false;

  // 🚀 v2.2: 더 이상 파싱하지 않고 완전 제거만 수행
  hasWebSearchData = containsWebSearchData(text);
  if (hasWebSearchData) {
    cleanText = removeWebSearchData(text);
  }

  return {
    hasWebSearchData,
    cleanText: cleanText,
    webSearchResults, // 빈 배열 반환 (별도 이벤트에서 처리)
  };
}

/**
 * 🔧 v2.1 호환: AI 응답 텍스트에서 웹 검색 결과 배열을 추출함 (v2.2 개선)
 */
export function parseWebSearchResults(
  text: string,
): ParsedWebSearchResults | null {
  // v2.2: 더 이상 파싱하지 않음 (별도 이벤트에서 처리)
  return null;
}

/**
 * 🔧 v2.1 호환: 웹 검색 결과가 포함된 텍스트인지 확인함 (v2.2 개선)
 */
export function containsWebSearchResults(text: string): boolean {
  return containsWebSearchData(text);
}

/**
 * 🔧 v2.1 호환: 웹 검색 결과 부분을 텍스트에서 제거함 (v2.2 개선)
 */
export function removeWebSearchResults(text: string): string {
  return removeWebSearchData(text);
}

/**
 * ✅ v2.1 호환: chat_web_search_results 이벤트 데이터를 WebSearchResult로 변환
 */
export function convertEventDataToWebSearchResults(eventData: {
  results: Array<{
    type: string;
    title: string;
    url: string;
    content: string;
    page_age: number | null;
    metadata: {
      source: string;
      confidence: number;
    };
  }>;
}): WebSearchResult[] {
  return eventData.results.map((result) => ({
    title: result.title,
    url: result.url,
    type: result.type,
    encrypted_content: result.content,
    page_age: result.page_age,
  }));
}
