# 라이브러리 모듈 구조

이 폴더는 애플리케이션의 핵심 라이브러리 모듈들을 포함합니다.

## 구조

```
src/lib/
├── api/           # API 클라이언트 모듈
│   ├── common/    # 공통 HTTP 클라이언트
│   ├── chat/      # 채팅 API
│   ├── bookmark/  # 북마크 API
│   └── ...
├── auth/          # 인증 모듈 (v6.1)
│   ├── authService.ts  # 인증 서비스
│   ├── tokenStore.ts   # JWT 토큰 관리
│   └── index.ts        # 통합 진입점
└── utils/         # 유틸리티 함수
```

## 사용법

### 인증 (v6.1 JWT 세부화)

```tsx
import { authService, tokenStore } from "@/lib/auth";

// 로그인
const user = await authService.login({
  email: "user@example.com",
  password: "password",
  rememberMe: true // v6.1: 30일 Refresh Token
});

// 토큰 상태 확인
const isAuthenticated = tokenStore.isAuthenticated();
const expiresAt = tokenStore.getTokenExpiryDate();
```

### API 호출

```tsx
import { httpClient, ApiError } from "@/lib/api";

try {
  const data = await httpClient.get("/some-endpoint");
} catch (error) {
  if (error instanceof ApiError && error.isAuthError) {
    // 인증 오류 처리
  }
}
```

### 상태 관리

```tsx
import { useAuth } from "@/stores/authStore";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // v6.1: JWT 세부화 정보
  const { rememberMe, tokenExpiresAt } = useAuth();
}
```

## 🎯 v6.1 핵심 개선사항

### 1. **JWT 세부화 정책**
- Access Token: 30분 (tokenStore에서 관리)
- Refresh Token: 1일/30일 (HttpOnly 쿠키)
- 자동 토큰 갱신 및 만료 추적

### 2. **모듈 통합**
- auth 관련 파일들을 `src/lib/auth/`로 통합
- 불필요한 re-export 제거
- 명확한 책임 분리

### 3. **API 명세서 v6.1 준수**
- JWT 세부화 정책 완전 구현
- 회원/비회원 차별화 지원
- SSE 메타데이터 기반 북마크

## 🚀 실제 사용법

### 기본 인증 플로우
```typescript
import { authService, tokenStore } from "@/lib/auth";
import { useAuth } from "@/stores/authStore";

// 컴포넌트에서 사용
function LoginComponent() {
  const { login, isAuthenticated, rememberMe } = useAuth();
  
  const handleLogin = async () => {
    await login("user@example.com", "password", true);
    // 자동으로 토큰 저장 및 만료 모니터링 시작
  };
}

// 서비스에서 직접 사용
const user = await authService.login({ 
  email: "user@example.com", 
  password: "password", 
  rememberMe: true 
});
```

### API 호출 (자동 토큰 갱신)
```typescript
import { httpClient } from "@/lib/api";

// httpClient가 자동으로 토큰 갱신 처리
const data = await httpClient.get("/protected-endpoint");
```

## 📊 v6.1 개선 효과

| 항목            | v5.x               | v6.1                  |
| --------------- | ------------------ | --------------------- |
| 파일 구조       | 분산된 auth 파일들 | 통합된 auth 모듈      |
| JWT 정책        | 단순한 토큰 저장   | 세부화된 JWT 정책     |
| 토큰 갱신       | 수동 처리          | 자동 갱신 및 모니터링 |
| API 명세서 준수 | 부분적             | 완전 준수             |
| 타입 안정성     | 보통               | 향상됨                |
| 개발자 경험     | 복잡한 설정        | 간단한 사용법         |

## 🔄 마이그레이션 가이드

### 기존 코드 (v5.x)
```typescript
// 분산된 import
import { authService } from "@/lib/api/auth";
import { tokenStore } from "@/lib/api/auth";

// 단순한 로그인
await authService.login({ email, password });
```

### 새로운 코드 (v6.1)
```typescript
// 통합된 import
import { authService, tokenStore } from "@/lib/auth";
import { useAuth } from "@/stores/authStore";

// JWT 세부화 로그인
await authService.login({ 
  email, 
  password, 
  rememberMe: true // 30일 토큰
});

// 향상된 상태 관리
const { rememberMe, tokenExpiresAt } = useAuth();
``` 