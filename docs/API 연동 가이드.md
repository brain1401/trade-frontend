# 프론트엔드 API 연동 가이드

## 1. 개요 (Overview)

이 문서는 우리 프로젝트에서 백엔드 API와 통신하는 방법을 안내하는 가이드입니다. 새로운 팀원이나 프로젝트 구조에 익숙하지 않은 개발자가 API 연동 작업을 쉽고 일관되게 수행할 수 있도록 돕는 것을 목표로 합니다.

우리 프로젝트는 API 연동을 위해 다음과 같은 기술 스택을 사용합니다.

-   **TanStack Query (v5)**: 서버 상태 관리를 위한 핵심 라이브러리입니다. 캐싱, 데이터 동기화, 비동기 로직 처리를 자동화하여 복잡성을 줄여줍니다.
-   **Axios**: HTTP 클라이언트 라이브러리로, `httpClient` 모듈의 기반이 됩니다.
-   **`queryOptions` 패턴**: TanStack Query가 제공하는 `queryOptions`를 적극적으로 사용하여, 반복적인 코드를 줄이고 타입-세이프하며 일관된 개발 패턴을 유지합니다.

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
-   **에러 처리**: 요청 실패 시 표준화된 `ApiError` 객체를 throw 합니다.

### TanStack Query

서버에서 가져온 데이터를 '서버 상태'로 관리합니다. 클라이언트 상태(예: UI 상태)와 분리하여 다루기 때문에 코드가 단순해집니다.

-   **Query (데이터 조회)**: `GET` 요청과 같이 서버에서 데이터를 가져오는 작업입니다. `useQuery` 훅을 사용하며, `isLoading`, `isError`, `data` 등의 상태를 제공합니다.
-   **Mutation (데이터 변경)**: `POST`, `PUT`, `DELETE` 등 서버 데이터를 변경하는 작업입니다. `useMutation` 훅을 사용하며, `isPending`, `isError` 등의 상태를 제공하고, 작업 성공/실패 시 특정 동작(예: 데이터 새로고침)을 수행할 수 있습니다.

## 3. API 모듈 구조 (`src/lib/api`)

API 관련 코드는 `src/lib/api` 디렉토리 내에 도메인별로 구분되어 있습니다. **`hooks.ts` 파일은 더 이상 사용하지 않습니다.**

```
src/lib/api/
├── common/             # 공통 모듈 (httpClient, ApiError 등)
├── bookmark/           # 북마크 API
│   ├── api.ts          # 실제 API 요청 함수
│   ├── index.ts        # 모듈 전체 export
│   ├── queries.ts      # TanStack Query 옵션 (query keys, queryOptions)
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
import type { ApiResponse } from "@/types/common";

export const productApi = {
  async getProducts(params?: GetProductsParams): Promise<ApiResponse<Product[]>> {
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

TanStack Query가 사용할 `queryKey`와 `queryFn`을 `queryOptions`를 사용해 정의합니다. 이 단계가 API 로직을 재사용 가능하고 직관적으로 만드는 핵심입니다.

우리 프로젝트는 **리소스의 복수/단수형을 사용**하여 `queryKey`를 만드는 것을 표준 패턴으로 삼습니다.

-   **목록 (Collection)**: 리소스의 **복수형** 이름을 사용합니다. (예: `['products']`)
-   **개별 항목 (Document)**: 리소스의 **단수형** 이름과 고유 ID를 사용합니다. (예: `['product', 'prod-123']`)

이 패턴은 TanStack Query 공식 문서에서도 사용되는 방식으로, 매우 직관적이고 코드를 간결하게 유지해줍니다.

-   `queryKey`: 쿼리 데이터를 캐싱하기 위한 고유한 키입니다.
-   `queryFn`: 해당 쿼리가 호출될 때 실행될 비동기 함수입니다. (2단계에서 만든 `productApi.getProducts` 호출)

```typescript
// src/lib/api/product/queries.ts
import { queryOptions } from "@tanstack/react-query";
import { productApi } from "./api";
import type { GetProductsParams } from "./types";

// **[핵심]** queryKey를 관리하는 객체입니다.
// 리소스의 복수형(예: 'products')은 목록을, 단수형(예: 'product')은 개별 항목을 나타냅니다.
export const productQueryKeys = {
  /** products 리소스 전체에 대한 최상위 키. 목록 무효화에 사용. */
  all: () => ["products"] as const,
  /** 필터링된 products 목록을 위한 키 */
  list: (params: GetProductsParams = {}) =>
    [...productQueryKeys.all(), params] as const,
  /** 단일 product의 상세 정보를 위한 키 */
  detail: (id: string) => ["product", id] as const, // `product` (단수형) 사용
};

// **[핵심]** queryOptions를 생성하는 팩토리 객체입니다.
// 컴포넌트에서는 이 객체의 메서드만 사용하게 됩니다.
export const productQueries = {
  list: (params?: GetProductsParams) =>
    queryOptions({
      queryKey: productQueryKeys.list(params),
      queryFn: () => productApi.getProducts(params),
    }),
  // 상세 정보를 가져오는 쿼리가 필요하다면 여기에 detail 팩토리를 추가합니다.
  // detail: (id: string) => queryOptions({ ... })
};
```

### 4단계: 모듈 통합 (`index.ts`)

방금 만든 기능들을 `index.ts` 파일을 통해 외부로 노출시킵니다.

```typescript
// src/lib/api/product/index.ts
export * from "./api";
export * from "./queries";
export * from "./types";
```

그리고 최상위 `index.ts`에도 추가합니다.

```typescript
// src/lib/api/index.ts
// ... 기존 export
export * from "./product";
```

### 5단계: 컴포넌트에서 쿼리 사용하기

이제 모든 준비가 끝났습니다. React 컴포넌트에서 `useQuery` 훅과 3단계에서 만든 `productQueries`를 직접 조합하여 데이터를 가져오고 UI를 렌더링할 수 있습니다.

```tsx
// src/components/ProductList.tsx
import { useQuery } from "@tanstack/react-query";
import { productQueries } from "@/lib/api";
import { useState } from "react";

export function ProductList() {
  const [category, setCategory] = useState("electronics");

  const { data: products, isLoading, isError, error } = useQuery(
    productQueries.list({ category }),
  );

  if (isLoading) {
    return <div>상품 목록을 불러오는 중...</div>;
  }

  if (isError) {
    // error 객체는 ApiError 타입일 가능성이 높음
    return <ErrorMessage message="데이터를 불러오는데 실패했습니다." />;
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

`POST`, `PUT`, `DELETE` 요청은 `useMutation` 훅을 컴포넌트 내에서 직접 사용하여 구현합니다. 상품을 추가하는 예시를 살펴봅시다.

**1~2단계**는 위와 동일하게 `types.ts`와 `api.ts`에 `AddProductRequest` 타입과 `productApi.addProduct` 함수를 추가합니다.

```typescript
// api.ts에 추가
async addProduct(newProduct: AddProductRequest): Promise<Product> {
  return httpClient.post<Product>("/products", newProduct);
}
```

**핵심은 컴포넌트에서 `useMutation`을 직접 사용하는 부분입니다.**

```tsx
// src/components/ProductAdder.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi, productQueryKeys, type AddProductRequest } from "@/lib/api";

export function ProductAdder() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newProduct: AddProductRequest) => productApi.addProduct(newProduct),
    onSuccess: () => {
      // 'products'로 시작하는 모든 쿼리를 무효화합니다.
      // 이를 통해 상품 목록이 자동으로 새로고침됩니다.
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all() });
    },
  });

  const handleAddProduct = () => {
    const newProduct: AddProductRequest = {
      name: "새로운 노트북",
      price: 2000000,
      categoryId: "electronics",
    };
    mutation.mutate(newProduct);
  };

  return (
    <button onClick={handleAddProduct} disabled={mutation.isPending}>
      {mutation.isPending ? "추가하는 중..." : "노트북 추가하기"}
    </button>
  );
}
```

컴포넌트 내에서 `useMutation`을 직접 사용함으로써, 뮤테이션 로직과 성공/실패 시의 사이드 이펙트(데이터 무효화 등)를 같은 위치에서 명확하게 관리할 수 있습니다.

### 언제 `useMutation`을 사용해야 할까요?

**결론부터 말하면, 서버의 데이터를 변경하는 모든 API 호출에는 `useMutation`을 사용하는 것이 원칙입니다.**

`productApi.addProduct()`와 같은 함수를 컴포넌트의 이벤트 핸들러 내에서 직접 호출할 수도 있지만, 이는 많은 단점을 야기합니다. `useMutation`은 이러한 문제들을 해결해주는 강력한 도구입니다.

#### 비교: 직접 호출 vs. `useMutation`

**Case 1: `productApi` 직접 호출 (나쁜 예시 👎)**

```tsx
function ProductAdderBad() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const queryClient = useQueryClient();

  const handleAddProduct = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newProduct: AddProductRequest = { /* ... */ };
      await productApi.addProduct(newProduct);
      
      // 성공 시 로직 (데이터 새로고침)
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all() });
    } catch (e) {
      setError(e as ApiError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={handleAddProduct} disabled={isLoading}>
        {isLoading ? "추가하는 중..." : "상품 추가"}
      </button>
      {error && <p>오류 발생: {error.message}</p>}
    </>
  );
}
```
-   **문제점**:
    -   로딩 상태(`isLoading`), 에러 상태(`error`)를 `useState`로 직접 관리해야 합니다.
    -   `try...catch...finally` 구문이 필수적으로 동반되어 코드가 길고 복잡해집니다.
    -   유사한 데이터 변경 작업을 하는 다른 컴포넌트가 생길 때마다 이 보일러플레이트 코드를 반복해서 작성해야 합니다.

**Case 2: `useMutation` 사용 (좋은 예시 👍)**

```tsx
function ProductAdderGood() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: productApi.addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all() });
    },
  });

  const handleAddProduct = () => {
    const newProduct: AddProductRequest = { /* ... */ };
    mutation.mutate(newProduct);
  };

  return (
    <>
      <button onClick={handleAddProduct} disabled={mutation.isPending}>
        {mutation.isPending ? "추가하는 중..." : "상품 추가"}
      </button>
      {mutation.isError && <p>오류 발생: {mutation.error.message}</p>}
    </>
  );
}
```

-   **`useMutation`의 명확한 이점**:
    1.  **상태 관리 자동화**: 로딩 상태(`isPending`), 에러 상태(`isError`), 성공 상태(`isSuccess`), 에러 객체(`error`) 등을 훅이 자동으로 관리해줍니다. `useState`와 `try...catch`가 필요 없습니다.
    2.  **선언적인 사이드 이펙트**: `onSuccess`, `onError`, `onSettled` 같은 콜백 옵션을 통해 "성공했을 때 무엇을 할지", "실패했을 때 무엇을 할지"를 직관적으로 선언할 수 있습니다. 코드가 간결하고 의도가 명확해집니다.
    3.  **일관성**: 프로젝트 내 모든 데이터 변경 작업이 동일한 구조와 패턴을 따르게 되어 예측 가능성과 유지보수성이 크게 향상됩니다.
    4.  **고급 기능**: 요청 재시도(retry), 낙관적 업데이트(Optimistic Updates) 등 복잡한 UI 패턴을 훨씬 적은 코드로 구현할 수 있습니다.

#### 판단 기준: 언제 직접 호출해도 괜찮은가?

**원칙적으로 없습니다.**

다만, 아래와 같이 **서버의 상태를 변경하지 않고**, **결과에 대한 UI 피드백이 전혀 필요 없는** 극히 예외적인 경우에만 직접 호출을 고려할 수 있습니다.

-   **Fire-and-forget 로깅**: 사용자의 특정 행동을 기록하기 위해 API를 호출하지만, 그 결과가 현재 화면이나 다른 데이터에 아무런 영향을 주지 않는 경우.

이런 경우를 제외한 **모든 `POST`, `PUT`, `PATCH`, `DELETE` 요청은 반드시 `useMutation`을 사용**해야 합니다.

## 6. 에러 처리

`useQuery`와 `useMutation`은 `isError` (boolean)와 `error` (`ApiError` 객체)를 반환합니다. 컴포넌트에서는 이 값들을 사용하여 사용자에게 적절한 피드백을 제공해야 합니다.

```tsx
const { isError, error } = useQuery(productQueries.list());

if (isError) {
  // 여기서 error는 `ApiError` 타입이므로, statusCode나 message에 접근 가능
  console.error("API Error:", error.statusCode, error.message);
  return <ErrorMessage message="데이터를 불러오는데 실패했습니다." />;
}
```

## 7. 규칙 및 FAQ

-   **Q: `httpClient`와 `rawHttpClient` 중 무엇을 써야 하나요?**
    -   **A:** 95%의 경우, `httpClient`를 사용하세요. 서버 응답의 `data`만 필요할 때 가장 편리합니다. 백엔드 응답의 `success` 필드나 `message` 필드를 직접 확인해야 하는 특수한 경우에만 `rawHttpClient`를 사용하세요.

-   **Q: API 파일은 어디에 만들어야 하나요?**
    -   **A:** `src/lib/api` 아래에 API의 도메인(기능)에 맞는 이름으로 새 폴더를 만드세요. 만약 적절한 폴더가 이미 있다면 해당 폴더 내의 `api.ts`, `queries.ts` 등에 코드를 추가하세요. **`hooks.ts` 파일은 더 이상 만들지 않습니다.**

-   **Q: 네이밍 컨벤션이 있나요?**
    -   **A:** 예.
        -   API 함수: `get[Something]`, `add[Something]`, `update[Something]` 등
        -   쿼리 키 객체: `[domain]QueryKeys` (예: `productQueryKeys`)
        -   쿼리 옵션 객체: `[domain]Queries` (예: `productQueries`)

-   **Q: API 요청 시 파라미터는 어떻게 전달하나요?**
    -   **A:** `useQuery` 훅에 `queryOptions` 팩토리(`productQueries.list`)를 전달할 때, 팩토리 함수에 인자를 넘겨주면 됩니다. 이 인자는 `queryKey`와 `queryFn` 양쪽에 모두 자동으로 전달되어, 파라미터에 따른 캐싱과 API 호출이 이루어집니다.
        
        `useQuery(productQueries.list({ category: "electronics" }))`