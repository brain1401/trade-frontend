import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_API_BASE_URL: z.string().default("http://localhost:8080/api/v1"),
    VITE_WS_URL: z.string().default("ws://localhost:8080/ws"),
    VITE_APP_NAME: z.string().default("AI HS Code Radar System"),
    VITE_APP_VERSION: z.string().default("1.0.0"),
    VITE_DEBUG: z
      .string()
      .optional()
      .transform((val) => val === "true"),
    VITE_ENABLE_ANALYTICS: z
      .string()
      .optional()
      .transform((val) => val === "true"),
    VITE_ENABLE_REAL_TIME: z
      .string()
      .optional()
      .transform((val) => val === "true"),
    VITE_ENABLE_WEBSOCKET: z
      .string()
      .optional()
      .transform((val) => val === "true"),
  },
  runtimeEnv: {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_WS_URL: import.meta.env.VITE_WS_URL,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
    VITE_DEBUG: import.meta.env.VITE_DEBUG,
    VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS,
    VITE_ENABLE_REAL_TIME: import.meta.env.VITE_ENABLE_REAL_TIME,
    VITE_ENABLE_WEBSOCKET: import.meta.env.VITE_ENABLE_WEBSOCKET,
  },
});

// 추가 설정들
export const config = {
  api: {
    baseUrl: env.VITE_API_BASE_URL,
    timeout: 60000, // AI 분석은 시간이 오래 걸릴 수 있음
  },
  ws: {
    url: env.VITE_WS_URL,
    reconnectDelay: 1000,
    maxReconnectAttempts: 5,
  },
  app: {
    name: env.VITE_APP_NAME,
    version: env.VITE_APP_VERSION,
    debug: env.VITE_DEBUG || false,
  },
  features: {
    analytics: env.VITE_ENABLE_ANALYTICS || false,
    realTime: env.VITE_ENABLE_REAL_TIME || true,
    webSocket: env.VITE_ENABLE_WEBSOCKET || true,
  },
  ui: {
    toastDuration: 5000,
    debounceDelay: 300,
    animationDuration: 200,
  },
  storage: {
    keys: {
      authToken: "auth-token",
      userPreferences: "user-preferences",
      analysisDraft: "analysis-draft",
      searchHistory: "search-history",
    },
  },
} as const;

export type Config = typeof config;
