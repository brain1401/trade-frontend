/**
 * @deprecated 이 파일은 하위 호환성을 위해 유지됩니다.
 * 새로운 코드에서는 @/lib/api 또는 구체적인 모듈을 직접 import 하세요.
 *
 * @example 권장하는 import 방식
 * ```typescript
 * // 전체 API 모듈
 * import { authApi, apiClient } from "@/lib/api";
 *
 * // 특정 API만
 * import { authApi } from "@/lib/api/auth";
 * import { apiClient } from "@/lib/api/client";
 * ```
 */

// 하위 호환성을 위한 재익스포트
export { apiClient, ApiError, setupApiInterceptor } from "./client";
export { authApi } from "./auth";
