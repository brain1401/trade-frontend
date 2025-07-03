import { createFileRoute } from "@tanstack/react-router";
import {
  User as UserIcon,
  Shield,
  Settings,
  Mail,
  Calendar,
} from "lucide-react";
import type { User } from "../../../types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/stores/authStore";
import { requireAuth } from "@/lib/utils/authGuard";
import { useState } from "react";
import { PasswordChangeModal } from "./PasswordChangeModal";

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
function ProfileSummary({ user }: { user: User | null }) {
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
            계정 타입
          </CardTitle>
          <Calendar className="h-4 w-4 text-info-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            {/* {daysSinceMember}일 */}
            표준 계정
          </div>
          <p className="text-xs text-neutral-500">추후 유료서비스 출시 예정</p>
          {/* <p className="text-xs text-neutral-500">{memberSince} 가입</p> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            휴대폰 인증
          </CardTitle>
          <Mail className="h-4 w-4 text-primary-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">완료</div>
          <p className="text-xs text-success-600">인증 완료</p>
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
      <ProfileSummary user={user} />

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
                <Badge
                  variant="secondary"
                  className="bg-success-100 text-success-800"
                >
                  인증됨
                </Badge>
              </div>
            </div>
            <Button variant="outline" disabled>
              정보 수정
            </Button>
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
                <p className="font-medium">알림 설정</p>
                <p className="text-sm text-neutral-500">규제 변경 알림 받기</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                설정
              </Button>
            </div>
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
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">2단계 인증</p>
                <p className="text-sm text-neutral-500">추가 보안 설정</p>
              </div>
              <Badge variant="outline" className="text-xs">
                미설정
              </Badge>
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
      </div>
    </div>
  );
}
