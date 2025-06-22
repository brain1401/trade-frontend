import type { ExchangeRate } from "@/types/base";
import { CURRENCIES } from "@/data/common";

/**
 * 환율 히스토리 데이터의 구조
 *
 * 특정 통화의 일별 환율 변동 추이를 추적하기 위한 데이터 타입입니다.
 */
export type ExchangeRateHistory = {
  /** 환율 기준 날짜 (YYYY-MM-DD 형식) */
  date: string;
  /** 해당 날짜의 환율 */
  rate: number;
};

/**
 * 국가 정보가 포함된 확장 환율 타입
 *
 * 기본 환율 정보에 국가 코드, 국가명, 국기 이모지, 인기 여부 등의
 * 추가 정보를 포함하는 확장된 환율 데이터 구조입니다.
 */
export type EnhancedExchangeRate = ExchangeRate & {
  /** ISO 국가 코드 (예: "US", "JP") */
  countryCode: string;
  /** 국가명 (한글) */
  countryName: string;
  /** 국기 이모지 */
  flag: string;
  /** 주요 통화 여부 */
  isPopular: boolean;
};

/**
 * 주요 4개 통화의 환율 정보 Mock 데이터
 *
 * USD, EUR, JPY, CNY 등 주요 거래 통화들의 현재 환율 정보를 제공합니다.
 * 실시간 환율 API 대신 사용되는 테스트용 데이터입니다.
 *
 * @example
 * ```typescript
 * const usdRate = mockExchangeRates.find(rate => rate.currency === "USD");
 * console.log(`USD 환율: ${usdRate?.rate}원`);
 * ```
 */
export const mockExchangeRates: ExchangeRate[] = [
  {
    currency: "USD",
    currencyName: CURRENCIES.USD.name,
    rate: 1359.4,
    change: -2.78,
    symbol: CURRENCIES.USD.symbol,
    lastUpdated: "2025-01-12T09:00:00Z",
  },
  {
    currency: "EUR",
    currencyName: CURRENCIES.EUR.name,
    rate: 1421.5,
    change: -1.52,
    symbol: CURRENCIES.EUR.symbol,
    lastUpdated: "2025-01-12T09:00:00Z",
  },
  {
    currency: "JPY",
    currencyName: CURRENCIES.JPY.name,
    rate: 9.43,
    change: -0.08,
    symbol: CURRENCIES.JPY.symbol,
    lastUpdated: "2025-01-12T09:00:00Z",
  },
  {
    currency: "CNY",
    currencyName: CURRENCIES.CNY.name,
    rate: 188.2,
    change: -0.85,
    symbol: CURRENCIES.CNY.symbol,
    lastUpdated: "2025-01-12T09:00:00Z",
  },
];

/**
 * 국가 정보가 포함된 확장 환율 데이터
 *
 * 기본 환율 정보에 국가별 추가 정보(국기, 국가명 등)를 포함한
 * 확장된 환율 데이터 목록입니다.
 *
 * @example
 * ```typescript
 * const popularRates = mockGlobalExchangeRates.filter(rate => rate.isPopular);
 * popularRates.forEach(rate => {
 *   console.log(`${rate.flag} ${rate.countryName}: ${rate.rate}원`);
 * });
 * ```
 */
export const mockGlobalExchangeRates: EnhancedExchangeRate[] = [
  {
    ...mockExchangeRates[0],
    countryCode: "US",
    countryName: "미국",
    flag: "🇺🇸",
    isPopular: true,
  },
  {
    ...mockExchangeRates[1],
    countryCode: "EU",
    countryName: "유럽연합",
    flag: "🇪🇺",
    isPopular: true,
  },
  {
    ...mockExchangeRates[2],
    countryCode: "JP",
    countryName: "일본",
    flag: "🇯🇵",
    isPopular: true,
  },
  {
    ...mockExchangeRates[3],
    countryCode: "CN",
    countryName: "중국",
    flag: "🇨🇳",
    isPopular: true,
  },
  {
    currency: "GBP",
    currencyName: CURRENCIES.GBP.name,
    rate: 1702.3,
    change: -2.1,
    symbol: CURRENCIES.GBP.symbol,
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "GB",
    countryName: "영국",
    flag: "🇬🇧",
    isPopular: true,
  },
];

/**
 * 환율 관련 뉴스 Mock 데이터
 *
 * 중앙은행 정책, 금리 변동 등 환율에 영향을 미치는 주요 뉴스들을
 * 모은 데이터입니다.
 */
export const mockExchangeRateNews = [
  {
    id: "exr-news-001",
    title: "미국 연준 기준금리 동결, 달러 환율 하락세",
    summary:
      "연방준비제도(Fed)가 기준금리를 현 수준에서 유지하기로 결정하면서 달러 대비 원화 환율이 하락했습니다.",
    source: "한국은행",
    publishedAt: "2025-01-12T08:30:00Z",
    category: "monetary",
    impact: "medium",
  },
  {
    id: "exr-news-002",
    title: "유럽중앙은행 금리인하 시사, 유로 약세 지속",
    summary:
      "유럽중앙은행(ECB)이 경기 부양을 위한 추가 금리인하 가능성을 시사하며 유로화 환율이 약세를 보이고 있습니다.",
    source: "연합뉴스",
    publishedAt: "2025-01-11T14:20:00Z",
    category: "monetary",
    impact: "high",
  },
];

/**
 * 특정 통화의 환율 정보 조회
 *
 * 통화 코드를 기준으로 해당 통화의 환율 정보를 검색하여 반환합니다.
 *
 * @param currency - 조회할 통화 코드 (예: "USD", "EUR")
 * @returns 해당 통화의 환율 정보, 없으면 undefined
 *
 * @example
 * ```typescript
 * const usdRate = getExchangeRateByCurrency("USD");
 * if (usdRate) {
 *   console.log(`USD 변동: ${usdRate.change > 0 ? '상승' : '하락'}`);
 * }
 * ```
 */
export const getExchangeRateByCurrency = (
  currency: string,
): ExchangeRate | undefined => {
  return mockExchangeRates.find((rate) => rate.currency === currency);
};

/**
 * 주요 통화 목록 조회
 *
 * 거래량이 많고 중요한 주요 통화들만 필터링하여 반환합니다.
 * 메인 대시보드나 요약 화면에서 핵심 환율 정보를 표시할 때 사용됩니다.
 *
 * @returns 주요 통화들의 확장 환율 정보 배열
 *
 * @example
 * ```typescript
 * const majorCurrencies = getPopularCurrencies();
 * console.log(`주요 통화 ${majorCurrencies.length}개 표시`);
 * ```
 */
export const getPopularCurrencies = (): EnhancedExchangeRate[] => {
  return mockGlobalExchangeRates.filter((rate) => rate.isPopular);
};

/**
 * 환율 검색 함수
 *
 * 통화 코드, 통화명, 국가명을 기준으로 환율 정보를 검색합니다.
 * 사용자가 특정 통화를 빠르게 찾을 수 있도록 도와줍니다.
 *
 * @param query - 검색어 (통화 코드, 통화명, 국가명 모두 검색 가능)
 * @returns 검색 조건에 일치하는 환율 정보 배열
 *
 * @example
 * ```typescript
 * const results = searchExchangeRates("달러");
 * // "USD", "달러", "미국" 등을 포함한 모든 관련 결과 반환
 * ```
 *
 * @example 빈 검색어 처리
 * ```typescript
 * const allRates = searchExchangeRates("");
 * // 빈 검색어인 경우 전체 환율 목록 반환
 * ```
 */
export const searchExchangeRates = (query: string): EnhancedExchangeRate[] => {
  if (!query.trim()) return mockGlobalExchangeRates;

  const searchTerm = query.toLowerCase();
  return mockGlobalExchangeRates.filter(
    (rate) =>
      rate.currency.toLowerCase().includes(searchTerm) ||
      rate.currencyName.toLowerCase().includes(searchTerm) ||
      rate.countryName.toLowerCase().includes(searchTerm),
  );
};
