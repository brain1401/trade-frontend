/**
 * 환율 정보 타입
 */
export type ExchangeRate = {
  /** 통화 코드 */
  currencyCode: string;
  /** 통화명 */
  currencyName: string;
  /** 환율 */
  exchangeRate: number;
  /** 변동률 (%) */
  changeRate: number;
  /** 변동액 */
  changeAmount: number;
  /** 마지막 업데이트 시간 */
  lastUpdated: string;
};

/**
 * 환율 목록 응답 타입
 */
export type ExchangeRatesResponse = {
  /** 환율 정보 목록 */
  exchangeRates: ExchangeRate[];
  /** 마지막 업데이트 시간 */
  lastUpdated: string;
  /** 데이터 소스 정보 */
  source: {
    provider: string;
    updateFrequency: string;
    disclaimer: string;
  };
};

/**
 * 특정 통화 상세 환율 정보 타입
 */
export type DetailedExchangeRate = ExchangeRate & {
  /** 당일 최고가 */
  todayHigh: number;
  /** 당일 최저가 */
  todayLow: number;
  /** 주간 최고가 */
  weekHigh: number;
  /** 주간 최저가 */
  weekLow: number;
  /** 월간 최고가 */
  monthHigh: number;
  /** 월간 최저가 */
  monthLow: number;
  /** 추세 */
  trend: "UP" | "DOWN" | "STABLE";
  /** 이력 데이터 */
  historicalData: Array<{
    date: string;
    rate: number;
  }>;
};
