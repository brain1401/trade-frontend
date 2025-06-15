import axios, { type AxiosResponse } from "axios";

type ApiResponse<T> = {
  result: "SUCCESS" | "ERROR";
  message: string;
  data: T;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public correlationId?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }

  get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  get isServerError(): boolean {
    return this.status ? this.status >= 500 : false;
  }

  get isNetworkError(): boolean {
    return this.code === "NETWORK_ERROR";
  }

  get isRetryable(): boolean {
    return this.isNetworkError || this.isServerError;
  }
}

// 상관관계 ID 생성 함수
const generateCorrelationId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// API 클라이언트 생성
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  timeout: 60000, // AI 분석은 시간이 오래 걸릴 수 있음
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 인증 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰 가져오기 (실제로는 authStore 사용)
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 상관관계 ID 추가
    config.headers["X-Correlation-ID"] = generateCorrelationId();

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 - ApiResponse<T> 형식 처리
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    const apiResponse = response.data;

    // 백엔드에서 SUCCESS/ERROR 형식으로 응답
    if (apiResponse.result === "SUCCESS") {
      // 성공 시 실제 데이터 반환
      return apiResponse.data;
    } else {
      // 백엔드에서 보고한 에러
      throw new ApiError(apiResponse.message, response.status, "BACKEND_ERROR");
    }
  },
  (error) => {
    // 네트워크 및 HTTP 에러 처리
    if (error.response) {
      // 서버가 응답했지만 에러 상태
      const apiResponse = error.response.data as ApiResponse<null>;
      throw new ApiError(
        apiResponse.message || "서버 오류가 발생했습니다",
        error.response.status,
        "HTTP_ERROR",
      );
    } else if (error.request) {
      // 네트워크 오류 - 응답 없음
      throw new ApiError(
        "네트워크 연결을 확인해주세요",
        undefined,
        "NETWORK_ERROR",
      );
    } else {
      // 요청 설정 오류
      throw new ApiError(error.message, undefined, "CONFIG_ERROR");
    }
  },
);

export default apiClient;
