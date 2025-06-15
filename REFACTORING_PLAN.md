# AI HS Code Radar System - 리팩토링 계획서

## 📋 개요

이 문서는 현재 프로젝트를 `.cursorrules`에 정의된 구조와 표준에 맞춰 리팩토링하기 위한 상세한 계획서입니다.

## 🔍 현재 프로젝트 구조 분석

### 1. 전체 구조 현황

#### ✅ 기본 설정 (양호)
- **기술 스택**: React 18, TypeScript, TanStack Router, Zustand, TanStack Query 등 cursorrules 권장 스택 준수
- **개발 환경**: Vite, ESLint, Prettier 등 적절히 설정됨
- **폴더 구조**: 기본적인 도메인 분리 구조 존재

#### ⚠️ 부분적 개선 필요
- **라우팅**: 일부 필수 라우트 누락 (news 도메인, analyze 세부 라우트 등)
- **컴포넌트**: 도메인별 분리는 되어있으나 cursorrules 명세와 차이점 존재
- **타입 정의**: 기본 구조는 있으나 확장 필요

#### ❌ 주요 누락 사항
- **뉴스 도메인**: `/news/*` 라우트 및 관련 컴포넌트 완전 누락
- **Claude AI 통합**: AI 관련 컴포넌트 및 훅 부족
- **WebSocket 연동**: 실시간 기능 구현 필요
- **한국어 최적화**: UI 텍스트 및 에러 메시지 한국어화 미흡

### 2. 도메인별 상세 분석

#### 📁 `/src/routes/` (라우팅)
**현재 상태:**
```
routes/
├── __root.tsx ✅
├── index.tsx ✅
├── auth/ ✅
├── dashboard/ ✅
├── hscode/ ✅ (일부)
├── tracking/ ✅ (일부)
├── trade/ ⚠️ (불완전)
└── search/ ✅ (기본)
```

**누락된 라우트:**
- `/hscode/analyze/$sessionId.tsx` - 대화형 분석 세션
- `/hscode/result/$resultId.tsx` - 분석 결과 상세 페이지
- `/trade/index.tsx` - 무역 정보 허브
- `/news/index.tsx` - 뉴스 목록 페이지
- `/news/$newsId.tsx` - 뉴스 상세 페이지
- `/tracking/$number.tsx` - 화물 추적 결과 페이지

#### 📁 `/src/components/` (컴포넌트)
**현재 상태:**
```
components/
├── auth/ ✅
├── common/ ✅
├── dashboard/ ✅
├── hscode/ ✅
├── monitoring/ ✅
├── notification/ ✅
├── search/ ✅
├── tracking/ ✅
├── trade/ ✅
├── ui/ ✅
├── user/ ⚠️ (불필요)
├── route/ ⚠️ (불필요)
├── layout/ ⚠️ (common으로 병합)
└── not-fount/ ⚠️ (오타 수정)
```

**누락된 컴포넌트:**
- `news/` 도메인 컴포넌트 전체
  - `NewsListGrid.tsx`
  - `NewsArticleContent.tsx`
  - `AISummaryPanel.tsx`
  - `BusinessImpactAnalysis.tsx`
- Claude AI 관련 컴포넌트
  - `AnalysisChat.tsx`
  - `SmartQuestions.tsx`
  - `ImageUpload.tsx`
  - `SourceCitation.tsx`

#### 📁 `/src/hooks/` (커스텀 훅)
**현재 상태:**
```
hooks/
├── auth/ ✅
├── common/ ✅
└── api/
    ├── hscode/ ✅
    ├── monitoring/ ✅
    ├── search/ ✅
    ├── tracking/ ✅
    └── trade/ ✅
```

**누락된 훅:**
- `api/news/` 디렉토리 전체
- Claude AI 관련 훅들
  - `useSmartQuestions.ts`
  - `useImageAnalysis.ts`
  - `useIntentDetection.ts`

#### 📁 `/src/stores/` (상태 관리)
**현재 상태:**
```
stores/
├── authStore.ts ✅
├── analysisStore.ts ✅
├── bookmarkStore.ts ✅
├── newsStore.ts ✅
├── notificationStore.ts ✅
├── resultStore.ts ✅
├── searchStore.ts ✅
├── uiStore.ts ✅
└── userStore.ts ⚠️ (authStore와 중복)
```

**개선 필요:**
- `userStore.ts` → `authStore.ts`로 통합
- 각 스토어의 Claude AI 통합 로직 강화

## 🎯 목표 구조

### 완성된 라우팅 구조
```
routes/
├── __root.tsx
├── index.tsx
├── auth/
│   ├── login.tsx
│   ├── signup.tsx
│   └── callback.tsx
├── hscode/
│   ├── index.tsx
│   ├── analyze/
│   │   └── $sessionId.tsx
│   └── result/
│       └── $resultId.tsx
├── tracking/
│   ├── index.tsx
│   └── $number.tsx
├── trade/
│   ├── index.tsx
│   ├── regulations.tsx
│   ├── exchange-rates.tsx
│   └── statistics.tsx
├── news/
│   ├── index.tsx
│   └── $newsId.tsx
├── search/
│   └── index.tsx
└── dashboard/
    ├── index.tsx
    ├── bookmarks.tsx
    └── settings.tsx
```

### 완성된 컴포넌트 구조
```
components/
├── auth/
├── hscode/
│   ├── AnalysisChat.tsx
│   ├── ResultDashboard.tsx
│   ├── SmartQuestions.tsx
│   ├── ImageUpload.tsx
│   └── ComplianceInfo.tsx
├── news/
│   ├── NewsListGrid.tsx
│   ├── NewsArticleContent.tsx
│   ├── AISummaryPanel.tsx
│   ├── TradeNewsPanel.tsx
│   └── BusinessImpactAnalysis.tsx
├── search/
│   ├── SearchInput.tsx
│   ├── IntentDetection.tsx
│   └── PopularSearchTerms.tsx
├── dashboard/
│   ├── RecentAnalysisResults.tsx
│   ├── HsCodeUpdatesPanel.tsx
│   └── RealTimeExchangeRates.tsx
├── common/
│   ├── Layout.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorBoundary.tsx
│   └── SourceCitation.tsx
└── ui/ (Shadcn UI)
```

## 📅 단계별 리팩토링 계획

### Phase 1: 핵심 인프라 정리 

#### 1.1 불필요한 파일 정리
- [ ] `src/components/user/` 디렉토리 삭제
- [ ] `src/components/route/` 디렉토리 삭제  
- [ ] `src/components/layout/` → `src/components/common/`로 통합
- [ ] `src/components/not-fount/` → `src/components/not-found/` 이름 수정
- [ ] `src/stores/userStore.ts` → `src/stores/authStore.ts`로 통합

#### 1.2 타입 정의 확장
- [ ] `src/types/api/` 하위에 도메인별 API 타입 추가
- [ ] `src/types/domain/` 하위에 비즈니스 로직 타입 추가
- [ ] Claude AI 관련 타입 정의 추가

#### 1.3 기본 라이브러리 설정
- [ ] `src/lib/websocket/` 디렉토리 생성 및 WebSocket 관리 모듈 추가
- [ ] `src/lib/api/` 하위에 Claude AI API 클라이언트 추가
- [ ] 한국어 에러 메시지 상수 파일 생성

### Phase 2: 뉴스 도메인 구현 

#### 2.1 뉴스 라우트 생성
- [ ] `src/routes/news/index.tsx` - 뉴스 목록 페이지
- [ ] `src/routes/news/$newsId.tsx` - 뉴스 상세 페이지

#### 2.2 뉴스 컴포넌트 구현 ⚠️ (기존 ContentCard 디자인 기반)
- [ ] `src/components/news/NewsListGrid.tsx` - ContentCard 구조 재사용
- [ ] `src/components/news/NewsArticleContent.tsx` - 기존 NewsItem 스타일 확장
- [ ] `src/components/news/NewsCategoryFilters.tsx` - 기존 Button 스타일 적용
- [ ] `src/components/news/NewsMetadata.tsx` - 기존 텍스트 스타일 적용
- [ ] `src/components/news/AISummaryPanel.tsx` - ContentCard 래퍼 사용
- [ ] `src/components/news/TradeNewsPanel.tsx` - 메인 페이지 뉴스 섹션과 동일 구조
- [ ] `src/components/news/BusinessImpactAnalysis.tsx` - ContentCard 기반

#### 2.3 뉴스 관련 훅 구현
- [ ] `src/hooks/api/news/useNewsList.ts`
- [ ] `src/hooks/api/news/useNewsDetail.ts`
- [ ] `src/hooks/api/news/usePopularNews.ts`
- [ ] `src/hooks/api/news/useNewsSubscription.ts`

### Phase 3: Claude AI 통합 

#### 3.1 AI 관련 컴포넌트 구현 ⚠️ (기존 디자인 시스템 준수)
- [ ] `src/components/hscode/AnalysisChat.tsx` - ContentCard 기반, 기존 Button 스타일
- [ ] `src/components/hscode/SmartQuestions.tsx` - 기존 폼 컴포넌트 스타일 적용
- [ ] `src/components/hscode/ImageUpload.tsx` - 기존 입력 컴포넌트 디자인 따름
- [ ] `src/components/search/IntentDetection.tsx` - 기존 텍스트/뱃지 스타일 사용
- [ ] `src/components/common/SourceCitation.tsx` - 기존 링크 스타일 (Button variant="link")

#### 3.2 AI 관련 훅 구현
- [ ] `src/hooks/api/search/useIntentDetection.ts`
- [ ] `src/hooks/api/hscode/useSmartQuestions.ts`
- [ ] `src/hooks/api/hscode/useImageAnalysis.ts`
- [ ] `src/hooks/api/hscode/useAnalysisSession.ts`

#### 3.3 AI 서비스 통합
- [ ] `src/lib/api/claude.ts` - Claude AI API 클라이언트
- [ ] 각 스토어에 AI 로직 통합
- [ ] 실시간 분석 진행 상황 WebSocket 연동

### Phase 4: 라우트 완성 

#### 4.1 HS Code 도메인 라우트 완성
- [ ] `src/routes/hscode/analyze/$sessionId.tsx` - 대화형 분석 세션
- [ ] `src/routes/hscode/result/$resultId.tsx` - 분석 결과 상세

#### 4.2 Trade 도메인 라우트 완성  
- [ ] `src/routes/trade/index.tsx` - 무역 정보 허브

#### 4.3 Tracking 도메인 라우트 완성
- [ ] `src/routes/tracking/$number.tsx` - 화물 추적 결과

### Phase 5: 메인 페이지 고도화 

#### 5.1 인텔리전트 검색 구현
- [ ] `src/components/search/SearchInput.tsx` 고도화
- [ ] Claude AI 의도 감지 통합
- [ ] 음성 입력 지원 추가

#### 5.2 메인 페이지 위젯 구현 ⚠️ (기존 컴포넌트 확장)
- [ ] `src/components/dashboard/RecentAnalysisResults.tsx` - 기존 "최근 분석 품목" 섹션 확장
- [ ] `src/components/dashboard/HsCodeUpdatesPanel.tsx` - ContentCard 구조 재사용
- [ ] `src/components/dashboard/RealTimeExchangeRates.tsx` - 기존 ExchangeRateCard 확장
- [ ] `src/components/search/PopularSearchTerms.tsx` - 기존 "인기 검색어" 섹션 확장

### Phase 6: 실시간 기능 구현 

#### 6.1 WebSocket 연동
- [ ] `src/lib/websocket/connection.ts` - 연결 관리
- [ ] `src/lib/websocket/handlers.ts` - 메시지 핸들러
- [ ] 분석 진행 상황 실시간 업데이트
- [ ] 북마크 모니터링 변경 알림

#### 6.2 알림 시스템 완성
- [ ] 브라우저 푸시 알림 구현
- [ ] 이메일 알림 설정 인터페이스
- [ ] 토스트 알림 시스템 고도화

### Phase 7: 한국어 최적화 및 품질 개선 

#### 7.1 한국어화 완성
- [ ] 모든 UI 텍스트 한국어 적용
- [ ] 에러 메시지 한국어화
- [ ] 로딩 메시지 한국어화
- [ ] 폼 유효성 검사 메시지 한국어화

#### 7.2 기존 디자인 기반 최적화 ⚠️ (디자인 변경 금지)
- [ ] 한국어 텍스트 길이에 맞는 **콘텐츠 조정** (기존 레이아웃 유지)
- [ ] 모바일 반응형 **기능 최적화** (기존 디자인 패턴 유지)
- [ ] 로딩 상태 개선 (기존 ContentCard 구조 내에서)
- [ ] 접근성 개선 (ARIA 라벨, 키보드 네비게이션) - 스타일 변경 없음

### Phase 8: 성능 최적화 및 테스트 

#### 8.1 성능 최적화
- [ ] 코드 스플리팅 최적화
- [ ] TanStack Query 캐시 설정 세밀 조정
- [ ] 이미지 최적화 및 지연 로딩
- [ ] 번들 크기 분석 및 최적화

#### 8.2 품질 검증
- [ ] ESLint 규칙 점검 및 수정
- [ ] TypeScript 에러 제거
- [ ] 브라우저 호환성 테스트
- [ ] 성능 지표 측정 및 개선

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

## 🚨 주의사항 및 위험 요소

### 기술적 위험요소
1. **Claude AI API 통합 복잡성**: AI 서비스 통합 시 API 한도 및 에러 처리 고려
2. **WebSocket 연결 안정성**: 한국 네트워크 환경에 맞는 재연결 로직 필요
3. **이미지 업로드 처리**: 멀티모달 분석을 위한 이미지 전처리 및 최적화
4. **실시간 데이터 동기화**: 다수 사용자 환경에서의 상태 동기화 복잡성

### 일정 위험요소
1. **AI 기능 개발 지연**: Claude AI 통합의 예상보다 긴 개발 시간
2. **성능 최적화 시간**: 대용량 데이터 처리 시 예상보다 긴 최적화 시간

### 디자인 관련 주의사항
1. **기존 디자인 준수**: 모든 새로운 페이지는 메인 페이지의 디자인 패턴을 따라야 함
2. **컴포넌트 재사용**: 기존 ContentCard, Button 등의 컴포넌트를 최대한 활용
3. **커스텀 컬러 시스템 준수**: `src/styles.css` @theme 정의 색상만 사용, 외부 색상 절대 금지
4. **일관성 유지**: 간격, 폰트 등 기존 디자인 시스템 엄격히 준수
5. **Tailwind v4 패턴 활용**: [@theme directive 활용](https://tailwindcss.com/docs/adding-custom-styles) 가이드 준수

## 📋 완료 체크리스트

### 필수 기능 (Must-have)
- [ ] 모든 라우트 구현 완료
- [ ] Claude AI 통합 완료
- [ ] 뉴스 도메인 완전 구현
- [ ] 한국어 UI 완성
- [ ] 모바일 반응형 완성
- [ ] 기본 에러 처리 구현

### 권장 기능 (Should-have)  
- [ ] 실시간 WebSocket 기능
- [ ] 이미지 분석 기능
- [ ] 음성 입력 지원
- [ ] 오프라인 캐싱
- [ ] PWA 기능
- [ ] 고급 알림 시스템

### 선택 기능 (Nice-to-have)
- [ ] 다크 모드 지원
- [ ] 고급 분석 도구
- [ ] 데이터 내보내기 기능
- [ ] 소셜 공유 기능
- [ ] 사용자 피드백 시스템

## 🔄 지속적 개선 계획

### 성능 모니터링
- Core Web Vitals 지속 추적
- 사용자 행동 분석 데이터 수집
- 에러 로깅 및 모니터링 시스템 구축

### 기능 확장
- Claude AI 모델 업데이트 대응
- 새로운 무역 규정 반영 자동화
- 사용자 요청 기반 기능 추가

이 계획서에 따라 단계적으로 리팩토링을 진행하면 .cursorrules에 정의된 완전한 AI HS Code Radar System을 구축할 수 있습니다. 