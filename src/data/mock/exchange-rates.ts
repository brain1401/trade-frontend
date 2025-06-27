import { CURRENCIES } from "@/data/common";

/**
 * v6.1 API 명세서 기준, 환율 정보 타입
 */
export type ExchangeRate = {
  /** 통화 코드 (e.g., "USD") */
  currencyCode: string;
  /** 통화명 (e.g., "미국 달러") */
  currencyName: string;
  /** 현재 환율 */
  exchangeRate: number;
  /** 전일 대비 등락률 */
  changeRate: number;
  /** 전일 대비 등락액 */
  changeAmount: number;
  /** 마지막 업데이트 시간 (ISO 8601) */
  lastUpdated: string;
};

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
 * v6.1 API 명세서 기준, 특정 통화 상세 환율 정보 타입
 */
export type DetailedExchangeRate = ExchangeRate & {
  /** 당일 고가 */
  todayHigh: number;
  /** 당일 저가 */
  todayLow: number;
  /** 주간 고가 */
  weekHigh: number;
  /** 주간 저가 */
  weekLow: number;
  /** 월간 고가 */
  monthHigh: number;
  /** 월간 저가 */
  monthLow: number;
  /** 변동 추이 (UP, DOWN, SAME) */
  trend: "UP" | "DOWN" | "SAME";
  /** 과거 데이터 */
  historicalData: {
    date: string;
    rate: number;
  }[];
};

/**
 * 주요 통화의 환율 정보 Mock 데이터 (v6.1)
 */
export const mockExchangeRates: ExchangeRate[] = [
  {
    currencyCode: "USD",
    currencyName: "미국 달러",
    exchangeRate: 1328.5,
    changeRate: -0.75,
    changeAmount: -10.0,
    lastUpdated: "2024-01-16T11:30:00Z",
  },
  {
    currencyCode: "EUR",
    currencyName: "유로",
    exchangeRate: 1445.2,
    changeRate: 0.45,
    changeAmount: 6.5,
    lastUpdated: "2024-01-16T11:30:00Z",
  },
  {
    currencyCode: "JPY",
    currencyName: "일본 엔 (100엔)",
    exchangeRate: 895.3,
    changeRate: -0.25,
    changeAmount: -2.2,
    lastUpdated: "2024-01-16T11:30:00Z",
  },
  {
    currencyCode: "CNY",
    currencyName: "중국 위안",
    exchangeRate: 184.75,
    changeRate: 0.15,
    changeAmount: 0.28,
    lastUpdated: "2024-01-16T11:30:00Z",
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
 *   console.log(`${rate.flag} ${rate.countryName}: ${rate.exchangeRate}원`);
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
    currencyCode: "GBP",
    currencyName: CURRENCIES.GBP.name,
    exchangeRate: 1702.3,
    changeRate: -2.1,
    changeAmount: -3.5,
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "GB",
    countryName: "영국",
    flag: "🇬🇧",
    isPopular: true,
  },
];

/**
 * USD 상세 환율 정보 Mock 데이터 (v6.1)
 */
export const mockDetailedUSDExchangeRate: DetailedExchangeRate = {
  currencyCode: "USD",
  currencyName: "미국 달러",
  exchangeRate: 1328.5,
  changeRate: -0.75,
  changeAmount: -10.0,
  todayHigh: 1335.0,
  todayLow: 1325.0,
  weekHigh: 1340.0,
  weekLow: 1315.0,
  monthHigh: 1365.0,
  monthLow: 1310.0,
  lastUpdated: "2024-01-16T11:30:00Z",
  trend: "DOWN",
  historicalData: [
    {
      date: "2024-01-15",
      rate: 1338.5,
    },
    {
      date: "2024-01-14",
      rate: 1342.0,
    },
  ],
};

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
 *   console.log(`USD 변동: ${usdRate.changeRate > 0 ? '상승' : '하락'}`);
 * }
 * ```
 */
export const getExchangeRateByCurrency = (
  currency: string,
): ExchangeRate | undefined => {
  return mockExchangeRates.find((rate) => rate.currencyCode === currency);
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
      rate.currencyCode.toLowerCase().includes(searchTerm) ||
      rate.currencyName.toLowerCase().includes(searchTerm) ||
      rate.countryName.toLowerCase().includes(searchTerm),
  );
};
