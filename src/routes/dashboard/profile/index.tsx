import { createFileRoute } from "@tanstack/react-router";

import {
  User as UserIcon,
  Shield,
  Settings,
  Mail,
  Calendar,
  Phone,
} from "lucide-react";
import type { User } from "../../../types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth, useAuthStore } from "@/stores/authStore";
import { requireAuth } from "@/lib/utils/authGuard";
import { useState } from "react";
import { PasswordChangeModal } from "./PasswordChangeModal";
import { PhoneVerificationModal } from "./PhoneVerificationModal";
import { toast } from "sonner";
import { authService } from "@/lib/auth";
import { NameChangeModal } from "./NameChangeModal";
import { AccountDeletionModal } from "./AccountDeletionModal";

/**
 * 프로필 관리 라우트 정의
 *
 * 인증된 사용자만 접근 가능한 보호된 페이지
 */
export const Route = createFileRoute("/dashboard/profile/")({
  beforeLoad: ({ context, location }) => {
    requireAuth(context, location);
  },
  component: ProfilePage,
});

/**
 * 프로필 요약 통계 컴포넌트
 * 사용자 계정의 기본 정보를 요약하여 표시
 */
function ProfileSummary({
  user,
  onOpenVerificationModal,
}: {
  user: User | null;
  onOpenVerificationModal: () => void;
}) {
  // 가입일로부터 경과 일수 계산 (임시 데이터)
  const memberSince = "2023-06-15";
  const daysSinceMember = Math.floor(
    (new Date().getTime() - new Date(memberSince).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            계정 상태
          </CardTitle>
          <Shield className="h-4 w-4 text-success-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">활성</div>
          <p className="text-xs text-success-600">인증 완료</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            회원 타입
          </CardTitle>
          <Calendar className="h-4 w-4 text-info-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            {/* {daysSinceMember}일 */}
            일반 회원
          </div>
          <p className="text-xs text-neutral-500">추후 구독 서비스 출시 예정</p>
          {/* <p className="text-xs text-neutral-500">{memberSince} 가입</p> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            휴대폰 인증
          </CardTitle>
          {/* 아이콘을 Mail에서 Phone으로 변경하여 의미를 명확하게 합니다. */}
          <Phone
            className={`h-4 w-4 ${user?.phoneVerified ? "text-success-600" : "text-neutral-500"}`}
          />
        </CardHeader>
        <CardContent>
          {user?.phoneVerified ? (
            // 인증 완료 상태 UI
            <>
              <div className="text-2xl font-bold text-neutral-900">
                인증 완료
              </div>
              <p className="text-xs text-success-600">
                휴대폰 본인인증이 완료되었습니다.
              </p>
            </>
          ) : (
            // 미인증 상태 UI
            <>
              <div className="text-2xl font-bold text-warning-600">미인증</div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-xs"
                onClick={onOpenVerificationModal}
              >
                인증하기
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 사용자 프로필 관리 페이지
 *
 * 인증된 사용자만 접근 가능
 * 사용자 정보 조회 및 수정 기능 제공
 */
function ProfilePage() {
  const { user } = useAuth();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isVerificationModalOpen, setVerificationModalOpen] = useState(false);
  const [isDeletionModalOpen, setIsDeletionModalOpen] = useState(false);

  // 인증 성공 시 최신 사용자 정보를 다시 불러와 상태를 업데이트하는 함수
  const handleVerificationSuccess = async () => {
    try {
      const updatedUser = await authService.getCurrentUser();
      useAuthStore.getState().setUser(updatedUser); // Zustand 스토어 직접 업데이트
      toast.success("사용자 정보가 업데이트되었습니다.");
    } catch (error) {
      toast.error("사용자 정보 업데이트에 실패했습니다.");
    }
  };
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          프로필 관리
        </h1>
        <p className="mt-2 text-neutral-600">
          계정 정보를 확인하고 수정할 수 있습니다.
        </p>
      </div>

      {/* 프로필 요약 통계 */}
      <ProfileSummary
        user={user}
        onOpenVerificationModal={() => setVerificationModalOpen(true)}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary-600" />
              <CardTitle>기본 정보</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={user?.name || ""}
                readOnly
                className="bg-neutral-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="email"
                  value={user?.email || ""}
                  readOnly
                  className="bg-neutral-50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-info-600" />
              <CardTitle>계정 설정</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">비밀번호 변경</p>
                <p className="text-sm text-neutral-500">
                  보안을 위해 정기적으로 변경하세요
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                변경
              </Button>
              <PasswordChangeModal
                isOpen={isPasswordModalOpen}
                onOpenChange={setIsPasswordModalOpen}
              />
              <NameChangeModal
                isOpen={isNameModalOpen}
                onOpenChange={setIsNameModalOpen}
                currentName={user?.name || ""}
              />
              <PhoneVerificationModal
                isOpen={isVerificationModalOpen}
                onOpenChange={setVerificationModalOpen}
                onSuccess={handleVerificationSuccess}
              />
              <AccountDeletionModal
                isOpen={isDeletionModalOpen}
                onOpenChange={setIsDeletionModalOpen}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">이름 변경</p>
                <p className="text-sm text-neutral-500">
                  이름은 언제든지 변경 가능합니다.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsNameModalOpen(true)}
              >
                변경
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 추가 정보 섹션 */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-warning-600" />
              <CardTitle>보안 정보</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">마지막 로그인</Label>
                <p className="text-sm text-neutral-600">
                  {new Date().toLocaleDateString("ko-KR")}{" "}
                  {new Date().toLocaleTimeString("ko-KR")}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">로그인 위치</Label>
                <p className="text-sm text-neutral-600">대한민국</p>
              </div>
              {/* <div className="space-y-2">
                <Label className="text-sm font-medium">계정 타입</Label>
                <Badge
                  variant="secondary"
                  className="bg-brand-100 text-brand-800"
                >
                  표준 사용자
                </Badge>
              </div> */}
              {/* <div className="space-y-2">
                <Label className="text-sm font-medium">데이터 사용량</Label>
                <p className="text-sm text-neutral-600">
                  북마크 4개, 검색 47회
                </p>
              </div> */}
            </div>
          </CardContent>
        </Card>
        {/* 계정 관리 */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <CardTitle>계정 관리</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">계정 삭제</p>
                  <p className="text-sm text-neutral-500">
                    계정과 모든 데이터가 영구적으로 삭제됩니다
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDeletionModalOpen(true)}
                >
                  계정 삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
