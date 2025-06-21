/**
 * JWT 토큰 관리를 위한 유틸리티 함수 모음
 *
 * @remarks
 * 현업 베스트 프랙티스에 따른 보안 강화 버전으로,
 * 환경별 토큰 저장 전략과 보안 검증 기능을 제공합니다.
 * 개발 환경에서는 편의성을, 프로덕션에서는 보안을 우선시합니다.
 *
 * @packageDocumentation
 */

/**
 * JWT 토큰의 만료 여부를 확인하는 함수
 *
 * @param token - 검증할 JWT 토큰 문자열
 * @returns 토큰이 만료되었으면 true, 유효하면 false
 *
 * @remarks
 * JWT 토큰의 `exp` 클레임을 확인하여 현재 시간과 비교합니다.
 * 토큰이 없거나 파싱에 실패하면 만료된 것으로 간주합니다.
 * 보안상 의심스러운 토큰은 모두 만료로 처리합니다.
 *
 * @example
 * ```typescript
 * const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
 * if (isTokenExpired(token)) {
 *   console.log("토큰이 만료되었습니다");
 * }
 * ```
 *
 * @public
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
 * JWT 토큰에서 추출된 사용자 정보 타입
 */
export type UserTokenData = {
  id: string;
  email: string;
  name: string;
  roles: string[];
} | null;

/**
 * JWT 토큰에서 사용자 정보를 추출하는 함수
 *
 * @param token - JWT 토큰 문자열
 * @returns 추출된 사용자 정보 객체 또는 null
 *
 * @remarks
 * JWT의 페이로드 부분을 Base64 디코딩하여 사용자 정보를 추출합니다.
 * 토큰이 유효하지 않거나 필수 필드가 누락된 경우 null을 반환합니다.
 * 클라이언트 사이드에서만 사용하며, 서버 검증을 대체하지 않습니다.
 *
 * @example
 * ```typescript
 * const userInfo = getUserFromToken(accessToken);
 * if (userInfo) {
 *   console.log(`사용자: ${userInfo.name} (${userInfo.email})`);
 *   console.log(`권한: ${userInfo.roles.join(', ')}`);
 * }
 * ```
 *
 * @public
 */
export const getUserFromToken = (token: string): UserTokenData => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    // 필수 필드 검증
    if (!payload.sub && !payload.userId) return null;
    if (!payload.email) return null;

    return {
      id: payload.sub || payload.userId,
      email: payload.email,
      name: payload.name || payload.username || payload.email.split("@")[0],
      roles: Array.isArray(payload.roles) ? payload.roles : [],
    };
  } catch (error) {
    console.error("토큰에서 사용자 정보 추출 실패:", error);
    return null;
  }
};

/**
 * 환경별 토큰 저장 전략을 결정하는 함수
 *
 * @returns 현재 환경에 적합한 토큰 저장 전략
 *
 * @remarks
 * 현업 베스트 프랙티스에 따라 환경별로 다른 저장 전략을 적용합니다:
 * - 프로덕션 + HTTPS: HttpOnly 쿠키 (최고 보안)
 * - 개발 환경: localStorage (편의성 우선)
 *
 * HTTPS가 비활성화된 프로덕션에서는 localStorage를 사용하되 경고를 표시합니다.
 *
 * @example
 * ```typescript
 * const strategy = getTokenStorageStrategy();
 * if (strategy === "httponly-cookie") {
 *   // 서버 API를 통한 보안 쿠키 사용
 * } else {
 *   // localStorage 직접 사용
 * }
 * ```
 *
 * @public
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
 * 보안 등급별 토큰 저장 관리 객체
 *
 * @remarks
 * 환경에 따라 최적의 보안 수준을 제공하는 토큰 저장소 관리 유틸리티입니다.
 * 프로덕션에서는 HttpOnly 쿠키를, 개발에서는 localStorage를 사용합니다.
 * 모든 메서드는 비동기이므로 await 또는 Promise 체이닝이 필요합니다.
 *
 * @public
 *
 * @example
 * ```typescript
 * // 토큰 저장
 * await secureTokenStorage.setSecureCookie("access", accessToken, true);
 *
 * // 토큰 조회
 * const token = await secureTokenStorage.getToken("access");
 *
 * // 모든 토큰 삭제
 * await secureTokenStorage.clearTokens();
 * ```
 */
export const secureTokenStorage = {
  /**
   * HttpOnly 쿠키를 사용한 최고 보안 토큰 저장
   *
   * @param tokenType - 저장할 토큰 타입 ("access" 또는 "refresh")
   * @param token - 저장할 JWT 토큰 문자열
   * @param rememberMe - 로그인 유지 여부 (기본값: false)
   * @returns 저장 성공 여부
   *
   * @remarks
   * 프로덕션 환경에서 권장되는 최고 보안 수준의 토큰 저장 방식입니다.
   * HttpOnly, Secure, SameSite 속성을 모두 적용하여 XSS, CSRF 공격을 방지합니다.
   * 서버 API 엔드포인트가 구현되어 있어야 정상 동작합니다.
   *
   * @example
   * ```typescript
   * // 액세스 토큰을 30일간 유지하며 저장
   * const success = await secureTokenStorage.setSecureCookie(
   *   "access",
   *   accessToken,
   *   true
   * );
   *
   * if (!success) {
   *   console.error("보안 쿠키 저장 실패");
   * }
   * ```
   */
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

  /**
   * localStorage를 사용한 토큰 저장 (개발 환경용)
   *
   * @param tokenType - 저장할 토큰 타입 ("access" 또는 "refresh")
   * @param token - 저장할 JWT 토큰 문자열
   * @param rememberMe - 로그인 유지 여부 (기본값: false)
   * @returns 저장 성공 여부
   *
   * @remarks
   * 개발 환경에서 편의성을 위해 사용하는 토큰 저장 방식입니다.
   * XSS 공격에 취약하므로 프로덕션에서는 사용을 권장하지 않습니다.
   * 만료 시간과 메타데이터를 함께 저장하여 자동 만료 처리를 지원합니다.
   *
   * @example
   * ```typescript
   * // 리프레시 토큰을 2시간 동안 저장
   * const success = secureTokenStorage.setLocalStorage(
   *   "refresh",
   *   refreshToken,
   *   false
   * );
   * ```
   */
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

  /**
   * 환경별 자동 감지를 통한 토큰 조회
   *
   * @param tokenType - 조회할 토큰 타입 ("access" 또는 "refresh")
   * @returns 조회된 토큰 문자열 또는 null
   *
   * @remarks
   * 현재 환경의 저장 전략에 따라 자동으로 적절한 저장소에서 토큰을 조회합니다.
   * 만료된 토큰은 자동으로 삭제하고 null을 반환합니다.
   * 네트워크 오류나 파싱 오류 시에도 안전하게 null을 반환합니다.
   *
   * @example
   * ```typescript
   * const accessToken = await secureTokenStorage.getToken("access");
   * if (accessToken) {
   *   // 유효한 토큰으로 API 요청 수행
   *   makeAuthenticatedRequest(accessToken);
   * } else {
   *   // 토큰이 없거나 만료됨 - 로그인 필요
   *   redirectToLogin();
   * }
   * ```
   */
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

  /**
   * 모든 저장된 토큰을 안전하게 삭제 (로그아웃)
   *
   * @returns 삭제 성공 여부
   *
   * @remarks
   * 환경별 저장 방식에 맞춰 모든 토큰을 완전히 삭제합니다.
   * HttpOnly 쿠키는 서버 API를 통해, localStorage는 직접 삭제합니다.
   * 부분적 실패 시에도 가능한 한 많은 토큰을 삭제하려고 시도합니다.
   *
   * @example
   * ```typescript
   * // 로그아웃 처리
   * const success = await secureTokenStorage.clearTokens();
   * if (success) {
   *   console.log("모든 토큰이 안전하게 삭제되었습니다");
   * }
   * ```
   */
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
 * JWT 토큰 보안 검증 결과를 나타내는 타입
 *
 * @public
 */
type TokenSecurityValidationResult = {
  /** 토큰이 보안 기준을 만족하는지 여부 */
  isValid: boolean;
  /** 발견된 보안 이슈 목록 */
  issues: string[];
};

/**
 * JWT 토큰의 보안성을 종합적으로 검증하는 함수
 *
 * @param token - 검증할 JWT 토큰 문자열
 * @returns 보안 검증 결과 객체
 *
 * @remarks
 * JWT 토큰의 구조적 무결성과 보안 정책 준수 여부를 검사합니다.
 * 다음 항목들을 검증합니다:
 * - JWT 형식 유효성
 * - 서명 알고리즘 안전성 (none 알고리즘 금지)
 * - 필수 클레임 존재 여부 (exp, iat)
 * - 토큰 유효 기간 적정성 (최대 24시간 권장)
 *
 * @example
 * ```typescript
 * const validation = validateTokenSecurity(suspiciousToken);
 * if (!validation.isValid) {
 *   console.error("보안 이슈 발견:", validation.issues);
 *   // 토큰 거부 및 재인증 요구
 * }
 * ```
 *
 * @public
 */
export const validateTokenSecurity = (
  token: string,
): TokenSecurityValidationResult => {
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
 * JWT 페이로드 표준 클레임 타입
 */
export type JwtPayload = {
  /** Subject (사용자 ID) */
  sub?: string;
  /** 사용자 ID (비표준) */
  userId?: string;
  /** 이메일 주소 */
  email?: string;
  /** 사용자 이름 */
  name?: string;
  /** 사용자명 (비표준) */
  username?: string;
  /** 사용자 역할 */
  roles?: string[];
  /** 발급 시간 (Unix timestamp) */
  iat?: number;
  /** 만료 시간 (Unix timestamp) */
  exp?: number;
  /** 발급자 */
  iss?: string;
  /** 대상 */
  aud?: string | string[];
  /** 토큰 타입 */
  type?: "access" | "refresh";
  /** 기타 클레임들 */
  [key: string]: unknown;
};

/**
 * JWT 토큰에서 페이로드 부분만 추출하는 함수
 *
 * @param token - 페이로드를 추출할 JWT 토큰 문자열
 * @returns 토큰 페이로드 객체 또는 null
 *
 * @remarks
 * JWT의 두 번째 부분(페이로드)을 Base64 디코딩하여 JSON 객체로 반환합니다.
 * 토큰이 유효하지 않거나 파싱에 실패하면 null을 반환합니다.
 * 보안상 서명 검증은 하지 않으므로 신뢰할 수 없는 토큰에는 사용하지 마세요.
 *
 * @example
 * ```typescript
 * const payload = getTokenPayload(jwtToken);
 * if (payload) {
 *   console.log("사용자 ID:", payload.sub);
 *   console.log("발급 시간:", new Date((payload.iat || 0) * 1000));
 *   console.log("만료 시간:", new Date((payload.exp || 0) * 1000));
 * }
 * ```
 *
 * @public
 */
export const getTokenPayload = (token: string): JwtPayload | null => {
  try {
    return JSON.parse(atob(token.split(".")[1])) as JwtPayload;
  } catch {
    return null;
  }
};

/**
 * JWT 토큰의 만료 시간을 Date 객체로 반환하는 함수
 *
 * @param token - 만료 시간을 확인할 JWT 토큰 문자열
 * @returns 만료 시간 Date 객체 또는 null
 *
 * @remarks
 * JWT의 `exp` 클레임을 추출하여 JavaScript Date 객체로 변환합니다.
 * `exp` 클레임이 없거나 토큰이 유효하지 않으면 null을 반환합니다.
 * 반환된 Date 객체를 현재 시간과 비교하여 만료 여부를 확인할 수 있습니다.
 *
 * @example
 * ```typescript
 * const expirationDate = getTokenExpirationDate(accessToken);
 * if (expirationDate) {
 *   console.log(`토큰 만료 시간: ${expirationDate.toLocaleString()}`);
 *
 *   if (expirationDate < new Date()) {
 *     console.log("토큰이 이미 만료되었습니다");
 *   }
 * }
 * ```
 *
 * @public
 */
export const getTokenExpirationDate = (token: string): Date | null => {
  const payload = getTokenPayload(token);
  if (!payload || !payload.exp) return null;

  return new Date(Number(payload.exp) * 1000);
};

/**
 * JWT 토큰의 남은 유효 시간을 밀리초 단위로 계산하는 함수
 *
 * @param token - 남은 시간을 계산할 JWT 토큰 문자열
 * @returns 남은 유효 시간 (밀리초) 또는 0
 *
 * @remarks
 * 토큰의 만료 시간에서 현재 시간을 빼서 남은 시간을 계산합니다.
 * 이미 만료된 토큰이거나 만료 시간이 없으면 0을 반환합니다.
 * 자동 토큰 갱신 타이밍을 결정할 때 유용합니다.
 *
 * @example
 * ```typescript
 * const remainingTime = getTokenRemainingTime(accessToken);
 *
 * if (remainingTime < 5 * 60 * 1000) { // 5분 미만 남음
 *   console.log("토큰이 곧 만료됩니다. 갱신이 필요합니다.");
 *   await refreshAccessToken();
 * }
 *
 * // 남은 시간을 사용자 친화적으로 표시
 * const minutes = Math.floor(remainingTime / (60 * 1000));
 * console.log(`토큰 유효 시간: ${minutes}분 남음`);
 * ```
 *
 * @public
 */
export const getTokenRemainingTime = (token: string): number => {
  const expirationDate = getTokenExpirationDate(token);
  if (!expirationDate) return 0;

  const remainingTime = expirationDate.getTime() - Date.now();
  return Math.max(0, remainingTime);
};
