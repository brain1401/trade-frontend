import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/lib/api/apiClient";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/callback")({
  component: OAuthCallbackPage,
});

/**
 * OAuth 콜백 처리 페이지
 *
 * OAuth 인증 완료 후 사용자 정보를 동기화하고 적절한 페이지로 리디렉션합니다.
 *
 * URL 파라미터:
 * - success=true: OAuth 인증 성공
 * - error=oauth_failed: OAuth 인증 실패
 */
function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { setUser, setLoading } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("OAuth 인증을 처리하고 있습니다...");

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // URL에서 파라미터 추출
        const searchParams = new URLSearchParams(window.location.search);
        const success = searchParams.get("success");
        const error = searchParams.get("error");

        if (error) {
          // OAuth 인증 실패
          setStatus("error");
          setMessage("소셜 로그인에 실패했습니다");

          toast.error("로그인 실패", {
            description: "소셜 로그인 중 오류가 발생했습니다",
          });

          // 3초 후 로그인 페이지로 리디렉션
          setTimeout(() => {
            navigate({ to: "/auth/login" });
          }, 3000);
          return;
        }

        if (success === "true") {
          // OAuth 인증 성공 - 사용자 정보 확인
          setMessage("사용자 정보를 확인하고 있습니다...");

          const response = await authApi.verify();

          if (response.success === "SUCCESS" && response.data) {
            // 사용자 정보 동기화 성공
            setUser(response.data);
            setStatus("success");
            setMessage("로그인이 완료되었습니다!");

            // OAuth 프로필 이미지 확인
            const profileImageMsg = response.data.profileImage
              ? "프로필 이미지가 설정되었습니다"
              : "";

            toast.success("로그인 성공", {
              description: `${response.data.name}님 환영합니다! ${profileImageMsg}`,
            });

            // 이전 페이지 또는 홈으로 리디렉션
            const redirectTo = sessionStorage.getItem("auth_redirect") || "/";
            sessionStorage.removeItem("auth_redirect");

            setTimeout(() => {
              navigate({ to: redirectTo });
            }, 2000);
          } else {
            throw new Error("사용자 정보 조회 실패");
          }
        } else {
          // 예상치 못한 상황
          throw new Error("OAuth 콜백 파라미터가 올바르지 않습니다");
        }
      } catch (error) {
        console.error("OAuth 콜백 처리 실패:", error);
        setStatus("error");
        setMessage("로그인 처리 중 오류가 발생했습니다");

        toast.error("인증 처리 실패", {
          description: "다시 시도해주세요",
        });

        // 3초 후 로그인 페이지로 리디렉션
        setTimeout(() => {
          navigate({ to: "/auth/login" });
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [navigate, setUser, setLoading]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* 로딩 상태 */}
        {status === "loading" && (
          <div className="space-y-4">
            <div className="mx-auto size-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-neutral-900">
                인증 처리 중
              </h1>
              <p className="text-sm text-neutral-600">{message}</p>
            </div>
          </div>
        )}

        {/* 성공 상태 */}
        {status === "success" && (
          <div className="space-y-4">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-success-100">
              <svg
                className="size-6 text-success-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-neutral-900">
                로그인 완료
              </h1>
              <p className="text-sm text-neutral-600">{message}</p>
              <p className="text-xs text-neutral-500">잠시 후 이동합니다...</p>
            </div>
          </div>
        )}

        {/* 에러 상태 */}
        {status === "error" && (
          <div className="space-y-4">
            <div className="bg-danger-100 mx-auto flex size-12 items-center justify-center rounded-full">
              <svg
                className="text-danger-600 size-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-neutral-900">
                인증 실패
              </h1>
              <p className="text-sm text-neutral-600">{message}</p>
              <p className="text-xs text-neutral-500">
                로그인 페이지로 이동합니다...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
