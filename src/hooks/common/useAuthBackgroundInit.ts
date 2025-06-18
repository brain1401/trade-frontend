import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";

/**
 * 백그라운드에서 조용히 인증 상태를 초기화하는 훅
 *
 * 기존 useAuthInit과 다른 점:
 * - UI를 차단하지 않고 백그라운드에서 실행
 * - 로딩 상태를 외부에 노출하지 않음
 * - 정적 콘텐츠가 먼저 렌더링될 수 있도록 함
 *
 * @module useAuthBackgroundInit
 * @since 1.0.0
 *
 * @function useAuthBackgroundInit
 * @returns {Object} 인증 초기화 상태 정보
 * @returns {boolean} returns.isInitialized - 인증 상태 확인 완료 여부
 *
 * @example
 * // App 컴포넌트에서 백그라운드 초기화
 * function App() {
 *   const { isInitialized } = useAuthBackgroundInit();
 *   return (
 *     <div>
 *       정적 콘텐츠는 즉시 표시
 *       동적 콘텐츠만 조건부 렌더링
 *     </div>
 *   );
 * }
 *
 * @description
 * 주요 동작 과정:
 * - 컴포넌트 마운트 시 useEffect를 통해 한 번만 실행
 * - 토큰 검증 및 갱신을 백그라운드에서 수행
 * - isLoading 상태를 외부에 노출하지 않아 UI 차단 방지
 * - 인증 완료 후 isInitialized만 true로 업데이트
 *
 * @description
 * 성능 최적화:
 * - 중복 실행 방지를 위한 isInitialized 확인
 * - 최소한의 상태만 반환하여 불필요한 리렌더링 방지
 * - 토큰이 이미 유효한 경우 빠른 복원
 */
export const useAuthBackgroundInit = () => {
  const { initializeAuth, isInitialized } = useAuthStore();

  useEffect(() => {
    /**
     * 백그라운드 인증 상태 확인 로직
     *
     * isInitialized 플래그를 확인하여 중복 실행을 방지하고,
     * UI를 차단하지 않으면서 인증 상태를 검증함
     */
    if (!isInitialized) {
      // 백그라운드에서 조용히 실행 - UI 차단 없음
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  return {
    /**
     * 인증 상태 확인 완료 여부
     *
     * true: 토큰 검증 및 인증 상태 확인 완료
     * false: 아직 인증 상태 확인 중
     *
     * 주의: isLoading은 의도적으로 노출하지 않음
     * 이를 통해 UI가 차단되지 않고 점진적 로딩이 가능함
     */
    isInitialized,
  };
};
