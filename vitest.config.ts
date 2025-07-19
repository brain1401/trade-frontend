/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  // 명시적으로 root 경로 설정
  root: process.cwd(),

  resolve: {
    alias: {
      // tsconfig.json의 paths와 일치하도록 수동 설정
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/utils": path.resolve(__dirname, "./src/lib/utils"),
      "@/test": path.resolve(__dirname, "./src/test"),
    },
  },

  test: {
    // 테스트 환경 설정
    environment: "jsdom",

    // 전역 함수 사용 (describe, it, expect 등)
    globals: true,

    // 설정 파일
    setupFiles: ["./src/test/setup.ts"],

    // 테스트 파일 패턴
    include: [
      "src/**/*.{test,spec}.{js,ts,jsx,tsx}",
      "tests/**/*.{test,spec}.{js,ts,jsx,tsx}",
    ],

    // pool 설정 변경 (Windows 호환성 개선)
    pool: "forks",

    // 제외할 파일
    exclude: ["node_modules", "dist", ".next", "coverage"],

    // 커버리지 설정
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "coverage/**",
        "dist/**",
        "packages/*/test{,s}/**",
        "**/*.d.ts",
        "cypress/**",
        "test{,s}/**",
        "test{,-*}.{js,cjs,mjs,ts,tsx,jsx}",
        "**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}",
        "**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}",
        "**/__tests__/**",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
        "**/.{eslint,mocha,prettier}rc.{js,cjs,yml}",
      ],
    },

    // 테스트 타임아웃
    testTimeout: 10000,

    // 더 나은 에러 출력
    logHeapUsage: true,
  },
});
