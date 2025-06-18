import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useRouteGuard } from "@/hooks/common/useRouteGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";
import {
  publicApiClient,
  API_ENDPOINTS,
  type ApiResponse,
} from "@/lib/apiClient";
import { mockLogin } from "@/data/mock/auth";

// 로그인 요청 타입
type LoginRequest = {
  email: string;
  password: string;
};

// 로그인 응답 타입
type LoginResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    notificationStats: {
      messageCount: number;
      bookmarkCount: number;
      analysisCount: number;
    };
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

function LoginPage() {
  // 로그인 페이지 가드 - 비로그인 사용자만 접근 허용
  const { isAllowed, LoadingComponent } = useRouteGuard("auth-only");

  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  // 모든 useState 호출을 조기 반환 이전에 배치 (Hook 규칙 준수)
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false); // 로그인 정보 유지 옵션
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 인증 상태 확인 중이면 스켈레톤 UI 표시
  if (!isAllowed && LoadingComponent) {
    return <LoadingComponent />;
  }

  // 인증 상태 확인 완료 후 접근 권한 없으면 null 반환 (리다이렉션됨)
  if (!isAllowed) {
    return null;
  }

  // 폼 입력 핸들러
  const handleInputChange =
    (field: keyof LoginRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      // 입력 시 에러 메시지 초기화
      if (error) setError(null);
    };

  // 로그인 처리 함수
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 목업 로그인 - 실제로는 publicApiClient.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.AUTH.LOGIN, formData)
      const loginResult = await mockLogin(
        formData.email,
        formData.password,
        rememberMe,
      );

      if (loginResult) {
        // 로그인 성공 시 스토어에 사용자 정보, 토큰, 로그인 정보 유지 옵션 저장
        login(loginResult.user, loginResult.tokens, rememberMe);

        // 메인페이지로 리다이렉트
        navigate({ to: "/" });
      } else {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (loginError) {
      console.error("로그인 오류:", loginError);
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 소셜 로그인 핸들러 (목업)
  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} 로그인 시도`);
    // 실제로는 OAuth 프로바이더로 리다이렉트
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            무역정보 서비스 로그인
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                placeholder="이메일을 입력하세요"
                disabled={isSubmitting || isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange("password")}
                placeholder="비밀번호를 입력하세요"
                disabled={isSubmitting || isLoading}
                required
              />
            </div>

            {/* 로그인 정보 유지 체크박스 */}
            <div className="flex items-center justify-end space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isSubmitting || isLoading}
              />
              <Label
                htmlFor="rememberMe"
                className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                로그인 정보 유지
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialLogin("google")}
                disabled={isSubmitting || isLoading}
              >
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialLogin("kakao")}
                disabled={isSubmitting || isLoading}
              >
                Kakao
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => navigate({ to: "/auth/signup" })}
              disabled={isSubmitting || isLoading}
            >
              계정이 없으신가요? 회원가입
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});
