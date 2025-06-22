import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      style={
        {
          // Sonner 내부에서 실제로 사용하는 CSS 변수들
          "--gray1": "var(--color-neutral-50)",
          "--gray2": "var(--color-neutral-100)",
          "--gray3": "var(--color-neutral-200)",
          "--gray4": "var(--color-neutral-300)",
          "--gray11": "var(--color-neutral-700)",
          "--gray12": "var(--color-neutral-900)",

          // 토스트 배경과 텍스트
          "--normal-bg": "var(--color-neutral-50)",
          "--normal-text": "var(--color-neutral-900)",
          "--normal-border": "var(--color-neutral-200)",

          // 성공 토스트
          "--success-bg": "var(--color-success-50)",
          "--success-text": "var(--color-success-900)",
          "--success-border": "var(--color-success-200)",

          // 오류 토스트
          "--error-bg": "var(--color-warning-50)",
          "--error-text": "var(--color-warning-900)",
          "--error-border": "var(--color-warning-200)",

          // 정보 토스트
          "--info-bg": "var(--color-info-50)",
          "--info-text": "var(--color-info-900)",
          "--info-border": "var(--color-info-200)",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          background: "var(--color-neutral-50)",
          color: "var(--color-neutral-900)",
          border: "1px solid var(--color-neutral-200)",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
