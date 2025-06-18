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

  // React 설정 - 버전 자동 감지
  settings: {
    react: {
      version: "detect", // React 버전 자동 감지
    },
  },

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

    // React Hook 호출 규칙 검사 - 조건문 안에서 Hook 호출 등을 방지
    "react-hooks/rules-of-hooks": "error",

    // React Hook의 의존성 배열 검사 - 무한 루프나 누락된 의존성 방지
    "react-hooks/exhaustive-deps": "error",

    // 위험한 props 사용 금지 - XSS 공격 방지
    "react/no-danger": "error",

    // 배열 인덱스를 key로 사용 금지 - 렌더링 성능 및 상태 오류 방지
    "react/no-array-index-key": "off",

    // 컴포넌트 내부 함수 정의 금지 - 불필요한 리렌더링 방지
    "react/no-unstable-nested-components": "error",

    // 누락된 key prop 검사 - 리스트 렌더링 최적화
    "react/jsx-key": [
      "error",
      {
        checkFragmentShorthand: true, // <></> 문법에서도 key 검사
        checkKeyMustBeforeSpread: true, // key는 spread 이전에 위치
        warnOnDuplicates: true, // 중복 key 경고
      },
    ],

    // 불필요한 Fragment 사용 경고 - 번들 크기 최적화
    "react/jsx-no-useless-fragment": "error",

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

    // 컴포넌트 파일명 규칙 - PascalCase 강제
    "react/jsx-pascal-case": [
      "warn",
      {
        allowAllCaps: true, // HTML, SVG 등 허용
        ignore: [], // 예외 컴포넌트 목록
      },
    ],

    // 불필요한 boolean 속성 값 경고 - 간결한 JSX 작성
    "react/jsx-boolean-value": ["warn", "never"],

    // 닫는 태그 일관성 - 가독성 향상
    "react/jsx-closing-bracket-location": ["warn", "line-aligned"],

    // props 구조 분해 권장 - 가독성 향상
    "react/destructuring-assignment": [
      "warn",
      "always",
      {
        ignoreClassFields: false,
        destructureInSignature: "always",
      },
    ],

    // 컴포넌트 정의 방식 일관성 - function declaration 권장
    "react/function-component-definition": [
      "warn",
      {
        namedComponents: "function-declaration",
        unnamedComponents: "arrow-function",
      },
    ],

    // 불필요한 curly braces 제거 - 간결한 JSX
    "react/jsx-curly-brace-presence": [
      "warn",
      {
        props: "never", // <Component prop="value"> not {{"value"}}
        children: "never", // <div>text</div> not <div>{"text"}</div>
        propElementValues: "always", // JSX 요소는 항상 중괄호
      },
    ],

    // JSX 속성 정렬 - 가독성 향상 (선택적)
    "react/jsx-sort-props": "off", // 너무 엄격할 수 있어서 비활성화

    // 접근성 관련 권장 규칙들
    "react/jsx-no-target-blank": [
      "warn",
      {
        enforceDynamicLinks: "always", // 동적 링크에서도 rel="noopener" 강제
        warnOnSpreadAttributes: true,
        links: true,
        forms: true,
      },
    ],

    // 성능 최적화 관련 규칙들
    "react/jsx-no-constructed-context-values": "warn", // Context value 객체 재생성 방지
    "react/no-object-type-as-default-prop": "warn", // 기본 props에 객체 타입 사용 금지
    "react/hook-use-state": "warn", // useState 대신 다른 hook이 더 적절한 경우 권장

    // 코드 품질 향상
    "react/no-unused-prop-types": "warn", // 사용하지 않는 prop types 제거
    "react/self-closing-comp": ["warn", { component: true, html: true }], // 자체 닫는 태그 권장
    "react/void-dom-elements-no-children": "error", // void 요소에 children 금지 (예: <img>에 children)

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

    // TypeScript에서 React 컴포넌트 props 타입 명시 권장
    "react/prop-types": "off", // TypeScript 사용 시 prop-types 비활성화

    // React 컴포넌트에서 displayName 자동 추론 허용
    "react/display-name": "off", // TypeScript 환경에서는 불필요

    // 불필요한 React import 제거 (React 17+ JSX Transform)
    "react/react-in-jsx-scope": "off",

    // 컴포넌트 함수에서 암시적 반환 타입 허용
    "@typescript-eslint/explicit-function-return-type": "off",

    // 비어있는 인터페이스 경고 - type 사용 권장
    "@typescript-eslint/no-empty-interface": [
      "warn",
      {
        allowSingleExtends: false, // 단일 확장도 금지
      },
    ],

    // 명시적 any 타입 사용 제한
    "@typescript-eslint/no-explicit-any": [
      "warn",
      {
        ignoreRestArgs: true, // ...args: any[] 허용
        fixToUnknown: true, // auto-fix 시 unknown으로 변경
      },
    ],

    "@typescript-eslint/require-await": "off",

    // 변수 shadowing 방지
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": [
      "warn",
      {
        ignoreTypeValueShadow: true, // 타입과 값 shadowing 허용
        ignoreFunctionTypeParameterNameValueShadow: true,
      },
    ],

    // Function 타입 사용 방지
    "@typescript-eslint/no-unsafe-function-type": "warn",

    // 일관된 타입 정의 방식 - interface 대신 type 사용
    "@typescript-eslint/consistent-type-definitions": ["warn", "type"],

    // 불필요한 non-null assertion 경고
    "@typescript-eslint/no-non-null-assertion": "warn",

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
