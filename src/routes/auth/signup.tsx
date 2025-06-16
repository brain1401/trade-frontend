import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ContentCard from "@/components/common/ContentCard";
import {
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  Building,
} from "lucide-react";

export const Route = createFileRoute("/auth/signup")({
  component: SignupPage,
});

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAgreementChange = (field: string, value: boolean) => {
    setAgreements((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      agreements.terms &&
      agreements.privacy
    );
  };

  const handleSignup = () => {
    if (isFormValid()) {
      // 목업 회원가입 처리
      console.log("Signup attempt:", { ...formData, agreements });
      // 실제로는 회원가입 API 호출 후 로그인 페이지로 리다이렉트
      window.location.href = "/auth/login";
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-8">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-neutral-800">회원가입</h1>
          <p className="text-neutral-600">
            AI 기반 무역정보 서비스를 시작하세요
          </p>
        </div>

        <ContentCard title="기본 정보">
          <div className="space-y-4">
            {/* 이름 */}
            <div>
              <Label
                htmlFor="name"
                className="text-sm font-medium text-neutral-700"
              >
                이름 *
              </Label>
              <div className="relative mt-1">
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="pl-10"
                />
                <User
                  size={16}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
                />
              </div>
            </div>

            {/* 이메일 */}
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-neutral-700"
              >
                이메일 *
              </Label>
              <div className="relative mt-1">
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10"
                />
                <Mail
                  size={16}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-neutral-700"
              >
                비밀번호 *
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="8자 이상 입력하세요"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
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
              <p className="mt-1 text-xs text-neutral-500">
                영문, 숫자, 특수문자를 포함하여 8자 이상
              </p>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-neutral-700"
              >
                비밀번호 확인 *
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className="pr-10 pl-10"
                />
                <Lock
                  size={16}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-danger-600">
                    비밀번호가 일치하지 않습니다
                  </p>
                )}
            </div>

            {/* 회사명 */}
            <div>
              <Label
                htmlFor="company"
                className="text-sm font-medium text-neutral-700"
              >
                회사명
              </Label>
              <div className="relative mt-1">
                <Input
                  id="company"
                  type="text"
                  placeholder="회사명을 입력하세요 (선택)"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="pl-10"
                />
                <Building
                  size={16}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
                />
              </div>
            </div>

            {/* 전화번호 */}
            <div>
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-neutral-700"
              >
                전화번호
              </Label>
              <div className="relative mt-1">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="010-1234-5678 (선택)"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="pl-10"
                />
                <Phone
                  size={16}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
                />
              </div>
            </div>
          </div>
        </ContentCard>

        {/* 약관 동의 */}
        <ContentCard title="약관 동의" className="mt-6">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={agreements.terms}
                onCheckedChange={(checked) =>
                  handleAgreementChange("terms", !checked)
                }
                className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex-1">
                <Label htmlFor="terms" className="text-sm text-neutral-700">
                  이용약관 동의 (필수) *
                </Label>
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs text-primary-600 hover:underline"
                >
                  약관 보기
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacy"
                checked={agreements.privacy}
                onCheckedChange={(checked) =>
                  handleAgreementChange("privacy", !checked)
                }
                className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex-1">
                <Label htmlFor="privacy" className="text-sm text-neutral-700">
                  개인정보처리방침 동의 (필수) *
                </Label>
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs text-primary-600 hover:underline"
                >
                  방침 보기
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="marketing"
                checked={agreements.marketing}
                onCheckedChange={(checked) =>
                  handleAgreementChange("marketing", !checked)
                }
                className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <Label htmlFor="marketing" className="text-sm text-neutral-700">
                마케팅 정보 수신 동의 (선택)
              </Label>
            </div>
          </div>
        </ContentCard>

        {/* 회원가입 버튼 */}
        <div className="mt-6">
          <Button
            onClick={handleSignup}
            className="w-full bg-primary-600 hover:bg-primary-700"
            disabled={!isFormValid()}
          >
            <UserPlus size={16} className="mr-2" />
            회원가입
          </Button>
        </div>

        {/* 로그인 링크 */}
        <div className="mt-4 text-center">
          <span className="text-sm text-neutral-600">
            이미 계정이 있으신가요?{" "}
          </span>
          <Button
            variant="link"
            className="h-auto p-0 text-sm text-primary-600 hover:underline"
            onClick={() => (window.location.href = "/auth/login")}
          >
            로그인
          </Button>
        </div>
      </div>
    </div>
  );
}
