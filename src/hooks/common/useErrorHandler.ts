import { useCallback } from "react";
import { useToast } from "@/hooks/common/useToast";
import { useRouter } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";

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

export const useErrorHandler = () => {
  const { toast } = useToast();
  const router = useRouter();
  const authStore = useAuthStore();

  return useCallback(
    (error: unknown, context?: string) => {
      console.error(`Error ${context ? `in ${context}` : ""}:`, error);

      if (error instanceof ApiError) {
        if (error.isAuthError) {
          // 인증 에러 처리
          authStore.logout();
          router.navigate({ to: "/" });
          toast({
            title: "인증이 필요합니다",
            description: "세션이 만료되었습니다. 다시 로그인해주세요.",
            variant: "destructive",
          });
        } else if (error.isNetworkError) {
          // 네트워크 에러 처리
          toast({
            title: "연결 오류",
            description: "인터넷 연결을 확인하고 다시 시도해주세요.",
            variant: "destructive",
          });
        } else if (error.isServerError) {
          // 서버 에러 처리
          toast({
            title: "서버 오류",
            description:
              "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
            variant: "destructive",
          });
        } else {
          // 기타 API 에러 처리
          toast({
            title: "오류",
            description: error.message || "예상치 못한 오류가 발생했습니다.",
            variant: "destructive",
          });
        }
      } else if (error instanceof Error) {
        // JavaScript 에러 처리
        toast({
          title: "애플리케이션 오류",
          description:
            "예상치 못한 오류가 발생했습니다. 페이지를 새로고침해주세요.",
          variant: "destructive",
        });
      } else {
        // 알 수 없는 에러 처리
        toast({
          title: "알 수 없는 오류",
          description: "알 수 없는 오류가 발생했습니다. 다시 시도해주세요.",
          variant: "destructive",
        });
      }
    },
    [toast, router, authStore],
  );
};
