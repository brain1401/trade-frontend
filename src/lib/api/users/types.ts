export type UpdatePasswordRequest = {
  currentPassword?: string; // 현재 비밀번호 (필요시)
  newPassword?: string; // 새 비밀번호
  newPasswordConfirm?: string;
};
