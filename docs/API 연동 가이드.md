# 프론트엔드 API 연동 가이드

## 1. 개요 (Overview)

이 문서는 우리 프로젝트에서 백엔드 API와 통신하는 방법을 안내하는 가이드입니다. 새로운 팀원이나 프로젝트 구조에 익숙하지 않은 개발자가 API 연동 작업을 쉽고 일관되게 수행할 수 있도록 돕는 것을 목표로 합니다.

우리 프로젝트는 API 연동을 위해 다음과 같은 기술 스택을 사용합니다.

-   **TanStack Query (v5)**: 서버 상태 관리를 위한 라이브러리로, 캐싱, 데이터 동기화, 비동기 로직 처리를 자동화하여 복잡성을 줄여줍니다.
-   **Axios**: HTTP 클라이언트 라이브러리로, `httpClient` 모듈의 기반이 됩니다.
-   **Custom Hook Factories**: `createQueryHook` 및 `createMutationHook` 과 같은 자체 제작 팩토리 함수를 사용하여, 반복적인 코드를 줄이고 일관된 개발 패턴을 유지합니다.

이 구조를 통해 우리는 예측 가능하고 유지보수하기 쉬운 API 코드를 작성할 수 있습니다.

## 2. 핵심 개념 (Core Concepts)

API 연동을 시작하기 전에 몇 가지 핵심 개념을 이해해야 합니다.

### `httpClient` (`src/lib/api/common/httpClient.ts`)

`httpClient`는 우리 프로젝트의 모든 API 요청을 처리하는 중앙 집중식 Axios 인스턴스입니다. 주요 특징은 다음과 같습니다.

-   **자동 인증 토큰 관리**: 요청 헤더에 자동으로 Access Token을 추가합니다.
-   **자동 토큰 갱신**: Access Token이 만료되면(401 Error), 자동으로 Refresh Token을 사용하여 토큰을 갱신하고, 실패했던 원래 요청을 재시도합니다.
-   **표준화된 응답 처리**:
    -   `httpClient`: 백엔드 응답 `ApiResponse<T>`에서 실제 데이터인 `data` 프로퍼티만 추출하여 반환합니다. 대부분의 경우 이 클라이언트를 사용합니다.
    -   `rawHttpClient`: `ApiResponse<T>` 객체 전체(`{ success, data, message, ... }`)를 그대로 반환합니다. 응답 코드나 메시지에 따라 분기 처리가 필요할 때 사용합니다.
-   **에러 처리**: 요청 실패 시 표준화된 `HttpClientError` 객체를 throw 합니다.

### TanStack Query

서버에서 가져온 데이터를 '서버 상태'로 관리합니다. 클라이언트 상태(예: UI 상태)와 분리하여 다루기 때문에 코드가 단순해집니다.

-   **Query (데이터 조회)**: `GET` 요청과 같이 서버에서 데이터를 가져오는 작업입니다. `useQuery` 훅을 사용하며, `isLoading`, `isError`, `data` 등의 상태를 제공합니다.
-   **Mutation (데이터 변경)**: `POST`, `PUT`, `DELETE` 등 서버 데이터를 변경하는 작업입니다. `useMutation` 훅을 사용하며, `isPending`, `isError` 등의 상태를 제공하고, 작업 성공/실패 시 특정 동작(예: 데이터 새로고침)을 수행할 수 있습니다.

### Hook Factories (`createQueryHook`, `createMutationHook`)

TanStack Query의 `useQuery`와 `useMutation`을 한 번 더 감싸서 만든 우리 프로젝트만의 훅 생성 함수입니다.

-   **`createQueryHook`**: 반복적인 `useQuery` 설정을 추상화합니다. 쿼리 키와 API 호출 함수만 정의하면, 표준화된 쿼리 훅을 쉽게 만들 수 있습니다.
-   **`createMutationHook`**: `useMutation` 설정을 추상화하여, 뮤테이션 함수와 성공 시 로직(주로 데이터 무효화)을 정의하면 표준화된 뮤테이션 훅이 생성됩니다.

**이 팩토리들을 사용하는 것은 코드의 일관성을 유지하기 위한 필수 규칙입니다.**

## 3. API 모듈 구조 (`src/lib/api`)

API 관련 코드는 `src/lib/api` 디렉토리 내에 도메인별로 구분되어 있습니다.

```
src/lib/api/
├── common/             # 공통 모듈 (httpClient, 훅 팩토리 등)
├── bookmark/           # 북마크 API
│   ├── api.ts          # 실제 API 요청 함수
│   ├── hooks.ts        # 컴포넌트에서 사용할 React Hooks
│   ├── index.ts        # 모듈 전체 export
│   ├── queries.ts      # TanStack Query 옵션 (query keys, query functions)
│   └── types.ts        # TypeScript 타입 정의
├── chat/               # 채팅 API (동일한 구조)
├── ...                 # 다른 도메인들
└── index.ts            # 모든 도메인 API 모듈을 통합하여 export
```

## 4. 새로운 API 엔드포인트 추가하기 (Step-by-Step)

이제, 가상의 `GET /products` 엔드포인트를 추가하는 과정을 통해 실제 작업 흐름을 알아봅시다.

### 0단계: API 명세 확인

작업 시작 전, 스웨거 문서를 반드시 확인하여 엔드포인트 URL, 요청 파라미터, 응답 데이터 구조를 정확히 파악해야 합니다.

### 1단계: 타입 정의 (`src/lib/api/product/types.ts`)

먼저 `product` 도메인과 관련된 TypeScript 타입을 정의합니다.

```typescript
// src/lib/api/product/types.ts

/** 상품 정보 타입 */
export type Product = {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
};

/** 상품 목록 조회 API의 요청 파라미터 타입 */
export type GetProductsParams = {
  category?: string;
  limit?: number;
  offset?: number;
};
```

### 2단계: API 함수 작성 (`src/lib/api/product/api.ts`)

`httpClient`를 사용하여 실제 백엔드 API를 호출하는 함수를 작성합니다.

```typescript
// src/lib/api/product/api.ts
import { httpClient } from "../common";
import type { Product, GetProductsParams } from "./types";

export const productApi = {
  async getProducts(params?: GetProductsParams): Promise<Product[]> {
    const queryParams = new URLSearchParams(
      // params가 있을 경우, undefined나 null이 아닌 값만 쿼리 스트링으로 변환
      Object.entries(params || {})
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)]),
    );

    return httpClient.get<Product[]>(`/products?${queryParams.toString()}`);
  },
};
```

### 3단계: 쿼리 옵션 정의 (`src/lib/api/product/queries.ts`)

TanStack Query가 사용할 `queryKey`와 `queryFn`을 정의합니다.

-   `queryKey`: 쿼리 데이터를 캐싱하기 위한 고유한 키입니다.
-   `queryFn`: 해당 쿼리가 호출될 때 실행될 비동기 함수입니다. (2단계에서 만든 `productApi.getProducts` 호출)

```typescript
// src/lib/api/product/queries.ts
import { queryOptions } from "@tanstack/react-query";
import { productApi } from "./api";
import type { GetProductsParams } from "./types";

export const productQueryKeys = {
  all: () => ["products"] as const,
  lists: () => [...productQueryKeys.all(), "list"] as const,
  list: (params: GetProductsParams = {}) =>
    [...productQueryKeys.lists(), params] as const,
};

export const productQueries = {
  list: (params?: GetProductsParams) =>
    queryOptions({
      queryKey: productQueryKeys.list(params),
      queryFn: () => productApi.getProducts(params),
    }),
};
```

### 4단계: 커스텀 훅 생성 (`src/lib/api/product/hooks.ts`)

`createQueryHook` 팩토리를 사용하여 컴포넌트에서 최종적으로 사용될 훅을 만듭니다.

```typescript
// src/lib/api/product/hooks.ts
import { createQueryHook } from "../common/createQuery";
import { productQueries } from "./queries";

/** 상품 목록을 가져오는 쿼리 훅 */
export const useGetProducts = createQueryHook(productQueries.list);
```

### 5단계: 모듈 통합 (`index.ts`)

방금 만든 기능들을 `index.ts` 파일을 통해 외부로 노출시킵니다.

```typescript
// src/lib/api/product/index.ts
export * from "./api";
export * from "./hooks";
export * from "./queries";
export * from "./types";
```

그리고 최상위 `index.ts`에도 추가합니다.

```typescript
// src/lib/api/index.ts
// ... 기존 export
export * from "./product";
```

### 6단계: 컴포넌트에서 훅 사용하기

이제 모든 준비가 끝났습니다. React 컴포넌트에서 방금 만든 `useGetProducts` 훅을 사용하여 데이터를 가져오고 UI를 렌더링할 수 있습니다.

```tsx
// src/components/ProductList.tsx
import { useGetProducts } from "@/lib/api";
import { useState } from "react";

export function ProductList() {
  const [category, setCategory] = useState("electronics");

  const { data: products, isLoading, isError, error } = useGetProducts({ category });

  if (isLoading) {
    return <div>상품 목록을 불러오는 중...</div>;
  }

  if (isError) {
    // error 객체는 HttpClientError 타입일 가능성이 높음
    return <div>오류가 발생했습니다: {error.message}</div>;
  }

  return (
    <div>
      <h2>상품 목록</h2>
      <ul>
        {products?.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price}원
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 5. 데이터 변경 API (Mutation) 추가하기

`POST`, `PUT`, `DELETE` 요청은 `createMutationHook`을 사용하여 거의 동일한 방식으로 구현합니다. 상품을 추가하는 `useAddProduct` 훅을 예시로 살펴봅시다.

**1~2단계**는 위와 동일하게 `types.ts`와 `api.ts`에 `AddProductRequest` 타입과 `productApi.addProduct` 함수를 추가합니다.

```typescript
// api.ts에 추가
async addProduct(newProduct: AddProductRequest): Promise<Product> {
  return httpClient.post<Product>("/products", newProduct);
}
```

**핵심은 `hooks.ts`에서 뮤테이션 훅을 만드는 부분입니다.**

```typescript
// src/lib/api/product/hooks.ts (기존 파일에 추가)
import { useQueryClient } from "@tanstack/react-query";
import { createMutationHook } from "../common/createMutation";
import { productApi } from "./api";
import { productQueryKeys } from "./queries";
// ... useGetProducts는 그대로 둠

export const useAddProduct = createMutationHook((queryClient) => ({
  mutationFn: productApi.addProduct,
  onSuccess: () => {
    // 새 상품이 추가되었으므로, 'products' 관련 모든 쿼리를 무효화시켜
    // 최신 데이터를 다시 불러오게 함
    queryClient.invalidateQueries({ queryKey: productQueryKeys.all() });
  },
}));
```

`onSuccess` 콜백에서 `queryClient.invalidateQueries`를 호출하는 것이 중요합니다. 이를 통해 TanStack Query는 데이터가 변경되었음을 인지하고, 해당 `queryKey`를 사용하는 모든 `useQuery` 훅(예: `useGetProducts`)을 자동으로 다시 실행하여 화면을 최신 상태로 업데이트합니다.

## 6. 에러 처리

`useQuery`와 `useMutation`은 `isError` (boolean)와 `error` (Error 객체)를 반환합니다. 컴포넌트에서는 이 값들을 사용하여 사용자에게 적절한 피드백을 제공해야 합니다.

```tsx
const { isError, error } = useGetProducts();

if (isError) {
  // 여기서 error는 `HttpClientError` 타입이므로, statusCode나 errorCode에 접근 가능
  console.error("API Error:", error.statusCode, error.message);
  return <ErrorMessage message="데이터를 불러오는데 실패했습니다." />;
}
```

## 7. 규칙 및 FAQ

-   **Q: `httpClient`와 `rawHttpClient` 중 무엇을 써야 하나요?**
    -   **A:** 95%의 경우, `httpClient`를 사용하세요. 서버 응답의 `data`만 필요할 때 가장 편리합니다. 백엔드 응답의 `success` 필드나 `message` 필드를 직접 확인해야 하는 특수한 경우에만 `rawHttpClient`를 사용하세요.

-   **Q: API 파일은 어디에 만들어야 하나요?**
    -   **A:** `src/lib/api` 아래에 API의 도메인(기능)에 맞는 이름으로 새 폴더를 만드세요. 만약 적절한 폴더가 이미 있다면 해당 폴더 내의 `api.ts`, `queries.ts` 등에 코드를 추가하세요.

-   **Q: 네이밍 컨벤션이 있나요?**
    -   **A:** 예.
        -   쿼리 훅: `useGet[Something]`, `useFetch[Something]`
        -   뮤테이션 훅: `useAdd[Something]`, `useUpdate[Something]`, `useDelete[Something]`
        -   API 함수: `get[Something]`, `add[Something]`, `update[Something]`
        -   쿼리 키: `[domain]QueryKeys` (예: `productQueryKeys`)
        -   쿼리 옵션: `[domain]Queries` (예: `productQueries`)

-   **Q: API 요청 시 파라미터는 어떻게 전달하나요?**
    -   **A:** `useQuery` 훅을 사용할 때, `queryOptions` 팩토리(`productQueries.list`)에 정의된 파라미터를 첫 번째 인자로 전달합니다. 이 파라미터는 `queryKey`와 `queryFn` 양쪽에 모두 전달됩니다. 