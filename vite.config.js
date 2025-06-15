// @ts-check
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";

// Vite 설정 파일 - 개발 서버 및 번들링 최적화
// https://vitejs.dev/config/
export default defineConfig({
  // 사용할 Vite 플러그인들
  plugins: [
    // TanStack Router 플러그인 - 파일 기반 라우팅 및 자동 코드 스플리팅
    tanstackRouter({ autoCodeSplitting: true }),

    // React 지원 플러그인 - JSX 변환 및 Fast Refresh
    viteReact(),

    // Tailwind CSS 플러그인 - CSS 처리 및 최적화
    tailwindcss(),
  ],

  // esbuild 설정 - Vite의 TypeScript/JSX 변환 최적화
  esbuild: {
    // 개발 중 더 나은 디버깅을 위한 소스맵 설정
    sourcemap: true,
    // 프로덕션에서 console 제거 (선택사항)
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },

  // 🆕 Vite 6.x 새로운 JSON 설정 - 'auto'가 기본값
  json: {
    stringify: "auto", // 큰 JSON만 문자열화 (Vite 6 기본값)
    namedExports: true, // JSON named exports 활성화
  },

  // 테스트 환경 설정 (Vitest 사용)
  test: {
    globals: true, // describe, it, expect 등을 전역으로 사용
    environment: "jsdom", // DOM API 시뮬레이션 (React 컴포넌트 테스트용)
  },

  // 모듈 해석 설정
  resolve: {
    alias: {
      // @ 별칭을 src 디렉토리로 설정
      // import Button from '@/components/Button' 형태로 사용 가능
      "@": resolve(__dirname, "./src"),
    },
  },

  // 🚀 프로덕션 빌드 최적화 설정
  build: {
    // 브라우저 지원 타겟 - Vite 6 기본값 (ES modules 지원 브라우저)
    target: "esnext",

    rollupOptions: {
      output: {
        // 패턴 기반 자동 청크 분할 - 더 유연하고 확장 가능
        manualChunks: (id) => {
          // React 코어 라이브러리 - 자주 변경되지 않음
          if (id.includes("react") || id.includes("react-dom")) {
            return "react";
          }

          // TanStack 라이브러리들 - 라우팅과 상태관리
          if (id.includes("@tanstack/")) {
            return "tanstack";
          }

          // 모든 Radix UI 컴포넌트들 - @radix-ui/* 패턴
          if (id.includes("@radix-ui/")) {
            return "ui";
          }

          // 유틸리티 라이브러리들 - 헬퍼 함수 및 상태관리
          if (
            id.includes("axios") ||
            id.includes("clsx") ||
            id.includes("tailwind-merge") ||
            id.includes("zod") ||
            id.includes("zustand")
          ) {
            return "utils";
          }

          // Lucide 아이콘들 - 아이콘 라이브러리
          if (id.includes("lucide-react")) {
            return "icons";
          }

          // 기타 node_modules는 vendor 청크로
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },

    // 청크 크기 경고 임계값 (KB) - 1MB 이상일 때 경고
    chunkSizeWarningLimit: 1000,

    // 프로덕션 소스맵 - 디버깅 필요 시에만 true로 설정
    sourcemap: false,
  },

  // 🔧 개발 서버 최적화 설정
  optimizeDeps: {
    // 사전 번들링할 의존성들 - 개발 서버 시작 속도 향상
    include: [
      "react", // React 코어
      "react-dom", // React DOM 렌더링
      "@tanstack/react-router", // 라우터 라이브러리
      "@tanstack/react-query", // 데이터 페칭 라이브러리
    ],
    // ESM 호환성 문제가 있는 패키지들 강제 사전 번들링
    force: true,
  },
});
