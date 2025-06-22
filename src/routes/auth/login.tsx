import {
  createFileRoute,
  Link,
  useNavigate,
  redirect,
} from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Chrome, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuthStore, useIsAuthenticated } from "@/stores/authStore";
import { authApi, ApiError } from "@/lib/api/apiClient";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
  beforeLoad: ({ location }) => {
    // 이미 로그인된 사용자는 홈으로 리디렉션
    const { isAuthenticated, isLoading } = useAuthStore.getState();

    if (!isLoading && isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
});

/**
 * 로그인 폼 유효성 검사 스키마
 */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식을 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { clearAuthCookies } = useAuthStore();
  const isAuthenticated = useIsAuthenticated();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // beforeLoad에서 리디렉션 처리하므로 useEffect 제거

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  /**
   * 로그인 폼 제출 처리
   */
  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      await login(values.email, values.password, values.rememberMe);

      // 로그인 성공 시 이전 페이지 또는 홈으로 이동
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get("redirect") || "/";
      navigate({ to: redirect });
    } catch (error) {
      console.error("로그인 실패:", error);

      let errorMessage = "인증 실패";

      if (error instanceof ApiError) {
        switch (error.statusCode) {
          case 401:
            errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다";
            break;
          case 403:
            // 사용자가 삭제되었거나 비활성화된 경우
            errorMessage = "계정에 문제가 있습니다. 쿠키를 정리했습니다.";
            clearAuthCookies();
            break;
          case 404:
            errorMessage = "계정을 찾을 수 없습니다";
            break;
          case 429:
            errorMessage =
              "너무 많은 로그인 시도입니다. 잠시 후 다시 시도해주세요";
            break;
          default:
            errorMessage = error.message || "로그인에 실패했습니다";
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * OAuth 로그인 처리
   */
  const handleOAuthLogin = (provider: "google" | "naver" | "kakao") => {
    const rememberMe = form.getValues("rememberMe");

    // OAuth 완료 후 리디렉션할 페이지를 저장
    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get("redirect") || "/";
    sessionStorage.setItem("auth_redirect", redirect);

    const oauthUrl = authApi.getOAuthUrl(provider, rememberMe);
    window.location.href = oauthUrl;
  };

  /**
   * 인증 쿠키 수동 삭제 (문제 해결용)
   */
  const handleClearCookies = () => {
    clearAuthCookies();
    setError(null);

    // 페이지 새로고침
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="border-neutral-200 shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold text-neutral-900">
              로그인
            </CardTitle>
            <CardDescription className="text-neutral-600">
              AI 무역 규제 레이더 플랫폼에 로그인하세요
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 에러 메시지 */}
            {error && (
              <Alert className="border-danger-200 bg-danger-50">
                <AlertDescription className="text-danger-700">
                  {error}
                  {error.includes("계정에 문제") && (
                    <div className="mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDebugInfo(!showDebugInfo)}
                        className="text-xs"
                      >
                        문제 해결 도구 {showDebugInfo ? "숨기기" : "보기"}
                      </Button>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* 디버깅 정보 및 해결 도구 */}
            {showDebugInfo && (
              <Alert className="border-info-200 bg-info-50">
                <AlertDescription className="text-info-700">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">문제 해결 방법:</p>
                    <ul className="list-inside list-disc space-y-1 text-xs">
                      <li>
                        이전 로그인 정보가 브라우저에 남아있을 수 있습니다
                      </li>
                      <li>사용자 계정이 삭제되었을 가능성이 있습니다</li>
                      <li>아래 버튼으로 인증 쿠키를 삭제해보세요</li>
                    </ul>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearCookies}
                      className="mt-2 w-full"
                    >
                      <RefreshCw className="mr-2 h-3 w-3" />
                      인증 쿠키 삭제 및 새로고침
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* 로그인 폼 */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* 이메일 입력 */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-800">이메일</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="example@company.com"
                          className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 비밀번호 입력 */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-800">
                        비밀번호
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="비밀번호를 입력하세요"
                            className="border-neutral-300 pr-10 focus:border-primary-500 focus:ring-primary-500"
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 p-0 text-neutral-500 hover:text-neutral-700"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 로그인 유지 체크박스 */}
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-neutral-300 data-[state=checked]:border-primary-600 data-[state=checked]:bg-primary-600"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer text-sm text-neutral-700">
                          로그인 상태 유지 (7일)
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {/* 로그인 버튼 */}
                <Button
                  type="submit"
                  className="w-full bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>
              </form>
            </Form>

            {/* 구분선 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-neutral-500">또는</span>
              </div>
            </div>

            {/* OAuth 로그인 버튼들 */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                size="lg"
                onClick={() => handleOAuthLogin("google")}
                disabled={isLoading}
              >
                <Chrome className="mr-2 h-4 w-4" />
                Google로 로그인
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex-col space-y-2">
            <div className="text-center text-sm text-neutral-600">
              계정이 없으신가요?{" "}
              <Link
                to="/auth/signup"
                className="font-medium text-primary-600 underline hover:text-primary-700"
              >
                회원가입
              </Link>
            </div>

            {/* 익명 사용 안내 */}
            <div className="text-center">
              <Link
                to="/"
                className="text-xs text-neutral-500 underline hover:text-neutral-700"
              >
                로그인 없이 무역 정보 검색하기
              </Link>
            </div>

            {/* 개발용 쿠키 삭제 버튼 (개발 환경에서만 표시) */}
            {import.meta.env.DEV && (
              <div className="border-t border-neutral-200 pt-2 text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCookies}
                  className="text-xs text-neutral-400 hover:text-neutral-600"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  개발용: 쿠키 초기화
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
