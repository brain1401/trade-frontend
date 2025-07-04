import React, { useState } from "react";
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
  Phone,
  User,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// 라우트 생성
export const Route = createFileRoute("/auth/find-password")({
  component: FindPasswordPage,
});

// Zod 스키마 정의
const emailSchema = z.object({
  email: z.string().email("올바른 이메일 형식을 입력해주세요."),
});

const verificationSchema = z.object({
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
  code: z.string().min(6, "인증번호 6자리를 입력해주세요."),
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

// 단계(Step) 정의
type Step =
  | "EMAIL_INPUT"
  | "METHOD_SELECTION"
  | "CODE_INPUT"
  | "PASSWORD_RESET"
  | "SUCCESS";

function FindPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("EMAIL_INPUT");
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 상태 추가
  const [email, setEmail] = useState("");
  const [maskedPhoneNumber, setMaskedPhoneNumber] = useState("");
  const [resetToken, setResetToken] = useState("");

  // 각 단계별로 폼 스키마와 기본값을 동적으로 변경
  const getFormConfig = () => {
    switch (step) {
      case "EMAIL_INPUT":
        return {
          resolver: zodResolver(emailSchema),
          defaultValues: { email: "" },
        };
      case "METHOD_SELECTION":
        return {
          resolver: zodResolver(
            z.object({
              name: z.string().optional(),
              phoneNumber: z.string().optional(),
            }),
          ),
          defaultValues: { name: "", phoneNumber: "" },
        };
      case "CODE_INPUT":
        return {
          resolver: zodResolver(verificationSchema),
          defaultValues: { code: "" },
        };
      case "PASSWORD_RESET":
        return {
          resolver: zodResolver(passwordSchema),
          defaultValues: { newPassword: "", newPasswordConfirm: "" },
        };
      default:
        return {
          resolver: zodResolver(emailSchema),
          defaultValues: { email: "" },
        };
    }
  };

  const form = useForm<any>(getFormConfig());

  // 1. 이메일 입력 및 확인
  const handleFindEmail = async (values: { email: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.findPassword(values);
      setEmail(values.email);
      setMaskedPhoneNumber(response.maskedPhoneNumber);
      setStep("METHOD_SELECTION");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "가입 정보를 찾을 수 없습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 2. 인증번호 발송
  const handleSendCode = async () => {
    setIsLoading(true);
    setError(null);
    const formData = form.getValues();
    try {
      await authService.sendPasswordCode({
        email,
        method: authMethod,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
      });
      toast.success("인증번호가 발송되었습니다.");
      setStep("CODE_INPUT");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "인증번호 발송에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 3. 인증번호 확인
  const handleVerifyCode = async (values: {
    email: string;
    name?: string;
    phoneNumber?: string;
    code?: string;
    newPassword?: string;
    newPasswordConfirm?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.verifyPasswordCode({
        email,
        method: authMethod,
        code: values.code ?? "",
      });
      setResetToken(response.resetToken);
      setStep("PASSWORD_RESET");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "인증번호 확인에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 4. 비밀번호 재설정
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

  const stepConfig = {
    EMAIL_INPUT: {
      icon: Mail,
      title: "이메일 확인",
      desc: "가입 시 사용한 이메일을 입력해주세요.",
    },
    METHOD_SELECTION: {
      icon: KeyRound,
      title: "인증 방법 선택",
      desc: "비밀번호를 찾을 인증 방법을 선택해주세요.",
    },
    CODE_INPUT: {
      icon: MessageSquare,
      title: "인증번호 입력",
      desc: `인증번호를 입력해주세요.`,
    },
    PASSWORD_RESET: {
      icon: Shield,
      title: "비밀번호 재설정",
      desc: "새로운 비밀번호를 설정해주세요.",
    },
    SUCCESS: {
      icon: CheckCircle,
      title: "완료",
      desc: "비밀번호가 성공적으로 변경되었습니다.",
    },
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-50 px-4 py-12">
      <Card className="w-full max-w-md border-neutral-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
            {React.createElement(stepConfig[step].icon, {
              className: "h-6 w-6 text-neutral-500",
            })}
          </div>
          <CardTitle className="text-2xl font-bold text-neutral-900">
            {stepConfig[step].title}
          </CardTitle>
          <CardDescription className="text-neutral-600">
            {stepConfig[step].desc}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* 단계별 폼 렌더링 */}
          {step === "EMAIL_INPUT" && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFindEmail)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
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
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}{" "}
                  다음
                </Button>
              </form>
            </Form>
          )}

          {step === "METHOD_SELECTION" && (
            <div className="space-y-6">
              <RadioGroup
                defaultValue="phone"
                onValueChange={(value: "phone" | "email") =>
                  setAuthMethod(value)
                }
              >
                <div className="flex items-center space-x-2 rounded-md border p-4">
                  <RadioGroupItem value="phone" id="phone" />
                  <Label htmlFor="phone" className="flex flex-col">
                    <span className="flex items-center font-semibold">
                      <Phone className="mr-2 h-4 w-4" />
                      휴대폰 인증
                    </span>
                    <span className="mt-1 text-xs text-neutral-500">
                      본인 명의의 휴대폰으로 인증합니다.
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-4">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email" className="flex flex-col">
                    <span className="flex items-center font-semibold">
                      <Mail className="mr-2 h-4 w-4" />
                      이메일 인증
                    </span>
                    <span className="mt-1 text-xs text-neutral-500">
                      {email}으로 인증 코드를 받습니다.
                    </span>
                  </Label>
                </div>
              </RadioGroup>

              {authMethod === "phone" && (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSendCode)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이름</FormLabel>
                          <FormControl>
                            <Input placeholder="홍길동" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            휴대폰 번호 ({maskedPhoneNumber})
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="'-' 없이 숫자만 입력"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              )}

              <Button
                onClick={handleSendCode}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}{" "}
                인증번호 받기
              </Button>
            </div>
          )}

          {step === "CODE_INPUT" && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleVerifyCode)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
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
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}{" "}
                  인증하기
                </Button>
              </form>
            </Form>
          )}

          {step === "PASSWORD_RESET" && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleResetPassword)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}{" "}
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
