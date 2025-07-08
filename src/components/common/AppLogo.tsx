import { Link } from "@tanstack/react-router";

type AppLogoProps = {
  /**
   * 클릭 가능 여부
   */
  clickable?: boolean;
};

/**
 * 로고 내용 컴포넌트
 */
function LogoContent() {
  return (
    <img
      src="/logo.webp"
      alt="logo"
      className="to-brand-600 flex h-full w-full items-center justify-center rounded-lg object-cover font-bold text-white"
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
export default function AppLogo({ clickable = true }: AppLogoProps) {
  if (!clickable) {
    return <LogoContent />;
  }

  return (
    <Link
      to="/"
      className="block h-full w-full transition-opacity hover:opacity-80 active:scale-95"
    >
      <LogoContent />
    </Link>
  );
}
