/**
 * v6.1 JWT 세부화 토큰 스토어
 * - Access Token: 30분 (메모리 저장)
 * - Refresh Token: HttpOnly 쿠키로 자동 관리
 * - 토큰 만료 시간 추적 및 자동 갱신 지원
 */
class TokenStore {
  private accessToken: string | null = null;
  private tokenExpiresAt: number | null = null;
  private listeners: ((token: string | null) => void)[] = [];

  /**
   * 현재 Access Token 반환
   */
  getToken(): string | null {
    // 토큰이 만료되었다면 null 반환
    if (this.isTokenExpired()) {
      this.clearToken();
      return null;
    }
    return this.accessToken;
  }

  /**
   * Access Token 설정
   * JWT 페이로드에서 만료 시간 추출
   */
  setToken(token: string | null): void {
    if (token) {
      this.accessToken = token;
      this.tokenExpiresAt = this.extractTokenExpiry(token);
    } else {
      this.accessToken = null;
      this.tokenExpiresAt = null;
    }

    this.notifyListeners(token);
  }

  /**
   * 토큰 삭제
   */
  clearToken(): void {
    this.setToken(null);
  }

  /**
   * 인증 상태 확인
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * 토큰 만료 확인
   */
  isTokenExpired(): boolean {
    if (!this.accessToken || !this.tokenExpiresAt) {
      return true;
    }

    // 현재 시간 + 1분 여유분으로 만료 확인 (조기 갱신)
    const bufferTime = 60 * 1000; // 1분
    return Date.now() + bufferTime >= this.tokenExpiresAt;
  }

  /**
   * 토큰 만료까지 남은 시간 (밀리초)
   */
  getTimeUntilExpiry(): number {
    if (!this.tokenExpiresAt) {
      return 0;
    }
    return Math.max(0, this.tokenExpiresAt - Date.now());
  }

  /**
   * 토큰 만료 시간 (Date 객체)
   */
  getTokenExpiryDate(): Date | null {
    if (!this.tokenExpiresAt) {
      return null;
    }
    return new Date(this.tokenExpiresAt);
  }

  /**
   * 토큰 변경 리스너 등록
   */
  onTokenChange(listener: (token: string | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * JWT 페이로드에서 만료 시간 추출
   */
  private extractTokenExpiry(token: string): number | null {
    try {
      const payload = this.parseJWTPayload(token);
      if (payload?.exp) {
        return payload.exp * 1000; // JWT exp는 초 단위이므로 밀리초로 변환
      }
    } catch (error) {
      console.warn("JWT 페이로드 파싱 실패:", error);
    }
    return null;
  }

  /**
   * JWT 페이로드 파싱 (검증 없이 디코딩만)
   */
  private parseJWTPayload(token: string): any {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }

      const payload = parts[1];
      const decodedPayload = atob(
        payload.replace(/-/g, "+").replace(/_/g, "/"),
      );
      return JSON.parse(decodedPayload);
    } catch (error) {
      throw new Error("JWT 페이로드 디코딩 실패");
    }
  }

  /**
   * 토큰 변경 알림
   */
  private notifyListeners(token: string | null): void {
    this.listeners.forEach((listener) => {
      try {
        listener(token);
      } catch (error) {
        console.error("토큰 변경 리스너 실행 중 오류:", error);
      }
    });
  }
}

export const tokenStore = new TokenStore();
