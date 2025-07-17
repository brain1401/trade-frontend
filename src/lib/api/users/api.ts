import { httpClient } from "../common";
import type { UpdatePasswordRequest } from "./types";
import type { User } from "@/types/auth";

export const usersApi = {
  /**
   * 사용자 프로필 정보(비밀번호 포함)를 업데이트
   * @param data - 업데이트할 비밀번호 정보
   * @returns 업데이트된 사용자 정보
   */
  updateProfile(data: UpdatePasswordRequest): Promise<User> {
    return httpClient.patch<User>("/users/profile", data);
  },

  /**
   * 사용자 이름 업데이트
   * @param data - 새로운 이름 정보
   * @returns 업데이트된 사용자 정보
   */
  updateUserName(data: { name: string }): Promise<User> {
    return httpClient.patch<User>("/users/profile", data);
  },

  /**
   * 계정 삭제(탈퇴)
   */
  leaveAccount(): Promise<void> {
    return httpClient.delete("/users/leave");
  },
};
