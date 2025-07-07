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
  return (
    <img
      src="/logo.png"
      alt="logo"
      className="to-brand-600 flex w-[10rem] items-center justify-center rounded-lg font-bold text-white"
    />
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
