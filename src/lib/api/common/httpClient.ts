import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosRequestConfig,
} from "axios";
import type {
  ApiResponse,
  ApiErrorCode,
  ApiErrorData,
} from "../../../types/common";
import { tokenStore } from "../../auth/tokenStore";
import { ApiError } from "./ApiError";

/**
 * 함수형 API 클라이언트 모듈
 * - Access Token: 메모리 저장 (tokenStore)
 * - Refresh Token: HttpOnly 쿠키 (자동 포함)
 * - 자동 토큰 갱신 및 재시도 지원
 * - FormData 및 파일 업로드 지원
 */

let refreshing = false;
let refreshPromise: Promise<void> | null = null;
let authFailureHandled = false; // 인증 실패 처리 중복 방지

const instance: AxiosInstance = axios.create({
  baseURL: "http://localhost:8081/api",
  timeout: 30000,
  withCredentials: true, // HttpOnly 쿠키 자동 포함
});

// --- API 에러 처리를 위한 함수형 접근 ---

/**
 * 주어진 에러가 ApiError 타입인지 확인하는 타입 가드
 * @param error 확인할 에러
 * @returns 타입 일치 여부
 */
export const isHttpClientError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

/**
 * FormData인지 확인하는 타입 가드
 */
const isFormData = (data: unknown): data is FormData => {
  return typeof FormData !== "undefined" && data instanceof FormData;
};

/**
 * File 객체인지 확인하는 타입 가드
 */
const isFile = (data: unknown): data is File => {
  return typeof File !== "undefined" && data instanceof File;
};

/**
 * 요청 데이터에 파일이 포함되어 있는지 확인
 */
const hasFileData = (data: unknown): boolean => {
  if (isFormData(data) || isFile(data)) {
    return true;
  }

  if (data && typeof data === "object") {
    return Object.values(data).some(
      (value) => isFile(value) || (Array.isArray(value) && value.some(isFile)),
    );
  }

  return false;
};

/**
 * 요청 설정을 FormData에 맞게 조정
 */
const prepareConfigForFormData = (
  data: unknown,
  config: AxiosRequestConfig = {},
): AxiosRequestConfig => {
  if (hasFileData(data)) {
    // FormData나 파일이 포함된 경우 Content-Type을 설정하지 않음
    // (브라우저가 자동으로 multipart/form-data와 boundary 설정)
    const newConfig = { ...config };
    if (newConfig.headers) {
      delete newConfig.headers["Content-Type"];
    }

    if (import.meta.env.DEV) {
      console.log("📤 파일 업로드 요청 감지 - Content-Type 자동 설정");
    }

    return newConfig;
  }

  return config;
};

/**
 * 토큰 갱신 수행
 */
const performTokenRefresh = async (): Promise<void> => {
  try {
    if (import.meta.env.DEV) {
      console.log("🔄 자동 토큰 갱신 시작");
    }

    const refreshResponse = await axios.post<
      ApiResponse<{ accessToken: string }>
    >("http://localhost:8081/api/auth/refresh", undefined, {
      withCredentials: true, // HttpOnly 쿠키 포함
    });

    if (
      refreshResponse.data.success === "SUCCESS" &&
      refreshResponse.data.data?.accessToken
    ) {
      tokenStore.setToken(refreshResponse.data.data.accessToken);

      if (import.meta.env.DEV) {
        console.log("✅ 자동 토큰 갱신 성공");
      }
    } else {
      throw new ApiError(500, undefined, "토큰 갱신 응답이 올바르지 않습니다");
    }
  } catch (refreshError) {
    if (import.meta.env.DEV) {
      console.warn("⚠️ 토큰 갱신 실패:", refreshError);
    }
    tokenStore.clearToken();
    throw refreshError;
  }
};

/**
 * 인증 실패 처리 (무한 새로고침 방지 개선)
 */
const handleAuthFailure = (): void => {
  if (authFailureHandled) {
    return;
  }
  authFailureHandled = true;
  tokenStore.clearToken();

  if (import.meta.env.DEV) {
    console.log("🚪 인증 실패 - 토큰 정리 완료");
  }

  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== "/auth/login" && !currentPath.startsWith("/auth/")) {
      sessionStorage.setItem("redirect_after_login", currentPath);
    }
    if (import.meta.env.DEV) {
      console.log("💡 인증 실패 처리 완료 - 라우터가 자동으로 리디렉션 처리");
    }
  }

  setTimeout(() => {
    authFailureHandled = false;
  }, 3000);
};

const extractData = <T>(apiResponse: ApiResponse<T>): T => {
  if (apiResponse.success === "ERROR") {
    throw new ApiError(500, undefined, apiResponse.message || "API 요청 실패");
  }
  if (!apiResponse.data) {
    throw new ApiError(500, undefined, "응답 데이터 없음");
  }
  return apiResponse.data;
};

// 요청 인터셉터: Access Token 추가
instance.interceptors.request.use(
  (config) => {
    const token = tokenStore.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error("🔴 요청 인터셉터 오류:", error);
    }
    return Promise.reject(error);
  },
);

// 응답 인터셉터: 자동 토큰 갱신
instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !(originalRequest as any)._retry &&
      !refreshing
    ) {
      (originalRequest as any)._retry = true;

      try {
        if (!refreshPromise) {
          refreshing = true;
          refreshPromise = performTokenRefresh();
        }
        await refreshPromise;

        const newToken = tokenStore.getToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance.request(originalRequest);
        }
      } catch (refreshError) {
        if (import.meta.env.DEV) {
          console.error("❌ 토큰 갱신 및 재시도 실패:", refreshError);
        }
        handleAuthFailure();
        throw refreshError;
      } finally {
        refreshing = false;
        refreshPromise = null;
      }
    }

    const errorData = error.response?.data as ApiErrorData | undefined;
    throw new ApiError(
      error.response?.status || 0,
      errorData?.errorCode,
      errorData?.message || error.message,
    );
  },
);

// GET 메서드 (config 지원)
const createGetMethod =
  () =>
  <TResponse>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> =>
    instance
      .get<ApiResponse<TResponse>>(endpoint, config)
      .then((res) => extractData(res.data));

// POST, PUT, PATCH 메서드 (body + config 지원, FormData 자동 처리)
const createMethodWithBody =
  (method: "post" | "put" | "patch") =>
  <TResponse, TRequest = unknown>(
    endpoint: string,
    data?: TRequest,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> => {
    const finalConfig = prepareConfigForFormData(data, config);
    return instance[method]<ApiResponse<TResponse>>(
      endpoint,
      data,
      finalConfig,
    ).then((res) => extractData(res.data));
  };

// DELETE 메서드 (제네릭 지원, config 지원)
const createDeleteMethod =
  () =>
  <TResponse = void>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> =>
    instance.delete<ApiResponse<TResponse>>(endpoint, config).then((res) => {
      if (res.data.success === "ERROR") {
        throw new ApiError(500, undefined, res.data.message || "API 요청 실패");
      }
      // void 타입인 경우 undefined 반환, 그 외에는 data 반환
      return (res.data.data as TResponse) ?? (undefined as TResponse);
    });

// Raw 메서드들 (전체 응답 반환)
const createRawMethod =
  (method: "get" | "delete") =>
  <TResponse>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<TResponse>> =>
    instance[method]<ApiResponse<TResponse>>(endpoint, config).then(
      (res) => res.data,
    );

const createRawMethodWithBody =
  (method: "post" | "put" | "patch") =>
  <TResponse, TRequest = unknown>(
    endpoint: string,
    data?: TRequest,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<TResponse>> => {
    const finalConfig = prepareConfigForFormData(data, config);
    return instance[method]<ApiResponse<TResponse>>(
      endpoint,
      data,
      finalConfig,
    ).then((res) => res.data);
  };

// 개선된 httpClient 객체
export const httpClient = {
  get: createGetMethod(),
  post: createMethodWithBody("post"),
  put: createMethodWithBody("put"),
  patch: createMethodWithBody("patch"),
  delete: createDeleteMethod(),

  // 파일 업로드 전용 메서드들 (명시적)
  uploadFile: <TResponse>(
    endpoint: string,
    file: File,
    fieldName: string = "file",
    additionalData?: Record<string, string | number | boolean>,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> => {
    const formData = new FormData();
    formData.append(fieldName, file);

    // 추가 데이터가 있으면 FormData에 추가
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    if (import.meta.env.DEV) {
      console.log(`📤 파일 업로드: ${file.name} (${file.size} bytes)`);
    }

    return httpClient.post<TResponse>(endpoint, formData, config);
  },

  uploadMultipleFiles: <TResponse>(
    endpoint: string,
    files: File[],
    fieldName: string = "files",
    additionalData?: Record<string, string | number | boolean>,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> => {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`${fieldName}[${index}]`, file);
    });

    // 추가 데이터가 있으면 FormData에 추가
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    if (import.meta.env.DEV) {
      console.log(`📤 다중 파일 업로드: ${files.length}개 파일`);
    }

    return httpClient.post<TResponse>(endpoint, formData, config);
  },
};

export const rawHttpClient = {
  get: createRawMethod("get"),
  post: createRawMethodWithBody("post"),
  put: createRawMethodWithBody("put"),
  patch: createRawMethodWithBody("patch"),
  delete: createRawMethod("delete"),
};

// 파일 업로드 유틸리티 함수들
export const fileUploadUtils = {
  /**
   * 파일 크기 유효성 검사
   */
  validateFileSize: (file: File, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },

  /**
   * 파일 타입 유효성 검사
   */
  validateFileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type);
  },

  /**
   * 이미지 파일 유효성 검사
   */
  validateImageFile: (
    file: File,
    maxSizeMB: number = 5,
  ): { isValid: boolean; error?: string } => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!fileUploadUtils.validateFileType(file, allowedTypes)) {
      return {
        isValid: false,
        error: "지원하지 않는 이미지 형식입니다. (JPEG, PNG, GIF, WebP만 가능)",
      };
    }

    if (!fileUploadUtils.validateFileSize(file, maxSizeMB)) {
      return {
        isValid: false,
        error: `이미지 크기가 너무 큽니다. (최대 ${maxSizeMB}MB)`,
      };
    }

    return { isValid: true };
  },

  /**
   * 파일 크기를 읽기 쉬운 형태로 변환
   */
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  /**
   * 이미지 미리보기 URL 생성
   */
  createImagePreview: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /**
   * 이미지 리사이징 (Canvas 사용)
   */
  resizeImage: (
    file: File,
    maxWidth: number,
    maxHeight: number,
    quality: number = 0.8,
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // 비율 유지하면서 크기 조정
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
              });
              resolve(resizedFile);
            } else {
              reject(new Error("이미지 리사이징 실패"));
            }
          },
          file.type,
          quality,
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  },
};
