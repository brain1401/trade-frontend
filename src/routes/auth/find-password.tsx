import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Loader2,
  KeyRound,
  CheckCircle,
  Mail,
  MessageSquare,
  Shield,
} from "lucide-react";

import { authService } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Alert, AlertDescription } from "@/components/ui/alert";

// 라우트 생성
export const Route = createFileRoute("/auth/find-password")({
  component: FindPasswordPage,
});

// Zod 스키마 정의
const emailSchema = z.object({
  email: z.string().email("올바른 이메일 형식입니다."),
});
const codeSchema = z.object({
  code: z.string().min(6, "인증번호 6자리를 입력하세요."),
});
const passwordSchema = z
  .object({
    newPassword: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
    newPasswordConfirm: z.string(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["newPasswordConfirm"],
  });

type Step = "EMAIL_INPUT" | "CODE_INPUT" | "PASSWORD_RESET" | "SUCCESS";

function FindPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("EMAIL_INPUT");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [maskedPhoneNumber, setMaskedPhoneNumber] = useState("");
  const [resetToken, setResetToken] = useState("");

  const emailForm = useForm<{ email: string }>({
    resolver: zodResolver(emailSchema),
  });
  const codeForm = useForm<{ code: string }>({
    resolver: zodResolver(codeSchema),
  });
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  const handleFindEmail = async (values: { email: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.findPassword(values);
      setEmail(values.email);
      setMaskedPhoneNumber(response.maskedPhoneNumber);
      setStep("CODE_INPUT");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "가입 정보를 찾을 수 없습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = async () => {
    setIsLoading(true);
    try {
      await authService.sendPasswordCode({ email });
      toast.success("인증번호가 발송되었습니다.");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "인증번호 발송에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (values: { code: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.verifyPasswordCode({
        email,
        code: values.code,
      });
      setResetToken(response.resetToken);
      setStep("PASSWORD_RESET");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "인증번호가 올바르지 않습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (
    values: z.infer<typeof passwordSchema>,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword({
        resetToken,
        newPassword: values.newPassword,
      });
      setStep("SUCCESS");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "비밀번호 변경에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const stepIcons = {
    EMAIL_INPUT: <Mail className="h-6 w-6 text-neutral-500" />,
    CODE_INPUT: <MessageSquare className="h-6 w-6 text-neutral-500" />,
    PASSWORD_RESET: <Shield className="h-6 w-6 text-neutral-500" />,
    SUCCESS: <CheckCircle className="h-6 w-6 text-green-500" />,
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-50 px-4 py-12">
      <Card className="w-full max-w-md border-neutral-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
            {stepIcons[step]}
          </div>
          <CardTitle className="text-2xl font-bold text-neutral-900">
            비밀번호 찾기
          </CardTitle>
          <CardDescription className="text-neutral-600">
            {step === "EMAIL_INPUT" && "가입 시 사용한 이메일을 입력해주세요."}
            {step === "CODE_INPUT" &&
              `인증번호를 ${maskedPhoneNumber}로 발송합니다.`}
            {step === "PASSWORD_RESET" && "새로운 비밀번호를 설정해주세요."}
            {step === "SUCCESS" && "비밀번호가 성공적으로 변경되었습니다."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === "EMAIL_INPUT" && (
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(handleFindEmail)}
                className="space-y-4"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}{" "}
                  다음
                </Button>
              </form>
            </Form>
          )}

          {step === "CODE_INPUT" && (
            <div className="space-y-4">
              <Button
                onClick={handleSendCode}
                className="w-full"
                variant="outline"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
                인증번호 받기
              </Button>
              <Form {...codeForm}>
                <form
                  onSubmit={codeForm.handleSubmit(handleVerifyCode)}
                  className="space-y-4"
                >
                  <FormField
                    control={codeForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>인증번호</FormLabel>
                        <FormControl>
                          <Input placeholder="인증번호 6자리" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}{" "}
                    인증하기
                  </Button>
                </form>
              </Form>
            </div>
          )}

          {step === "PASSWORD_RESET" && (
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(handleResetPassword)}
                className="space-y-4"
              >
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>새 비밀번호</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPasswordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>새 비밀번호 확인</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}{" "}
                  비밀번호 변경
                </Button>
              </form>
            </Form>
          )}

          {step === "SUCCESS" && (
            <Button
              onClick={() => navigate({ to: "/auth/login" })}
              className="w-full"
            >
              로그인 페이지로 이동
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
