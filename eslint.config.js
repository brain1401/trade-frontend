//  @ts-check
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";

import { tanstackConfig } from "@tanstack/eslint-config";
import pluginRouter from "@tanstack/eslint-plugin-router";

export default tseslint.config({
  // TanStack의 기본 ESLint 설정을 확장
  // TypeScript, React, Import 관련 기본 규칙들이 포함됨
  extends: [...tanstackConfig],

  // JavaScript 설정 파일들은 TypeScript 파싱에서 제외
  ignores: ["*.config.js", "*.config.ts"],

  // 프로젝트에서 사용할 ESLint 플러그인들
  plugins: {
    // React Hooks 관련 규칙 (useEffect, useState 등)
    "react-hooks": reactHooks,
    // React Fast Refresh 지원 (HMR 최적화)
    "react-refresh": reactRefresh,
    // React JSX 및 컴포넌트 관련 규칙
    react: react,
    // TanStack Router 전용 규칙
    "@tanstack/router": pluginRouter,
  },

  rules: {
    // 🚨 진짜 오류 (ERROR) - 런타임 버그나 번들링에 직접적 영향

    // 동일 모듈의 중복 import 방지 - 번들 크기 최적화
    "no-duplicate-imports": "error",

    // React Hook의 의존성 배열 검사 - 무한 루프나 누락된 의존성 방지
    "react-hooks/exhaustive-deps": "error",

    // lexical declaration in case block 방지
    "no-case-declarations": "error",

    // ⚠️ 권장사항 (WARN) - 코드 품질이나 성능 최적화 관련

    // 미사용 변수/함수 감지 - Tree Shaking을 위해 필수
    // _로 시작하는 변수는 무시 (예: _unused)
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_", // _id, _props 같은 매개변수 무시
        varsIgnorePattern: "^_", // _temp 같은 변수 무시
        ignoreRestSiblings: true, // 객체 구조분해에서 나머지 속성 무시
      },
    ],

    // TanStack Router의 createRoute 속성 순서 일관성
    // 코드 가독성과 팀 협업을 위한 권장사항
    "@tanstack/router/create-route-property-order": "warn",

    // JSX에서 함수 바인딩 최적화 - 불필요한 리렌더링 방지
    // 화살표 함수는 허용하지만 .bind()나 익명 함수는 경고
    "react/jsx-no-bind": [
      "warn",
      {
        ignoreDOMComponents: true, // <div onClick={handler}> 허용
        ignoreRefs: true, // ref 콜백 허용
        allowArrowFunctions: true, // () => {} 허용
        allowFunctions: false, // function() {} 금지
        allowBind: false, // .bind() 금지
      },
    ],

    // Type import 일관성 - inline type specifier 허용하도록 설정
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports", // inline type specifier 사용 허용
        disallowTypeAnnotations: false,
      },
    ],

    // 불필요한 조건문 검사
    "@typescript-eslint/no-unnecessary-condition": "warn",

    "@typescript-eslint/require-await": "off",

    // 변수 shadowing 방지
    "no-shadow": "off",

    // Function 타입 사용 방지
    "@typescript-eslint/no-unsafe-function-type": "warn",

    // 🔇 비활성화 - 기존 설정 유지 또는 다른 도구가 처리

    // TypeScript가 처리하므로 일반 JS 규칙 비활성화
    "no-unused-vars": "off",

    // 배열 타입 표기법 (T[] vs Array<T>) - 팀 선호도에 따라 비활성화
    "@typescript-eslint/array-type": "off",

    // import 정렬 - Prettier나 다른 도구가 처리
    "sort-imports": "off",
    "import/order": "off",

    // Type import 관련 충돌 방지 - inline type specifier와 충돌하므로 비활성화
    "import/consistent-type-specifier-style": "off",
  },
});
