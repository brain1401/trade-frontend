import type { CountryInfo } from "./base";

/**
 * 무역 통계 관련 타입 정의 (API v2.4)
 *
 * HS Code 분석 및 일반 무역 정보에 포함되는 통계 데이터 타입
 */

/**
 * 기본 무역 통계 타입
 */
export type TradeStatistics = {
  /** 관련 HS Code */
  hsCode: string;
  /** 통계 기간 */
  period: string;
  /** 수출 금액 (달러) */
  exportValue: number;
  /** 수입 금액 (달러) */
  importValue: number;
  /** 수출 증가율 (%) */
  exportGrowthRate: number;
  /** 수입 증가율 (%) */
  importGrowthRate: number;
  /** 주요 수출 대상국 */
  mainExportCountries: CountryInfo[];
  /** 주요 수입 원산지국 */
  mainImportCountries: CountryInfo[];
};

/**
 * 상세 무역 통계 타입 (API 응답용)
 */
export type DetailedTradeStatistics = {
  /** HS Code */
  hsCode: string;
  /** 품목명 */
  itemName: string;
  /** 통계 기간 */
  period: {
    startDate: string;
    endDate: string;
    type: "월간" | "분기" | "연간";
  };
  /** 수출 통계 */
  exportStats: {
    /** 총 수출액 (달러) */
    totalValue: number;
    /** 수출 중량 (톤) */
    totalWeight: number;
    /** 수출 단가 (달러/톤) */
    unitPrice: number;
    /** 전년 동기 대비 증가율 (%) */
    growthRate: number;
    /** 전체 수출에서 차지하는 비중 (%) */
    shareOfTotal: number;
  };
  /** 수입 통계 */
  importStats: {
    totalValue: number;
    totalWeight: number;
    unitPrice: number;
    growthRate: number;
    shareOfTotal: number;
  };
  /** 무역수지 */
  tradeBalance: {
    /** 무역수지 (달러) */
    balance: number;
    /** 무역수지 증감 (달러) */
    balanceChange: number;
    /** 수출입비율 */
    exportImportRatio: number;
  };
};

/**
 * 국가별 무역 통계 타입
 */
export type CountryTradeStatistics = {
  /** 국가 정보 */
  country: CountryInfo;
  /** 수출 통계 */
  exportStats: {
    /** 수출액 (달러) */
    value: number;
    /** 수출 비중 (%) */
    share: number;
    /** 증가율 (%) */
    growthRate: number;
    /** 주요 수출 품목 */
    topItems: Array<{
      hsCode: string;
      itemName: string;
      value: number;
      share: number;
    }>;
  };
  /** 수입 통계 */
  importStats: {
    value: number;
    share: number;
    growthRate: number;
    topItems: Array<{
      hsCode: string;
      itemName: string;
      value: number;
      share: number;
    }>;
  };
  /** 무역수지 */
  tradeBalance: number;
  /** 관세율 정보 */
  tariffInfo?: {
    /** 평균 관세율 (%) */
    averageRate: string;
    /** 적용 협정 */
    applicableAgreements: string[];
  };
};

/**
 * 시계열 무역 통계 타입
 */
export type TimeSeriesTradeStats = {
  /** HS Code */
  hsCode: string;
  /** 데이터 포인트 */
  dataPoints: Array<{
    /** 기간 (ISO 8601) */
    period: string;
    /** 수출액 */
    exportValue: number;
    /** 수입액 */
    importValue: number;
    /** 무역수지 */
    tradeBalance: number;
    /** 수출 증가율 */
    exportGrowthRate?: number;
    /** 수입 증가율 */
    importGrowthRate?: number;
  }>;
  /** 추세 분석 */
  trendAnalysis: {
    /** 수출 추세 */
    exportTrend: "증가" | "감소" | "안정" | "변동";
    /** 수입 추세 */
    importTrend: "증가" | "감소" | "안정" | "변동";
    /** 계절성 여부 */
    seasonality: boolean;
    /** 주요 변동 요인 */
    majorFactors?: string[];
  };
};

/**
 * 무역 통계 요약 타입
 */
export type TradeStatisticsSummary = {
  /** 통계 기간 */
  period: string;
  /** 전체 무역 규모 */
  overallTrade: {
    /** 총 수출액 */
    totalExport: number;
    /** 총 수입액 */
    totalImport: number;
    /** 무역수지 */
    tradeBalance: number;
    /** 무역규모 (수출+수입) */
    tradeVolume: number;
  };
  /** 성장률 */
  growthRates: {
    /** 수출 증가율 */
    exportGrowth: number;
    /** 수입 증가율 */
    importGrowth: number;
    /** 무역규모 증가율 */
    volumeGrowth: number;
  };
  /** 상위 품목 (수출) */
  topExportItems: Array<{
    hsCode: string;
    itemName: string;
    value: number;
    share: number;
    growthRate: number;
  }>;
  /** 상위 품목 (수입) */
  topImportItems: Array<{
    hsCode: string;
    itemName: string;
    value: number;
    share: number;
    growthRate: number;
  }>;
  /** 주요 교역국 */
  majorTradingPartners: CountryTradeStatistics[];
};

/**
 * 무역 통계 비교 분석 타입
 */
export type TradeStatisticsComparison = {
  /** 비교 대상 HS Code들 */
  hsCodes: string[];
  /** 비교 기간 */
  period: string;
  /** 비교 결과 */
  comparison: {
    /** 수출 규모 순위 */
    exportRanking: Array<{
      rank: number;
      hsCode: string;
      itemName: string;
      value: number;
    }>;
    /** 수입 규모 순위 */
    importRanking: Array<{
      rank: number;
      hsCode: string;
      itemName: string;
      value: number;
    }>;
    /** 성장률 비교 */
    growthComparison: Array<{
      hsCode: string;
      exportGrowth: number;
      importGrowth: number;
      competitiveness: "우수" | "보통" | "부진";
    }>;
  };
  /** 시장 분석 */
  marketAnalysis: {
    /** 경쟁력 있는 품목 */
    competitiveItems: string[];
    /** 성장 잠재력 있는 품목 */
    growthPotentialItems: string[];
    /** 주의 필요 품목 */
    cautionItems: string[];
  };
};

/**
 * 무역 예측 분석 타입
 */
export type TradeForecast = {
  /** 예측 대상 HS Code */
  hsCode: string;
  /** 예측 기간 */
  forecastPeriod: {
    startDate: string;
    endDate: string;
  };
  /** 예측 결과 */
  predictions: Array<{
    /** 예측 기간 (ISO 8601) */
    period: string;
    /** 예상 수출액 */
    predictedExport: number;
    /** 예상 수입액 */
    predictedImport: number;
    /** 신뢰도 (%) */
    confidence: number;
  }>;
  /** 예측 근거 */
  forecastBasis: {
    /** 사용된 모델 */
    model: string;
    /** 주요 영향 요인 */
    keyFactors: string[];
    /** 가정 사항 */
    assumptions: string[];
  };
};
