import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, UserCheck } from "lucide-react";

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
import { useAuth } from "@/stores/authStore";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { requireGuest } from "@/lib/utils/authGuard";

export const Route = createFileRoute("/auth/signup")({
  beforeLoad: ({ context }) => {
    requireGuest(context);
  },
  component: SignupPage,
});

/**
 * 회원가입 폼 유효성 검사 스키마 (API v2.4 정책 반영)
 */
const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요")
      .email("올바른 이메일 형식을 입력해주세요"),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        "비밀번호는 영문자와 숫자를 포함해야 합니다",
      ),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요"),
    name: z
      .string()
      .min(1, "이름을 입력해주세요")
      .max(50, "이름은 50자를 초과할 수 없습니다")
      .regex(
        /^[가-힣a-zA-Z\s]+$/,
        "이름은 한글, 영문자, 공백만 입력 가능합니다",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

/**
 * 회원가입 페이지 (API v2.4 대응)
 *
 * 주요 변경사항:
 * - 새로운 에러 코드 체계 지원
 * - 비밀번호 정책 강화 (USER_004 에러)
 * - 사용자 친화적 에러 메시지
 * - 개선된 입력 검증 및 피드백
 */
function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  /**
   * 회원가입 폼 제출 처리 (API v2.4 에러 처리)
   */
  const onSubmit = async (values: SignupFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // 회원가입 API 호출
      const response = await authApi.register({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      if (response.success === "SUCCESS" && response.data) {
        setSuccess(true);

        console.log("회원가입 성공:", {
          email: response.data.email,
          name: response.data.name,
        });

        // 회원가입 성공 후 자동 로그인 시도
        try {
          await login(values.email, values.password, false);

          // 로그인 성공 시 홈으로 이동
          setTimeout(() => {
            navigate({ to: "/" });
          }, 2000);
        } catch (loginError) {
          console.warn("자동 로그인 실패:", loginError);

          // 자동 로그인 실패 시 로그인 페이지로 안내
          setTimeout(() => {
            navigate({
              to: "/auth/login",
              search: {
                message: "회원가입이 완료되었습니다. 로그인해주세요.",
              },
            });
          }, 2000);
        }
      } else {
        throw new Error(response.message || "회원가입에 실패했습니다");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);

      // API v2.4 에러 메시지 처리
      let errorMessage = "알 수 없는 오류가 발생했습니다";

      if (error instanceof ApiError) {
        // 사용자 친화적 에러 메시지 사용
        errorMessage = error.getUserFriendlyMessage();

        // 에러 코드별 추가 처리
        switch (error.errorCode) {
          case "USER_001":
            // 이메일 중복
            form.setError("email", {
              type: "manual",
              message: "이미 사용 중인 이메일입니다",
            });
            break;
          case "USER_002":
            // 입력 데이터 오류
            errorMessage = "입력 정보를 다시 확인해주세요";
            break;
          case "USER_004":
            // 비밀번호 정책 위반
            form.setError("password", {
              type: "manual",
              message: "비밀번호가 보안 정책에 맞지 않습니다",
            });
            break;
          case "RATE_LIMIT_001":
            // Rate limiting (회원가입도 제한될 수 있음)
            errorMessage =
              "요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요";
            break;
        }

        // 특정 상태 코드별 추가 처리
        switch (error.statusCode) {
          case 409:
            // 409: Conflict (이메일 중복)
            break;
          case 422:
            // 422: Unprocessable Entity (비밀번호 정책 위반)
            break;
          case 429:
            // 429: Too Many Requests
            break;
          case 500:
            // 500: Internal Server Error
            errorMessage =
              "서버에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요";
            break;
        }
      } else {
        // API가 아닌 일반 에러
        errorMessage = authApi.parseErrorMessage(error);
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
            {/* 성공 메시지 */}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <UserCheck className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  <div className="space-y-1">
                    <p className="font-medium">회원가입이 완료되었습니다!</p>
                    <p className="text-sm">로그인하여 서비스를 이용해보세요.</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* 에러 메시지 */}
            {error && !success && (
              <Alert className="border-danger-200 bg-danger-50">
                <AlertDescription className="text-danger-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* 회원가입 폼 */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700">이름</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="홍길동"
                          className="border-neutral-300 focus:border-primary-500"
                          disabled={isLoading || success}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          disabled={isLoading || success}
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
                            placeholder="영문자, 숫자 포함 8자 이상"
                            className="border-neutral-300 pr-10 focus:border-primary-500"
                            disabled={isLoading || success}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            disabled={isLoading || success}
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700">
                        비밀번호 확인
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="비밀번호를 다시 입력하세요"
                            className="border-neutral-300 pr-10 focus:border-primary-500"
                            disabled={isLoading || success}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            disabled={isLoading || success}
                          >
                            {showConfirmPassword ? (
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

                <Button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700"
                  disabled={isLoading || success}
                >
                  {isLoading
                    ? "가입 중..."
                    : success
                      ? "가입 완료"
                      : "회원가입"}
                </Button>
              </form>
            </Form>

            {/* 비밀번호 정책 안내 */}
            <Alert className="border-info-200 bg-info-50">
              <AlertDescription className="text-info-700">
                <div className="space-y-2">
                  <p className="text-sm font-medium">비밀번호 정책:</p>
                  <ul className="list-inside list-disc space-y-1 text-xs">
                    <li>최소 8자 이상</li>
                    <li>영문자와 숫자 포함 필수</li>
                    <li>특수문자 포함 권장</li>
                    <li>연속된 문자나 숫자 사용 금지</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-neutral-600">
              이미 계정이 있으신가요?{" "}
              <Link
                to="/auth/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                로그인
              </Link>
            </div>

            <div className="text-center text-xs text-neutral-400">
              <p>API v2.4 • 강화된 보안 정책 • 자동 로그인 지원</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default SignupPage;
