import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

type AppLogoProps = {
  /**
   * 클릭 가능 여부
   */
  clickable?: boolean;
  className?: string;
};

/**
 * 로고 내용 컴포넌트
 */
function LogoContent({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center",
        className,
      )}
    >
      <img
        src="/logo.webp"
        alt="logo"
        className="h-[3.5rem] scale-[2] overflow-hidden object-contain"
      />
      <span className="absolute bottom-[-.5rem] text-sm text-neutral-500">
        TrAI-bot
      </span>
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
export default function AppLogo({ clickable = true, className }: AppLogoProps) {
  if (!clickable) {
    return <LogoContent className={className} />;
  }

  return (
    <Link
      to="/"
      className={cn(
        "block h-full w-full transition-opacity hover:opacity-80 active:scale-95",
        className,
      )}
    >
      <LogoContent className={className} />
    </Link>
  );
}
