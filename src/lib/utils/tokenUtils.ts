/**
 * 토큰 관련 유틸리티 함수들
 * 현업 베스트 프랙티스에 따른 보안 강화 버전
 */

/**
 * JWT 토큰 만료 시간 확인 함수
 * @param token JWT 토큰 문자열
 * @returns 토큰이 만료되었으면 true, 유효하면 false
 */
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // exp 클레임이 있으면 확인, 없으면 만료된 것으로 간주
    if (payload.exp) {
      return payload.exp < currentTime;
    }

    return true;
  } catch (error) {
    console.error("토큰 파싱 오류:", error);
    return true;
  }
};

/**
 * JWT 토큰에서 사용자 정보 추출
 * @param token JWT 토큰 문자열
 * @returns 사용자 정보 객체 또는 null
 */
export const getUserFromToken = (token: string): any => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.sub || payload.userId,
      email: payload.email,
      name: payload.name || payload.username,
      roles: payload.roles || [],
    };
  } catch (error) {
    console.error("토큰에서 사용자 정보 추출 실패:", error);
    return null;
  }
};

/**
 * 현업 베스트 프랙티스: 환경별 토큰 저장 전략
 * @returns 토큰 저장 전략
 */
export const getTokenStorageStrategy = () => {
  const isProduction = import.meta.env.PROD;
  const isHttpsEnabled = window.location.protocol === "https:";

  // 프로덕션 환경이고 HTTPS가 활성화된 경우 HttpOnly 쿠키 우선
  if (isProduction && isHttpsEnabled) {
    return "httponly-cookie";
  }

  // 개발 환경에서는 localStorage 사용 (편의성)
  return "localstorage";
};

/**
 * 보안 등급별 토큰 저장 방식
 */
export const secureTokenStorage = {
  // 최고 보안: HttpOnly 쿠키 (프로덕션 권장)
  setSecureCookie: async (
    tokenType: "access" | "refresh",
    token: string,
    rememberMe: boolean = false,
  ) => {
    const maxAge = rememberMe
      ? 30 * 24 * 60 * 60 * 1000 // 30일
      : undefined; // 브라우저 세션

    // 실제 프로덕션에서는 서버 API 호출
    try {
      const response = await fetch("/api/auth/set-secure-cookie", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenType,
          token,
          maxAge,
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("보안 쿠키 설정 실패:", error);
      return false;
    }
  },

  // 차선책: 로컬 스토리지 (개발 환경)
  setLocalStorage: (
    tokenType: "access" | "refresh",
    token: string,
    rememberMe: boolean = false,
  ) => {
    const key = `${tokenType}_token`;
    const expiryTime = rememberMe
      ? Date.now() + 30 * 24 * 60 * 60 * 1000 // 30일
      : Date.now() + 2 * 60 * 60 * 1000; // 2시간

    const tokenData = {
      token,
      expiryTime,
      rememberMe,
      createdAt: Date.now(),
    };

    try {
      localStorage.setItem(key, JSON.stringify(tokenData));
      console.log(
        `📝 ${tokenType} 토큰 저장 완료 (${rememberMe ? "30일" : "2시간"} 유효)`,
      );
      return true;
    } catch (error) {
      console.error("로컬 스토리지 저장 실패:", error);
      return false;
    }
  },

  // 토큰 조회 (환경별 자동 감지)
  getToken: async (tokenType: "access" | "refresh"): Promise<string | null> => {
    const strategy = getTokenStorageStrategy();

    if (strategy === "httponly-cookie") {
      // HttpOnly 쿠키에서 토큰 조회 (서버 API 필요)
      try {
        const response = await fetch(`/api/auth/get-token/${tokenType}`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          return data.token;
        }
      } catch (error) {
        console.error("쿠키 토큰 조회 실패:", error);
      }
      return null;
    } else {
      // localStorage에서 토큰 조회
      const key = `${tokenType}_token`;
      const stored = localStorage.getItem(key);

      if (!stored) return null;

      try {
        const tokenData = JSON.parse(stored);

        // 만료 시간 확인
        if (Date.now() > tokenData.expiryTime) {
          localStorage.removeItem(key);
          console.log(`⏰ ${tokenType} 토큰 만료로 삭제`);
          return null;
        }

        return tokenData.token;
      } catch (error) {
        console.error("토큰 파싱 실패:", error);
        localStorage.removeItem(key);
        return null;
      }
    }
  },

  // 토큰 삭제 (로그아웃)
  clearTokens: async (): Promise<boolean> => {
    const strategy = getTokenStorageStrategy();

    if (strategy === "httponly-cookie") {
      // 서버에 쿠키 삭제 요청
      try {
        const response = await fetch("/api/auth/clear-cookies", {
          method: "POST",
          credentials: "include",
        });
        return response.ok;
      } catch (error) {
        console.error("쿠키 삭제 실패:", error);
        return false;
      }
    } else {
      // localStorage 토큰 삭제
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      console.log("🧹 로컬 토큰 삭제 완료");
      return true;
    }
  },
};

/**
 * 토큰 보안 검증 함수
 * @param token JWT 토큰 문자열
 * @returns 보안 검증 결과 객체
 */
export const validateTokenSecurity = (
  token: string,
): { isValid: boolean; issues: string[] } => {
  const issues: string[] = [];

  if (!token) {
    return { isValid: false, issues: ["토큰이 없습니다"] };
  }

  try {
    const [header, payload] = token.split(".");

    if (!header || !payload) {
      issues.push("JWT 형식이 올바르지 않습니다");
    }

    const headerData = JSON.parse(atob(header));
    const payloadData = JSON.parse(atob(payload));

    // 보안 검증 항목들
    if (!headerData.alg || headerData.alg === "none") {
      issues.push("안전하지 않은 알고리즘이 사용되었습니다");
    }

    if (!payloadData.exp) {
      issues.push("만료 시간이 설정되지 않았습니다");
    }

    if (!payloadData.iat) {
      issues.push("발급 시간이 설정되지 않았습니다");
    }

    if (payloadData.exp && payloadData.iat) {
      const tokenLifetime = payloadData.exp - payloadData.iat;
      const maxLifetime = 24 * 60 * 60; // 24시간

      if (tokenLifetime > maxLifetime) {
        issues.push("토큰 유효 기간이 너무 깁니다 (최대 24시간 권장)");
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  } catch (error) {
    return {
      isValid: false,
      issues: ["토큰 파싱 중 오류가 발생했습니다"],
    };
  }
};

/**
 * JWT 토큰에서 페이로드 추출 함수
 * @param token JWT 토큰 문자열
 * @returns 토큰 페이로드 객체 또는 null
 */
export const getTokenPayload = (token: string): Record<string, any> | null => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

/**
 * 토큰 만료 시간 추출 함수
 * @param token JWT 토큰 문자열
 * @returns 만료 시간 (Date 객체) 또는 null
 */
export const getTokenExpirationDate = (token: string): Date | null => {
  const payload = getTokenPayload(token);
  if (!payload || !payload.exp) return null;

  return new Date(payload.exp * 1000);
};

/**
 * 토큰의 남은 유효 시간 계산 함수
 * @param token JWT 토큰 문자열
 * @returns 남은 시간 (밀리초) 또는 0
 */
export const getTokenRemainingTime = (token: string): number => {
  const expirationDate = getTokenExpirationDate(token);
  if (!expirationDate) return 0;

  const remainingTime = expirationDate.getTime() - Date.now();
  return Math.max(0, remainingTime);
};
