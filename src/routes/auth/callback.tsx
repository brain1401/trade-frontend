import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/stores/authStore";

export const Route = createFileRoute("/auth/callback")({
  component: OAuthCallbackPage,
});

type CallbackStatus = "processing" | "success" | "error";

/**
 * OAuth 콜백 처리 페이지 (API v2.4 대응)
 *
 * 주요 기능:
 * - OAuth 로그인 완료 후 리디렉션 처리
 * - 프로필 이미지 지원
 * - 에러 상황별 적절한 안내 메시지
 * - 자동 리디렉션 및 수동 네비게이션
 */
function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { handleOAuthCallback, user } = useAuth();

  const [status, setStatus] = useState<CallbackStatus>("processing");
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setInterval> | null = null;

    const processCallback = async () => {
      try {
        setStatus("processing");

        // OAuth 콜백 처리
        const success = await handleOAuthCallback();

        if (!mounted) return;

        if (success) {
          setStatus("success");

          // 성공 시 저장된 리디렉션 경로로 이동
          const redirectPath = sessionStorage.getItem("auth_redirect") || "/";
          sessionStorage.removeItem("auth_redirect");

          // 3초 후 자동 리디렉션
          timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                if (timer) clearInterval(timer);
                if (mounted) {
                  navigate({ to: redirectPath });
                }
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setStatus("error");
          setError("소셜 로그인 처리 중 오류가 발생했습니다");
        }
      } catch (error) {
        console.error("OAuth 콜백 처리 실패:", error);

        if (mounted) {
          setStatus("error");

          // URL 파라미터에서 에러 정보 확인
          const urlParams = new URLSearchParams(window.location.search);
          const urlError = urlParams.get("error");

          let errorMessage = "소셜 로그인에 실패했습니다";

          switch (urlError) {
            case "oauth_failed":
              errorMessage = "소셜 로그인 처리 중 서버 오류가 발생했습니다";
              break;
            case "oauth_cancelled":
              errorMessage = "소셜 로그인이 취소되었습니다";
              break;
            case "unsupported_provider":
              errorMessage = "지원하지 않는 소셜 로그인 방식입니다";
              break;
            default:
              if (error instanceof Error) {
                errorMessage = error.message;
              }
          }

          setError(errorMessage);
        }
      }
    };

    processCallback();

    return () => {
      mounted = false;
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [handleOAuthCallback, navigate]);

  /**
   * 수동 리디렉션 처리
   */
  const handleManualRedirect = () => {
    const redirectPath = sessionStorage.getItem("auth_redirect") || "/";
    sessionStorage.removeItem("auth_redirect");
    navigate({ to: redirectPath });
  };

  /**
   * 로그인 페이지로 돌아가기
   */
  const handleBackToLogin = () => {
    navigate({ to: "/auth/login" });
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="border-neutral-200 shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold text-neutral-900">
              {status === "processing" && "로그인 처리 중"}
              {status === "success" && "로그인 완료"}
              {status === "error" && "로그인 실패"}
            </CardTitle>
            <CardDescription className="text-neutral-600">
              {status === "processing" && "소셜 로그인을 처리하고 있습니다..."}
              {status === "success" &&
                "소셜 로그인이 성공적으로 완료되었습니다"}
              {status === "error" && "소셜 로그인 중 문제가 발생했습니다"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 처리 중 상태 */}
            {status === "processing" && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
                <p className="text-sm text-neutral-600">
                  잠시만 기다려주세요...
                </p>
              </div>
            )}

            {/* 성공 상태 */}
            {status === "success" && (
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />

                  {/* 사용자 정보 표시 (프로필 이미지 포함) */}
                  {user && (
                    <div className="flex flex-col items-center space-y-2">
                      {user.profileImage && (
                        <img
                          src={user.profileImage}
                          alt={`${user.name}님의 프로필`}
                          className="h-16 w-16 rounded-full border-2 border-neutral-200"
                          onError={(e) => {
                            // 이미지 로드 실패 시 숨김
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <div className="text-center">
                        <p className="font-medium text-neutral-900">
                          {user.name}님 환영합니다!
                        </p>
                        <p className="text-sm text-neutral-600">{user.email}</p>
                      </div>
                    </div>
                  )}
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700">
                    <div className="text-center">
                      <p>로그인이 완료되었습니다.</p>
                      <p className="mt-1 text-sm">
                        {countdown}초 후 자동으로 이동합니다...
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleManualRedirect}
                  className="w-full bg-primary-600 hover:bg-primary-700"
                >
                  지금 이동하기
                </Button>
              </div>
            )}

            {/* 에러 상태 */}
            {status === "error" && (
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <XCircle className="h-12 w-12 text-red-600" />

                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">
                      {error || "알 수 없는 오류가 발생했습니다"}
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleBackToLogin}
                    className="w-full bg-primary-600 hover:bg-primary-700"
                  >
                    로그인 페이지로 돌아가기
                  </Button>

                  <Button
                    onClick={() => navigate({ to: "/" })}
                    variant="outline"
                    className="w-full border-neutral-300 hover:bg-neutral-50"
                  >
                    홈으로 이동
                  </Button>
                </div>

                {/* 문제 해결 안내 */}
                <Alert className="border-info-200 bg-info-50">
                  <AlertDescription className="text-info-700">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">문제 해결 방법:</p>
                      <ul className="list-inside list-disc space-y-1 text-xs">
                        <li>
                          브라우저의 팝업 차단이 활성화되어 있지 않은지 확인
                        </li>
                        <li>소셜 로그인 계정의 이메일 주소 확인</li>
                        <li>다른 브라우저나 시크릿 모드에서 시도</li>
                        <li>쿠키 및 사이트 데이터 삭제 후 재시도</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* 개발 정보 */}
            {import.meta.env.DEV && (
              <Alert className="border-neutral-200 bg-neutral-50">
                <AlertDescription className="text-neutral-600">
                  <div className="space-y-1 text-xs">
                    <p>
                      <strong>개발 정보:</strong>
                    </p>
                    <p>Status: {status}</p>
                    <p>URL: {window.location.href}</p>
                    {user && (
                      <div>
                        <p>User: {user.email}</p>
                        <p>Profile Image: {user.profileImage ? "Yes" : "No"}</p>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default OAuthCallbackPage;
