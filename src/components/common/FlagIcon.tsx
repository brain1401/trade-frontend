import type { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  className?: string;
};

/**
 * 국기 아이콘 컴포넌트
 * @param src 국기 이미지 URL
 * @param alt 이미지 대체 텍스트
 * @param className 이미지 클래스 이름
 */
export function FlagIcon({ className, src, alt, ...props }: Props) {
  return (
    <img
      className={cn("h-[2.5rem]", className)}
      src={src}
      alt={alt}
      {...props}
    />
  );
}
