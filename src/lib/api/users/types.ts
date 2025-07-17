export type UpdatePasswordRequest = {
  currentPassword?: string;
  newPassword?: string;
  newPasswordConfirm?: string;
};

export type UpdateNameRequest = {
  name: string;
};
