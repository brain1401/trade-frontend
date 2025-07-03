import { redirect } from "@tanstack/react-router";
import type { User } from "@/types/auth";

// beforeLoad 매개변수 타입 정의
type AuthContext = {
  auth: {
    isLoading: boolean;
    isAuthenticated: boolean;
    user: User | null;
  };
};

type LocationContext = {
  href: string;
};

/**
 * 인증된 사용자만 접근 가능한 라우트를 위한 가드 함수
 *
 * beforeLoad에서 사용하여 미인증 사용자를 로그인 페이지로 리디렉션
 * 로딩 상태 중에는 리디렉션하지 않아 UX를 보호함
 *
 * @param context - TanStack Router의 beforeLoad 컨텍스트
 * @param location - 현재 위치 정보
 * @param redirectTo - 리디렉션할 경로 (기본값: "/auth/login")
 *
 * @throws redirect - 미인증 사용자일 경우 로그인 페이지로 리디렉션
 *
 * @example
 * ```typescript
 * export const Route = createFileRoute("/protected-page/")({
 *   beforeLoad: ({ context, location }) => {
 *     requireAuth(context, location);
 *   },
 *   component: ProtectedPage,
 * });
 * ```
 *
 * @example 커스텀 리디렉션 경로
 * ```typescript
 * beforeLoad: ({ context, location }) => {
 *   requireAuth(context, location, "/custom-login");
 * }
 * ```
 */
export const requireAuth = (
  context: AuthContext,
  location: LocationContext,
  redirectTo: string = "/auth/login",
): void => {
  // 로딩 중이면 리디렉션하지 않음 (안전장치)
  if (context.auth.isLoading) {
    return;
  }

  if (!context.auth.isAuthenticated) {
    throw redirect({
      to: redirectTo,
      search: {
        redirect: location.href,
      } as Record<string, string>,
      replace: true,
    });
  }
};

/**
 * 역방향 인증 가드 - 이미 로그인한 사용자는 접근 제한
 *
 * 로그인/회원가입 페이지처럼 이미 인증된 사용자가 접근하면 안 되는 페이지용
 * 인증된 사용자는 대시보드로 리디렉션
 *
 * @param context - TanStack Router의 beforeLoad 컨텍스트
 * @param redirectTo - 인증된 사용자 리디렉션 경로 (기본값: "/dashboard")
 *
 * @example
 * ```typescript
 * export const Route = createFileRoute("/auth/login")({
 *   beforeLoad: ({ context }) => {
 *     requireGuest(context);
 *   },
 *   component: LoginPage,
 * });
 * ```
 */
export const requireGuest = (
  context: AuthContext,
  redirectTo: string = "/dashboard",
): void => {
  // 로딩 중이면 리디렉션하지 않음
  if (context.auth.isLoading) {
    return;
  }

  if (context.auth.isAuthenticated) {
    throw redirect({
      to: redirectTo,
      replace: true,
    });
  }
};
