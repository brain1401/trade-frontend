import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
import ContentCard from "@/components/common/ContentCard";
import { Eye, EyeOff, LogIn, Mail, Lock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    // 목업 로그인 처리
    console.log("Login attempt:", { email, password, rememberMe });
    // 실제로는 로그인 API 호출 후 메인 페이지로 리다이렉트
    window.location.href = "/";
  };

  const handleSnsLogin = (provider: string) => {
    // 목업 SNS 로그인 처리
    console.log(`${provider} login attempt`);
    // 실제로는 SNS 인증 플로우 시작
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-neutral-800">로그인</h1>
          <p className="text-neutral-600">
            AI HS Code 레이더 시스템에 오신 것을 환영합니다
          </p>
        </div>

        <ContentCard title="계정 로그인">
          <div className="space-y-4">
            {/* 이메일 입력 */}
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-neutral-700"
              >
                이메일
              </Label>
              <div className="relative mt-1">
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
                <Mail
                  size={16}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-neutral-700"
              >
                비밀번호
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="pr-10 pl-10"
                />
                <Lock
                  size={16}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* 옵션 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <Label htmlFor="remember" className="text-sm text-neutral-600">
                  로그인 상태 유지
                </Label>
              </div>
              <Button
                variant="link"
                className="h-auto p-0 text-sm text-primary-600 hover:underline"
              >
                비밀번호 찾기
              </Button>
            </div>

            {/* 로그인 버튼 */}
            <Button
              onClick={handleLogin}
              className="w-full bg-primary-600 hover:bg-primary-700"
              disabled={!email || !password}
            >
              <LogIn size={16} className="mr-2" />
              로그인
            </Button>

            {/* 회원가입 링크 */}
            <div className="text-center">
              <span className="text-sm text-neutral-600">
                계정이 없으신가요?{" "}
              </span>
              <Button
                variant="link"
                className="h-auto p-0 text-sm text-primary-600 hover:underline"
                onClick={() => (window.location.href = "/auth/signup")}
              >
                회원가입
              </Button>
            </div>
          </div>
        </ContentCard>

        {/* SNS 로그인 */}
        <ContentCard title="간편 로그인" className="mt-6">
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-center border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
              onClick={() => handleSnsLogin("google")}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google로 시작하기
            </Button>

            <Button
              variant="outline"
              className="w-full justify-center border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
              onClick={() => handleSnsLogin("naver")}
            >
              <div className="mr-2 flex h-4 w-4 items-center justify-center rounded bg-green-500 text-xs font-bold text-white">
                N
              </div>
              네이버로 시작하기
            </Button>

            <Button
              variant="outline"
              className="w-full justify-center border-yellow-200 bg-yellow-50 text-yellow-800 hover:bg-yellow-100"
              onClick={() => handleSnsLogin("kakao")}
            >
              <div className="mr-2 flex h-4 w-4 items-center justify-center rounded bg-yellow-400 text-xs font-bold text-black">
                K
              </div>
              카카오로 시작하기
            </Button>
          </div>
        </ContentCard>

        {/* 하단 안내 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-neutral-500">
            로그인하시면 이용약관 및 개인정보처리방침에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
