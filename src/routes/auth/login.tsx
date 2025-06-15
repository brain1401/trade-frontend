import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { LogIn } from "lucide-react";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthLayout
      title="로그인"
      description="AI HS Code 분석 시스템에 로그인하세요"
      icon={<LogIn className="h-5 w-5" />}
    >
      <LoginForm />
    </AuthLayout>
  );
}
