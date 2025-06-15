# Stores

이 디렉토리는 애플리케이션의 전역 상태 관리를 위한 Zustand store들을 보관합니다.

## Store 구조

각 store는 **State**와 **Actions**를 분리하여 정의하고, `&` 연산자로 조합하는 패턴을 사용합니다.

```typescript
// State 타입 정의 (데이터만 포함)
type ExampleState = {
  data: string;
  isLoading: boolean;
  error: string | null;
};

// Actions 타입 정의 (함수들만 포함)
type ExampleActions = {
  setData: (data: string) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};

// 전체 Store 타입 조합
type ExampleStore = ExampleState & ExampleActions;
```

## 현재 구현된 Store들

### 1. authStore.ts

- **목적**: 사용자 인증 및 권한 관리
- **주요 기능**: 로그인, 로그아웃, 토큰 관리, 인증 상태 확인
- **persist**: 토큰 및 사용자 정보

### 2. userStore.ts

- **목적**: 사용자 프로필 및 설정 관리
- **주요 기능**: 프로필 업데이트, 사용자 통계, 설정 관리
- **persist**: 사용자 데이터 및 설정

### 3. searchStore.ts

- **목적**: 검색 기능 및 의도 감지
- **주요 기능**: 검색 쿼리 관리, 의도 감지, 검색 기록
- **persist**: 검색 기록 및 최근 검색어

### 4. analysisStore.ts

- **목적**: HS Code 분석 세션 관리
- **주요 기능**: 분석 세션 생성/관리, 질문 답변, 진행 상태 추적
- **persist**: 없음 (세션 데이터는 휘발성)

### 5. resultStore.ts

- **목적**: 분석 결과 캐싱 및 북마크 관리
- **주요 기능**: 결과 캐싱, 북마크, 최근 결과 관리
- **persist**: 결과 캐시 및 북마크

### 6. notificationStore.ts

- **목적**: 실시간 알림 관리
- **주요 기능**: 알림 추가/제거, 읽음 상태 관리
- **persist**: 일부 알림 데이터

### 7. newsStore.ts

- **목적**: 뉴스 및 정보 관리
- **주요 기능**: 뉴스 필터링, 북마크, 검색
- **persist**: 없음 (실시간 데이터)

### 8. uiStore.ts

- **목적**: UI 상태 관리
- **주요 기능**: 로딩 상태, 모달, 사이드바, Toast 관리
- **persist**: 없음 (UI 상태는 휘발성)

## 사용 가이드라인

### 1. Selector 사용 권장

성능 최적화를 위해 필요한 상태만 선택하여 구독하세요.

```typescript
// ❌ 비권장: 전체 state 구독
const { user, preferences, stats } = useUserStore();

// ✅ 권장: 필요한 데이터만 선택
const user = useUserStore((state) => state.currentUser);
const isLoading = useUserStore((state) => state.isLoading);
```

### 2. 타입 안전성

모든 store는 TypeScript로 엄격히 타입이 정의되어 있습니다.

```typescript
// 타입 안전한 사용
const { setCurrentUser, updateUserStats } = useUserStore();
setCurrentUser(userData); // 타입 검증됨
updateUserStats({ messageCount: 5 }); // 타입 검증됨
```

### 3. Persist 사용

중요한 데이터는 localStorage에 자동으로 저장됩니다.

```typescript
// persist 설정 예시
export const useExampleStore = create<ExampleStore>()(
  persist(
    (set, get) => ({
      // store 구현
    }),
    {
      name: "example-storage",
      partialize: (state) => ({
        // 저장할 데이터만 선택
        importantData: state.importantData,
      }),
    },
  ),
);
```

### 4. 에러 처리

모든 store는 일관된 에러 처리 패턴을 가집니다.

```typescript
// 에러 상태 관리
type StateWithError = {
  error: string | null;
  // ... 기타 상태
};

type ActionsWithError = {
  setError: (error: string | null) => void;
  clearError: () => void;
  // ... 기타 액션
};
```

## 성능 최적화

### 1. 상태 분리

관련 없는 상태들은 별도의 store로 분리하여 불필요한 리렌더링을 방지합니다.

### 2. 선택적 구독

`useStore((state) => state.specificValue)` 패턴을 사용하여 필요한 상태만 구독합니다.

### 3. 액션 메모이제이션

컴포넌트에서 store 액션을 사용할 때는 `useCallback`으로 메모이제이션하세요.

```typescript
const MyComponent = () => {
  const setLoading = useUserStore((state) => state.setLoading);

  const handleAction = useCallback(() => {
    setLoading(true);
    // ... 비동기 작업
    setLoading(false);
  }, [setLoading]);

  return <button onClick={handleAction}>Action</button>;
};
```

## 디버깅

### 1. Zustand DevTools

개발 환경에서는 Redux DevTools를 사용하여 상태 변화를 추적할 수 있습니다.

### 2. 콘솔 로깅

중요한 상태 변화는 subscribe를 통해 로깅됩니다.

```typescript
// 예시: analysisStore의 세션 변화 추적
useAnalysisStore.subscribe(
  (state) => state.activeSessions,
  (sessions) => {
    console.log("Sessions updated:", Object.keys(sessions).length);
  },
);
```

## 마이그레이션 가이드

기존 Context API나 다른 상태 관리 라이브러리에서 Zustand로 마이그레이션할 때:

1. **Provider 제거**: Zustand는 Provider가 필요하지 않습니다.
2. **Props Drilling 해결**: 어느 컴포넌트에서든 직접 store에 접근 가능합니다.
3. **성능 개선**: 자동으로 최적화된 리렌더링을 제공합니다.

## 베스트 프랙티스

1. **State와 Actions 분리**: 타입 정의를 명확히 분리하여 유지보수성을 높입니다.
2. **단일 책임 원칙**: 각 store는 하나의 명확한 책임을 가집니다.
3. **불변성**: Zustand는 불변성을 자동으로 처리하지만, 중첩 객체 업데이트 시 주의합니다.
4. **에러 처리**: 모든 비동기 작업에는 적절한 에러 처리를 포함합니다.
5. **타입 안전성**: TypeScript를 적극 활용하여 런타임 에러를 방지합니다.
