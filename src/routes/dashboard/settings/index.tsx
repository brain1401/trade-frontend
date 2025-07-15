import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import { requireAuth } from "@/lib/utils/authGuard";
import {
  dashboardNotificationQueries,
  dashboardNotificationQueryKeys,
} from "@/lib/api/dashboard/queries";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard/api";
import type { DashboardNotification } from "@/lib/api/dashboard/types";
import { useAuth } from "@/stores/authStore";
import { toast } from "sonner";

/**
 * 설정 관리 라우트 정의
 *
 * 인증된 사용자만 접근 가능한 보호된 페이지
 */
export const Route = createFileRoute("/dashboard/settings/")({
  beforeLoad: ({ location }) => {
    requireAuth(location);
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

  console.log("user : ", user);

  // 서버에서 알림 설정 데이터를 가져옴
  const { data: settings, isLoading } = useQuery(
    dashboardNotificationQueries.settings(user),
  );

  console.log(settings);

  // 설정을 업데이트하는 Mutation - 낙관적 업데이트 적용
  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: DashboardNotification) =>
      dashboardApi.updateDashboardNotificationSettings(newSettings),
    onMutate: async (newSettings) => {
      // 진행 중인 쿼리들을 취소하여 낙관적 업데이트가 덮어씌워지지 않도록 함
      await queryClient.cancelQueries({
        queryKey: dashboardNotificationQueryKeys.settings(user),
      });

      // 이전 데이터를 백업
      const previousSettings = queryClient.getQueryData(
        dashboardNotificationQueryKeys.settings(user),
      );

      // 낙관적으로 새 데이터를 설정
      queryClient.setQueryData(
        dashboardNotificationQueryKeys.settings(user),
        newSettings,
      );

      // 롤백을 위한 컨텍스트 반환
      return { previousSettings };
    },
    onError: (error, _newSettings, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      queryClient.setQueryData(
        dashboardNotificationQueryKeys.settings(user),
        context?.previousSettings,
      );
      toast.error(`설정 저장에 실패했습니다: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("알림 설정이 성공적으로 저장되었습니다.");
    },
    onSettled: () => {
      // 성공/실패 여부와 관계없이 최신 데이터를 다시 가져옴
      queryClient.invalidateQueries({
        queryKey: dashboardNotificationQueryKeys.settings(user),
      });
    },
  });

  // 토글 스위치 핸들러
  const handleToggle = (key: keyof DashboardNotification, value: boolean) => {
    if (!settings) return;

    // 새로운 설정 객체 생성
    const newSettings = {
      ...settings,
      [key]: value,
    };

    // 낙관적 업데이트로 API 요청
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
