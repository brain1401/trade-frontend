import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { authApi } from "@/lib/api/auth";
import { setupApiInterceptor, ApiError } from "@/lib/api/client";
import type { User, AuthState, ApiErrorCode } from "@/types/auth";

/**
 * 인증 스토어의 액션들
 */
type AuthActions = {
  // 초기화
  initialize: () => Promise<void>;

  // 로그인
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;

  // 로그아웃 (API v2.4 - 204 No Content 응답)
  logout: () => Promise<void>;

  // 사용자 정보 설정
  setUser: (user: User | null) => void;

  // 로딩 상태 설정
  setLoading: (loading: boolean) => void;

  // 인증 상태 초기화 (401 에러 시)
  clearAuth: () => void;

  // 강제 쿠키 삭제 (문제 해결용)
  clearAuthCookies: () => void;

  // OAuth 콜백 처리
  handleOAuthCallback: () => Promise<boolean>;
};

/**
 * 인증 상태와 액션들을 포함한 스토어 타입
 */
type AuthStore = AuthState & AuthActions;

/**
 * 인증 상태 관리 스토어 (API v2.4 대응)
 *
 * 주요 변경사항:
 * - 로그아웃 응답 변경: 200 OK -> 204 No Content
 * - OAuth 프로필 이미지 지원
 * - 확장된 에러 코드 체계
 * - 보안 정책 강화 (사용자 열거 공격 방지)
 *
 * useShallow를 사용한 최적화된 useAuth 훅과 함께 제공됩니다.
 * 실제로 사용하는 상태나 액션이 변경될 때만 리렌더링을 트리거합니다.
 *
 * 보안 우선 설계 원칙:
 * - JWT 토큰은 HttpOnly 쿠키에서만 관리 (클라이언트 접근 불가)
 * - 프론트엔드 필요 최소 정보만 저장 (email, name, profileImage)
 * - 권한 검증은 서버에서 이메일 기반으로 수행
 * - 민감한 정보(ID, roles 등)는 클라이언트에 노출 금지
 * - 사용자가 삭제되거나 토큰이 유효하지 않으면 자동으로 쿠키 정리
 *
 * @example 기본 사용법
 * ```typescript
 * const { user, isAuthenticated, isLoading, login, logout, initialize } = useAuth();
 *
 * // 초기화
 * useEffect(() => {
 *   initialize();
 * }, [initialize]);
 *
 * // 로그인
 * const handleLogin = async (email: string, password: string) => {
 *   try {
 *     await login(email, password);
 *     router.push('/dashboard');
 *   } catch (error) {
 *     setError(authApi.parseErrorMessage(error));
 *   }
 * };
 *
 * // 조건부 렌더링
 * if (isLoading) return <LoadingSpinner />;
 * if (!isAuthenticated) return <LoginForm onLogin={handleLogin} />;
 * return <Welcome user={user} onLogout={logout} />;
 * ```
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  // 초기 상태
  user: null,
  isAuthenticated: false,
  isLoading: true,

  /**
   * 앱 시작 시 인증 상태 초기화
   *
   * HttpOnly 쿠키가 존재하면 서버에서 사용자 정보를 가져와 상태 설정
   * 쿠키가 없거나 만료되었으면 익명 상태로 초기화
   *
   * API v2.4 개선사항:
   * - 사용자가 데이터베이스에서 삭제된 경우 자동 쿠키 삭제
   * - 토큰이 유효하지 않은 경우 자동 쿠키 삭제
   * - OAuth 프로필 이미지 지원
   */
  initialize: async () => {
    try {
      set({ isLoading: true });

      // 서버에서 인증 상태 확인
      const response = await authApi.verify();

      if (response.success === "SUCCESS" && response.data) {
        // 인증 성공: 사용자 정보 설정
        set({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
        });

        console.log("인증 상태 초기화 완료:", {
          email: response.data.email,
          name: response.data.name,
          hasProfileImage: !!response.data.profileImage,
        });
      } else {
        // 인증 실패: 익명 상태로 설정
        console.warn("인증 실패 - 익명 모드로 전환");
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.warn("인증 상태 확인 실패:", error);

      // API 에러인 경우 상세 로깅
      if (error instanceof ApiError) {
        console.warn("인증 에러 상세:", {
          statusCode: error.statusCode,
          errorCode: error.errorCode,
          message: error.message,
        });

        // 에러 코드별 처리
        switch (error.errorCode) {
          case "AUTH_003":
          case "TOKEN_EXPIRED":
            console.warn("토큰이 만료되었습니다");
            break;
          case "AUTH_004":
          case "INVALID_TOKEN":
            console.warn("토큰이 유효하지 않습니다");
            break;
          case "AUTH_005":
          case "FORBIDDEN":
            console.warn("사용자가 삭제되었거나 비활성화되었습니다");
            break;
        }
      }

      // 모든 경우에 대해 익명 상태로 초기화
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  /**
   * 로그인 처리 (API v2.4 보안 강화)
   *
   * 성공 시 서버에서 HttpOnly 쿠키 자동 설정
   * 클라이언트는 사용자 정보만 상태에 저장
   *
   * 보안 강화:
   * - 로그인 실패 시 기존 쿠키 자동 정리
   * - 사용자 열거 공격 방지를 위한 통합 에러 메시지
   */
  login: async (email: string, password: string, rememberMe = false) => {
    try {
      const response = await authApi.login({
        email,
        password,
        rememberMe,
      });

      if (response.success === "SUCCESS" && response.data) {
        // 로그인 성공: 사용자 정보 설정
        set({
          user: response.data.user,
          isAuthenticated: true,
        });

        console.log("로그인 성공:", {
          email: response.data.user.email,
          name: response.data.user.name,
          hasProfileImage: !!response.data.user.profileImage,
          rememberMe,
        });
      } else {
        throw new Error(response.message || "로그인에 실패했습니다");
      }
    } catch (error) {
      console.error("로그인 실패:", error);

      // API 에러 상세 로깅
      if (error instanceof ApiError) {
        console.error("로그인 에러 상세:", {
          statusCode: error.statusCode,
          errorCode: error.errorCode,
          message: error.message,
        });

        // 에러 코드별 추가 처리
        switch (error.errorCode) {
          case "AUTH_001":
            // 사용자 열거 공격 방지: 동일한 메시지 표시
            console.warn("인증 실패 (사용자 열거 공격 방지)");
            break;
          case "AUTH_002":
            console.warn("계정 일시 잠김");
            break;
          case "RATE_LIMIT_001":
            console.warn("로그인 시도 한도 초과");
            break;
        }
      }

      throw error; // 컴포넌트에서 에러 처리하도록 재던짐
    }
  },

  /**
   * 로그아웃 처리 (API v2.4 - 204 No Content 응답)
   *
   * 서버에서 HttpOnly 쿠키 삭제
   * 클라이언트 상태 초기화
   *
   * 변경사항:
   * - 응답 코드: 200 OK -> 204 No Content
   * - 응답 본문 없음
   * - 에러 발생 시에도 클라이언트 상태는 항상 정리
   */
  logout: async () => {
    try {
      await authApi.logout(); // 이제 void 반환
      console.log("로그아웃 API 호출 완료");
    } catch (error) {
      console.warn("로그아웃 API 호출 실패:", error);
      // 에러가 발생해도 클라이언트 상태는 정리해야 함
    } finally {
      // API 호출 성공 여부와 관계없이 클라이언트 상태 초기화
      set({
        user: null,
        isAuthenticated: false,
      });
      console.log("로그아웃 완료 - 클라이언트 상태 정리됨");
    }
  },

  /**
   * OAuth 콜백 처리 (API v2.4 신규 기능)
   *
   * OAuth 로그인 완료 후 리디렉션된 페이지에서 호출
   * URL 파라미터를 통해 성공/실패 여부 확인
   */
  handleOAuthCallback: async (): Promise<boolean> => {
    try {
      const result = authApi.parseOAuthCallback();

      if (result.success) {
        // OAuth 성공 시 사용자 정보 다시 확인
        const response = await authApi.verify();

        if (response.success === "SUCCESS" && response.data) {
          set({
            user: response.data,
            isAuthenticated: true,
          });

          console.log("OAuth 로그인 완료:", {
            email: response.data.email,
            name: response.data.name,
            hasProfileImage: !!response.data.profileImage,
          });

          return true;
        }
      } else {
        console.error("OAuth 콜백 실패:", result.error);
      }

      return false;
    } catch (error) {
      console.error("OAuth 콜백 처리 실패:", error);
      return false;
    }
  },

  /**
   * 사용자 정보 수동 설정
   */
  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  /**
   * 로딩 상태 설정
   */
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  /**
   * 인증 상태 강제 초기화
   *
   * 401/403 에러 발생 시 API 인터셉터에서 호출
   */
  clearAuth: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
    console.log("인증 상태 강제 초기화");
  },

  /**
   * 인증 쿠키 강제 삭제
   *
   * 인증 문제 해결용 디버깅 기능
   */
  clearAuthCookies: () => {
    authApi.clearAuthCookies();
    set({
      user: null,
      isAuthenticated: false,
    });
    console.log("인증 쿠키 강제 삭제 및 상태 초기화");
  },
}));

// API 인터셉터 설정
setupApiInterceptor(() => {
  const { clearAuth } = useAuthStore.getState();
  clearAuth();
});

/**
 * 최적화된 인증 훅
 *
 * useShallow를 사용하여 실제로 사용하는 상태나 액션이 변경될 때만
 * 리렌더링을 트리거합니다.
 *
 * @example 선택적 구독
 * ```typescript
 * // 사용자 정보만 필요한 경우
 * const { user, isAuthenticated } = useAuth();
 *
 * // 로그인 액션만 필요한 경우
 * const { login, logout } = useAuth();
 *
 * // 모든 상태와 액션이 필요한 경우
 * const auth = useAuth();
 * ```
 */
export const useAuth = () =>
  useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      initialize: state.initialize,
      login: state.login,
      logout: state.logout,
      setUser: state.setUser,
      setLoading: state.setLoading,
      clearAuth: state.clearAuth,
      clearAuthCookies: state.clearAuthCookies,
      handleOAuthCallback: state.handleOAuthCallback,
    })),
  );
