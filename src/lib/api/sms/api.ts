import { httpClient } from "../common";

/**
 * SMS 인증 API 요청을 위한 객체
 *
 * @property {(to: string) => Promise<void>} sendVerification - 인증번호 발송을 요청
 * @property {(to: string, code: string) => Promise<{success: boolean}>>} verifyCode - 인증번호를 검증
 */
export const smsApi = {
  /**
   * 지정된 번호로 인증번호를 발송
   * @param to 휴대폰 번호
   */
  sendVerification(to: string): Promise<void> {
    return httpClient.post("/sms/send-verification", { to });
  },

  /**
   * 입력된 인증번호를 검증
   * @param to 휴대폰 번호
   * @param code 6자리 인증번호
   * @returns 성공 여부를 포함하는 객체를 반환하는 Promise
   */
  verifyCode(to: string, code: string): Promise<{ success: boolean }> {
    return httpClient.post("/sms/verify", { to, code });
  },
};
