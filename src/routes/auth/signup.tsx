import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";
import { UserPlus } from "lucide-react";

export const Route = createFileRoute("/auth/signup")({
  component: SignupPage,
});

function SignupPage() {
  return (
    <AuthLayout
      title="회원가입"
      description="AI HS Code 분석 시스템에 가입하세요"
      icon={<UserPlus className="h-5 w-5" />}
    >
      <SignupForm />
    </AuthLayout>
  );
}
