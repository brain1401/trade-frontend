/**
 * 관세청 API 연동 관련 함수 모음
 *
 * 화물 진행정보, 무역통계, 환율정보 등 관세청 공개 API와 연동
 * 스프링부트 서버의 /api/v1/customs/* 엔드포인트를 통해 접근
 *
 * @module CustomsApi
 * @since 1.0.0
 */

import { apiClient, type ApiResponse, API_ENDPOINTS } from "./client";

/**
 * 화물 진행정보 조회 응답 데이터 타입
 */
export type CargoProgressResponse = {
  /** 화물관리번호 */
  cargoNumber: string;
  /** 현재 통관 단계 */
  currentStage:
    | "ARRIVAL"
    | "INSPECTION"
    | "CLEARANCE"
    | "RELEASED"
    | "DELIVERED";
  /** 진행률 (0-100) */
  progress: number;
  /** 예상 완료 시간 */
  estimatedCompletion: string;
  /** 화물 기본 정보 */
  cargoInfo: {
    /** 출발지 */
    origin: string;
    /** 도착지 */
    destination: string;
    /** 물품명 */
    productName: string;
    /** 수량 */
    quantity: string;
    /** 중량 */
    weight: string;
  };
  /** 통관 단계별 상세 정보 */
  stages: Array<{
    stage: string;
    status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
    completedAt?: string;
    description: string;
    location?: string;
  }>;
  /** 필요 조치사항 */
  requiredActions?: Array<{
    action: string;
    deadline?: string;
    description: string;
  }>;
};

/**
 * 무역통계 조회 요청 데이터 타입
 */
export type TradeStatisticsRequest = {
  /** 조회 시작일 (YYYY-MM-DD) */
  startDate: string;
  /** 조회 종료일 (YYYY-MM-DD) */
  endDate: string;
  /** HS Code (선택적) */
  hsCode?: string;
  /** 국가코드 (선택적) */
  countryCode?: string;
  /** 수출입 구분 */
  tradeType: "EXPORT" | "IMPORT" | "ALL";
};

/**
 * 무역통계 조회 응답 데이터 타입
 */
export type TradeStatisticsResponse = {
  /** 조회 기간 */
  period: {
    startDate: string;
    endDate: string;
  };
  /** 총 무역액 */
  totalTradeValue: number;
  /** 수출액 */
  exportValue: number;
  /** 수입액 */
  importValue: number;
  /** 무역수지 */
  tradeBalance: number;
  /** 품목별 통계 */
  itemStats: Array<{
    hsCode: string;
    itemName: string;
    tradeValue: number;
    quantity: number;
    weight: number;
    rank: number;
  }>;
  /** 국가별 통계 */
  countryStats: Array<{
    countryCode: string;
    countryName: string;
    tradeValue: number;
    percentage: number;
    rank: number;
  }>;
};

/**
 * 환율정보 조회 응답 데이터 타입
 */
export type ExchangeRateResponse = {
  /** 기준일 */
  baseDate: string;
  /** 통화별 환율 정보 */
  rates: Array<{
    /** 통화코드 */
    currencyCode: string;
    /** 통화명 */
    currencyName: string;
    /** 매매기준율 */
    basicRate: number;
    /** 현금살때 */
    cashBuyingRate: number;
    /** 현금팔때 */
    cashSellingRate: number;
    /** 송금보낼때 */
    remittanceRate: number;
    /** 전일대비 변동률 */
    changeRate: number;
    /** 변동 방향 */
    changeDirection: "UP" | "DOWN" | "SAME";
  }>;
};

/**
 * 화물 진행정보 조회 API 함수
 *
 * 화물관리번호 또는 B/L번호로 수입화물의 통관 진행정보를 조회함
 *
 * @param cargoNumber - 화물관리번호 또는 B/L번호
 * @returns 화물 진행정보
 *
 * @example
 * ```typescript
 * const result = await getCargoProgress("24012345678901");
 * if (result.success) {
 *   console.log("현재 단계:", result.data.currentStage);
 *   console.log("진행률:", result.data.progress + "%");
 * }
 * ```
 */
export const getCargoProgress = async (
  cargoNumber: string,
): Promise<ApiResponse<CargoProgressResponse>> => {
  const response = await apiClient.get<ApiResponse<CargoProgressResponse>>(
    `${API_ENDPOINTS.CUSTOMS.CARGO_PROGRESS}/${cargoNumber}`,
  );
  return response.data;
};

/**
 * 무역통계 조회 API 함수
 *
 * 지정된 기간의 무역통계 데이터를 품목별, 국가별로 조회함
 *
 * @param requestData - 무역통계 조회 요청 데이터
 * @returns 무역통계 데이터
 *
 * @example
 * ```typescript
 * const result = await getTradeStatistics({
 *   startDate: "2024-01-01",
 *   endDate: "2024-12-31",
 *   hsCode: "8517",
 *   tradeType: "IMPORT"
 * });
 *
 * if (result.success) {
 *   console.log("총 수입액:", result.data.importValue);
 * }
 * ```
 */
export const getTradeStatistics = async (
  requestData: TradeStatisticsRequest,
): Promise<ApiResponse<TradeStatisticsResponse>> => {
  const response = await apiClient.post<ApiResponse<TradeStatisticsResponse>>(
    API_ENDPOINTS.CUSTOMS.TRADE_STATISTICS,
    requestData,
  );
  return response.data;
};

/**
 * 환율정보 조회 API 함수
 *
 * 관세청 고시 기준환율 정보를 조회함
 *
 * @param baseDate - 기준일 (YYYY-MM-DD), 미지정 시 최신일
 * @returns 환율정보
 *
 * @example
 * ```typescript
 * const result = await getExchangeRates("2024-01-15");
 * if (result.success) {
 *   const usdRate = result.data.rates.find(r => r.currencyCode === "USD");
 *   console.log("USD 환율:", usdRate?.basicRate);
 * }
 * ```
 */
export const getExchangeRates = async (
  baseDate?: string,
): Promise<ApiResponse<ExchangeRateResponse>> => {
  const url = baseDate
    ? `${API_ENDPOINTS.CUSTOMS.EXCHANGE_RATES}?baseDate=${baseDate}`
    : API_ENDPOINTS.CUSTOMS.EXCHANGE_RATES;

  const response = await apiClient.get<ApiResponse<ExchangeRateResponse>>(url);
  return response.data;
};

/**
 * 화물 추적 이력 조회 API 함수
 *
 * @param cargoNumber - 화물관리번호
 * @returns 화물 추적 이력
 *
 * @example
 * ```typescript
 * const history = await getCargoTrackingHistory("24012345678901");
 * history.data.forEach(event => {
 *   console.log(`${event.timestamp}: ${event.description}`);
 * });
 * ```
 */
export const getCargoTrackingHistory = async (
  cargoNumber: string,
): Promise<
  ApiResponse<
    Array<{
      timestamp: string;
      stage: string;
      description: string;
      location: string;
      status: string;
    }>
  >
> => {
  const response = await apiClient.get<
    ApiResponse<
      Array<{
        timestamp: string;
        stage: string;
        description: string;
        location: string;
        status: string;
      }>
    >
  >(`${API_ENDPOINTS.CUSTOMS.CARGO_PROGRESS}/${cargoNumber}/history`);
  return response.data;
};
