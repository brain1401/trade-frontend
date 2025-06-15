import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/callback")({
  component: CallbackPage,
});

function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // OAuth 콜백 처리 로직
    const handleOAuthCallback = async () => {
      try {
        // 실제로는 인증 서버에서 받은 코드 처리
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
          // 코드를 서버로 전송하여 토큰 교환
          console.log("OAuth code received:", code);

          // 성공 시 대시보드로 이동
          navigate({ to: "/dashboard" });
        } else {
          // 실패 시 로그인 페이지로 이동
          navigate({ to: "/auth/login" });
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        navigate({ to: "/auth/login" });
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold">로그인 처리 중...</h2>
        <p className="text-muted-foreground">잠시만 기다려 주세요.</p>
      </div>
    </div>
  );
}
