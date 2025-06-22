import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Bell, Shield, Database, AlertCircle } from "lucide-react";
import { useAuth } from "@/stores/authStore";
import { requireAuth } from "@/lib/utils/authGuard";
import {
  mockNotificationSettings,
  getNotificationsByType,
  getUnreadNotifications,
} from "@/data/mock/notifications";

/**
 * 설정 관리 라우트 정의
 *
 * 인증된 사용자만 접근 가능한 보호된 페이지
 */
export const Route = createFileRoute("/dashboard/settings/")({
  beforeLoad: ({ context, location }) => {
    requireAuth(context, location);
  },
  component: SettingsPage,
});

/**
 * 알림 카테고리 설정 컴포넌트
 * 각 알림 타입별 푸시/이메일 설정을 관리
 */
type NotificationCategoryProps = {
  categoryKey: string;
  category: {
    name: string;
    pushEnabled: boolean;
    emailEnabled: boolean;
  };
  onTogglePush?: (categoryKey: string) => void;
  onToggleEmail?: (categoryKey: string) => void;
};

function NotificationCategory({
  categoryKey,
  category,
  onTogglePush,
  onToggleEmail,
}: NotificationCategoryProps) {
  // 해당 카테고리의 최근 알림 수 계산
  const categoryNotifications = getNotificationsByType(categoryKey as any);
  const unreadCount = categoryNotifications.filter(
    (notif) => !notif.read,
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Label className="text-base font-medium">{category.name}</Label>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount}개 미읽음
              </Badge>
            )}
          </div>
          <p className="text-sm text-neutral-500">
            {getCategoryDescription(categoryKey)}
          </p>
        </div>
      </div>

      <div className="grid gap-3 pl-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-neutral-500" />
            <Label className="text-sm">푸시 알림</Label>
          </div>
          <Switch
            checked={category.pushEnabled}
            onCheckedChange={() => onTogglePush?.(categoryKey)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-neutral-500" />
            <Label className="text-sm">이메일 알림</Label>
          </div>
          <Switch
            checked={category.emailEnabled}
            onCheckedChange={() => onToggleEmail?.(categoryKey)}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * 카테고리별 설명 텍스트 반환
 */
function getCategoryDescription(categoryKey: string): string {
  switch (categoryKey) {
    case "hscode_regulation":
      return "HS Code 관련 규제 변경사항을 알려드립니다";
    case "cargo_status":
      return "화물 추적 상태 변경을 알려드립니다";
    case "trade_news":
      return "무역 관련 중요한 뉴스를 알려드립니다";
    case "exchange_rate":
      return "주요 통화의 환율 변동을 알려드립니다";
    case "system":
      return "시스템 점검 및 공지사항을 알려드립니다";
    default:
      return "관련 정보를 알려드립니다";
  }
}

/**
 * 설정 요약 통계 컴포넌트
 */
function SettingsSummary() {
  const settings = mockNotificationSettings;
  const unreadNotifications = getUnreadNotifications();

  // 활성화된 알림 카테고리 수 계산
  const enabledPushCategories = Object.values(settings.categories).filter(
    (cat) => cat.pushEnabled,
  ).length;

  const enabledEmailCategories = Object.values(settings.categories).filter(
    (cat) => cat.emailEnabled,
  ).length;

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            푸시 알림
          </CardTitle>
          <Bell className="h-4 w-4 text-primary-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            {enabledPushCategories}/{Object.keys(settings.categories).length}
          </div>
          <p className="text-xs text-neutral-500">카테고리 활성화</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            이메일 알림
          </CardTitle>
          <Database className="h-4 w-4 text-info-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            {enabledEmailCategories}/{Object.keys(settings.categories).length}
          </div>
          <p className="text-xs text-neutral-500">카테고리 활성화</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            미읽은 알림
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-warning-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            {unreadNotifications.length}
          </div>
          <p className="text-xs text-neutral-500">확인 필요</p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 설정 관리 페이지
 *
 * 인증된 사용자만 접근 가능
 * 개인 설정 및 환경 설정 관리 기능 제공
 */
function SettingsPage() {
  const notificationSettings = mockNotificationSettings;

  // 임시 핸들러 함수들 (실제로는 상태 관리를 통해 구현)
  const handleTogglePush = (categoryKey: string) => {
    console.log(`푸시 알림 토글: ${categoryKey}`);
    // TODO: 실제 구현 시 상태 업데이트 로직 추가
  };

  const handleToggleEmail = (categoryKey: string) => {
    console.log(`이메일 알림 토글: ${categoryKey}`);
    // TODO: 실제 구현 시 상태 업데이트 로직 추가
  };

  const handleToggleGlobalPush = () => {
    console.log(`전체 푸시 알림 토글`);
    // TODO: 실제 구현 시 전체 설정 업데이트 로직 추가
  };

  const handleToggleGlobalEmail = () => {
    console.log(`전체 이메일 알림 토글`);
    // TODO: 실제 구현 시 전체 설정 업데이트 로직 추가
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          설정
        </h1>
        <p className="mt-2 text-neutral-600">
          개인 설정과 환경을 관리할 수 있습니다.
        </p>
      </div>

      {/* 설정 요약 통계 */}
      <SettingsSummary />

      <div className="grid gap-6">
        {/* 전체 알림 설정 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>전체 알림 설정</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">모든 푸시 알림</Label>
                <p className="text-sm text-neutral-500">
                  모든 카테고리의 푸시 알림을 한번에 관리합니다
                </p>
              </div>
              <Switch
                checked={notificationSettings.pushEnabled}
                onCheckedChange={handleToggleGlobalPush}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">
                  모든 이메일 알림
                </Label>
                <p className="text-sm text-neutral-500">
                  모든 카테고리의 이메일 알림을 한번에 관리합니다
                </p>
              </div>
              <Switch
                checked={notificationSettings.emailEnabled}
                onCheckedChange={handleToggleGlobalEmail}
              />
            </div>
          </CardContent>
        </Card>

        {/* 카테고리별 알림 설정 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <CardTitle>카테고리별 알림 설정</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(notificationSettings.categories).map(
              ([categoryKey, category], index) => (
                <div key={categoryKey}>
                  <NotificationCategory
                    categoryKey={categoryKey}
                    category={category}
                    onTogglePush={handleTogglePush}
                    onToggleEmail={handleToggleEmail}
                  />
                  {index <
                    Object.entries(notificationSettings.categories).length -
                      1 && <Separator className="mt-6" />}
                </div>
              ),
            )}
          </CardContent>
        </Card>

        {/* 보안 설정 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>보안 설정</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">2단계 인증</Label>
                <p className="text-sm text-neutral-500">
                  계정 보안을 강화하기 위한 2단계 인증을 활성화합니다
                </p>
              </div>
              <Button variant="outline" size="sm">
                설정
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">로그인 세션 관리</Label>
                <p className="text-sm text-neutral-500">
                  다른 기기에서의 로그인 세션을 관리합니다
                </p>
              </div>
              <Button variant="outline" size="sm">
                관리
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 데이터 설정 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle>데이터 설정</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">검색 히스토리 저장</Label>
                <p className="text-sm text-neutral-500">
                  검색 기록을 저장하여 개인화된 서비스를 제공합니다
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">사용 통계 수집</Label>
                <p className="text-sm text-neutral-500">
                  서비스 개선을 위한 익명 사용 통계를 수집합니다
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">데이터 내보내기</Label>
                <p className="text-sm text-neutral-500">
                  개인 데이터를 내보내기할 수 있습니다
                </p>
              </div>
              <Button variant="outline" size="sm">
                내보내기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 계정 관리 */}
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
              <Button variant="destructive" size="sm">
                계정 삭제
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
