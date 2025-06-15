import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "@tanstack/react-router";

export const useAuthCheck = () => {
  const {
    isAuthenticated,
    token,
    refreshToken,
    logout,
    checkTokenValidity,
    refreshAuthToken,
    user,
    initialize,
  } = useAuthStore();
  const router = useRouter();

  // 함수들을 useCallback으로 memoize하여 참조 안정화
  const handleLogout = useCallback(() => {
    logout();
    router.navigate({ to: "/auth/login" });
  }, [logout, router]);

  useEffect(() => {
    // 앱 시작 시 저장된 인증 정보 확인
    const checkAuthStatus = async () => {
      try {
        // localStorage에서 토큰 확인
        const storedToken = localStorage.getItem("auth-token");
        const storedUser = localStorage.getItem("auth-user");

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);

          // TODO: 실제로는 서버에 토큰 유효성 검증 요청
          // const isValidToken = await validateToken(storedToken);

          // 임시로 토큰이 있으면 유효한 것으로 처리
          useAuthStore.setState({
            isAuthenticated: true,
            token: storedToken,
            user: userData,
          });
        } else {
          // 토큰이 없으면 로그아웃 상태 - 직접 호출로 의존성 문제 해결
          useAuthStore.getState().logout();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        useAuthStore.getState().logout();
      }
    };

    checkAuthStatus();
  }, []); // 초기 실행만 필요하므로 빈 배열, store 메서드 직접 호출로 의존성 불필요

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated || !token) {
        return;
      }

      try {
        // Check if current token is valid
        const isValid = await checkTokenValidity(token);

        if (!isValid) {
          // Try to refresh token
          if (refreshToken) {
            try {
              await refreshAuthToken(refreshToken);
            } catch (error) {
              console.error("Token refresh failed:", error);
              handleLogout();
            }
          } else {
            // No refresh token, logout user
            handleLogout();
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        handleLogout();
      }
    };

    // Check auth status on mount
    checkAuth();

    // Set up periodic token validity check (every 5 minutes)
    const intervalId = setInterval(checkAuth, 5 * 60 * 1000);

    // Set up token expiration check
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiration = expirationTime - currentTime;

        if (timeUntilExpiration > 0) {
          // Set timeout to refresh token 5 minutes before expiration
          const refreshTime = Math.max(timeUntilExpiration - 5 * 60 * 1000, 0);

          const timeoutId = setTimeout(async () => {
            if (refreshToken) {
              try {
                await refreshAuthToken(refreshToken);
              } catch (error) {
                console.error("Automatic token refresh failed:", error);
                handleLogout();
              }
            }
          }, refreshTime);

          return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
          };
        }
      } catch (error) {
        console.error("Failed to parse token:", error);
        handleLogout();
      }
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [
    isAuthenticated,
    token,
    refreshToken,
    checkTokenValidity,
    refreshAuthToken,
    handleLogout,
  ]);
  // 함수들을 최소화하고 안정화된 handleLogout 사용

  return {
    isAuthenticated,
    isTokenValid: !!token,
    user,
  };
};
