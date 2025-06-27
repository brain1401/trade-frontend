import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell, Shield, Database, AlertCircle } from "lucide-react";
import { requireAuth } from "@/lib/utils/authGuard";
import {
  mockNotificationSettings,
  mockNotifications,
  type NotificationSettings,
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
 * 북마크 알림 설정 컴포넌트
 * 각 북마크별 SMS/이메일 설정을 관리
 */
type BookmarkNotificationSettingProps = {
  setting: NotificationSettings["bookmarkSettings"][0];
  onToggleSms?: (bookmarkId: string) => void;
  onToggleEmail?: (bookmarkId: string) => void;
};

function BookmarkNotificationSetting({
  setting,
  onToggleSms,
  onToggleEmail,
}: BookmarkNotificationSettingProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Label className="text-base font-medium">
              {setting.displayName}
            </Label>
          </div>
          <p className="text-sm text-neutral-500">
            {setting.type === "HS_CODE"
              ? `HS Code: ${setting.displayName}`
              : `화물번호: ${setting.displayName}`}
          </p>
        </div>
      </div>

      <div className="grid gap-3 pl-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-neutral-500" />
            <Label className="text-sm">SMS 알림</Label>
          </div>
          <Switch
            checked={setting.smsNotificationEnabled}
            onCheckedChange={() => onToggleSms?.(setting.bookmarkId)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-neutral-500" />
            <Label className="text-sm">이메일 알림</Label>
          </div>
          <Switch
            checked={setting.emailNotificationEnabled}
            onCheckedChange={() => onToggleEmail?.(setting.bookmarkId)}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * 설정 요약 통계 컴포넌트
 */
function SettingsSummary() {
  const settings = mockNotificationSettings;
  const unreadNotifications = mockNotifications.filter((n) => !n.isRead);

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-600">
            SMS 알림
          </CardTitle>
          <Bell className="h-4 w-4 text-primary-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-900">
            {settings.notificationStats.smsEnabledBookmarks}/
            {settings.notificationStats.totalBookmarks}
          </div>
          <p className="text-xs text-neutral-500">북마크 활성화</p>
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
            {settings.notificationStats.emailEnabledBookmarks}/
            {settings.notificationStats.totalBookmarks}
          </div>
          <p className="text-xs text-neutral-500">북마크 활성화</p>
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
  const handleToggleSms = (bookmarkId: string) => {
    console.log(`SMS 알림 토글: ${bookmarkId}`);
    // TODO: 실제 구현 시 상태 업데이트 로직 추가
  };

  const handleToggleEmail = (bookmarkId: string) => {
    console.log(`이메일 알림 토글: ${bookmarkId}`);
    // TODO: 실제 구현 시 상태 업데이트 로직 추가
  };

  const handleToggleGlobalSms = () => {
    console.log(`전체 SMS 알림 토글`);
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
                <Label className="text-base font-medium">모든 SMS 알림</Label>
                <p className="text-sm text-neutral-500">
                  모든 북마크의 SMS 알림을 한번에 관리합니다
                </p>
              </div>
              <Switch
                checked={
                  notificationSettings.globalSettings.smsNotificationEnabled
                }
                onCheckedChange={handleToggleGlobalSms}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">
                  모든 이메일 알림
                </Label>
                <p className="text-sm text-neutral-500">
                  모든 북마크의 이메일 알림을 한번에 관리합니다
                </p>
              </div>
              <Switch
                checked={
                  notificationSettings.globalSettings.emailNotificationEnabled
                }
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
              <CardTitle>북마크별 알림 설정</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {notificationSettings.bookmarkSettings.map((setting, index) => (
              <div key={setting.bookmarkId}>
                <BookmarkNotificationSetting
                  setting={setting}
                  onToggleSms={handleToggleSms}
                  onToggleEmail={handleToggleEmail}
                />
                {index < notificationSettings.bookmarkSettings.length - 1 && (
                  <Separator className="mt-6" />
                )}
              </div>
            ))}
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
