import { LogOut, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { mockUserQuickLinks } from "@/data/mock/user";
import { useAuthStore } from "@/stores/authStore";

const LINK_BUTTON_BASE_CLASSES = "h-auto p-0 text-sm hover:underline";
const AVATAR_BORDER_CLASSES = "border-white";

function UserInfoCard() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const notificationStats = user?.notificationStats;

  // 인증되지 않은 경우 로그인 유도 카드 표시
  if (!isAuthenticated || !user) {
    return (
      <Card className="mb-4 overflow-hidden py-0 shadow-lg">
        <CardContent className="p-4 text-center">
          <p className="mb-3 font-bold">로그인이 필요합니다.</p>
          <Button
            variant="default"
            asChild
            className="w-full bg-primary-600 hover:bg-primary-700"
          >
            <Link to="/auth/login">로그인</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 overflow-hidden py-0 shadow-lg">
      <div className="bg-primary-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="mr-3 h-12 w-12">
              <AvatarImage
                src={
                  user.avatar ||
                  "https://placehold.co/48x48/FFFFFF/004E98?text=" +
                    user.name.charAt(0)
                }
                alt="사용자 프로필"
                className={AVATAR_BORDER_CLASSES}
              />
              <AvatarFallback
                className={cn(AVATAR_BORDER_CLASSES, "bg-white text-brand-700")}
              >
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold text-white">{user.name} 님</p>
              <p className="text-xs text-blue-100">{user.email}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="flex h-auto items-center rounded-md bg-white px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-neutral-100"
            onClick={() => logout()}
          >
            <LogOut size={14} className="mr-1" /> 로그아웃
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-around border-b border-neutral-200 pb-3">
          <Button
            variant="link"
            asChild
            className={cn(LINK_BUTTON_BASE_CLASSES, "text-primary-600")}
          >
            <Link to="/dashboard" className="flex items-center">
              <LifeBuoy size={16} className="mr-1.5 text-blue-500" /> 대시보드
            </Link>
          </Button>
          <Button
            variant="link"
            asChild
            className={cn(
              LINK_BUTTON_BASE_CLASSES,
              "ml-4 text-neutral-700 hover:text-primary-600",
            )}
          >
            <Link to="/dashboard">프로필 수정</Link>
          </Button>
        </div>
        <ul className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
          {mockUserQuickLinks.map(({ name, icon: Icon, path }) => {
            // userStats에서 해당하는 count 가져오기
            let count: number | undefined;
            switch (name) {
              case "메시지":
                count = notificationStats?.messageCount;
                break;
              case "북마크":
                count = notificationStats?.bookmarkCount;
                break;
              case "분석이력":
                count = notificationStats?.analysisCount;
                break;
              default:
                count = undefined;
            }

            return (
              <li
                className="flex w-full items-center justify-center"
                key={name}
              >
                <Button
                  variant="ghost"
                  asChild
                  className="relative flex h-auto w-[5rem] flex-col items-center justify-center overflow-visible rounded-md p-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
                >
                  <Link to={path || "#"}>
                    <div className="mb-1">
                      <Icon size={20} />
                    </div>
                    <span>{name}</span>
                    {count && count > 0 && (
                      <Badge
                        variant="destructive"
                        className="pointer-events-none absolute top-0 right-0 z-10 translate-x-1/3 -translate-y-1/3 transform px-1.5 py-0.5 text-xs"
                      >
                        {count}
                      </Badge>
                    )}
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

export default UserInfoCard;
