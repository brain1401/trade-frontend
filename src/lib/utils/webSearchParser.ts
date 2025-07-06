import type {
  WebSearchResult,
  ParsedWebSearchResults,
} from "@/lib/api/chat/types";

/**
 * 🔧 v2.1: 웹 검색 결과 파싱 유틸리티 (개선된 버전)
 *
 * Context7 기반 최적화:
 * - JSON 배열 형태 웹 검색 결과 처리 추가
 * - 단일 파이썬 딕셔너리와 JSON 배열 모두 지원
 * - 견고한 에러 핸들링 및 fallback 메커니즘
 */

/**
 * 🆕 JSON 배열 형태의 웹 검색 결과를 감지하는 정규식
 * 예시: [{'encrypted_content': '...', 'type': 'web_search_result', ...}, {...}]
 */
const JSON_ARRAY_PATTERN =
  /\[\s*\{[^[\]]*'type':\s*'web_search_result'[^[\]]*\}\s*(?:,\s*\{[^[\]]*'type':\s*'web_search_result'[^[\]]*\}\s*)*\]/g;

/**
 * 🆕 파이썬 딕셔너리 형태의 웹 검색 결과를 감지하는 정규식 (기존)
 * 예시: {'encrypted_content': '...', 'page_age': None, 'title': '...', 'type': 'web_search_result', 'url': '...'}
 */
const PYTHON_DICT_PATTERN =
  /\{[^{}]*'encrypted_content':[^{}]*'type':\s*'web_search_result'[^{}]*'url':[^{}]*\}/g;

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

  // 1. JSON 배열 형태 처리 (우선순위 높음)
  const jsonArrayMatches = text.match(JSON_ARRAY_PATTERN);
  if (jsonArrayMatches && jsonArrayMatches.length > 0) {
    console.log(
      "🔍 JSON 배열 형태 웹 검색 결과 감지:",
      jsonArrayMatches.length,
      "개",
    );

    for (const match of jsonArrayMatches) {
      const parsed = parseJSONArrayResults(match);
      if (parsed.length > 0) {
        webSearchResults.push(...parsed);
        hasWebSearchData = true;

        // 원본 텍스트에서 제거
        cleanText = cleanText.replace(match, "").replace(/\s+/g, " ").trim();
        console.log("✅ JSON 배열에서", parsed.length, "개 결과 파싱 완료");
      }
    }
  }

  // 2. 개별 파이썬 딕셔너리 형태 처리 (기존 방식)
  const pythonDictMatches = cleanText.match(PYTHON_DICT_PATTERN);
  if (pythonDictMatches && pythonDictMatches.length > 0) {
    console.log(
      "🔍 파이썬 딕셔너리 형태 웹 검색 결과 감지:",
      pythonDictMatches.length,
      "개",
    );

    for (const match of pythonDictMatches) {
      const parsed = parseAdvancedPythonDict(match);

      if (
        parsed &&
        parsed.type === "web_search_result" &&
        parsed.title &&
        parsed.url
      ) {
        webSearchResults.push({
          title: parsed.title,
          url: parsed.url,
          type: parsed.type,
          encrypted_content: parsed.encrypted_content,
          page_age: parsed.page_age,
        });
        hasWebSearchData = true;

        // 원본 텍스트에서 제거
        cleanText = cleanText.replace(match, "").replace(/\s+/g, " ").trim();
      }
    }
  }

  return {
    hasWebSearchData,
    cleanText: cleanText,
    webSearchResults,
  };
}

/**
 * 🆕 텍스트에 웹 검색 결과가 포함되어 있는지 빠르게 확인
 */
export function containsPythonDict(text: string): boolean {
  if (!text || typeof text !== "string") return false;
  // JSON 배열 또는 파이썬 딕셔너리 패턴 확인
  return JSON_ARRAY_PATTERN.test(text) || PYTHON_DICT_PATTERN.test(text);
}

/**
 * 🔧 v2.1 호환: Context7 기반 실시간 스트리밍 웹 검색 결과 처리
 * JSON 배열과 파이썬 딕셔너리 모두 지원하는 통합 파서
 */
export function parseStreamingWebSearchResults(text: string): {
  cleanText: string;
  hasWebSearchData: boolean;
  partialResults?: WebSearchResult[];
} {
  // 🔧 성능 최적화: 웹 검색 데이터가 없다면 원본 텍스트 그대로 반환
  if (!containsPythonDict(text)) {
    return {
      cleanText: text || "",
      hasWebSearchData: false,
    };
  }

  // 🆕 Context7 기반: 통합 웹 검색 결과 파싱
  const result = detectAndParseWebSearchResults(text);

  if (result.hasWebSearchData) {
    console.log(
      "🎯 통합 파서 성공:",
      result.webSearchResults.length,
      "개 결과 파싱",
    );
    return {
      cleanText: result.cleanText,
      hasWebSearchData: true,
      partialResults: result.webSearchResults,
    };
  }

  // fallback: 원본 텍스트 반환
  return { cleanText: text || "", hasWebSearchData: false };
}

/**
 * 🔧 v2.1 호환: AI 응답 텍스트에서 웹 검색 결과 배열을 추출함
 */
export function parseWebSearchResults(
  text: string,
): ParsedWebSearchResults | null {
  const result = detectAndParseWebSearchResults(text);

  if (result.hasWebSearchData && result.webSearchResults.length > 0) {
    return {
      results: result.webSearchResults,
      count: result.webSearchResults.length,
    };
  }

  return null;
}

/**
 * 🔧 v2.1 호환: 웹 검색 결과가 포함된 텍스트인지 확인함
 */
export function containsWebSearchResults(text: string): boolean {
  const result = detectAndParseWebSearchResults(text);
  return result.hasWebSearchData;
}

/**
 * 🔧 v2.1 호환: 웹 검색 결과 부분을 텍스트에서 제거함
 */
export function removeWebSearchResults(text: string): string {
  const result = detectAndParseWebSearchResults(text);
  return result.cleanText;
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
