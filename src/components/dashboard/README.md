# Dashboard Components

이 디렉토리는 대시보드 레이아웃 재설계 프로젝트의 일환으로 개발된 컴포넌트들을 포함합니다.

## RecentActivityFeed

최근 활동을 표시하는 피드 컴포넌트입니다. 다양한 활동 타입(채팅, 북마크, 알림, 피드, 시스템)을 통합하여 시간순으로 표시합니다.

### 주요 기능

- **통합 활동 피드**: 채팅, 북마크, 알림, 피드, 시스템 활동을 하나의 피드에서 관리
- **무한 스크롤**: Intersection Observer API를 사용한 자동 로딩
- **반응형 디자인**: 모바일부터 데스크톱까지 최적화된 레이아웃
- **접근성 지원**: 키보드 네비게이션, 스크린 리더 호환성, ARIA 라벨
- **상태 관리**: 로딩, 에러, 빈 상태에 대한 적절한 UI 제공
- **시간 포맷팅**: 한국어 상대 시간 표시 (방금 전, N분 전, N시간 전 등)

### 사용법

```tsx
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import { generateMockActivities } from "@/lib/utils/mock-data";

function DashboardPage() {
  const [activities, setActivities] = useState(generateMockActivities(10));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const newActivities = await fetchMoreActivities();
      setActivities(prev => [...prev, ...newActivities]);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecentActivityFeed
      activities={activities}
      loading={loading}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      className="max-w-2xl"
    />
  );
}
```

### Props

| Prop         | Type             | Default | Description                  |
| ------------ | ---------------- | ------- | ---------------------------- |
| `activities` | `ActivityItem[]` | -       | 표시할 활동 목록             |
| `loading`    | `boolean`        | `false` | 로딩 상태                    |
| `error`      | `boolean`        | `false` | 에러 상태                    |
| `onLoadMore` | `() => void`     | -       | 더 많은 활동을 로드하는 콜백 |
| `hasMore`    | `boolean`        | `false` | 더 로드할 활동이 있는지 여부 |
| `className`  | `string`         | -       | 추가 CSS 클래스              |

### ActivityItem 타입

```typescript
type ActivityItem = {
  id: string;
  type: 'chat' | 'bookmark' | 'notification' | 'feed' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  href?: string;
  user?: {
    name: string;
    avatar?: string;
  };
};
```

### 활동 타입별 스타일링

각 활동 타입은 고유한 아이콘과 색상을 가집니다:

- **채팅** (`chat`): 파란색, MessageSquare 아이콘
- **북마크** (`bookmark`): 초록색, Bookmark 아이콘
- **알림** (`notification`): 주황색, Bell 아이콘
- **피드** (`feed`): 보라색, Rss 아이콘
- **시스템** (`system`): 회색, Settings 아이콘

### 상태별 UI

#### 로딩 상태
- 스켈레톤 UI 표시
- 로딩 스피너와 "활동을 불러오는 중..." 메시지

#### 에러 상태
- 에러 아이콘과 "활동을 불러올 수 없습니다" 메시지
- 재시도 버튼 제공 (onLoadMore가 있는 경우)

#### 빈 상태
- 빈 상태 아이콘과 안내 메시지
- "아직 활동이 없습니다" 메시지

#### 무한 스크롤
- 자동 로딩: Intersection Observer를 통한 자동 감지
- 수동 로딩: "더 보기" 버튼 제공
- 완료 상태: "모든 활동을 불러왔습니다" 메시지

### 접근성 기능

- **키보드 네비게이션**: Tab, Enter, Space 키 지원
- **ARIA 라벨**: 각 활동 항목에 적절한 라벨 제공
- **역할 정의**: button, article, status, alert 역할 사용
- **포커스 관리**: 시각적 포커스 표시 및 논리적 탭 순서

### 테스트

컴포넌트는 24개의 테스트 케이스로 검증됩니다:

```bash
npm test src/components/dashboard/__tests__/RecentActivityFeed.test.tsx
```

주요 테스트 영역:
- 렌더링 (로딩, 에러, 빈 상태, 정상 상태)
- 사용자 상호작용 (클릭, 키보드 네비게이션)
- 무한 스크롤 동작
- 시간 포맷팅
- 접근성 기능

### 성능 최적화

- **React.memo**: 불필요한 리렌더링 방지
- **useCallback**: 콜백 함수 메모이제이션
- **Intersection Observer**: 효율적인 스크롤 감지
- **가상화**: 긴 목록에 대한 성능 최적화 (필요시)

### 브라우저 호환성

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Intersection Observer API를 사용하므로 구형 브라우저에서는 폴리필이 필요할 수 있습니다.

## DashboardHeader

사용자 정보와 빠른 액션을 표시하는 헤더 컴포넌트입니다.

### 주요 기능

- 사용자 환영 메시지
- 빠른 액션 버튼들
- 알림 드롭다운
- 반응형 레이아웃

### 사용법

```tsx
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

function Dashboard() {
  const user = {
    name: "김무역",
    email: "kim@example.com"
  };

  const quickActions = [
    {
      id: "new-chat",
      label: "새 대화",
      icon: MessageSquare,
      onClick: () => navigate("/chat/new")
    }
  ];

  return (
    <DashboardHeader
      user={user}
      quickActions={quickActions}
    />
  );
}
```

## 개발 가이드

### 새로운 컴포넌트 추가

1. 컴포넌트 파일 생성: `src/components/dashboard/NewComponent.tsx`
2. 타입 정의 추가: `src/types/dashboard.ts`
3. 테스트 파일 생성: `src/components/dashboard/__tests__/NewComponent.test.tsx`
4. 스토리 파일 생성 (선택사항): `src/components/dashboard/NewComponent.stories.tsx`

### 스타일링 가이드

- Tailwind CSS 사용
- shadcn/ui 컴포넌트 활용
- 일관된 색상 팔레트 유지
- 충분한 여백과 패딩 제공
- 반응형 디자인 고려

### 테스트 가이드

- 모든 컴포넌트에 대해 단위 테스트 작성
- 사용자 상호작용 테스트 포함
- 접근성 테스트 포함
- 에러 상태 테스트 포함

### 성능 가이드

- React.memo 적절히 사용
- useCallback, useMemo 필요시에만 사용
- 큰 데이터셋에 대해서는 가상화 고려
- 이미지 최적화 및 지연 로딩 적용
## Quic
kStats

사이드바에 표시되는 빠른 통계 요약 컴포넌트입니다. 주요 메트릭을 간결하게 표시하고 트렌드 정보를 포함합니다.

### 주요 기능

- **간결한 통계 표시**: 아이콘, 라벨, 값, 설명을 포함한 컴팩트한 레이아웃
- **트렌드 정보**: 상승/하락/변화없음 표시 (색상과 아이콘으로 구분)
- **클릭 상호작용**: 상세 정보 모달 또는 페이지 이동 지원
- **접근성 지원**: 키보드 네비게이션, ARIA 라벨, 스크린 리더 호환성
- **상태 관리**: 로딩, 에러, 빈 상태에 대한 적절한 UI 제공
- **반응형 디자인**: 사이드바 공간에 최적화된 레이아웃

### 사용법

```tsx
import { QuickStats } from "@/components/dashboard/QuickStats";
import { generateMockQuickStats } from "@/lib/utils/mock-data";

function DashboardSidebar() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await fetchQuickStats();
      setStats(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleStatClick = (stat) => {
    if (stat.href) {
      navigate(stat.href);
    } else {
      // 모달 표시 또는 기타 액션
      showStatDetails(stat);
    }
  };

  return (
    <QuickStats
      stats={stats}
      loading={loading}
      error={error}
      onStatClick={handleStatClick}
      className="w-full"
    />
  );
}
```

### Props

| Prop          | Type                       | Default | Description                     |
| ------------- | -------------------------- | ------- | ------------------------------- |
| `stats`       | `StatItem[]`               | -       | 표시할 통계 목록                |
| `loading`     | `boolean`                  | `false` | 로딩 상태                       |
| `error`       | `boolean`                  | `false` | 에러 상태                       |
| `onStatClick` | `(stat: StatItem) => void` | -       | 통계 항목 클릭 시 호출되는 콜백 |
| `className`   | `string`                   | -       | 추가 CSS 클래스                 |

### StatItem 타입

```typescript
type StatItem = {
  id: string;
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: TrendDirection; // 'up' | 'down' | 'neutral'
  };
  href?: string;
  description?: string;
};
```

### 트렌드 표시

각 통계 항목은 선택적으로 트렌드 정보를 포함할 수 있습니다:

- **상승** (`up`): 초록색, ↗ 아이콘
- **하락** (`down`): 빨간색, ↘ 아이콘  
- **변화없음** (`neutral`): 회색, → 아이콘

### 상태별 UI

#### 로딩 상태
- 4개의 스켈레톤 항목 표시
- 각 항목은 아이콘, 라벨, 값 영역의 스켈레톤 포함

#### 에러 상태
- 빨간색 테두리와 배경
- "통계 데이터를 불러올 수 없습니다" 메시지

#### 빈 상태
- "표시할 통계 데이터가 없습니다" 메시지

#### 정상 상태
- 통계 항목들을 세로로 나열
- 각 항목은 아이콘, 라벨/설명, 값/트렌드로 구성

### 레이아웃 구조

```
┌─────────────────────────────────┐
│           빠른 통계              │
├─────────────────────────────────┤
│ [아이콘] 라벨           123 ↗+5% │
│         설명                    │
├─────────────────────────────────┤
│ [아이콘] 라벨           456 ↘-2% │
│         설명                    │
├─────────────────────────────────┤
│ [아이콘] 라벨           789 →0%  │
│         설명                    │
└─────────────────────────────────┘
```

### 접근성 기능

- **키보드 네비게이션**: Tab, Enter, Space 키 지원
- **ARIA 라벨**: 각 통계 항목에 적절한 라벨과 설명 제공
- **역할 정의**: button 역할 (클릭 가능한 경우)
- **트렌드 설명**: 스크린 리더를 위한 트렌드 정보 음성 설명

### Mock Data 생성

```typescript
import { generateMockQuickStats, generateQuickStatsFromMetrics } from "@/lib/utils/mock-data";

// 랜덤 목 데이터 생성
const mockStats = generateMockQuickStats();

// 실제 메트릭 기반 데이터 생성
const realStats = generateQuickStatsFromMetrics(
  {
    totalBookmarks: 1234,
    activeMonitoring: 56,
    unreadFeeds: 89,
    totalSessions: 234,
    totalMessages: 567,
    recentSessions30d: 123
  },
  previousMetrics // 트렌드 계산용
);
```

### 테스트

컴포넌트는 21개의 테스트 케이스로 검증됩니다:

```bash
npm test src/components/dashboard/__tests__/QuickStats.test.tsx
```

주요 테스트 영역:
- 정상 렌더링 (데이터, 설명, 트렌드, 숫자 포맷팅)
- 상호작용 (클릭, 링크, 키보드 네비게이션)
- 상태 관리 (로딩, 에러, 빈 상태)
- 접근성 (ARIA 라벨, 키보드 지원)
- 스타일링 (CSS 클래스, 호버 효과)

### 성능 최적화

- **React.memo**: 불필요한 리렌더링 방지
- **useCallback**: 이벤트 핸들러 메모이제이션
- **숫자 포맷팅**: `toLocaleString()` 사용으로 성능 최적화
- **조건부 렌더링**: 상태에 따른 효율적인 렌더링

### 사용 예제

#### 기본 사용법
```tsx
<QuickStats
  stats={stats}
  onStatClick={(stat) => console.log('Clicked:', stat)}
/>
```

#### 로딩 상태
```tsx
<QuickStats
  stats={[]}
  loading={true}
/>
```

#### 에러 상태
```tsx
<QuickStats
  stats={[]}
  error={true}
/>
```

#### 스켈레톤만 표시
```tsx
<QuickStatsSkeleton />
```