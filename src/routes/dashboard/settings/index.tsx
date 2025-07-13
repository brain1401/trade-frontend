import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Database } from "lucide-react";
import { requireAuth } from "@/lib/utils/authGuard";
import { dashboardNotificationQueries } from "@/lib/api/dashboardnotification/queries";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardNotificationApi } from "@/lib/api/dashboardnotification/api";
import type { DashboardNotification } from "@/lib/api/dashboardnotification";
import { useAuth } from "@/stores/authStore";
import { toast } from "sonner";
import { useEffect, useState } from "react";

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
 * 설정 관리 페이지
 *
 * 인증된 사용자만 접근 가능
 * 개인 설정 및 환경 설정 관리 기능 제공
 */
function SettingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. 서버에서 알림 설정 데이터를 가져옵니다.
  const { data: serverSettings, isLoading } = useQuery(
    dashboardNotificationQueries.settings(),
  );

  // 2. 컴포넌트 내부 상태(State)에서 설정을 관리합니다.
  const [settings, setSettings] = useState<DashboardNotification | null>(null);

  useEffect(() => {
    if (serverSettings) {
      setSettings(serverSettings);
    }
  }, [serverSettings]);

  // 3. 설정을 업데이트하는 Mutation을 정의합니다.
  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: DashboardNotification) =>
      dashboardNotificationApi.updateDashboardNotificationSettings(newSettings),
    onSuccess: (data) => {
      // 성공 시 서버 상태(캐시)와 UI 상태를 함께 업데이트합니다.
      queryClient.setQueryData(
        dashboardNotificationQueries.settings().queryKey,
        data,
      );
      setSettings(data);
      toast.success("알림 설정이 성공적으로 저장되었습니다.");
    },
    onError: (error) => {
      toast.error(`설정 저장에 실패했습니다: ${error.message}`);
      // 실패 시, 서버 데이터로 UI를 되돌립니다.
      setSettings(serverSettings ?? null);
    },
  });

  // 4. 토글 스위치 핸들러
  const handleToggle = (key: keyof DashboardNotification, value: boolean) => {
    if (!settings) return;

    // 새로운 설정 객체 생성
    const newSettings = {
      ...settings,
      [key]: value,
    };

    // UI 즉시 업데이트
    setSettings(newSettings);

    // API 요청
    updateSettingsMutation.mutate(newSettings);
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          알림 설정
        </h1>
        <p className="mt-2 text-neutral-600">알림 설정을 관리할 수 있습니다.</p>
      </div>

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
              <Label className="text-base font-medium">SMS 알림</Label>
              <p className="text-sm text-neutral-500">
                북마크의 SMS 알림을 허용합니다
                {!user?.phoneVerified && (
                  <span className="ml-2 text-xs text-yellow-600">
                    (휴대폰 인증 필요)
                  </span>
                )}
              </p>
            </div>
            <Switch
              checked={settings?.smsNotificationEnabled ?? false}
              onCheckedChange={(value) =>
                handleToggle("smsNotificationEnabled", value)
              }
              disabled={
                !user?.phoneVerified || updateSettingsMutation.isPending
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">이메일 알림</Label>
              <p className="text-sm text-neutral-500">
                북마크의 이메일 알림을 허용합니다
              </p>
            </div>
            <Switch
              checked={settings?.emailNotificationEnabled ?? false}
              onCheckedChange={(value) =>
                handleToggle("emailNotificationEnabled", value)
              }
              disabled={updateSettingsMutation.isPending}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
