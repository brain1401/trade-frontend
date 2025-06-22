import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useAuth } from "@/stores/authStore";
import { User, Settings, LogOut } from "lucide-react";

type UserAvatarProps = {
  /**
   * 사용자 프로필 이미지 URL
   */
  src?: string;
  /**
   * 사용자 이름 (이니셜 표시용)
   */
  name?: string;
  /**
   * 아바타 크기
   */
  size?: "sm" | "md" | "lg";
  /**
   * HoverCard 기능 사용 여부 (기본: true)
   */
  showHoverCard?: boolean;
};

/**
 * 사용자 아바타를 표시하는 컴포넌트
 * 마우스 호버 시 사용자 정보 HoverCard 표시
 *
 * @example 기본 사용법 (HoverCard 포함)
 * ```tsx
 * <UserAvatar
 *   src="/user-profile.jpg"
 *   name="홍길동"
 *   size="md"
 * />
 * ```
 *
 * @example HoverCard 없이 단순 표시
 * ```tsx
 * <UserAvatar
 *   src="/user-profile.jpg"
 *   name="홍길동"
 *   size="md"
 *   showHoverCard={false}
 * />
 * ```
 */
export default function UserAvatar({
  src,
  name = "사용자",
  size = "md",
  showHoverCard = true,
}: UserAvatarProps) {
  const { user, logout } = useAuth();

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const handleEditProfile = () => {
    // TODO: 회원정보 수정 페이지로 이동
    console.log("회원정보 수정 페이지로 이동");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
    }
  };

  const avatarContent = (
    <Avatar
      className={`${sizeClasses[size]} ${showHoverCard ? "cursor-pointer" : ""}`}
    >
      <AvatarImage
        src={src || user?.profileImage || undefined}
        alt={name || user?.name || "사용자"}
      />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {src || user?.profileImage ? (
          getInitials(name || user?.name || "사용자")
        ) : (
          <User className="h-4 w-4" />
        )}
      </AvatarFallback>
    </Avatar>
  );

  if (!showHoverCard) {
    return avatarContent;
  }

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>{avatarContent}</HoverCardTrigger>
      <HoverCardContent className="w-80" align="end" side="right">
        <div className="space-y-4">
          {/* 사용자 정보 헤더 */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={src || user?.profileImage || undefined}
                alt={name || user?.name || "사용자"}
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {src || user?.profileImage ? (
                  getInitials(name || user?.name || "사용자")
                ) : (
                  <User className="h-5 w-5" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900">
                {name || user?.name || "사용자"}
              </p>
              <p className="truncate text-xs text-neutral-600">
                {user?.email || "이메일 없음"}
              </p>
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t border-neutral-200" />

          {/* 액션 버튼들 */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
              onClick={handleEditProfile}
            >
              <Settings className="mr-2 h-4 w-4" />
              회원정보 수정
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
