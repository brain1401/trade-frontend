# Store

이 디렉토리는 애플리케이션의 전역 상태 관리를 위한 [Zustand 공식 문서](https://docs.pmnd.rs/zustand/getting-started/introduction) `store`들을 보관함.

## Zustand 도입 배경

Zustand는 Redux와 같은 다른 상태 관리 라이브러리에 비해 최소한의 보일러플레이트로 단순하고 직관적인 API를 제공함. React 내장 Context API의 주요 단점을 해결하기 위해 도입함.

### Context API의 주요 단점과 Zustand

- **잦은 리렌더링**: Context의 특정 상태값 하나만 변경되어도 해당 Context를 구독하는 모든 컴포넌트가 리렌더링되는 문제가 있음. Zustand는 상태 변경 시 필요한 컴포넌트만 선택적으로 리렌더링하여 성능을 최적화함.
- **Props Drilling (Provider Hell)**: 상태를 공유하기 위해 여러 계층의 컴포넌트를 거쳐 `props`를 계속해서 전달해야 하는 `Props Drilling` 문제가 발생함. 여러 Context 사용 시 중첩된 Provider 구조(`Provider Hell`)는 가독성과 유지보수성을 저하시킴. Zustand는 `Provider` 없이 어떤 컴포넌트에서든 `store`에 직접 접근할 수 있어 이 문제를 근본적으로 해결함.

## 디렉토리 구조

각 `store`는 관심사를 기준으로 분리하여 `[domain].ts` 형식의 파일로 관리함.

```
store/
├── ui.ts
├── user.ts
└── ...
```

## Store 생성 및 사용법

### Store 생성 규칙

새로운 `store`를 생성할 때는 다음 규칙을 따름.

1.  **파일 생성**: `store` 디렉토리 내에 `[domain].ts` 파일을 생성함.
2.  **타입 정의**: `State`와 `Actions` 타입을 분리하여 정의함.
3.  **Store 구현**: `create` 함수를 사용하여 `store`를 구현함. `immer` 미들웨어를 사용하여 불변성을 쉽게 관리하는 것을 권장함.
4.  **네이밍**: `use[Domain]Store` 형식의 이름을 사용함. (예: `useUserStore`)

### 예시 : 사용자 인증 Store

다음은 Props Drilling 문제를 해결하는 사용자 인증 `store`의 생성 및 사용 예시임.

#### 1. 파일 구조

```
src/
├── components/
│   ├── Header.tsx
│   └── UserProfile.tsx
├── store/
│   └── user.ts
└── App.tsx
```

#### 2. 사용자 Store 생성 (`user.ts`)

```typescript
// store/user.ts
import { create } from "zustand";

type User = {
  name: string;
  email: string;
};

type State = {
  user: User | null;
};

type Actions = {
  login: (user: User) => void;
  logout: () => void;
};

export const useUserStore = create<State & Actions>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

#### 3. 컴포넌트에서 Store 직접 사용

`Header`와 `UserProfile` 컴포넌트는 `props` 전달 없이 `useUserStore` 훅을 호출하여 필요한 값과 함수를 직접 가져와 사용할 수 있음.

**`Header.tsx`**

```tsx
// components/Header.tsx
import { useUserStore } from "@/store/user";

function Header() {
  const { user, logout } = useUserStore();

  return (
    <header>
      {user ? (
        <>
          <span>안녕하세요, {user.name}님</span>
          <button onClick={logout}>로그아웃</button>
        </>
      ) : (
        <span>로그인이 필요합니다.</span>
      )}
    </header>
  );
}
```

**`UserProfile.tsx`**

````tsx
// components/UserProfile.tsx
import { useUserStore } from '@/store/user';

function UserProfile() {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <div>사용자 정보가 없습니다.</div>;
  }

  return (
    <div>
      <h2>프로필</h2>
      <p>이름: {user.name}</p>
      <p>이메일: {user.email}</p>
    </div>
  );
}

#### 4. 상태 선택(Selector)과 렌더링 최적화

위 예제에서 `Header`와 `UserProfile`은 `store`의 상태를 가져오는 방식이 다름. 이 차이는 성능에 영향을 줄 수 있음.

-   **전체 상태 구독 (비권장)**
    ```tsx
    // Header.tsx
    const { user, logout } = useUserStore();
    ```
    이 방식은 `store`의 모든 것을 구독함. `store`의 어떤 값이든 변경되면 컴포넌트는 불필요하게 리렌더링될 수 있음. 예를 들어 `user`와 관련 없는 다른 상태가 `userStore`에 추가되고 그 값이 바뀌면, `Header`도 다시 렌더링됨.

-   **일부 상태 선택 (권장)**
    ```tsx
    // UserProfile.tsx
    const user = useUserStore((state) => state.user);
    ```
    이 방식은 `selector` 함수를 사용하여 필요한 상태만 정확히 선택함. Zustand는 `selector`가 반환하는 값(`state.user`)이 실제로 변경될 때만 컴포넌트를 리렌더링하여 성능을 최적화함.

**결론적으로, 불필요한 리렌더링을 방지하고 성능을 최적화하기 위해 항상 `selector`를 사용하여 필요한 상태만 가져오는 것을 권장함.**
````
