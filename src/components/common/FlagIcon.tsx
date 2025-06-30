import type { ImgHTMLAttributes } from "react";

/**
 * 국기 아이콘 컴포넌트
 * @param src 국기 이미지 URL
 * @param alt 이미지 대체 텍스트
 */
export function FlagIcon({
  src,
  alt,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return <img className="h-[2.5rem]" src={src} alt={alt} {...props} />;
}
