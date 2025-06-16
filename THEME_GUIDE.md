## 🎨 디자인 원칙 (중요)

### ⭐ 기존 디자인 유지 원칙
**절대적 원칙: 현재 "/" 경로에 구현된 CSS/Tailwind 스타일을 기준으로 모든 페이지에 일관성 있게 적용**

### 🎯 레이아웃 유연성 원칙
- **레이아웃 구조는 기능과 콘텐츠에 맞게 자유롭게 선택**
- **사이드바는 필수가 아니며, 필요에 따라 포함/제외 결정**
- **CSS/Tailwind 스타일 가이드라인은 절대적으로 유지**
- **색상, 타이포그래피, 간격, 컴포넌트 스타일은 기존 시스템 준수**

## 📐 현재 디자인 시스템 완전 분석

### 1. 레이아웃 시스템

#### 메인 레이아웃 구조 옵션:

**Option A: 사이드바 포함 레이아웃 (대시보드형)**
```tsx
// 2/3 + 1/3 비율의 반응형 레이아웃 (현재 "/" 경로 기준)
<div className="lg:flex lg:space-x-8">
  <div className="lg:w-2/3">     // 주요 콘텐츠 영역
    <ContentCard />              // 재사용 가능한 카드 컴포넌트
    <GridLayout />               // 그리드 레이아웃 (선택사항)
    <TableLayout />              // 테이블 레이아웃 (선택사항)
  </div>
  <aside className="mt-8 lg:mt-0 lg:w-1/3">  // 사이드바 영역 (선택사항)
    <div className="hidden lg:block">
      <UserInfoCard />
    </div>
    <ExchangeRateCard />
    <ContentCard className="mt-8" />
  </aside>
</div>
```

**Option B: 풀 위드스 레이아웃 (콘텐츠 중심형)**
```tsx
// 전체 너비 활용 레이아웃
<div className="w-full">
  <ContentCard />                // 카드 기반 콘텐츠
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    <GridItem />                 // 그리드 아이템들
  </div>
  <TableLayout />                // 테이블 레이아웃
</div>
```

**Option C: 중앙 정렬 레이아웃 (폼/상세 페이지형)**
```tsx
// 중앙 정렬된 최대 너비 제한 레이아웃
<div className="mx-auto max-w-4xl">
  <ContentCard />
  <div className="space-y-6">
    <FormSection />
    <DetailSection />
  </div>
</div>
```

#### 반응형 레이아웃 패턴:
- **모바일**: 세로 스택 구조, 단일 컬럼
- **태블릿 (md:)**: 2컬럼 또는 적절한 그리드
- **데스크톱 (lg:)**: 3컬럼, 사이드바, 또는 최적화된 레이아웃
- **기본 간격**: `space-x-8`, `space-y-6`, `gap-4` ~ `gap-8`

#### 레이아웃 선택 기준:
- **사이드바 포함**: 대시보드, 관련 정보가 많은 페이지
- **풀 위드스**: 테이블 중심, 그리드 중심, 리스트 중심 페이지
- **중앙 정렬**: 폼, 상세보기, 단일 콘텐츠 페이지

#### 컴포넌트 레이아웃 선택 기준:
- **Card**: 제목이 있고 여러 섹션으로 구성된 콘텐츠
- **Grid**: 균등한 크기의 아이템들을 격자 형태로 표시
- **Table**: 구조화된 데이터를 행과 열로 표시
- **List**: 순차적이고 유사한 형태의 아이템들

### 2. 카드 시스템 (ContentCard 기반)

#### ContentCard 구조:
```tsx
// 기본 Card (Shadcn UI): 
className="flex flex-col rounded-xl border bg-card py-4 text-card-foreground shadow-sm"

// ContentCard 오버라이드:
className="mb-4 py-0"                    // 기본 여백 제거, 하단 여백 추가

// Header:
className="flex flex-row items-center justify-between border-b p-4 md:p-4"

// Title:
className="!mt-0 text-lg font-semibold text-neutral-800"

// Content:
className="p-4 md:p-5"                  // 기본 패딩
className="pt-4"                        // 제목 있을 때 추가 상단 패딩
```

#### 특수 카드 스타일:

**UserInfoCard (독립적 스타일)**:
```tsx
// 카드 기본: 
className="mb-4 overflow-hidden py-0 shadow-lg"

// 헤더 영역 (파란색 배경):
className="bg-blue-600 p-4"
// 제목: 
className="text-lg font-semibold text-white"
// 부제목: 
className="text-xs text-blue-100"

// 콘텐츠 영역:
className="p-4"
```

### 3. 그리드 시스템

#### 기본 그리드 패턴:
```tsx
// UserInfoCard 그리드 (참조):
className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4"

// 일반적인 그리드 패턴:
className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"    // 반응형 그리드
className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4"    // 작은 아이템용
className="grid grid-cols-1 gap-6 lg:grid-cols-2"                   // 큰 아이템용
```

#### 그리드 아이템 스타일:
```tsx
// 그리드 아이템 기본:
className="rounded-xl border bg-card p-4 shadow-sm"                 // 카드형 아이템
className="flex flex-col items-center justify-center p-3 text-center"  // 중앙 정렬
className="hover:bg-neutral-50 transition-colors"                   // 호버 효과

// 그리드 아이템 내부:
className="text-lg font-semibold text-neutral-800"                  // 제목
className="text-sm text-neutral-600"                               // 부제목
className="text-xs text-neutral-500"                               // 메타 정보
```

#### 그리드 간격 시스템:
- **기본 간격**: `gap-4` (16px)
- **좁은 간격**: `gap-2`, `gap-3` (8px, 12px)
- **넓은 간격**: `gap-6`, `gap-8` (24px, 32px)

### 4. 테이블 시스템

#### 기본 테이블 구조:
```tsx
// 테이블 컨테이너:
className="w-full overflow-hidden rounded-lg border"

// 테이블 헤더:
className="bg-neutral-50 px-4 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider"

// 테이블 행:
className="border-b border-neutral-100 hover:bg-neutral-50"
className="last:border-b-0"                                        // 마지막 행 테두리 제거

// 테이블 셀:
className="px-4 py-3 text-sm text-neutral-800"                     // 기본 셀
className="px-4 py-3 text-sm text-neutral-600"                     // 보조 정보 셀
className="px-4 py-3 text-right text-sm font-medium"               // 숫자/금액 셀
```

#### ExchangeRateCard 테이블 (기존):
```tsx
// 테이블:
className="w-full space-y-2"

// 행:
className="border-b border-neutral-100 pb-2 last:border-b-0"

// 셀 정렬:
className="flex items-center justify-center"                       // 중앙 정렬
className="flex items-center justify-between"                      // 양쪽 정렬
className="text-center"                                            // 텍스트 중앙
className="self-end text-xs text-neutral-500"                      // 우측 하단 정렬
```

#### 반응형 테이블:
```tsx
// 모바일에서 카드형으로 변환:
className="hidden md:table"                                        // 데스크톱 테이블
className="block md:hidden space-y-2"                              // 모바일 카드 리스트

// 모바일 카드 아이템:
className="rounded-lg border p-3 bg-card"
```

### 5. 리스트 시스템

#### NewsItem 패턴 (기존):
```tsx
// 컨테이너:
className="border-b border-neutral-100 py-3 last:border-b-0"

// 제목:
className="cursor-pointer pr-2 font-semibold text-neutral-800"

// 메타 정보:
className="mb-1 text-xs text-neutral-500"                          // HS Code
className="text-sm leading-relaxed text-neutral-600"               // 요약
className="mt-1.5 text-xs text-neutral-400"                        // 출처, 날짜
```

#### 일반 리스트 패턴:
```tsx
// 리스트 컨테이너:
className="space-y-1"                                              // 기본 간격
className="space-y-2"                                              // 중간 간격
className="space-y-3"                                              // 넓은 간격

// 리스트 아이템:
className="border-b border-neutral-100 py-1.5 last:border-0"       // 구분선 있는 아이템
className="py-1"                                                   // 작은 아이템
className="rounded-lg p-3 hover:bg-neutral-50"                     // 카드형 아이템
```

### 6. 색상 시스템 ⚠️ (styles.css의 @theme 기준)

> **중요**: 모든 색상은 `src/styles.css`에 정의된 Tailwind v4 `@theme` directive 커스텀 컬러만 사용

#### 프로젝트 커스텀 컬러 팔레트:

**Brand Colors (브랜드 메인):**
```css
--color-brand-50 ~ --color-brand-950   // #f0f7ff ~ #001a3d
```

**Primary Colors (기본 테마):**
```css
--color-primary-50 ~ --color-primary-950   // #eff6ff ~ #172554
```

**Neutral Colors (회색 계열):**
```css
--color-neutral-50 ~ --color-neutral-950   // #f9fafb ~ #030712
```

**Semantic Colors:**
```css
--color-success-50 ~ --color-success-900   // 녹색 (성공)
--color-warning-50 ~ --color-warning-900   // 노란색 (경고)
--color-danger-50 ~ --color-danger-900     // 빨간색 (위험)
--color-info-50 ~ --color-info-900         // 파란색 (정보)
```

**Chart Colors (차트 전용):**
```css
--color-chart-primary: #0088fe
--color-chart-secondary: #00c49f
--color-chart-tertiary: #ffbb28
--color-chart-quaternary: #ff8042
--color-chart-accent: #8884d8
--color-chart-highlight: #ff7300
```

#### 현재 사용 중인 색상 매핑:

**텍스트 색상 (분석된 패턴):**
- **주요 제목**: `text-neutral-800` → `#1f2937`
- **부제목**: `text-neutral-700` → `#374151`  
- **본문**: `text-neutral-600` → `#4b5563`
- **메타 정보**: `text-neutral-500` → `#6b7280`
- **비활성/보조**: `text-neutral-400` → `#9ca3af`
- **링크/액션**: `text-primary-600` → `#2563eb`
- **흰색 텍스트**: `text-white`

**배경 색상 (분석된 패턴):**
- **강조 배경**: `bg-blue-600` → **⚠️ `bg-primary-600` 또는 `bg-brand-600` 사용 권장**
- **카드 배경**: `bg-card` → CSS 변수 기반
- **보조 배경**: `bg-neutral-50`, `bg-neutral-100`, `bg-neutral-200`
- **구분선**: `border-neutral-100`, `border-neutral-200`

**상태별 색상 (커스텀 시맨틱 컬러 활용):**
- **상승/양수**: `text-red-500` → **⚠️ `text-danger-500` 사용 권장**
- **하락/음수**: `text-blue-500` → **⚠️ `text-info-500` 사용 권장**
- **성공**: `text-success-500` → `#22c55e`
- **경고**: `text-warning-500` → `#f59e0b`
- **중립**: `text-neutral-500`

#### 🎨 Tailwind v4 @theme 활용 예시:

```tsx
// ✅ 올바른 사용 (커스텀 컬러 활용)
<div className="bg-primary-600 text-white">           // 메인 브랜드 색상
<p className="text-neutral-800">                      // 제목
<span className="text-success-500">                   // 성공 상태
<div className="border-neutral-100">                  // 구분선

// ❌ 잘못된 사용 (하드코딩된 색상)
<div className="bg-blue-600">                         // 커스텀 컬러 무시
<p className="text-gray-800">                         // 정의되지 않은 색상
```

#### 📚 참고 문서:
- **Tailwind CSS v4 Custom Styles**: [https://tailwindcss.com/docs/adding-custom-styles](https://tailwindcss.com/docs/adding-custom-styles)
- **프로젝트 색상 정의**: `src/styles.css` @theme 섹션

### 7. 타이포그래피 시스템

#### 폰트 크기:
- **대제목**: `text-lg` (18px) + `font-semibold`
- **중제목**: `font-semibold` + `text-neutral-800`
- **본문**: `text-sm` (14px)
- **메타 정보**: `text-xs` (12px)
- **보조 텍스트**: `text-xs` + `text-neutral-400`

#### 폰트 무게:
- **제목**: `font-semibold`
- **강조**: `font-medium`
- **본문**: 기본 (400)

### 8. 간격 시스템

#### 컴포넌트 간격:
- **카드 간 간격**: `mt-8` (메인 간격), `mb-4` (카드 하단)
- **그리드 간격**: `gap-2` ~ `gap-8` (콘텐츠에 따라 조정)
- **리스트 간격**: `space-y-1` ~ `space-y-3`
- **테이블 간격**: `py-3` (행), `px-4` (셀)
- **섹션 내부**: `space-y-2` (2단위), `space-y-1` (1단위)
- **작은 요소**: `mt-0.5`, `mb-1`, `py-0.5`

#### 패딩 시스템:
- **카드 패딩**: `p-4`, `md:p-5` (반응형)
- **그리드 아이템**: `p-3`, `p-4`
- **테이블 셀**: `px-4 py-3`
- **헤더 패딩**: `p-4 md:p-4`
- **작은 패딩**: `px-2 py-0.5`, `px-3 py-2`

### 9. 버튼 시스템

#### Button Variants (Shadcn UI):
```tsx
// link 스타일 (가장 많이 사용):
variant="link" 
className="h-auto p-0 text-sm hover:underline"

// 확장된 link 스타일:
className="h-auto p-0 text-sm hover:underline text-primary-600"
className="flex items-center justify-end text-primary-600"

// ghost 스타일:
variant="ghost"
className="h-auto w-[5rem] flex-col items-center justify-center p-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"

// outline 스타일:
variant="outline"
className="border-neutral-300 bg-neutral-200 text-neutral-700 hover:bg-neutral-300"

// default 활성 상태:
variant="default"
className="bg-blue-500 text-white hover:bg-blue-600"
```

#### 버튼 패턴:
- **더보기 링크**: `variant="link"` + `ChevronRight` 아이콘
- **필터 버튼**: `rounded-full px-3 py-2 text-xs`
- **액션 버튼**: 아이콘 + 텍스트 조합

### 10. 뱃지 시스템

#### Badge Variants:
```tsx
// 기본: 
variant="secondary"                     // 회색 배경
variant="destructive"                   // 빨간색 배경 (규제)
variant="default"                       // 파란색 배경 (관세)

// 공통 스타일:
className="rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
```

### 11. 아이콘 시스템

#### 아이콘 크기:
- **작은 아이콘**: `size={14}`, `size={16}`
- **중간 아이콘**: `size={20}`
- **큰 아이콘**: 기본 크기

#### 아이콘 여백:
- **우측 여백**: `mr-1`, `mr-1.5`, `mr-2`
- **좌측 여백**: `ml-0.5`, `ml-1`, `ml-2`

### 12. 반응형 규칙

#### 브레이크포인트:
- **모바일 기본**: 기본 클래스
- **데스크톱**: `lg:` 접두사 (1024px+)
- **중간 크기**: `md:` 접두사 (768px+)

#### 숨김/표시 패턴:
```tsx
className="hidden lg:block"                    // 데스크톱만 표시
className="block lg:hidden"                    // 모바일만 표시
className="mt-8 lg:mt-0"                      // 모바일 여백, 데스크톱 제거
```

#### 반응형 레이아웃 변환:
```tsx
// 그리드 → 리스트 (모바일)
className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
className="block md:grid space-y-2 md:space-y-0"

// 테이블 → 카드 (모바일)
className="hidden md:table"
className="block md:hidden space-y-3"
```

### 📏 필수 적용 패턴

#### 1. 레이아웃 선택 가이드:

**페이지 레이아웃 선택:**
- **사이드바 포함**: 대시보드, 실시간 정보, 관련 데이터가 많은 페이지
- **풀 위드스**: 테이블 중심, 데이터 분석, 리스트 중심 페이지
- **중앙 정렬**: 폼, 상세보기, 단일 콘텐츠, 로그인 페이지 등
- **기능에 맞는 레이아웃 자유 선택** - 고정된 구조에 얽매이지 않음

**컴포넌트 레이아웃 선택:**

**ContentCard 사용 시기:**
- 제목이 있고 여러 섹션으로 구성된 콘텐츠
- 더보기 버튼이나 필터 기능이 필요한 경우
- 독립적인 기능 단위로 묶여야 하는 경우

**Grid 사용 시기:**
- 균등한 크기의 아이템들을 격자 형태로 표시
- 카테고리, 통계, 대시보드 위젯 등
- 시각적 일관성이 중요한 경우

**Table 사용 시기:**
- 구조화된 데이터를 행과 열로 표시
- 정렬, 필터링이 필요한 데이터
- 숫자 비교나 상세 정보가 중요한 경우

**List 사용 시기:**
- 순차적이고 유사한 형태의 아이템들
- 뉴스, 알림, 히스토리 등
- 세로 스크롤이 자연스러운 콘텐츠

#### 2. 새로운 컴포넌트 패턴:

**Card 기반:**
- **반드시 ContentCard 기반으로 구성**
- `title` prop 사용, `titleRightElement`로 필터 버튼 배치
- 콘텐츠는 `space-y-2` 간격
- 더보기 링크는 `variant="link"` + `ChevronRight`

**Grid 기반:**
- 반응형 그리드 클래스 적용 (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- 일관된 `gap` 크기 사용
- 아이템은 카드형 스타일 또는 최소한의 패딩 적용

**Table 기반:**
- 헤더는 `bg-neutral-50` 배경 사용
- 행별 `hover:bg-neutral-50` 효과 적용
- 마지막 행은 `last:border-b-0` 클래스 적용
- 모바일에서는 카드형으로 변환 고려

**List 기반:**
- `border-b border-neutral-100 py-3 last:border-b-0` 패턴
- 제목: `font-semibold text-neutral-800`
- 메타 정보: `text-xs text-neutral-500`

#### 3. 색상 적용 (styles.css @theme 기준):
- **절대 새로운 색상 도입 금지** - `src/styles.css`에 정의된 컬러만 사용
- **사용 가능한 팔레트**: `brand-*`, `primary-*`, `neutral-*`, `success-*`, `warning-*`, `danger-*`, `info-*`, `chart-*`
- **텍스트 계층**: `neutral-800 → 700 → 600 → 500 → 400` 순서 유지
- **상태 색상**: 기존 `red-500`, `blue-500` 대신 `danger-500`, `info-500` 사용 권장
- **브랜드 색상**: `bg-blue-600` 대신 `bg-primary-600` 또는 `bg-brand-600` 사용

### 🚫 금지사항
- **CSS/Tailwind 스타일 시스템 변경 금지** - 색상, 타이포그래피, 간격, 컴포넌트 스타일 임의 변경 절대 금지
- **styles.css @theme 외부 색상 사용 금지** - 정의되지 않은 색상 클래스 사용 절대 금지
- **기존 컴포넌트 스타일 파괴 금지** - ContentCard, Button, Badge 등의 기본 스타일 변경 금지
- **새로운 디자인 시스템 생성 금지** - 기존 스타일 가이드라인 무시하고 새로운 패턴 도입 금지
- **하드코딩된 색상값 사용 금지** (예: `#ffffff`, `rgb()`, `hsl()` 등)
- **일관성 없는 간격 시스템 사용 금지** - 기존 spacing 패턴 무시 금지

### ✅ 허용사항
- **🔄 레이아웃 구조 자유 선택** - 사이드바, 풀 위드스, 중앙 정렬 등 기능에 맞는 레이아웃 자유 선택
- **🎨 적절한 컴포넌트 레이아웃 선택** - Card, Grid, Table, List 중 콘텐츠에 최적화된 레이아웃 선택
- **📱 반응형 레이아웃 최적화** - 모바일/태블릿/데스크톱에 맞는 레이아웃 변환
- **🔗 레이아웃 혼합 사용** - 한 페이지 내에서 Card, Grid, Table, List 조합 사용
- **🎯 기능 중심 페이지 구성** - 사이드바 없이도 기능에 집중된 페이지 구성 가능
- **⚙️ 기존 컴포넌트 재사용 및 확장** - ContentCard, Button, Badge 등 기존 스타일 유지하며 확장
- **🌈 styles.css @theme 정의 컬러 내에서의 변형** - 커스텀 컬러 팔레트 범위 내 자유 사용
- **📝 콘텐츠 구조 변경** - 기존 CSS 스타일 가이드라인 유지하며 콘텐츠 구조 조정
- **✨ 기능 추가** - 기존 스타일 시스템 적용하여 새로운 기능 구현
- **🎨 시맨틱 컬러 활용** - `success-*`, `warning-*`, `danger-*`, `info-*` 적극 활용

### 💡 레이아웃 선택 예시

#### 페이지 레이아웃 옵션:

```tsx
// ✅ Option A: 사이드바 포함 (대시보드형)
<div className="lg:flex lg:space-x-8">
  <main className="lg:w-2/3">
    <ContentCard title="주요 지표" />
    <div className="grid grid-cols-2 gap-4 mt-8">
      <StatCard />
      <StatCard />
    </div>
  </main>
  <aside className="mt-8 lg:mt-0 lg:w-1/3">
    <UserInfoCard />
    <ExchangeRateCard className="mt-8" />
  </aside>
</div>

// ✅ Option B: 풀 위드스 (데이터 중심형)
<div className="w-full space-y-6">
  <ContentCard title="거래 데이터" titleRightElement={<FilterButton />} />
  <div className="overflow-x-auto">
    <table className="w-full">...</table>
  </div>
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    <SummaryCard />
    <SummaryCard />
    <SummaryCard />
  </div>
</div>

// ✅ Option C: 중앙 정렬 (폼/상세형)
<div className="mx-auto max-w-2xl space-y-6">
  <ContentCard title="사용자 정보 수정">
    <form className="space-y-4">
      <FormField />
      <FormField />
    </form>
  </ContentCard>
</div>
```

#### 컴포넌트 레이아웃 선택:
```tsx
// ✅ 통계 데이터 → Grid
<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
  <div className="rounded-lg border p-4 text-center">
    <div className="text-2xl font-bold text-primary-600">1,234</div>
    <div className="text-sm text-neutral-600">총 거래량</div>
  </div>
</div>

// ✅ 상세 데이터 → Table
<table className="w-full">
  <thead className="bg-neutral-50">
    <tr>
      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-700">상품명</th>
      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-700">가격</th>
    </tr>
  </thead>
  <tbody>...</tbody>
</table>

// ✅ 뉴스/피드 → List
<div className="space-y-3">
  <div className="border-b border-neutral-100 py-3 last:border-b-0">
    <h3 className="font-semibold text-neutral-800">뉴스 제목</h3>
    <p className="text-sm text-neutral-600">뉴스 요약...</p>
  </div>
</div>

// ✅ 복합 정보 → Card
<ContentCard title="시장 동향" titleRightElement={<FilterButton />}>
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">...</div>
    <div className="border-t pt-4">...</div>
  </div>
</ContentCard>
```