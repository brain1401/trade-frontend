import { Link } from "@tanstack/react-router";

type AppLogoProps = {
  /**
   * 로고 크기
   */
  size?: "sm" | "md" | "lg";
  /**
   * 클릭 가능 여부
   */
  clickable?: boolean;
};

type LogoContentProps = {
  size: "sm" | "md" | "lg";
};

/**
 * 로고 내용 컴포넌트
 */
function LogoContent({ size }: LogoContentProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
  };

  return (
    <div
      className={`${sizeClasses[size]} to-brand-600 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 font-bold text-white shadow-sm`}
    >
      <span className="leading-none">로고</span>
    </div>
  );
}

/**
 * TRADE 앱 로고 컴포넌트
 * 메인페이지로 이동할 수 있는 링크 기능 포함
 *
 * @example
 * ```tsx
 * <AppLogo size="md" clickable />
 * ```
 */
export default function AppLogo({
  size = "md",
  clickable = true,
}: AppLogoProps) {
  if (!clickable) {
    return <LogoContent size={size} />;
  }

  return (
    <Link
      to="/"
      className="block transition-opacity hover:opacity-80 active:scale-95"
    >
      <LogoContent size={size} />
    </Link>
  );
}
