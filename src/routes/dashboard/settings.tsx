import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Bell, Shield, Mail, Smartphone } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const [accountInfo, setAccountInfo] = useState({
    name: "홍길동",
    email: "hong@example.com",
    phone: "010-1234-5678",
  });

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 계정 정보 업데이트 로직
    console.log("계정 정보 업데이트:", accountInfo);
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-1 flex-col space-y-6">
      <h1 className="text-3xl font-bold text-neutral-800">설정</h1>

      {/* 계정 정보 관리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            계정 정보 관리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAccountSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={accountInfo.name}
                  onChange={(e) =>
                    setAccountInfo((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={accountInfo.email}
                  onChange={(e) =>
                    setAccountInfo((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                value={accountInfo.phone}
                onChange={(e) =>
                  setAccountInfo((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">정보 업데이트</Button>
              <Button type="button" variant="outline">
                비밀번호 변경
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 알림 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-6 w-6" />
            알림 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 알림 방식 */}
          <div>
            <h3 className="mb-4 text-lg font-medium">알림 방식</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-neutral-600" />
                  <div>
                    <p className="font-medium">이메일 알림</p>
                    <p className="text-sm text-neutral-600">
                      중요한 업데이트를 이메일로 받기
                    </p>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-neutral-600" />
                  <div>
                    <p className="font-medium">푸시 알림</p>
                    <p className="text-sm text-neutral-600">
                      브라우저 푸시 알림 받기
                    </p>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
            </div>
          </div>

          <hr className="border-neutral-200" />

          {/* 알림 카테고리 */}
          <div>
            <h3 className="mb-4 text-lg font-medium">알림 카테고리</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">분석 결과 업데이트</p>
                  <p className="text-sm text-neutral-600">
                    HS Code 분석 완료 시 알림
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">모니터링 알림</p>
                  <p className="text-sm text-neutral-600">
                    북마크한 항목의 변경사항 알림
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">규제 업데이트</p>
                  <p className="text-sm text-neutral-600">
                    새로운 규제 정보 업데이트 알림
                  </p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">환율 변동 알림</p>
                  <p className="text-sm text-neutral-600">
                    관세 환율 급격한 변동 시 알림
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 개인정보 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            개인정보 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">데이터 공유</p>
              <p className="text-sm text-neutral-600">
                서비스 개선을 위한 익명화된 데이터 공유
              </p>
            </div>
            <input type="checkbox" className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">분석 기록 보관</p>
              <p className="text-sm text-neutral-600">
                분석 기록을 계정에 저장하여 나중에 확인
              </p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">쿠키 설정</p>
              <p className="text-sm text-neutral-600">
                서비스 이용 편의를 위한 쿠키 사용
              </p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>

      {/* 계정 삭제 */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">위험 구역</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-red-600">계정 삭제</h4>
              <p className="mb-4 text-sm text-neutral-600">
                계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수
                없습니다.
              </p>
              <Button variant="destructive" size="sm">
                계정 삭제
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
