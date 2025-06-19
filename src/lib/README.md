# lib 폴더 구조 및 사용 가이드

AI HS Code 레이더 시스템의 핵심 라이브러리 모듈들을 체계적으로 정리한 폴더입니다.

## 📁 폴더 구조

```
src/lib/
├── api/                    # API 관련 모듈들 (스프링부트 서버 연동)
│   ├── index.ts           # 모든 API 함수 통합 export
│   ├── client.ts          # Axios 클라이언트 설정 및 인터셉터
│   ├── auth.ts            # 인증 관련 API (로그인, 회원가입, 토큰 관리)
│   ├── claude.ts          # Claude AI 분석 API (HS Code 분석, 의도 분석)
│   ├── customs.ts         # 관세청 API 연동 (화물 추적, 무역 통계)
│   ├── bookmarks.ts       # 북마크 관리 API (CRUD, 모니터링)
│   └── notifications.ts   # 알림 시스템 API (푸시, 이메일 알림)
└── utils/                 # 유틸리티 함수들
    ├── index.ts           # 공통 유틸리티 (cn 함수 등)
    └── tokenUtils.ts      # JWT 토큰 관리 유틸리티
```

## 🚀 주요 기능

### API 클라이언트 (`api/`)

스프링부트 서버와의 모든 HTTP 통신을 담당하며, 다음과 같은 기능을 제공합니다:

- **자동 JWT 토큰 관리**: 요청 시 자동 토큰 추가, 만료 시 자동 갱신
- **환경별 설정**: 개발/프로덕션 환경에 따른 자동 baseURL 설정
- **표준화된 응답**: `ApiResponse<T>` 타입으로 일관된 응답 처리
- **오류 처리**: 401 오류 시 자동 토큰 갱신 및 재시도

### 유틸리티 (`utils/`)

- **토큰 관리**: JWT 토큰의 유효성 검증, 파싱, 보안 저장
- **UI 헬퍼**: Tailwind CSS 클래스 병합 및 최적화

## 📖 사용법

### 1. API 함수 사용

```typescript
// 개별 함수 import
import { 
  loginUser, 
  analyzeHSCode, 
  getCargoProgress,
  createBookmark 
} from "@/lib/api";

// 사용 예시
const loginResult = await loginUser({
  email: "user@example.com",
  password: "password123",
  rememberMe: true
});

const analysisResult = await analyzeHSCode({
  productDescription: "삼성 갤럭시 스마트폰",
  additionalInfo: "5G 지원, 128GB"
});

const cargoInfo = await getCargoProgress("24012345678901");

const bookmark = await createBookmark({
  type: "HSCODE",
  title: "스마트폰 분석 결과",
  hsCode: "8517.12.00",
  monitoringEnabled: true
});
```

### 2. 유틸리티 함수 사용

```typescript
// UI 클래스 병합
import { cn } from "@/lib/utils";

const className = cn(
  "base-class",
  { "active-class": isActive },
  "additional-class"
);

// 토큰 관리
import { 
  isTokenExpired, 
  getUserFromToken,
  secureTokenStorage 
} from "@/lib/utils/tokenUtils";

// 토큰 유효성 체크
if (isTokenExpired(token)) {
  console.log("토큰이 만료되었습니다");
}

// 사용자 정보 추출
const userInfo = getUserFromToken(accessToken);

// 보안 토큰 저장
await secureTokenStorage.setLocalStorage("access", token, true);
```

## 🔧 환경별 설정

### 개발 환경
- **API Base URL**: `http://localhost:3001/mock` (목업 서버)
- **토큰 저장**: localStorage (편의성 우선)
- **디버깅**: 콘솔 로그 활성화

### 프로덕션 환경
- **API Base URL**: `http://localhost:8080/api/v1` (스프링부트 서버)
- **토큰 저장**: HttpOnly 쿠키 (보안 우선)
- **디버깅**: 최소화된 로그

## 🛡️ 보안 고려사항

### JWT 토큰 관리
- **개발 환경**: localStorage 사용으로 개발 편의성 제공
- **프로덕션**: HttpOnly, Secure, SameSite 쿠키로 XSS/CSRF 방지
- **자동 갱신**: 401 오류 시 refresh token으로 자동 토큰 갱신
- **세션 관리**: 토큰 만료 시간 체크 및 자동 로그아웃

### API 요청 보안
- **HTTPS 강제**: 프로덕션 환경에서 HTTPS 연결 필수
- **요청 타임아웃**: 10초 제한으로 무한 대기 방지
- **오류 처리**: 민감한 정보 노출 방지를 위한 안전한 오류 메시지

## 🔄 백엔드 연동 전환

현재는 목업 데이터로 동작하지만, 실제 스프링부트 서버 연동 시 다음과 같이 전환됩니다:

1. **환경 변수 변경**:
   ```env
   # 개발
   VITE_API_BASE_URL=http://localhost:3001/mock
   
   # 프로덕션
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```

2. **코드 변경 없음**: API 클라이언트는 동일한 인터페이스 유지

3. **타입 안정성**: 백엔드 DTO와 완전히 일치하는 TypeScript 타입

## 📝 타입 정의

모든 API 함수와 응답 데이터는 완전한 TypeScript 타입을 제공합니다:

```typescript
// 요청 타입
type LoginRequest = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

// 응답 타입
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  timestamp: string;
};
```

## 🚦 사용 시 주의사항

1. **API 호출 시 항상 오류 처리** 포함
2. **토큰 만료 시나리오** 고려한 UI 설계
3. **네트워크 오류** 상황에 대한 적절한 사용자 피드백
4. **환경별 설정** 확인 후 배포
5. **보안 토큰** 취급 시 브라우저 개발자 도구 노출 주의 