/**
 * JWT 토큰 만료 여부 확인 함수
 * @param token JWT 토큰 문자열
 * @returns 토큰이 만료되었으면 true, 유효하면 false
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true; // 파싱 실패 시 만료된 것으로 간주
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
