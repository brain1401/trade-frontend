# TanStack Query v5 queryOptions 완전 가이드

## queryOptions란?

queryOptions는 queryKey와 queryFn을 여러 곳에서 공유하면서도 함께 유지할 수 있는 최고의 방법 중 하나입니다. 런타임에서 이 헬퍼는 전달한 내용을 그대로 반환하지만, TypeScript와 함께 사용할 때 많은 장점을 제공합니다.

## 기본 사용법

### 1. 기본 queryOptions 정의

```typescript
import { queryOptions } from '@tanstack/react-query'

// 사용자 데이터 타입 정의
type User = {
  id: number
  name: string
  email: string
}

// 기본 queryOptions 함수
function userOptions(userId: number) {
  return queryOptions({
    queryKey: ['users', userId],
    queryFn: async (): Promise<User> => {
      const response = await fetch(`/api/users/${userId}`)
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000,   // 10분 (v5에서 cacheTime → gcTime)
  })
}
```

### 2. 다양한 훅에서 사용

```typescript
import { useQuery, useSuspenseQuery, useQueries } from '@tanstack/react-query'

function UserProfile({ userId }: { userId: number }) {
  // useQuery에서 사용
  const { data: user, isLoading, error } = useQuery(userOptions(userId))
  
  return (
    <div>
      {isLoading && <div>사용자 정보 로딩 중...</div>}
      {error && <div>오류 발생: {error.message}</div>}
      {user && <div>{user.name} ({user.email})</div>}
    </div>
  )
}

function UserProfileSuspense({ userId }: { userId: number }) {
  // useSuspenseQuery에서 사용 - 데이터가 항상 정의됨
  const { data: user } = useSuspenseQuery(userOptions(userId))
  
  return <div>{user.name} ({user.email})</div>
}

function MultipleUsers() {
  // useQueries에서 사용
  const userQueries = useQueries({
    queries: [
      userOptions(1),
      userOptions(2),
      userOptions(3),
    ]
  })
  
  return (
    <div>
      {userQueries.map((query, index) => (
        <div key={index}>
          {query.data ? query.data.name : '로딩 중...'}
        </div>
      ))}
    </div>
  )
}
```

### 3. QueryClient 메서드와 함께 사용

```typescript
import { useQueryClient } from '@tanstack/react-query'

function UserActions({ userId }: { userId: number }) {
  const queryClient = useQueryClient()
  
  const prefetchUser = () => {
    // 사용자 데이터 미리 가져오기
    queryClient.prefetchQuery(userOptions(userId + 1))
  }
  
  const updateUserCache = (newUserData: User) => {
    // 캐시 직접 업데이트
    queryClient.setQueryData(userOptions(userId).queryKey, newUserData)
  }
  
  const invalidateUser = () => {
    // 특정 사용자 쿼리 무효화
    queryClient.invalidateQueries({ 
      queryKey: userOptions(userId).queryKey 
    })
  }
  
  return (
    <div>
      <button onClick={prefetchUser}>다음 사용자 미리 로드</button>
      <button onClick={invalidateUser}>사용자 데이터 새로고침</button>
    </div>
  )
}
```

## TypeScript 타입 안전성

### 1. 자동 타입 추론

```typescript
// queryFn의 반환 타입이 자동으로 추론됨
function postOptions(postId: number) {
  return queryOptions({
    queryKey: ['posts', postId],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${postId}`)
      const data = await response.json()
      return data as {
        id: number
        title: string
        content: string
        authorId: number
      }
    },
  })
}

// 사용 시 타입이 자동으로 추론됨
const { data } = useQuery(postOptions(1))
// data의 타입: { id: number; title: string; content: string; authorId: number } | undefined

// getQueryData도 타입 안전함
const cachedPost = queryClient.getQueryData(postOptions(1).queryKey)
// cachedPost의 타입: { id: number; title: string; content: string; authorId: number } | undefined
```

### 2. 커스텀 에러 타입

```typescript
// 전역 에러 타입 설정
declare module '@tanstack/react-query' {
  interface Register {
    defaultError: {
      message: string
      code: number
    }
  }
}

function apiOptions<T>(endpoint: string) {
  return queryOptions({
    queryKey: [endpoint],
    queryFn: async (): Promise<T> => {
      const response = await fetch(`/api/${endpoint}`)
      if (!response.ok) {
        throw {
          message: '요청 실패',
          code: response.status
        }
      }
      return response.json()
    },
  })
}
```

## 고급 패턴

### 1. select를 활용한 데이터 변환

```typescript
type Product = {
  id: number
  name: string
  price: number
  category: string
  inStock: boolean
}

function productOptions(productId: number) {
  return queryOptions({
    queryKey: ['products', productId],
    queryFn: async (): Promise<Product> => {
      const response = await fetch(`/api/products/${productId}`)
      return response.json()
    },
    staleTime: 5 * 60 * 1000,
  })
}

// 컴포넌트에서 필요한 데이터만 선택
function ProductName({ productId }: { productId: number }) {
  const { data: productName } = useQuery({
    ...productOptions(productId),
    select: (product) => product.name, // 이름만 선택
  })
  
  return <h1>{productName}</h1>
}

function ProductStatus({ productId }: { productId: number }) {
  const { data: isAvailable } = useQuery({
    ...productOptions(productId),
    select: (product) => product.inStock && product.price > 0,
  })
  
  return <span>{isAvailable ? '구매 가능' : '품절'}</span>
}
```

### 2. 조건부 쿼리와 함께 사용

```typescript
import { skipToken } from '@tanstack/react-query'

function userProfileOptions(userId: number | null) {
  return queryOptions({
    queryKey: ['userProfile', userId],
    queryFn: userId 
      ? async () => {
          const response = await fetch(`/api/users/${userId}/profile`)
          return response.json()
        }
      : skipToken, // userId가 없으면 쿼리 실행하지 않음
  })
}

function UserProfileConditional({ userId }: { userId: number | null }) {
  const { data, isLoading } = useQuery(userProfileOptions(userId))
  
  if (!userId) return <div>사용자를 선택해주세요</div>
  if (isLoading) return <div>프로필 로딩 중...</div>
  
  return <div>{data?.name}</div>
}
```

### 3. 무한 쿼리 옵션

```typescript
import { infiniteQueryOptions } from '@tanstack/react-query'

type PostsResponse = {
  posts: Array<{ id: number; title: string; content: string }>
  nextCursor: number | null
  hasNextPage: boolean
}

function postsInfiniteOptions(category?: string) {
  return infiniteQueryOptions({
    queryKey: ['posts', 'infinite', category],
    queryFn: async ({ pageParam = 0 }) => {
      const url = new URL('/api/posts')
      url.searchParams.set('cursor', pageParam.toString())
      if (category) url.searchParams.set('category', category)
      
      const response = await fetch(url.toString())
      return response.json() as PostsResponse
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => 
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
    maxPages: 5, // v5의 새로운 기능 - 최대 페이지 수 제한
  })
}

function InfinitePostsList({ category }: { category?: string }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(postsInfiniteOptions(category))
  
  return (
    <div>
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.posts.map(post => (
            <article key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </article>
          ))}
        </div>
      ))}
      
      {hasNextPage && (
        <button 
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? '로딩 중...' : '더 보기'}
        </button>
      )}
    </div>
  )
}
```

## 실전 예제: API 서비스 구조화

### 1. API 서비스 모듈

```typescript
// services/api.ts
const API_BASE_URL = '/api'

export const api = {
  users: {
    getById: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`)
      if (!response.ok) throw new Error('사용자 조회 실패')
      return response.json()
    },
    
    getList: async (page = 0, limit = 10) => {
      const response = await fetch(`${API_BASE_URL}/users?page=${page}&limit=${limit}`)
      if (!response.ok) throw new Error('사용자 목록 조회 실패')
      return response.json()
    },
    
    update: async (id: number, data: Partial<User>) => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('사용자 업데이트 실패')
      return response.json()
    },
  },
  
  posts: {
    getById: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`)
      if (!response.ok) throw new Error('게시글 조회 실패')
      return response.json()
    },
    
    getByUser: async (userId: number) => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/posts`)
      if (!response.ok) throw new Error('사용자 게시글 조회 실패')
      return response.json()
    },
  },
}
```

### 2. Query Options 모듈

```typescript
// queries/userQueries.ts
import { queryOptions } from '@tanstack/react-query'
import { api } from '../services/api'

export const userQueries = {
  // 기본 키 정의
  all: () => ['users'] as const,
  
  // 특정 사용자 조회
  detail: (id: number) => 
    queryOptions({
      queryKey: [...userQueries.all(), 'detail', id],
      queryFn: () => api.users.getById(id),
      staleTime: 5 * 60 * 1000,
    }),
  
  // 사용자 목록 조회
  list: (page = 0, limit = 10) =>
    queryOptions({
      queryKey: [...userQueries.all(), 'list', page, limit],
      queryFn: () => api.users.getList(page, limit),
      staleTime: 1 * 60 * 1000,
    }),
  
  // 사용자의 게시글 조회
  posts: (userId: number) =>
    queryOptions({
      queryKey: [...userQueries.all(), userId, 'posts'],
      queryFn: () => api.posts.getByUser(userId),
      staleTime: 2 * 60 * 1000,
    }),
}

// queries/postQueries.ts
export const postQueries = {
  all: () => ['posts'] as const,
  
  detail: (id: number) =>
    queryOptions({
      queryKey: [...postQueries.all(), 'detail', id],
      queryFn: () => api.posts.getById(id),
      staleTime: 10 * 60 * 1000,
    }),
}
```

### 3. 커스텀 훅

```typescript
// hooks/useUsers.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userQueries } from '../queries/userQueries'
import { api } from '../services/api'

export function useUser(id: number) {
  return useQuery(userQueries.detail(id))
}

export function useUsers(page = 0, limit = 10) {
  return useQuery(userQueries.list(page, limit))
}

export function useUserPosts(userId: number) {
  return useQuery(userQueries.posts(userId))
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => 
      api.users.update(id, data),
    
    onSuccess: (updatedUser, { id }) => {
      // 특정 사용자 캐시 업데이트
      queryClient.setQueryData(userQueries.detail(id).queryKey, updatedUser)
      
      // 사용자 목록 쿼리들 무효화
      queryClient.invalidateQueries({ 
        queryKey: userQueries.all() 
      })
    },
  })
}
```

### 4. 컴포넌트에서 사용

```typescript
// components/UserDashboard.tsx
import { useUser, useUserPosts, useUpdateUser } from '../hooks/useUsers'

function UserDashboard({ userId }: { userId: number }) {
  const { data: user, isLoading: userLoading } = useUser(userId)
  const { data: posts, isLoading: postsLoading } = useUserPosts(userId)
  const updateUser = useUpdateUser()
  
  const handleUpdateName = (newName: string) => {
    updateUser.mutate({
      id: userId,
      data: { name: newName }
    })
  }
  
  if (userLoading) return <div>사용자 정보 로딩 중...</div>
  
  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
      
      <button 
        onClick={() => handleUpdateName('새 이름')}
        disabled={updateUser.isPending}
      >
        {updateUser.isPending ? '업데이트 중...' : '이름 변경'}
      </button>
      
      <h2>게시글</h2>
      {postsLoading ? (
        <div>게시글 로딩 중...</div>
      ) : (
        <ul>
          {posts?.map((post: any) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

## 최적화 팁

### 1. 캐시 계층화

```typescript
// 공통 옵션을 상위에서 정의
const baseQueryOptions = {
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  retry: 2,
}

function userOptions(id: number) {
  return queryOptions({
    ...baseQueryOptions,
    queryKey: ['users', id],
    queryFn: () => api.users.getById(id),
    // 특정 설정 재정의 가능
    staleTime: 10 * 60 * 1000, // 사용자 데이터는 더 오래 캐시
  })
}
```

### 2. 의존성 쿼리 패턴

```typescript
function userWithPostsOptions(userId: number) {
  return queryOptions({
    queryKey: ['users', userId, 'with-posts'],
    queryFn: async () => {
      // 사용자 정보와 게시글을 동시에 가져오기
      const [user, posts] = await Promise.all([
        api.users.getById(userId),
        api.posts.getByUser(userId)
      ])
      
      return { user, posts }
    },
    staleTime: 3 * 60 * 1000,
  })
}

// 또는 단계별 의존성 쿼리
function useUserWithPosts(userId: number | null) {
  // 첫 번째 쿼리 - 사용자 정보
  const userQuery = useQuery({
    ...userQueries.detail(userId!),
    enabled: !!userId, // userId가 있을 때만 실행
  })
  
  // 두 번째 쿼리 - 사용자의 게시글 (첫 번째 쿼리 성공 후 실행)
  const postsQuery = useQuery({
    ...userQueries.posts(userId!),
    enabled: !!userId && !!userQuery.data,
  })
  
  return {
    user: userQuery.data,
    posts: postsQuery.data,
    isLoading: userQuery.isLoading || postsQuery.isLoading,
    error: userQuery.error || postsQuery.error,
  }
}
```

## 주요 장점

1. **코드 재사용성**: 동일한 쿼리 설정을 여러 곳에서 사용 가능
2. **타입 안전성**: TypeScript와 완벽한 통합으로 컴파일 타임 에러 방지
3. **중앙 집중화**: API 호출 로직을 한 곳에서 관리
4. **유지보수성**: 쿼리 설정 변경 시 한 곳만 수정하면 됨
5. **테스트 용이성**: 쿼리 로직을 독립적으로 테스트 가능