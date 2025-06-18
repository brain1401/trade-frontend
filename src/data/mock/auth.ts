import { isTokenExpired } from "../../lib/utils/tokenUtils";
import type { User } from "../../stores/authStore";

// 목업 토큰 갱신 응답 타입
export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
} | null;

/**
 * 목업 JWT 토큰 생성 함수
 * @param payload 토큰에 포함할 데이터
 * @param expiresInMinutes 토큰 만료 시간 (분)
 * @returns 목업 JWT 토큰
 */
const createMockJWT = (payload: any, expiresInMinutes: number): string => {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + expiresInMinutes * 60;

  const jwtPayload = {
    ...payload,
    iat: now,
    exp: expiry,
  };

  // Base64 인코딩 (실제 JWT는 서명이 필요하지만 목업에서는 생략)
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(jwtPayload));
  const mockSignature = btoa("mock-signature-" + Date.now());

  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
};

/**
 * 리프레시 토큰으로 액세스 토큰 갱신 목업 함수
 * 실제로는 스프링부트 서버의 /api/v1/auth/refresh 호출
 * @param refreshToken 리프레시 토큰
 * @returns 새로운 토큰 정보 또는 null
 */
export const mockRefreshToken = async (
  refreshToken: string,
): Promise<RefreshTokenResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (refreshToken && !isTokenExpired(refreshToken)) {
        // 새로운 액세스 토큰 생성 (15분 만료)
        const newAccessToken = createMockJWT(
          { sub: "user-123", email: "hong@example.com" },
          15,
        );

        resolve({
          accessToken: newAccessToken,
          refreshToken: refreshToken, // 리프레시 토큰은 그대로 유지
        });
      } else {
        resolve(null);
      }
    }, 1000); // 네트워크 지연 시뮬레이션
  });
};

/**
 * 액세스 토큰 검증 및 사용자 정보 조회 목업 함수
 * 실제로는 스프링부트 서버의 /api/v1/auth/validate 호출
 * @param accessToken 액세스 토큰
 * @returns 사용자 정보 또는 null
 */
export const mockValidateToken = async (
  accessToken: string,
): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (accessToken && !isTokenExpired(accessToken)) {
        resolve({
          id: "user-123",
          name: "홍길동",
          email: "hong@example.com",
          avatar: null,
          notificationStats: {
            messageCount: 3,
            bookmarkCount: 5,
            analysisCount: 2,
          },
        });
      } else {
        resolve(null);
      }
    }, 500); // 네트워크 지연 시뮬레이션
  });
};

/**
 * 로그인 목업 함수
 * 실제로는 스프링부트 서버의 /api/v1/auth/login 호출
 * @param email 이메일
 * @param password 비밀번호
 * @param rememberMe 로그인 정보 유지 여부
 * @returns 로그인 응답 또는 null
 */
export const mockLogin = async (
  email: string,
  password: string,
  rememberMe: boolean = false,
): Promise<{
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
} | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 간단한 목업 검증 로직
      if (email && password) {
        // 로그인 정보 유지 여부에 따라 토큰 만료 시간 설정
        const accessTokenExpiry = 15; // 액세스 토큰은 항상 15분
        const refreshTokenExpiry = rememberMe ? 30 * 24 * 60 : 24 * 60; // 로그인 정보 유지 시 30일, 아니면 1일

        const accessToken = createMockJWT(
          { sub: "user-123", email: email },
          accessTokenExpiry,
        );

        const refreshToken = createMockJWT(
          { sub: "user-123", email: email, type: "refresh" },
          refreshTokenExpiry,
        );

        resolve({
          user: {
            id: "user-123",
            name: "홍길동",
            email: email,
            avatar: null,
            notificationStats: {
              messageCount: 3,
              bookmarkCount: 5,
              analysisCount: 2,
            },
          },
          tokens: {
            accessToken,
            refreshToken,
          },
        });
      } else {
        resolve(null);
      }
    }, 1500); // 로그인 처리 시뮬레이션
  });
};

/**
 * 로그아웃 목업 함수
 * 실제로는 스프링부트 서버의 /api/v1/auth/logout 호출
 * @param refreshToken 로그아웃할 리프레시 토큰
 * @returns 성공 여부
 */
export const mockLogout = async (refreshToken: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 서버에서 리프레시 토큰 무효화 처리
      console.log("로그아웃 처리 - 리프레시 토큰 무효화:", refreshToken);
      resolve(true);
    }, 500);
  });
};
