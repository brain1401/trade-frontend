/**
 * URL 쿼리 파라미터를 안전하게 검증하는 유틸리티 함수들
 *
 * 이 모듈은 URL에서 받은 원시 쿼리 파라미터 값들을 타입 안전하게 검증하고
 * 필요한 타입으로 변환하는 기능을 제공합니다.
 *
 * @example 기본 사용법
 * ```typescript
 * const validatedParams = validateQueryParams(rawSearch, {
 *   q: 'string',
 *   page: 'number',
 *   category: 'string'
 * });
 * ```
 */

// =============================================================================
// 🔧 TYPE DEFINITIONS
// =============================================================================

/**
 * 원시 쿼리 파라미터 타입 (URL에서 받는 raw 데이터)
 */
export type RawQueryParams = {
  [key: string]: unknown;
};

/**
 * 지원하는 검증 타입들
 */
export type ValidationSchema = {
  [key: string]: "string" | "number" | "boolean";
};

/**
 * 검증된 쿼리 파라미터 타입
 */
export type ValidatedParams<T extends ValidationSchema> = {
  [K in keyof T]: T[K] extends "string"
    ? string | undefined
    : T[K] extends "number"
      ? number | undefined
      : T[K] extends "boolean"
        ? boolean | undefined
        : unknown;
};

// =============================================================================
// 🔍 VALIDATION FUNCTIONS
// =============================================================================

/**
 * 문자열 타입 검증 함수
 *
 * @param value - 검증할 값
 * @returns 유효한 문자열이면 해당 값, 아니면 undefined
 *
 * @example
 * ```typescript
 * const searchQuery = validateStringParam(rawParams.q);
 * // rawParams.q가 문자열이면 해당 값, 아니면 undefined 반환
 * ```
 */
export function validateStringParam(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/**
 * 숫자 타입 검증 함수
 *
 * @param value - 검증할 값
 * @returns 유효한 숫자이면 해당 값, 아니면 undefined
 *
 * @example
 * ```typescript
 * const pageNumber = validateNumberParam(rawParams.page);
 * // rawParams.page가 숫자로 변환 가능하면 숫자, 아니면 undefined 반환
 * ```
 */
export function validateNumberParam(value: unknown): number | undefined {
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return !isNaN(parsed) ? parsed : undefined;
  }
  return undefined;
}

/**
 * 불린 타입 검증 함수
 *
 * @param value - 검증할 값
 * @returns 유효한 불린값이면 해당 값, 아니면 undefined
 *
 * @example
 * ```typescript
 * const isActive = validateBooleanParam(rawParams.active);
 * // rawParams.active가 "true"/"false" 또는 boolean이면 변환된 값, 아니면 undefined
 * ```
 */
export function validateBooleanParam(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return undefined;
}

// =============================================================================
// 🎯 MAIN VALIDATION FUNCTION
// =============================================================================

/**
 * 스키마 기반 쿼리 파라미터 검증 함수
 *
 * 정의된 스키마를 기반으로 원시 쿼리 파라미터들을 일괄적으로 검증합니다.
 *
 * @param rawParams - 원시 쿼리 파라미터 객체
 * @param schema - 검증 스키마 정의
 * @returns 검증된 파라미터 객체
 *
 * @example 검색 파라미터 검증
 * ```typescript
 * const searchParams = validateQueryParams(rawSearch, {
 *   q: 'string',
 *   category: 'string',
 *   period: 'string'
 * });
 * // 타입: { q: string | undefined, category: string | undefined, period: string | undefined }
 * ```
 *
 * @example 페이지네이션 파라미터 검증
 * ```typescript
 * const paginationParams = validateQueryParams(rawSearch, {
 *   page: 'number',
 *   limit: 'number',
 *   sortBy: 'string',
 *   ascending: 'boolean'
 * });
 * ```
 */
export function validateQueryParams<T extends ValidationSchema>(
  rawParams: RawQueryParams,
  schema: T,
): ValidatedParams<T> {
  const result = {} as ValidatedParams<T>;

  for (const [key, type] of Object.entries(schema)) {
    const rawValue = rawParams[key];

    switch (type) {
      case "string":
        (result as any)[key] = validateStringParam(rawValue);
        break;
      case "number":
        (result as any)[key] = validateNumberParam(rawValue);
        break;
      case "boolean":
        (result as any)[key] = validateBooleanParam(rawValue);
        break;
      default:
        (result as any)[key] = undefined;
    }
  }

  return result;
}

// =============================================================================
// 📋 PREDEFINED SCHEMAS
// =============================================================================

/**
 * 검색 관련 쿼리 파라미터 스키마 (재사용 가능)
 */
export const SEARCH_PARAMS_SCHEMA = {
  q: "string" as const,
  category: "string" as const,
  period: "string" as const,
};

/**
 * 페이지네이션 관련 쿼리 파라미터 스키마 (재사용 가능)
 */
export const PAGINATION_PARAMS_SCHEMA = {
  page: "number" as const,
  limit: "number" as const,
  offset: "number" as const,
};

/**
 * 정렬 관련 쿼리 파라미터 스키마 (재사용 가능)
 */
export const SORT_PARAMS_SCHEMA = {
  sortBy: "string" as const,
  sortOrder: "string" as const,
  ascending: "boolean" as const,
};

// =============================================================================
// 🔄 CONVENIENCE VALIDATORS
// =============================================================================

/**
 * 일반적인 검색 파라미터를 빠르게 검증하는 편의 함수
 *
 * @param rawParams - 원시 쿼리 파라미터
 * @returns 검증된 검색 파라미터
 *
 * @example
 * ```typescript
 * const searchParams = validateSearchParams(rawUrlParams);
 * // { q: string | undefined, category: string | undefined, period: string | undefined }
 * ```
 */
export const validateSearchParams = (rawParams: RawQueryParams) =>
  validateQueryParams(rawParams, SEARCH_PARAMS_SCHEMA);

/**
 * 일반적인 페이지네이션 파라미터를 빠르게 검증하는 편의 함수
 *
 * @param rawParams - 원시 쿼리 파라미터
 * @returns 검증된 페이지네이션 파라미터
 *
 * @example
 * ```typescript
 * const paginationParams = validatePaginationParams(rawUrlParams);
 * // { page: number | undefined, limit: number | undefined, offset: number | undefined }
 * ```
 */
export const validatePaginationParams = (rawParams: RawQueryParams) =>
  validateQueryParams(rawParams, PAGINATION_PARAMS_SCHEMA);

/**
 * 일반적인 정렬 파라미터를 빠르게 검증하는 편의 함수
 *
 * @param rawParams - 원시 쿼리 파라미터
 * @returns 검증된 정렬 파라미터
 *
 * @example
 * ```typescript
 * const sortParams = validateSortParams(rawUrlParams);
 * // { sortBy: string | undefined, sortOrder: string | undefined, ascending: boolean | undefined }
 * ```
 */
export const validateSortParams = (rawParams: RawQueryParams) =>
  validateQueryParams(rawParams, SORT_PARAMS_SCHEMA);
