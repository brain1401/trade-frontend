/**
 * 쿠키 관련 유틸리티 함수들
 */
export const cookieUtils = {
  /**
   * 특정 쿠키 삭제
   */
  deleteCookie(name: string) {
    // 현재 도메인과 경로에서 쿠키 삭제
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    // 루트 도메인에서도 쿠키 삭제 시도
    const domain = window.location.hostname;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
    if (domain.includes(".")) {
      const rootDomain = "." + domain.split(".").slice(-2).join(".");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${rootDomain};`;
    }
  },

  /**
   * 모든 인증 관련 쿠키 삭제
   */
  clearAuthCookies() {
    // 일반적인 JWT 쿠키 이름들을 삭제
    const commonCookieNames = [
      "accessToken",
      "access_token",
      "jwt",
      "JWT",
      "authToken",
      "auth_token",
      "token",
      "session",
    ];

    commonCookieNames.forEach((name) => {
      this.deleteCookie(name);
    });

    console.log("모든 인증 쿠키가 삭제되었습니다");
  },
};
