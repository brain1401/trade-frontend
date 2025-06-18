import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/authStore";
import { AuthInitializingSkeleton } from "../../components/common/AuthInitializingSkeleton";

type RouteGuardType = "protected" | "auth-only" | "guest-only";

/**
 * TanStack Router용 라우트 보호 시스템
 *
 * 라우트별 접근 권한을 관리하며, 인증 상태에 따른 적절한 리다이렉션을 수행
 *
 * @module useRouteGuard
 * @since 1.0.0
 *
 * @function useRouteGuard
 * @param {RouteGuardType} guardType - 라우트 보호 유형
 * @returns {Object} 라우트 가드 상태
 * @returns {boolean} returns.isAllowed - 현재 라우트 접근 허용 여부
 * @returns {JSX.Element | null} returns.LoadingComponent - 로딩 중 표시할 컴포넌트
 */
export const useRouteGuard = (guardType: RouteGuardType) => {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * 인증 상태 확인 완료 후 라우트 가드 실행
     *
     * isInitialized가 false인 경우 아직 토큰 검증이 완료되지 않았으므로
     * 리다이렉션을 수행하지 않고 대기
     */
    if (!isInitialized) return;

    switch (guardType) {
      case "protected":
        /**
         * 보호된 라우트 - 로그인 필수
         *
         * 예시: /dashboard, /hscode/analyze, /notifications
         * 인증되지 않은 사용자는 로그인 페이지로 리다이렉션
         */
        if (!isAuthenticated) {
          navigate({ to: "/auth/login" });
        }
        break;

      case "auth-only":
        /**
         * 인증 전용 라우트 - 로그인 사용자만 접근
         *
         * 예시: /auth/login, /auth/signup
         * 이미 로그인한 사용자는 메인 페이지로 리다이렉션
         */
        if (isAuthenticated) {
          navigate({ to: "/" });
        }
        break;

      case "guest-only":
        /**
         * 게스트 전용 라우트 - 비로그인 사용자만 접근
         *
         * 예시: 특정 랜딩 페이지, 소개 페이지
         * 로그인한 사용자는 대시보드로 리다이렉션
         */
        if (isAuthenticated) {
          navigate({ to: "/dashboard" });
        }
        break;
    }
  }, [isAuthenticated, isInitialized, guardType, navigate]);

  /**
   * 현재 라우트 접근 허용 여부 계산
   *
   * 인증 상태 확인이 완료되지 않은 경우 false 반환
   * 이를 통해 로딩 상태를 표시할 수 있음
   */
  const isAllowed = (() => {
    if (!isInitialized) return false;

    switch (guardType) {
      case "protected":
        return isAuthenticated;
      case "auth-only":
        return !isAuthenticated;
      case "guest-only":
        return !isAuthenticated;
      default:
        return true;
    }
  })();

  return {
    /**
     * 현재 라우트 접근 허용 여부
     *
     * true: 현재 사용자가 해당 라우트에 접근 가능
     * false: 접근 불가능하거나 인증 상태 확인 중
     */
    isAllowed,

    /**
     * 로딩 중 표시할 컴포넌트
     *
     * 인증 상태 확인 중일 때만 반환
     * null인 경우 일반적인 로딩 처리 방식 사용
     */
    LoadingComponent: !isInitialized ? AuthInitializingSkeleton : null,
  };
};
