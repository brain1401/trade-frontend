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
import { useIsAuthenticated, useAuthStore } from "@/stores/authStore";
import { authApi, ApiError } from "@/lib/api/apiClient";

export const Route = createFileRoute("/auth/signup")({
  component: SignupPage,
  beforeLoad: ({ location }) => {
    // 이미 로그인된 사용자는 홈으로 리디렉션
    const { isAuthenticated, isLoading } = useAuthStore.getState();

    if (!isLoading && isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
});

/**
 * 회원가입 폼 유효성 검사 스키마
 */
const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, "이름을 입력해주세요")
      .min(2, "이름은 2글자 이상이어야 합니다")
      .max(50, "이름은 50글자를 초과할 수 없습니다"),
    email: z
      .string()
      .min(1, "이메일을 입력해주세요")
      .email("올바른 이메일 형식을 입력해주세요"),
    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요")
      .min(8, "비밀번호는 8자 이상이어야 합니다"),
    // 개발 환경에서 비밀번호 검증 주석 처리
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    //   "비밀번호는 영문 대소문자와 숫자를 포함해야 합니다",
    // ),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

function SignupPage() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const { clearAuthCookies } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // beforeLoad에서 리디렉션 처리하므로 useEffect 제거

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  /**
   * 회원가입 폼 제출 처리
   */
  const onSubmit = async (values: SignupFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      await authApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      setSuccess("회원가입이 완료되었습니다! 로그인해주세요.");

      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate({ to: "/auth/login" });
      }, 3000);
    } catch (error) {
      console.error("회원가입 실패:", error);

      let errorMessage = "계정 생성 실패";

      if (error instanceof ApiError) {
        switch (error.statusCode) {
          case 409:
            errorMessage = "이미 가입된 이메일입니다";
            break;
          case 400:
            errorMessage = "입력 정보를 확인해주세요";
            break;
          case 401:
          case 403:
            // 인증 문제가 있는 경우 쿠키 삭제
            errorMessage = "인증 문제가 발생했습니다. 쿠키를 정리했습니다.";
            clearAuthCookies();
            break;
          default:
            errorMessage = error.message || "계정 생성 실패";
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
    // OAuth 완료 후 리디렉션할 페이지를 저장
    sessionStorage.setItem("auth_redirect", "/");

    const oauthUrl = authApi.getOAuthUrl(provider, false);
    window.location.href = oauthUrl;
  };

  /**
   * 인증 쿠키 수동 삭제 (문제 해결용)
   */
  const handleClearCookies = () => {
    clearAuthCookies();
    setError(null);
    setSuccess("인증 쿠키가 삭제되었습니다. 페이지를 새로고침합니다.");

    // 1초 후 새로고침
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="border-neutral-200 shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold text-neutral-900">
              회원가입
            </CardTitle>
            <CardDescription className="text-neutral-600">
              AI 무역 규제 레이더 플랫폼에 가입하세요
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 에러 메시지 */}
            {error && (
              <Alert className="border-danger-200 bg-danger-50">
                <AlertDescription className="text-danger-700">
                  {error}
                  {error.includes("인증 문제") && (
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

            {/* 성공 메시지 */}
            {success && (
              <Alert className="border-success-200 bg-success-50">
                <AlertDescription className="text-success-700">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* 회원가입 폼 */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* 이름 입력 */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-800">이름</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="홍길동"
                          className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            placeholder="8자 이상, 대소문자와 숫자 포함"
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

                {/* 비밀번호 확인 */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-800">
                        비밀번호 확인
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="비밀번호를 다시 입력하세요"
                            className="border-neutral-300 pr-10 focus:border-primary-500 focus:ring-primary-500"
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 p-0 text-neutral-500 hover:text-neutral-700"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? (
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

                {/* 회원가입 버튼 */}
                <Button
                  type="submit"
                  className="w-full bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
                  size="lg"
                  disabled={isLoading || success !== null}
                >
                  {isLoading ? "가입 처리 중..." : "회원가입"}
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
                disabled={isLoading || success !== null}
              >
                <Chrome className="mr-2 h-4 w-4" />
                Google로 가입
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex-col space-y-2">
            <div className="text-center text-sm text-neutral-600">
              이미 계정이 있으신가요?{" "}
              <Link
                to="/auth/login"
                className="font-medium text-primary-600 underline hover:text-primary-700"
              >
                로그인
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
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
