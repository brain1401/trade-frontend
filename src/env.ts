import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    SERVER_URL: z.string().url().optional(),
  },

  /**
   * 클라이언트 측 변수들이 가져야 하는 접두사
   * 타입 레벨과 런타임 모두에서 강제됨
   */
  clientPrefix: "VITE_",

  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
  },

  /**
   * 런타임에서 환경 변수들을 보유하는 객체
   * 일반적으로 `process.env` 또는 `import.meta.env`
   */
  runtimeEnv: import.meta.env,

  /**
   * 기본적으로 env에 타입을 씌워주는 이 라이브러리는 환경 변수들을 Zod 검증기에 직접 전달함
   *
   * 즉, 숫자여야 하는 값에 대해 빈 문자열이 있는 경우(예: ".env" 파일의 `PORT=`),
   * Zod는 이를 타입 불일치 위반으로 잘못 플래그 지정함. 추가적으로, 기본값이 있는
   * 문자열이어야 하는 값에 대해 빈 문자열이 있는 경우(예: ".env" 파일의 `DOMAIN=`),
   * 기본값이 적용되지 않음
   *
   * 이러한 문제들을 해결하기 위해 모든 새 프로젝트에서
   * 이 옵션을 명시적으로 true로 지정하는 것을 권장함
   */
  emptyStringAsUndefined: true,
});
