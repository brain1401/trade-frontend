# 테마 색상 시스템 가이드

## 개요

이 프로젝트는 styles.css에서 중앙집중화된 테마 색상 시스템을 사용합니다. 이를 통해 브랜드 색상을 한 곳에서 쉽게 변경할 수 있습니다.

## 색상 시스템 구조

### Primary Colors (주요 액션 색상)
메인 브랜드 색상으로, 링크, 버튼, 중요한 UI 요소에 사용됩니다.
```css
text-primary-50    /* 가장 연한 색 */
text-primary-100
text-primary-200
...
text-primary-600   /* 주로 사용되는 메인 색상 */
...
text-primary-950   /* 가장 진한 색 */
```

### Neutral Colors (회색 계열)
텍스트, 배경, 테두리 등에 사용되는 중성적인 색상입니다.
```css
text-neutral-50    /* 연한 배경 */
text-neutral-100   /* 테두리 */
text-neutral-500   /* 보조 텍스트 */
text-neutral-600   /* 일반 텍스트 */
text-neutral-700   /* 중요 텍스트 */
text-neutral-800   /* 제목 */
text-neutral-900   /* 강조 텍스트 */
```

### Semantic Colors
의미가 있는 색상들입니다.
- `success-*`: 성공, 완료 상태
- `warning-*`: 주의, 경고 상태  
- `danger-*`: 오류, 위험 상태

## 사용법

### ✅ 권장 사용법

```tsx
// Primary 색상 사용
<Button className="text-primary-600 hover:text-primary-700">
  링크 버튼
</Button>

// Neutral 색상 사용
<p className="text-neutral-600">일반 텍스트</p>
<h1 className="text-neutral-800">제목</h1>
<div className="border-neutral-200">테두리</div>
<div className="bg-neutral-50">연한 배경</div>
```

### ❌ 피해야 할 사용법

```tsx
// 하드코딩된 색상 (지양)
<Button className="text-blue-600">버튼</Button>
<p className="text-gray-500">텍스트</p>
```

## 테마 색상 변경하기

`src/styles.css` 파일의 `@theme` 섹션에서 색상 값을 수정하면 전체 애플리케이션의 테마가 변경됩니다.

### 예시: Primary 색상을 녹색으로 변경

```css
@theme {
  /* Primary Colors */
  --color-primary-50: #f0fdf4;
  --color-primary-100: #dcfce7;
  --color-primary-200: #bbf7d0;
  --color-primary-300: #86efac;
  --color-primary-400: #4ade80;
  --color-primary-500: #22c55e;
  --color-primary-600: #16a34a;  /* 메인 색상 */
  --color-primary-700: #15803d;
  --color-primary-800: #166534;
  --color-primary-900: #14532d;
  --color-primary-950: #052e16;
}
```

## 색상 매핑표

기존 하드코딩된 색상에서 새로운 테마 색상으로의 매핑:

| 기존 클래스       | 새로운 클래스        | 용도            |
| ----------------- | -------------------- | --------------- |
| `text-blue-600`   | `text-primary-600`   | 링크, 액션 버튼 |
| `text-gray-500`   | `text-neutral-500`   | 보조 텍스트     |
| `text-gray-600`   | `text-neutral-600`   | 일반 텍스트     |
| `text-gray-700`   | `text-neutral-700`   | 중요 텍스트     |
| `text-gray-800`   | `text-neutral-800`   | 제목            |
| `bg-gray-50`      | `bg-neutral-50`      | 연한 배경       |
| `bg-gray-100`     | `bg-neutral-100`     | 섹션 배경       |
| `border-gray-100` | `border-neutral-100` | 연한 테두리     |
| `border-gray-200` | `border-neutral-200` | 일반 테두리     |

## 개발 가이드라인

1. **새로운 컴포넌트 개발 시** 하드코딩된 색상 대신 테마 색상을 사용하세요.
2. **색상 일관성** 동일한 목적의 UI 요소는 동일한 색상 단계를 사용하세요.
3. **접근성** 충분한 대비율을 위해 배경과 텍스트 색상을 적절히 조합하세요.
4. **반응형** 다크 모드나 다른 테마 변형도 고려하여 색상을 선택하세요.

## 확장성

새로운 브랜드 색상이나 색상 변형이 필요할 경우, `styles.css`의 `@theme` 섹션에 추가할 수 있습니다:

```css
@theme {
  /* 기존 색상들... */
  
  /* 새로운 브랜드 색상 */
  --color-secondary-50: #fff7ed;
  --color-secondary-100: #ffedd5;
  /* ... */
  --color-secondary-600: #ea580c;
  /* ... */
}
```

이 시스템을 통해 디자인 시스템의 일관성을 유지하면서도 쉽게 테마를 변경할 수 있습니다. 