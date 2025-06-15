import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore } from "@/stores/authStore";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";

type LoginFormProps = {
  onSuccess?: () => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      clearError();
      await login(data);

      if (onSuccess) {
        onSuccess();
      } else {
        // 로그인 성공 후 홈으로 이동
        router.navigate({ to: "/" });
      }
    } catch (error) {
      // 에러는 authStore에서 처리됨
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* 에러 표시 */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 이메일 필드 */}
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <div className="relative">
          <Mail className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            className="pl-10"
            {...form.register("email")}
            disabled={isLoading}
          />
        </div>
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {/* 비밀번호 필드 */}
      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <div className="relative">
          <Lock className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            className="pl-10"
            {...form.register("password")}
            disabled={isLoading}
          />
        </div>
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      {/* 로그인 버튼 */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !form.formState.isValid}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            로그인 중...
          </>
        ) : (
          "로그인"
        )}
      </Button>

      {/* 추가 옵션 */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>데모 계정: 임의의 이메일과 비밀번호를 입력하세요</p>
      </div>
    </form>
  );
};
