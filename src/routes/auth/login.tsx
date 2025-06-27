import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
import { useAuth } from "@/stores/authStore.ts";
import { authService } from "@/lib/auth/authService";
import { ApiError } from "@/lib/api";
import type { OAuthProvider } from "@/types/auth";
import { requireGuest } from "@/lib/utils/authGuard";

export const Route = createFileRoute("/auth/login")({
  beforeLoad: ({ context }) => {
    requireGuest(context);
  },
  component: LoginPage,
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

/**
 * 로그인 페이지 (API v6.1 JWT 세부화 대응)
 *
 * 주요 변경사항:
 * - Access Token 30분, Refresh Token 1일/30일 정책
 * - Access Token은 헤더&Zustand 저장, Refresh Token은 HttpOnly 쿠키
 * - remember me 기간 수정 (7일 → 1일/30일)
 * - 새로운 에러 코드 체계 지원
 * - OAuth 프로필 이미지 지원
 * - 사용자 열거 공격 방지를 위한 통합 에러 메시지
 * - 개선된 에러 처리 및 사용자 친화적 메시지
 * - 회원/비회원 차별화 시스템 안내
 */
function LoginPage() {
  const navigate = useNavigate();
  const { login, clearClientAuthState } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  /**
   * 로그인 폼 제출 처리 (API v6.1 JWT 세부화)
   */
  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      await login(values.email, values.password, values.rememberMe);

      // 로그인 성공 시 이전 페이지 또는 홈으로 이동
      // 1. URL 쿼리 파라미터 확인
      const searchParams = new URLSearchParams(window.location.search);
      const urlRedirect = searchParams.get("redirect");

      // 2. sessionStorage에서 저장된 리디렉션 경로 확인 (httpClient에서 설정)
      const sessionRedirect = sessionStorage.getItem("redirect_after_login");

      // 3. 우선순위: URL 파라미터 > sessionStorage > 기본 홈
      const redirect = urlRedirect || sessionRedirect || "/";

      // 4. sessionStorage 정리
      if (sessionRedirect) {
        sessionStorage.removeItem("redirect_after_login");
      }

      navigate({ to: redirect });
    } catch (error) {
      console.error("로그인 실패:", error);

      // API v6.1 에러 메시지 처리
      let errorMessage = "알 수 없는 오류가 발생했습니다";

      if (error instanceof ApiError) {
        // 사용자 친화적 에러 메시지 사용
        errorMessage = error.message;

        // 에러 코드별 추가 처리
        switch (error.errorCode) {
          case "AUTH_001":
            // 사용자 열거 공격 방지: 구체적인 실패 이유를 노출하지 않음
            console.warn("로그인 실패 - 보안 정책에 따라 통합 메시지 표시");
            break;
          case "AUTH_002":
            // 계정 잠김: 추가 안내 제공
            setShowDebugInfo(true);
            break;
          case "RATE_LIMIT_001":
            // Rate limiting: 재시도 안내
            errorMessage += " (잠시 후 다시 시도해주세요)";
            break;
          case "OAUTH_002":
          case "OAUTH_003":
            // OAuth 관련 에러
            errorMessage =
              "소셜 로그인 중 오류가 발생했습니다. 일반 로그인을 시도해보세요";
            break;
        }

        // 특정 상태 코드별 추가 처리
        switch (error.statusCode) {
          case 401:
            // 401: 인증 실패
            break;
          case 403:
            // 403: 계정 문제 - 클라이언트 상태 정리 필요
            errorMessage =
              "계정에 문제가 있습니다. 클라이언트 상태를 정리했습니다";
            clearClientAuthState();
            setShowDebugInfo(true);
            break;
          case 423:
            // 423: 계정 잠김
            setShowDebugInfo(true);
            break;
          case 429:
            // 429: Too Many Requests
            break;
          case 502:
          case 504:
            // 502/504: 외부 시스템 오류
            errorMessage =
              "서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요";
            break;
        }
      } else {
        // API가 아닌 일반 에러
        errorMessage = authService.parseErrorMessage(error);
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * OAuth 로그인 처리 (🆕 v6.1 JWT 세부화 지원)
   */
  const handleOAuthLogin = (provider: OAuthProvider) => {
    const rememberMe = form.getValues("rememberMe");

    // OAuth 완료 후 리디렉션할 페이지를 저장
    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get("redirect") || "/";
    sessionStorage.setItem("auth_redirect", redirect);

    // OAuth URL로 리디렉션 (프로필 이미지도 함께 획득됨)
    const oauthUrl = authService.getOAuthUrl(provider, rememberMe);
    console.log(`${provider} OAuth 로그인 시작:`, { provider, rememberMe });
    window.location.href = oauthUrl;
  };

  /**
   * 클라이언트 인증 상태 수동 정리 (문제 해결용)
   */
  const handleClearClientAuth = () => {
    clearClientAuthState();
    setError(null);
    setShowDebugInfo(false);

    // 페이지 새로고침으로 상태 완전 초기화
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  /**
   * OAuth Provider별 표시명과 아이콘
   */
  const oauthProviders: {
    provider: OAuthProvider;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      provider: "google",
      label: "Google",
      icon: <Chrome className="h-4 w-4" />,
    },
    {
      provider: "naver",
      label: "네이버",
      icon: <div className="h-4 w-4 rounded-sm bg-green-500" />,
    },
    {
      provider: "kakao",
      label: "카카오",
      icon: <div className="h-4 w-4 rounded-sm bg-yellow-400" />,
    },
  ];

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
              <br />
              <span className="mt-1 block text-xs text-neutral-500">
                💾 회원: 채팅 기록 영구 저장 • 👤 비회원: 휘발성 채팅만
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 에러 메시지 */}
            {error && (
              <Alert className="border-danger-200 bg-danger-50">
                <AlertDescription className="text-danger-700">
                  {error}
                  {(error.includes("계정에 문제") ||
                    error.includes("접근 제한")) && (
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
                      <li>브라우저 쿠키 문제일 수 있습니다</li>
                      <li>다른 브라우저나 시크릿 모드를 시도해보세요</li>
                      <li>계정이 일시적으로 제한되었을 수 있습니다</li>
                    </ul>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearClientAuth}
                      className="mt-2 text-xs"
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      클라이언트 상태 정리 후 새로고침
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700">이메일</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="your@email.com"
                          className="border-neutral-300 focus:border-primary-500"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700">
                        비밀번호
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="비밀번호를 입력하세요"
                            className="border-neutral-300 pr-10 focus:border-primary-500"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-neutral-600">
                          로그인 상태 유지 (30일간)
                        </FormLabel>
                        <p className="text-xs text-neutral-500">
                          체크 안 함: 1일간 유지
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700"
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
                <span className="bg-white px-2 text-neutral-500">
                  또는 소셜 로그인
                </span>
              </div>
            </div>

            {/* OAuth 로그인 버튼들 (🆕 v6.1 JWT 세부화 지원) */}
            <div className="grid gap-3">
              {oauthProviders.map(({ provider, label, icon }) => (
                <Button
                  key={provider}
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuthLogin(provider)}
                  disabled={isLoading}
                  className="w-full border-neutral-300 hover:bg-neutral-50"
                >
                  <div className="flex items-center gap-2">
                    {icon}
                    <span>{label}로 계속하기</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-neutral-600">
              계정이 없으신가요?{" "}
              <Link
                to="/auth/signup"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                회원가입
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
