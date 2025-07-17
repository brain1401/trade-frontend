import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스를 조건부로 병합하고 중복을 제거하는 유틸리티 함수
 *
 * clsx를 사용하여 조건부 클래스 적용과 다양한 입력 형태를 처리하고,
 * tailwind-merge를 사용하여 Tailwind CSS 클래스 간 충돌을 해결함
 *
 * @param inputs - 병합할 클래스 값들 (문자열, 객체, 배열, undefined, null 등)
 * @returns 중복 제거되고 최적화된 Tailwind CSS 클래스 문자열
 *
 * @example
 * ```typescript
 * // 기본 사용법
 * cn('px-2 py-1', 'text-sm')
 * // 결과: 'px-2 py-1 text-sm'
 *
 * // 조건부 클래스
 * cn('base-class', { 'active-class': isActive, 'disabled-class': isDisabled })
 *
 * // Tailwind 충돌 해결
 * cn('px-2 px-4', 'py-1 py-2')
 * // 결과: 'px-4 py-2' (나중에 오는 값이 우선)
 *
 * // 다양한 형태의 입력
 * cn(['base', 'class'], null, undefined, { conditional: true })
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
