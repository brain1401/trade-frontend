import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";

/**
 * AI HS Code 레이더 시스템의 앱 초기화 시 인증 상태 자동 확인 훅
 *
 * 앱이 시작될 때 저장된 JWT 토큰의 유효성을 검증하고,
 * 필요 시 refresh token을 사용하여 자동 토큰 갱신을 수행함
 * 사용자가 이전 세션에서 로그인한 상태를 유지할 수 있도록 함
 *
 * @module useAuthInit
 * @since 1.0.0
 *
 * @function useAuthInit
 * @returns {Object} 인증 초기화 상태 정보
 * @returns {boolean} returns.isInitialized - 인증 상태 확인 완료 여부
 * @returns {boolean} returns.isLoading - 인증 상태 확인 진행 중 여부
 *
 * @example
 * ```typescript
 * // App 컴포넌트에서 앱 초기화 시 사용
 * function App() {
 *   const { isInitialized, isLoading } = useAuthInit();
 *
 *   if (isLoading) {
 *     return <LoadingSpinner />;
 *   }
 *
 *   if (!isInitialized) {
 *     return <InitializingScreen />;
 *   }
 *
 *   return <MainApp />;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Root 레이아웃에서 조건부 렌더링
 * function RootLayout() {
 *   const { isInitialized, isLoading } = useAuthInit();
 *   const { isAuthenticated } = useAuthStore();
 *
 *   return (
 *     <div>
 *       {isInitialized && isAuthenticated && <UserNavigation />}
 *       <Outlet />
 *     </div>
 *   );
 * }
 * ```
 *
 * @description
 * 주요 동작 과정:
 * - 컴포넌트 마운트 시 useEffect를 통해 한 번만 실행
 * - localStorage의 토큰 존재 여부 확인
 * - 토큰이 있으면 서버에 유효성 검증 요청
 * - 만료된 토큰의 경우 refresh token으로 자동 갱신 시도
 * - 갱신 실패 시 로그아웃 상태로 전환
 * - 모든 과정 완료 후 isInitialized를 true로 설정
 *
 * @description
 * 보안 고려사항:
 * - 토큰 검증은 스프링부트 서버의 `/auth/validate` 엔드포인트 사용
 * - 네트워크 오류 시 재시도 로직 포함
 * - XSS 공격 방지를 위한 secure token 저장 방식 적용
 *
 * @description
 * 성능 최적화:
 * - isInitialized 플래그로 중복 실행 방지
 * - 토큰이 없는 경우 서버 요청 생략
 * - 메모이제이션된 initializeAuth 함수 사용
 */
export const useAuthInit = () => {
  const { initializeAuth, isInitialized, isLoading } = useAuthStore();

  useEffect(() => {
    /**
     * 인증 상태 초기화 로직
     *
     * isInitialized 플래그를 확인하여 중복 실행을 방지하고,
     * 저장된 토큰의 유효성을 검증하여 사용자 세션을 복원함
     */
    if (!isInitialized) {
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  return {
    /**
     * 현재 인증 상태 확인 중 여부
     *
     * true: 토큰 검증 및 사용자 정보 복원 진행 중
     * false: 인증 상태 확인 완료 또는 미시작
     */
    isLoading,

    /**
     * 인증 상태 확인 완료 여부
     *
     * true: 토큰 검증 및 인증 상태 확인 완료
     * false: 아직 인증 상태 확인 중
     */
    isInitialized,
  };
};
