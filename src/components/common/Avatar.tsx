import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

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
};

/**
 * 사용자 아바타를 표시하는 컴포넌트
 *
 * @example
 * ```tsx
 * <UserAvatar
 *   src="/user-profile.jpg"
 *   name="홍길동"
 *   size="md"
 * />
 * ```
 */
export default function UserAvatar({
  src,
  name = "사용자",
  size = "md",
}: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {src ? getInitials(name) : <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
}
