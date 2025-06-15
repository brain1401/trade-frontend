import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore } from "@/stores/authStore";
import { signupSchema, type SignupInput } from "@/lib/validation/auth";
import {
  User,
  Mail,
  Lock,
  Shield,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";

type SignupFormProps = {
  onSuccess?: () => void;
};

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuthStore();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
      privacy: false,
      marketing: false,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      clearError();

      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        // 회원가입 성공 후 로그인 페이지로 이동
        router.navigate({
          to: "/auth/login",
          search: { message: "회원가입이 완료되었습니다. 로그인해주세요." },
        });
      }
    } catch (error) {
      console.error("Signup failed:", error);
      // 에러는 authStore에서 이미 처리됨
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

      {/* 이름 필드 */}
      <div className="space-y-2">
        <Label htmlFor="name">이름</Label>
        <div className="relative">
          <User className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            placeholder="홍길동"
            className="pl-10"
            {...form.register("name")}
            disabled={isLoading}
          />
        </div>
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

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
        <p className="text-xs text-muted-foreground">
          대문자, 소문자, 숫자, 특수문자를 포함하여 8자 이상
        </p>
      </div>

      {/* 비밀번호 확인 필드 */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <div className="relative">
          <Shield className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            className="pl-10"
            {...form.register("confirmPassword")}
            disabled={isLoading}
          />
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* 약관 동의 */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            id="terms"
            type="checkbox"
            className="rounded border-gray-300"
            {...form.register("terms")}
            disabled={isLoading}
          />
          <Label htmlFor="terms" className="cursor-pointer text-sm font-normal">
            <span className="text-destructive">*</span> 이용약관에 동의합니다
          </Label>
        </div>
        {form.formState.errors.terms && (
          <p className="text-sm text-destructive">
            {form.formState.errors.terms.message}
          </p>
        )}

        <div className="flex items-center space-x-2">
          <input
            id="privacy"
            type="checkbox"
            className="rounded border-gray-300"
            {...form.register("privacy")}
            disabled={isLoading}
          />
          <Label
            htmlFor="privacy"
            className="cursor-pointer text-sm font-normal"
          >
            <span className="text-destructive">*</span> 개인정보 처리방침에
            동의합니다
          </Label>
        </div>
        {form.formState.errors.privacy && (
          <p className="text-sm text-destructive">
            {form.formState.errors.privacy.message}
          </p>
        )}

        <div className="flex items-center space-x-2">
          <input
            id="marketing"
            type="checkbox"
            className="rounded border-gray-300"
            {...form.register("marketing")}
            disabled={isLoading}
          />
          <Label
            htmlFor="marketing"
            className="cursor-pointer text-sm font-normal"
          >
            마케팅 정보 수신에 동의합니다 (선택)
          </Label>
        </div>
      </div>

      {/* 회원가입 버튼 */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !form.formState.isValid}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            회원가입 중...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            회원가입
          </>
        )}
      </Button>

      {/* 로그인 링크 */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>
          이미 계정이 있으신가요?{" "}
          <button
            type="button"
            onClick={() => router.navigate({ to: "/auth/login" })}
            className="text-primary hover:underline"
            disabled={isLoading}
          >
            로그인하기
          </button>
        </p>
      </div>
    </form>
  );
};
