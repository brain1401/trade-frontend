import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";

/**
 * 보호된 라우트에서 사용할 인증 검증 함수
 *
 * 인증되지 않은 사용자가 보호된 페이지에 접근할 때
 * 현재 경로를 기억하고 로그인 페이지로 리디렉션합니다.
 *
 * @param currentPath - 현재 접근하려는 경로
 * @returns 인증 상태 또는 리디렉션 처리
 */
export function requireAuth(currentPath: string) {
  const { isAuthenticated, isLoading } = useAuthStore.getState();

  // 인증 상태가 아직 로딩 중인 경우 대기
  if (isLoading) {
    return null; // 로딩 중이면 컴포넌트에서 처리
  }

  // 인증되지 않은 경우 로그인 페이지로 리디렉션
  if (!isAuthenticated) {
    throw redirect({
      to: "/auth/login",
      search: {
        redirect: currentPath,
      },
    });
  }

  return true;
}

/**
 * 게스트 전용 라우트에서 사용할 함수
 *
 * 이미 로그인된 사용자가 로그인/회원가입 페이지에 접근할 때
 * 홈 페이지로 리디렉션합니다.
 *
 * @param redirectTo - 리디렉션할 경로 (기본값: "/")
 * @returns 게스트 상태 또는 리디렉션 처리
 */
export function requireGuest(redirectTo: string = "/") {
  const { isAuthenticated, isLoading } = useAuthStore.getState();

  // 인증 상태가 아직 로딩 중인 경우 대기
  if (isLoading) {
    return null; // 로딩 중이면 컴포넌트에서 처리
  }

  // 이미 인증된 경우 지정된 페이지로 리디렉션
  if (isAuthenticated) {
    throw redirect({
      to: redirectTo,
    });
  }

  return true;
}

/**
 * 보호된 라우트 목록
 *
 * 이 목록에 포함된 경로는 인증이 필요합니다.
 */
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/bookmarks",
  "/profile",
  "/settings",
] as const;

/**
 * 게스트 전용 라우트 목록
 *
 * 이 목록에 포함된 경로는 로그인하지 않은 사용자만 접근 가능합니다.
 */
export const GUEST_ONLY_ROUTES = ["/auth/login", "/auth/signup"] as const;

/**
 * 공개 라우트 목록
 *
 * 이 목록에 포함된 경로는 누구나 접근 가능합니다.
 */
export const PUBLIC_ROUTES = [
  "/",
  "/search",
  "/exchange-rates",
  "/news",
  "/auth/callback",
] as const;

/**
 * 주어진 경로가 보호된 라우트인지 확인
 */
export function isProtectedRoute(path: string): boolean {
  return PROTECTED_ROUTES.some((route) => path.startsWith(route));
}

/**
 * 주어진 경로가 게스트 전용 라우트인지 확인
 */
export function isGuestOnlyRoute(path: string): boolean {
  return GUEST_ONLY_ROUTES.some((route) => path.startsWith(route));
}

/**
 * 주어진 경로가 공개 라우트인지 확인
 */
export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => path === route || path.startsWith(route),
  );
}
