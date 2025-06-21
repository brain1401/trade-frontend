// 인증 관련 목업 데이터

/**
 * 사용자 로그인 인증을 처리하는 Mock 함수
 *
 * 이메일과 비밀번호를 검증하여 로그인 성공 시 JWT 토큰과 사용자 정보를 반환합니다.
 * 테스트용 계정: admin@test.com/admin123, user@test.com/user123
 *
 * @param email - 사용자 이메일 주소
 * @param password - 사용자 비밀번호
 * @returns Promise<로그인 결과 객체> - 성공/실패 여부, 토큰, 사용자 정보 포함
 *
 * @example
 * ```typescript
 * const result = await mockLogin("admin@test.com", "admin123");
 * if (result.success) {
 *   console.log(`로그인 성공: ${result.user.name}`);
 *   localStorage.setItem('token', result.token);
 * }
 * ```
 */
export const mockLogin = async (email: string, password: string) => {
  // 모의 로그인 로직
  if (email === "admin@test.com" && password === "admin123") {
    return {
      success: true,
      token: "mock-jwt-token-12345",
      user: {
        id: "user-1",
        email: email,
        name: "관리자",
        role: "admin",
      },
    };
  }

  if (email === "user@test.com" && password === "user123") {
    return {
      success: true,
      token: "mock-jwt-token-67890",
      user: {
        id: "user-2",
        email: email,
        name: "일반사용자",
        role: "user",
      },
    };
  }

  return {
    success: false,
    message: "이메일 또는 비밀번호가 올바르지 않습니다.",
  };
};

/**
 * JWT 토큰을 갱신하는 Mock 함수
 *
 * 기존 토큰의 유효성을 검증하고 새로운 토큰을 발급합니다.
 * 토큰 만료 시점이 다가왔을 때 자동으로 갱신하는 용도로 사용됩니다.
 *
 * @param token - 갱신할 기존 JWT 토큰
 * @returns Promise<갱신 결과 객체> - 성공/실패 여부와 새로운 토큰 포함
 *
 * @example
 * ```typescript
 * const result = await mockRefreshToken(currentToken);
 * if (result.success) {
 *   localStorage.setItem('token', result.token);
 * } else {
 *   // 로그인 페이지로 리다이렉트
 *   window.location.href = '/login';
 * }
 * ```
 */
export const mockRefreshToken = async (token: string) => {
  // 모의 토큰 갱신
  if (token && token.startsWith("mock-jwt-token")) {
    return {
      success: true,
      token: "mock-jwt-token-refreshed-" + Date.now(),
    };
  }

  return {
    success: false,
    message: "유효하지 않은 토큰입니다.",
  };
};

/**
 * JWT 토큰의 유효성을 검증하는 Mock 함수
 *
 * 제공된 토큰이 유효한지 확인합니다.
 * 보호된 라우트 접근 시 토큰 유효성을 검사하는 용도로 사용됩니다.
 *
 * @param token - 검증할 JWT 토큰
 * @returns Promise<검증 결과 객체> - 토큰 유효성 여부와 메시지 포함
 *
 * @example
 * ```typescript
 * const validation = await mockValidateToken(userToken);
 * if (!validation.valid) {
 *   console.error(validation.message);
 *   // 로그아웃 처리
 *   handleLogout();
 * }
 * ```
 */
export const mockValidateToken = async (token: string) => {
  // 모의 토큰 검증
  if (token && token.startsWith("mock-jwt-token")) {
    return {
      success: true,
      valid: true,
    };
  }

  return {
    success: false,
    valid: false,
    message: "토큰이 유효하지 않습니다.",
  };
};
