import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { smsApi } from "@/lib/api/sms/api";
import { ApiError } from "@/lib/api";

// 스키마 정의 (기존과 동일)
const phoneSchema = z.object({
  phone: z
    .string()
    .regex(/^010\d{8}$/, "올바른 휴대폰 번호 형식(01012345678)이 아닙니다."),
});

const codeSchema = z.object({
  code: z.string().length(6, "인증번호 6자리를 입력해주세요."),
});

type PhoneVerificationModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
};

export function PhoneVerificationModal({
  isOpen,
  onOpenChange,
  onSuccess,
}: PhoneVerificationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"PHONE_INPUT" | "CODE_INPUT">("PHONE_INPUT");
  const [phoneNumber, setPhoneNumber] = useState("");

  // ==================== [수정 1] ====================
  // useForm에 defaultValues를 명시적으로 추가하여
  // "uncontrolled to controlled" 에러를 원천적으로 방지합니다.
  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const codeForm = useForm<z.infer<typeof codeSchema>>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: "",
    },
  });
  // =================================================

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("PHONE_INPUT");
      phoneForm.reset({ phone: "" }); // 폼 상태도 명시적으로 초기화
      codeForm.reset({ code: "" });
      setIsLoading(false);
    }, 300);
  };

  const handleSendCode = async (values: z.infer<typeof phoneSchema>) => {
    setIsLoading(true);
    try {
      await smsApi.sendVerification(values.phone);
      toast.success("인증번호가 발송되었습니다.");
      setPhoneNumber(values.phone);
      setStep("CODE_INPUT"); // 상태 전환
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "인증번호 발송에 실패했습니다.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (values: z.infer<typeof codeSchema>) => {
    setIsLoading(true);
    try {
      await smsApi.verifyCode(phoneNumber, values.code);
      toast.success("휴대폰 인증이 완료되었습니다.");
      onSuccess();
      handleClose();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "인증번호가 올바르지 않습니다.";
      toast.error(message);
      codeForm.setError("code", { message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>휴대폰 인증</DialogTitle>
          <DialogDescription>
            {step === "PHONE_INPUT"
              ? "인증을 진행할 휴대폰 번호를 입력해주세요."
              : `발송된 6자리 인증번호를 입력해주세요.`}
          </DialogDescription>
        </DialogHeader>

        {step === "PHONE_INPUT" && (
          <Form {...phoneForm}>
            {/* ==================== [수정 2] ==================== */}
            {/* key를 추가하여 step이 변경될 때 form을 완전히 새로 렌더링하도록 강제합니다. */}
            <form
              key="phone-form"
              onSubmit={phoneForm.handleSubmit(handleSendCode)}
              className="space-y-4 pt-4"
            >
              {/* ================================================= */}
              <FormField
                control={phoneForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>휴대폰 번호</FormLabel>
                    <FormControl>
                      <Input placeholder="하이픈(-) 없이 입력" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  취소
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  인증번호 발송
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {step === "CODE_INPUT" && (
          <Form {...codeForm}>
            {/* ==================== [수정 2] ==================== */}
            <form
              key="code-form"
              onSubmit={codeForm.handleSubmit(handleVerifyCode)}
              className="space-y-4 pt-4"
            >
              {/* ================================================= */}
              <FormField
                control={codeForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>인증번호</FormLabel>
                    <FormControl>
                      <Input placeholder="6자리 숫자 입력" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("PHONE_INPUT")}
                  disabled={isLoading}
                >
                  번호 재입력
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  인증 확인
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
