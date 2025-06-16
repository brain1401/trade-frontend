# useFilteredPagination 훅 문서

## 개요

`useFilteredPagination`은 다양한 타입의 배열 데이터에 대해 **필터링**과 **페이지네이션** 기능을 제공하는 제네릭 React 커스텀 훅입니다.

## 주요 기능

- ✅ **타입 안전성**: TypeScript 제네릭을 활용한 완전한 타입 지원
- ✅ **재사용성**: 모든 배열 타입에 대해 동일한 인터페이스 제공
- ✅ **유연한 필터링**: 사용자 정의 필터링 로직 지원
- ✅ **점진적 로딩**: "더보기" 기능으로 성능 최적화
- ✅ **상태 관리**: 필터 상태와 표시 개수 자동 관리

## 타입 정의

```typescript
type UseFilteredPaginationParams<TItem, TFilterKey extends string> = {
  data: TItem[];                                    // 원본 데이터 배열
  filterConfigs: FilterConfig<TFilterKey>[];        // 필터 설정 배열
  filterFunction: FilterFunction<TItem, TFilterKey>; // 필터링 함수
  defaultFilter: TFilterKey;                        // 기본 필터
  initialItemsPerPage?: number;                     // 초기 표시 개수 (기본값: 3)
  incrementSize?: number;                           // 증가 단위 (기본값: 3)
};

type FilterConfig<T extends string> = {
  key: T;      // 필터 키
  label: string; // 필터 라벨
};

type FilterFunction<TItem, TFilterKey extends string> = (
  items: TItem[],
  filterKey: TFilterKey,
) => TItem[];
```

## 반환 값

```typescript
type UseFilteredPaginationReturn<TItem, TFilterKey extends string> = {
  // 상태
  currentFilter: TFilterKey;    // 현재 활성 필터
  displayCount: number;         // 현재 표시 개수
  
  // 계산된 값
  filteredItems: TItem[];       // 필터링된 전체 데이터
  displayedItems: TItem[];      // 실제 표시되는 데이터
  allItemsLoaded: boolean;      // 모든 항목 로드 완료 여부
  
  // 설정
  filterConfigs: FilterConfig<TFilterKey>[]; // 필터 설정 배열
  
  // 액션
  setFilter: (filter: TFilterKey) => void;  // 필터 변경
  loadMore: () => void;                     // 더 많은 항목 로드
  reset: () => void;                        // 상태 초기화
};
```

## 기본 사용법

### 1. 뉴스 데이터 필터링

```typescript
import { useFilteredPagination } from "@/hooks/common/useFilteredPagination";
import type { TradeNews } from "@/types";

type NewsFilterType = "latest" | "bookmarked";

const NewsComponent = () => {
  // 필터링 함수 정의
  const filterNewsFunction = (news: TradeNews[], filterKey: NewsFilterType) => {
    switch (filterKey) {
      case "latest":
        return [...news].sort((a, b) => 
          new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        );
      case "bookmarked":
        return news.filter(item => item.bookmarked);
      default:
        return news;
    }
  };

  // 훅 사용
  const {
    currentFilter,
    displayedItems,
    allItemsLoaded,
    filterConfigs,
    setFilter,
    loadMore,
  } = useFilteredPagination({
    data: newsData,
    filterConfigs: [
      { key: "latest" as const, label: "최신순" },
      { key: "bookmarked" as const, label: "북마크" },
    ],
    filterFunction: filterNewsFunction,
    defaultFilter: "latest" as const,
    initialItemsPerPage: 5,
    incrementSize: 5,
  });

  return (
    <div>
      {/* 필터 버튼 - filterConfigs 활용 */}
      <div className="filter-buttons">
        {filterConfigs.map((config) => (
          <button 
            key={config.key}
            onClick={() => setFilter(config.key)}
            className={currentFilter === config.key ? "active" : ""}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* 데이터 표시 */}
      <div className="news-list">
        {displayedItems.map(news => (
          <NewsItem key={news.uuid} {...news} />
        ))}
      </div>

      {/* 더보기 버튼 */}
      {!allItemsLoaded && (
        <button onClick={loadMore}>더보기</button>
      )}
    </div>
  );
};
```

### 2. HS Code 분석 결과 필터링

```typescript
type AnalysisFilterType = "completed" | "pending" | "high_confidence";

const AnalysisComponent = () => {
  const filterAnalysisFunction = (
    analyses: HSCodeAnalysis[], 
    filterKey: AnalysisFilterType
  ) => {
    switch (filterKey) {
      case "completed":
        return analyses.filter(item => item.status === "completed");
      case "pending":
        return analyses.filter(item => item.status === "pending");
      case "high_confidence":
        return analyses.filter(item => item.confidence >= 0.8);
      default:
        return analyses;
    }
  };

  const pagination = useFilteredPagination({
    data: analysisData,
    filterConfigs: [
      { key: "completed" as const, label: "완료" },
      { key: "pending" as const, label: "분석 중" },
      { key: "high_confidence" as const, label: "고신뢰도" },
    ],
    filterFunction: filterAnalysisFunction,
    defaultFilter: "completed" as const,
    initialItemsPerPage: 10,
  });

  // 컴포넌트 렌더링...
};
```

### 3. 단순 문자열 배열 필터링

```typescript
type StringFilterType = "all" | "short" | "long";

const StringListComponent = () => {
  const filterStringFunction = (strings: string[], filterKey: StringFilterType) => {
    switch (filterKey) {
      case "all":
        return strings;
      case "short":
        return strings.filter(str => str.length <= 10);
      case "long":
        return strings.filter(str => str.length > 10);
      default:
        return strings;
    }
  };

  const {
    displayedItems,
    allItemsLoaded,
    loadMore,
  } = useFilteredPagination({
    data: stringData,
    filterConfigs: [
      { key: "all" as const, label: "전체" },
      { key: "short" as const, label: "짧은 텍스트" },
      { key: "long" as const, label: "긴 텍스트" },
    ],
    filterFunction: filterStringFunction,
    defaultFilter: "all" as const,
  });

  // 컴포넌트 렌더링...
};
```

## 고급 사용법

### 1. 복합 필터링 로직

```typescript
const complexFilterFunction = (items: MyDataType[], filterKey: MyFilterType) => {
  let result = items;

  // 1단계: 기본 필터링
  switch (filterKey) {
    case "active":
      result = result.filter(item => item.isActive);
      break;
    case "recent":
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter(item => new Date(item.createdAt) >= weekAgo);
      break;
  }

  // 2단계: 정렬
  result.sort((a, b) => {
    // 중요도 우선, 그 다음 날짜 순
    if (a.importance !== b.importance) {
      return b.importance - a.importance;
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return result;
};
```

### 2. 상태 초기화 활용

```typescript
const MyComponent = () => {
  const { reset, setFilter, currentFilter } = useFilteredPagination({
    // ... 설정
  });

  // 특정 조건에서 자동 초기화
  useEffect(() => {
    if (someCondition) {
      reset(); // 필터와 표시 개수를 초기 상태로 되돌림
    }
  }, [someCondition, reset]);

  // 프로그래밍 방식으로 필터 변경
  const handleSpecialAction = () => {
    setFilter("special_filter");
  };

  // ...
};
```

## 주의사항

1. **필터링 함수 메모이제이션**: 복잡한 필터링 로직의 경우 `useCallback`으로 최적화 권장

```typescript
const filterFunction = useCallback((items: MyType[], filterKey: MyFilterType) => {
  // 복잡한 필터링 로직...
}, [dependencies]);
```

2. **데이터 불변성**: 원본 데이터를 변경하지 않도록 주의

```typescript
// ✅ 올바른 방법
return [...items].sort((a, b) => a.value - b.value);

// ❌ 잘못된 방법
return items.sort((a, b) => a.value - b.value); // 원본 배열 변경
```

3. **타입 안전성**: 필터 키는 `as const`를 사용하여 리터럴 타입으로 지정

```typescript
// ✅ 올바른 방법
{ key: "latest" as const, label: "최신순" }

// ❌ 잘못된 방법 (타입 추론이 부정확할 수 있음)
{ key: "latest", label: "최신순" }
```

## 파일 구조

```
src/hooks/common/
├── useFilteredPagination.ts         # 메인 훅
├── useFilteredPagination.example.ts # 사용 예시
└── README.md                        # 이 문서
```

## 관련 컴포넌트

이 훅을 사용하는 주요 컴포넌트:
- `src/components/news/NewsSection.tsx` - 뉴스 필터링
- `src/components/dashboard/BookmarkManagementTab.tsx` - 북마크 관리 (예정)
- `src/components/hscode/ResultDashboard.tsx` - 분석 결과 관리 (예정) 