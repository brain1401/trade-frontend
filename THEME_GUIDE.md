## 🎨 디자인 원칙 (중요)

### ⭐ 기존 디자인 유지 원칙
**절대적 원칙: 현재 "/" 경로에 구현된 디자인을 기준으로 모든 페이지에 일관성 있게 적용**

## 📐 현재 디자인 시스템 완전 분석

### 1. 레이아웃 시스템

#### 메인 레이아웃 구조:
```tsx
// 2/3 + 1/3 비율의 반응형 레이아웃
<div className="lg:flex lg:space-x-8">
  <div className="lg:w-2/3">     // 주요 콘텐츠 영역
    <ContentCard />              // 재사용 가능한 카드 컴포넌트
  </div>
  <aside className="mt-8 lg:mt-0 lg:w-1/3">  // 사이드바 영역
    <div className="hidden lg:block">
      <UserInfoCard />
    </div>
    <ExchangeRateCard />
    <ContentCard className="mt-8" />
  </aside>
</div>
```

#### 반응형 레이아웃 패턴:
- **모바일**: 세로 스택, 사이드바가 메인 콘텐츠 아래
- **데스크톱 (lg:)**: 가로 분할, `lg:flex lg:space-x-8`
- **사이드바 간격**: `mt-8 lg:mt-0` (모바일 위쪽 여백, 데스크톱 제거)

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

### 3. 색상 시스템 ⚠️ (styles.css의 @theme 기준)

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

### 4. 타이포그래피 시스템

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

### 5. 간격 시스템

#### 컴포넌트 간격:
- **카드 간 간격**: `mt-8` (메인 간격), `mb-4` (카드 하단)
- **섹션 내부**: `space-y-2` (2단위), `space-y-1` (1단위)
- **테이블 행**: `py-1`, `py-1.5`, `py-3`
- **작은 요소**: `mt-0.5`, `mb-1`, `py-0.5`

#### 패딩 시스템:
- **카드 패딩**: `p-4`, `md:p-5` (반응형)
- **헤더 패딩**: `p-4 md:p-4`
- **작은 패딩**: `px-2 py-0.5`, `px-3 py-2`
- **테이블 셀**: `px-[.2rem]`

### 6. 버튼 시스템

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

### 7. 뱃지 시스템

#### Badge Variants:
```tsx
// 기본: 
variant="secondary"                     // 회색 배경
variant="destructive"                   // 빨간색 배경 (규제)
variant="default"                       // 파란색 배경 (관세)

// 공통 스타일:
className="rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
```

### 8. 리스트 시스템

#### NewsItem 패턴:
```tsx
// 컨테이너:
className="border-b border-neutral-100 py-3 last:border-b-0"

// 제목:
className="cursor-pointer pr-2 font-semibold text-neutral-800"

// 메타 정보:
className="mb-1 text-xs text-neutral-500"       // HS Code
className="text-sm leading-relaxed text-neutral-600"  // 요약
className="mt-1.5 text-xs text-neutral-400"     // 출처, 날짜
```

#### 일반 리스트 패턴:
```tsx
// 리스트 컨테이너:
className="space-y-1"                          // 기본 간격

// 리스트 아이템:
className="border-b border-neutral-100 py-1.5 last:border-0"
className="py-1"                               // 작은 아이템
```

### 9. 테이블 시스템

#### ExchangeRateCard 테이블:
```tsx
// 테이블:
className="w-full space-y-2"

// 행:
className="border-b border-neutral-100 pb-2 last:border-b-0"

// 셀 정렬:
className="flex items-center justify-center"    // 중앙 정렬
className="flex items-center justify-between"   // 양쪽 정렬
className="text-center"                         // 텍스트 중앙
className="self-end text-xs text-neutral-500"   // 우측 하단 정렬
```

### 10. 아이콘 시스템

#### 아이콘 크기:
- **작은 아이콘**: `size={14}`, `size={16}`
- **중간 아이콘**: `size={20}`
- **큰 아이콘**: 기본 크기

#### 아이콘 여백:
- **우측 여백**: `mr-1`, `mr-1.5`, `mr-2`
- **좌측 여백**: `ml-0.5`, `ml-1`, `ml-2`

### 11. 반응형 규칙

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

### 12. 그리드 시스템

#### UserInfoCard 그리드:
```tsx
className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4"
```

### 📏 필수 적용 패턴

#### 1. 새로운 카드 컴포넌트:
- **반드시 ContentCard 기반으로 구성**
- `title` prop 사용, `titleRightElement`로 필터 버튼 배치
- 콘텐츠는 `space-y-2` 간격
- 더보기 링크는 `variant="link"` + `ChevronRight`

#### 2. 새로운 리스트 아이템:
- `border-b border-neutral-100 py-3 last:border-b-0` 패턴
- 제목: `font-semibold text-neutral-800`
- 메타 정보: `text-xs text-neutral-500`

#### 3. 새로운 버튼:
- 링크: `variant="link" className="h-auto p-0 text-sm hover:underline text-primary-600"`
- 필터: `rounded-full px-3 py-2 text-xs`
- 액션: 기존 variant 재사용

#### 4. 색상 적용 (styles.css @theme 기준):
- **절대 새로운 색상 도입 금지** - `src/styles.css`에 정의된 컬러만 사용
- **사용 가능한 팔레트**: `brand-*`, `primary-*`, `neutral-*`, `success-*`, `warning-*`, `danger-*`, `info-*`, `chart-*`
- **텍스트 계층**: `neutral-800 → 700 → 600 → 500 → 400` 순서 유지
- **상태 색상**: 기존 `red-500`, `blue-500` 대신 `danger-500`, `info-500` 사용 권장
- **브랜드 색상**: `bg-blue-600` 대신 `bg-primary-600` 또는 `bg-brand-600` 사용

### 🚫 금지사항
- **새로운 디자인 컴포넌트 생성 금지**
- **styles.css @theme 외부 색상 사용 금지** - 정의되지 않은 색상 클래스 사용 절대 금지
- **레이아웃 구조 임의 변경 금지**
- **새로운 UI 패턴 도입 금지**
- **하드코딩된 색상값 사용 금지** (예: `#ffffff`, `rgb()`, `hsl()` 등)

### ✅ 허용사항
- **기존 컴포넌트 재사용 및 확장**
- **styles.css @theme 정의 컬러 내에서의 변형** - 커스텀 컬러 팔레트 범위 내 자유 사용
- **콘텐츠 구조 변경 (디자인 유지)**
- **기능 추가 (기존 스타일 적용)**
- **시맨틱 컬러 활용** - `success-*`, `warning-*`, `danger-*`, `info-*` 적극 활용
