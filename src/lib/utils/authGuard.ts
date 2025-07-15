import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/types/auth";

// beforeLoad 매개변수 타입 정의 (location만 필요)
type LocationContext = {
  href: string;
};

/**
 * 인증된 사용자만 접근 가능한 라우트를 위한 가드 함수
 *
 * beforeLoad에서 사용하여 미인증 사용자를 로그인 페이지로 리디렉션
 * 로딩 상태 중에는 리디렉션하지 않아 UX를 보호함
 *
 * Zustand store를 직접 사용하여 auth 상태 확인
 *
 * @param location - 현재 위치 정보
 * @param redirectTo - 리디렉션할 경로 (기본값: "/auth/login")
 *
 * @throws redirect - 미인증 사용자일 경우 로그인 페이지로 리디렉션
 *
 * @example
 * ```typescript
 * export const Route = createFileRoute("/protected-page/")({
 *   beforeLoad: ({ location }) => {
 *     requireAuth(location);
 *   },
 *   component: ProtectedPage,
 * });
 * ```
 *
 * @example 커스텀 리디렉션 경로
 * ```typescript
 * beforeLoad: ({ location }) => {
 *   requireAuth(location, "/custom-login");
 * }
 * ```
 */
export const requireAuth = (
  location: LocationContext,
  redirectTo: string = "/auth/login",
): void => {
  const { isLoading, isAuthenticated, initializationState } =
    useAuthStore.getState();

  // 초기화가 완료되지 않았거나 로딩 중이면 리디렉션하지 않음
  if (initializationState !== "completed" || isLoading) {
    return;
  }

  if (!isAuthenticated) {
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
 * Zustand store를 직접 사용하여 auth 상태 확인
 *
 * @param redirectTo - 인증된 사용자 리디렉션 경로 (기본값: "/dashboard")
 *
 * @example
 * ```typescript
 * export const Route = createFileRoute("/auth/login")({
 *   beforeLoad: () => {
 *     requireGuest();
 *   },
 *   component: LoginPage,
 * });
 * ```
 */
export const requireGuest = (redirectTo: string = "/dashboard"): void => {
  const { isLoading, isAuthenticated, initializationState } =
    useAuthStore.getState();

  // 초기화가 완료되지 않았거나 로딩 중이면 리디렉션하지 않음
  if (initializationState !== "completed" || isLoading) {
    return;
  }

  if (isAuthenticated) {
    throw redirect({
      to: redirectTo,
      replace: true,
    });
  }
};

/**
 * 휴대폰 인증이 완료된 사용자만 접근 가능한 라우트 가드
 *
 * @param location - 현재 위치 정보
 * @param redirectTo - 휴대폰 인증 페이지 경로 (기본값: "/verify-phone")
 *
 * @example
 * ```typescript
 * beforeLoad: ({ location }) => {
 *   requirePhoneVerified(location);
 * }
 * ```
 */
export const requirePhoneVerified = (
  location: LocationContext,
  redirectTo: string = "/verify-phone",
): void => {
  const { isLoading, isAuthenticated, user, initializationState } =
    useAuthStore.getState();

  // 먼저 인증 확인
  requireAuth(location);

  // 초기화가 완료되지 않았거나 로딩 중이면 리디렉션하지 않음
  if (initializationState !== "completed" || isLoading) {
    return;
  }

  // 사용자가 없거나 휴대폰 인증이 완료되지 않은 경우 리디렉션
  if (!user || !user.phoneVerified) {
    throw redirect({
      to: redirectTo,
      search: {
        redirect: location.href,
        reason: "phone_verification_required",
      } as Record<string, string>,
      replace: true,
    });
  }
};

/**
 * 프로필 이미지가 있는 사용자만 접근 가능한 라우트 가드
 *
 * @param location - 현재 위치 정보
 * @param redirectTo - 프로필 설정 페이지 경로 (기본값: "/profile/setup")
 *
 * @example
 * ```typescript
 * beforeLoad: ({ location }) => {
 *   requireProfileImage(location);
 * }
 * ```
 */
export const requireProfileImage = (
  location: LocationContext,
  redirectTo: string = "/profile/setup",
): void => {
  const { isLoading, isAuthenticated, user, initializationState } =
    useAuthStore.getState();

  // 먼저 인증 확인
  requireAuth(location);

  // 초기화가 완료되지 않았거나 로딩 중이면 리디렉션하지 않음
  if (initializationState !== "completed" || isLoading) {
    return;
  }

  // 사용자가 없거나 프로필 이미지가 없는 경우 리디렉션
  if (!user || !user.profileImage) {
    throw redirect({
      to: redirectTo,
      search: {
        redirect: location.href,
        reason: "profile_image_required",
      } as Record<string, string>,
      replace: true,
    });
  }
};

/**
 * 완전한 프로필 설정이 완료된 사용자만 접근 가능한 라우트 가드
 *
 * 이름, 프로필 이미지, 휴대폰 인증이 모두 완료된 사용자만 허용
 *
 * @param location - 현재 위치 정보
 * @param redirectTo - 프로필 완성 페이지 경로 (기본값: "/profile/complete")
 *
 * @example
 * ```typescript
 * beforeLoad: ({ location }) => {
 *   requireCompleteProfile(location);
 * }
 * ```
 */
export const requireCompleteProfile = (
  location: LocationContext,
  redirectTo: string = "/profile/complete",
): void => {
  const { isLoading, isAuthenticated, user, initializationState } =
    useAuthStore.getState();

  // 먼저 인증 확인
  requireAuth(location);

  // 초기화가 완료되지 않았거나 로딩 중이면 리디렉션하지 않음
  if (initializationState !== "completed" || isLoading) {
    return;
  }

  // 완전한 프로필 확인
  if (!user || !user.name || !user.profileImage || !user.phoneVerified) {
    throw redirect({
      to: redirectTo,
      search: {
        redirect: location.href,
        reason: "complete_profile_required",
      } as Record<string, string>,
      replace: true,
    });
  }
};

/**
 * 사용자 정보를 기반으로 커스텀 조건을 확인하는 가드 함수
 *
 * @param condition - 사용자 정보를 받아 boolean을 반환하는 함수
 * @param location - 현재 위치 정보
 * @param redirectTo - 조건 불만족 시 리디렉션 경로
 *
 * @example
 * ```typescript
 * beforeLoad: ({ location }) => {
 *   requireCondition(
 *     (user) => user.phoneVerified === true,
 *     location,
 *     "/verify-phone"
 *   );
 * }
 * ```
 *
 * @example 최근 로그인 사용자만 허용
 * ```typescript
 * beforeLoad: ({ location }) => {
 *   requireCondition(
 *     (user) => {
 *       if (!user.lastLoggedInAt) return false;
 *       const lastLogin = new Date(user.lastLoggedInAt);
 *       const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
 *       return lastLogin > oneDayAgo;
 *     },
 *     location,
 *     "/login"
 *   );
 * }
 * ```
 */
export const requireCondition = (
  condition: (user: User) => boolean,
  location: LocationContext,
  redirectTo: string = "/dashboard",
): void => {
  const { isLoading, isAuthenticated, user, initializationState } =
    useAuthStore.getState();

  // 먼저 인증 확인
  requireAuth(location);

  // 초기화가 완료되지 않았거나 로딩 중이면 리디렉션하지 않음
  if (initializationState !== "completed" || isLoading) {
    return;
  }

  // 사용자가 없거나 조건을 만족하지 않으면 리디렉션
  if (!user || !condition(user)) {
    throw redirect({
      to: redirectTo,
      search: {
        redirect: location.href,
        error: "condition_not_met",
      } as Record<string, string>,
      replace: true,
    });
  }
};

/**
 * 여러 조건 중 하나라도 만족하면 접근 가능한 라우트 가드
 *
 * @param conditions - 조건 함수들의 배열
 * @param location - 현재 위치 정보
 * @param redirectTo - 모든 조건 불만족 시 리디렉션 경로
 *
 * @example
 * ```typescript
 * beforeLoad: ({ location }) => {
 *   requireAnyCondition([
 *     (user) => user.phoneVerified === true,
 *     (user) => user.email.endsWith("@company.com"),
 *   ], location, "/verify-phone");
 * }
 * ```
 */
export const requireAnyCondition = (
  conditions: ((user: User) => boolean)[],
  location: LocationContext,
  redirectTo: string = "/dashboard",
): void => {
  const { isLoading, isAuthenticated, user, initializationState } =
    useAuthStore.getState();

  // 먼저 인증 확인
  requireAuth(location);

  // 초기화가 완료되지 않았거나 로딩 중이면 리디렉션하지 않음
  if (initializationState !== "completed" || isLoading) {
    return;
  }

  // 사용자가 없거나 조건 중 하나도 만족하지 않으면 리디렉션
  if (!user || !conditions.some((condition) => condition(user))) {
    throw redirect({
      to: redirectTo,
      search: {
        redirect: location.href,
        error: "no_condition_met",
      } as Record<string, string>,
      replace: true,
    });
  }
};

/**
 * 모든 조건을 만족해야 접근 가능한 라우트 가드
 *
 * @param conditions - 조건 함수들의 배열
 * @param location - 현재 위치 정보
 * @param redirectTo - 조건 불만족 시 리디렉션 경로
 *
 * @example
 * ```typescript
 * beforeLoad: ({ location }) => {
 *   requireAllConditions([
 *     (user) => user.phoneVerified === true,
 *     (user) => user.profileImage !== null,
 *     (user) => user.name.length > 0,
 *   ], location, "/profile/complete");
 * }
 * ```
 */
export const requireAllConditions = (
  conditions: ((user: User) => boolean)[],
  location: LocationContext,
  redirectTo: string = "/dashboard",
): void => {
  const { isLoading, isAuthenticated, user, initializationState } =
    useAuthStore.getState();

  // 먼저 인증 확인
  requireAuth(location);

  // 초기화가 완료되지 않았거나 로딩 중이면 리디렉션하지 않음
  if (initializationState !== "completed" || isLoading) {
    return;
  }

  // 사용자가 없거나 조건을 모두 만족하지 않으면 리디렉션
  if (!user || !conditions.every((condition) => condition(user))) {
    throw redirect({
      to: redirectTo,
      search: {
        redirect: location.href,
        error: "conditions_not_met",
      } as Record<string, string>,
      replace: true,
    });
  }
};

/**
 * 특정 이메일 도메인 사용자만 접근 가능한 라우트 가드
 *
 * @param allowedDomains - 허용되는 이메일 도메인 배열
 * @param location - 현재 위치 정보
 * @param redirectTo - 권한 없을 시 리디렉션 경로
 *
 * @example
 * ```typescript
 * beforeLoad: ({ location }) => {
 *   requireEmailDomain(["company.com", "partner.com"], location);
 * }
 * ```
 */
export const requireEmailDomain = (
  allowedDomains: string[],
  location: LocationContext,
  redirectTo: string = "/dashboard",
): void => {
  const { isLoading, isAuthenticated, user, initializationState } =
    useAuthStore.getState();

  // 먼저 인증 확인
  requireAuth(location);

  // 초기화가 완료되지 않았거나 로딩 중이면 리디렉션하지 않음
  if (initializationState !== "completed" || isLoading) {
    return;
  }

  // 사용자가 없거나 허용된 도메인이 아니면 리디렉션
  if (!user) {
    throw redirect({
      to: redirectTo,
      search: {
        error: "user_not_found",
      } as Record<string, string>,
      replace: true,
    });
  }

  const userDomain = user.email.split("@")[1];
  if (!allowedDomains.includes(userDomain)) {
    throw redirect({
      to: redirectTo,
      search: {
        error: "invalid_email_domain",
      } as Record<string, string>,
      replace: true,
    });
  }
};

/**
 * 최근 로그인 사용자만 접근 가능한 라우트 가드
 *
 * @param maxHours - 최대 허용 시간 (기본값: 24시간)
 * @param location - 현재 위치 정보
 * @param redirectTo - 재로그인 페이지 경로
 *
 * @example
 * ```typescript
 * beforeLoad: ({ location }) => {
 *   requireRecentLogin(1, location); // 1시간 이내 로그인한 사용자만
 * }
 * ```
 */
export const requireRecentLogin = (
  maxHours: number = 24,
  location: LocationContext,
  redirectTo: string = "/auth/login",
): void => {
  const { isLoading, isAuthenticated, user, initializationState } =
    useAuthStore.getState();

  // 먼저 인증 확인
  requireAuth(location);

  // 초기화가 완료되지 않았거나 로딩 중이면 리디렉션하지 않음
  if (initializationState !== "completed" || isLoading) {
    return;
  }

  // 사용자가 없거나 최근 로그인 기록이 없으면 리디렉션
  if (!user || !user.lastLoggedInAt) {
    throw redirect({
      to: redirectTo,
      search: {
        redirect: location.href,
        reason: "recent_login_required",
      } as Record<string, string>,
      replace: true,
    });
  }

  const lastLogin = new Date(user.lastLoggedInAt);
  const maxTime = new Date(Date.now() - maxHours * 60 * 60 * 1000);

  if (lastLogin < maxTime) {
    throw redirect({
      to: redirectTo,
      search: {
        redirect: location.href,
        reason: "login_expired",
      } as Record<string, string>,
      replace: true,
    });
  }
};

/**
 * 개발 환경에서만 접근 가능한 라우트 가드
 *
 * @param location - 현재 위치 정보
 * @param redirectTo - 프로덕션 환경에서의 리디렉션 경로
 *
 * @example
 * ```typescript
 * beforeLoad: ({ location }) => {
 *   requireDevelopment(location);
 * }
 * ```
 */
export const requireDevelopment = (
  location: LocationContext,
  redirectTo: string = "/dashboard",
): void => {
  if (import.meta.env.PROD) {
    throw redirect({
      to: redirectTo,
      replace: true,
    });
  }
};

/**
 * 앱 초기화가 완료될 때까지 대기하는 가드 함수
 *
 * 앱 시작 시 인증 상태 초기화가 완료되기 전까지 라우팅을 지연시킴
 *
 * @param location - 현재 위치 정보
 * @param loadingRedirect - 초기화 중 리디렉션할 경로 (옵션)
 *
 * @example
 * ```typescript
 * beforeLoad: ({ location }) => {
 *   waitForInitialization(location);
 * }
 * ```
 */
export const waitForInitialization = (
  location: LocationContext,
  loadingRedirect?: string,
): void => {
  const { initializationState } = useAuthStore.getState();

  // 초기화가 진행 중이면 로딩 페이지로 리디렉션 (옵션)
  if (initializationState === "initializing" && loadingRedirect) {
    throw redirect({
      to: loadingRedirect,
      search: {
        redirect: location.href,
      } as Record<string, string>,
      replace: true,
    });
  }

  // // 초기화 실패 시 에러 페이지로 리디렉션
  // if (initializationState === "failed") {
  //   throw redirect({
  //     to: "/error",
  //     search: {
  //       error: "initialization_failed",
  //     } as Record<string, string>,
  //     replace: true,
  //   });
  // }
};

/**
 * 사용자 이름이 설정된 사용자만 접근 가능한 라우트 가드
 *
 * @param location - 현재 위치 정보
 * @param redirectTo - 이름 설정 페이지 경로
 *
 * @example
 * ```typescript
 * beforeLoad: ({ location }) => {
 *   requireUserName(location);
 * }
 * ```
 */
export const requireUserName = (
  location: LocationContext,
  redirectTo: string = "/profile/name",
): void => {
  const { isLoading, user, initializationState } = useAuthStore.getState();

  // 먼저 인증 확인
  requireAuth(location);

  // 초기화가 완료되지 않았거나 로딩 중이면 리디렉션하지 않음
  if (initializationState !== "completed" || isLoading) {
    return;
  }

  // 사용자가 없거나 이름이 설정되지 않은 경우 리디렉션
  if (!user || !user.name || user.name.trim().length === 0) {
    throw redirect({
      to: redirectTo,
      search: {
        redirect: location.href,
        reason: "name_required",
      } as Record<string, string>,
      replace: true,
    });
  }
};
