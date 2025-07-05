import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { isHttpClientError } from "@/lib/api/common/httpClient";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (isHttpClientError(error)) {
        const message = error.errorCode?.startsWith("AUTH_")
          ? "인증이 필요합니다. 다시 로그인해주세요."
          : `데이터 조회 실패: ${error.message}`;
        toast.error(message, {
          description: `오류 코드: ${error.errorCode ?? "N/A"}`,
        });
      } else if (error instanceof Error) {
        toast.error(`데이터 조회 실패: ${error.message}`);
      } else {
        toast.error("알 수 없는 오류로 데이터를 조회하지 못했습니다.");
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (isHttpClientError(error)) {
        const message = error.errorCode?.startsWith("AUTH_")
          ? "인증이 필요합니다. 다시 로그인해주세요."
          : `요청 처리 실패: ${error.message}`;
        toast.error(message, {
          description: `오류 코드: ${error.errorCode ?? "N/A"}`,
        });
      } else if (error instanceof Error) {
        toast.error(`요청 처리 실패: ${error.message}`);
      } else {
        toast.error("알 수 없는 오류로 요청을 처리하지 못했습니다.");
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: 3, // 무조건 3번 재시도

      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000), // 지수 백오프, 최대 3초
      refetchOnMount: true, // 컴포넌트 마운트 시 stale 데이터 자동 refetch
      refetchOnWindowFocus: true, // 윈도우 포커스 시 stale 데이터 자동 refetch
      refetchOnReconnect: true, // 네트워크 재연결 시 stale 데이터 자동 refetch
    },
  },
});

export function getContext() {
  return {
    queryClient,
  };
}

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
