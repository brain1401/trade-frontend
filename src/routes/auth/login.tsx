import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRouteGuard } from "@/hooks/common/useRouteGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuthStore } from "@/stores/authStore";
import { mockLogin } from "@/data/mock/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 로그인 폼 Zod 스키마 정의
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .email("올바른 이메일 형식을 입력해주세요."),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요.")
    .min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
  rememberMe: z.boolean(),
});

// 로그인 폼 타입 추론
type LoginFormData = z.infer<typeof loginSchema>;

function LoginPage() {
  // 로그인 페이지 가드 - 비로그인 사용자만 접근 허용
  const { isAllowed, LoadingComponent } = useRouteGuard("auth-only");

  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  // React Hook Form 초기화
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // 인증 상태 확인 중이면 스켈레톤 UI 표시
  if (!isAllowed && LoadingComponent) {
    return <LoadingComponent />;
  }

  // 인증 상태 확인 완료 후 접근 권한 없으면 null 반환 (리다이렉션됨)
  if (!isAllowed) {
    return null;
  }

  // 로그인 처리 함수
  const onSubmit = async (data: LoginFormData) => {
    try {
      // 목업 로그인 - 실제로는 publicApiClient.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.AUTH.LOGIN, data)
      const loginResult = await mockLogin(
        data.email,
        data.password,
        data.rememberMe,
      );

      if (loginResult) {
        // 로그인 성공 시 스토어에 사용자 정보, 토큰, 로그인 정보 유지 옵션 저장
        login(loginResult.user, loginResult.tokens, data.rememberMe);

        // 메인페이지로 리다이렉트
        navigate({ to: "/" });
      } else {
        // 로그인 실패 시 폼 에러 설정
        form.setError("root", {
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        });
      }
    } catch (loginError) {
      console.error("로그인 오류:", loginError);
      form.setError("root", {
        message: "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.",
      });
    }
  };

  // 소셜 로그인 핸들러 (목업)
  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} 로그인 시도`);
    // 실제로는 OAuth 프로바이더로 리다이렉트
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            무역정보 서비스 로그인
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {/* 전역 에러 메시지 표시 */}
              {form.formState.errors.root && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {form.formState.errors.root.message}
                </div>
              )}

              {/* 이메일 필드 */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="이메일을 입력하세요"
                        disabled={isSubmitting || isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 비밀번호 필드 */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        disabled={isSubmitting || isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 로그인 정보 유지 체크박스 */}
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-end space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting || isLoading}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer text-sm leading-none font-medium">
                      로그인 정보 유지
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? "로그인 중..." : "로그인"}
              </Button>
            </form>
          </Form>

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
