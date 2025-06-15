import { z } from "zod";

// 로그인 스키마
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다")
    .max(100, "이메일은 100자를 초과할 수 없습니다"),

  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요")
    .min(6, "비밀번호는 최소 6자 이상이어야 합니다")
    .max(50, "비밀번호는 50자를 초과할 수 없습니다"),
});

// 회원가입 스키마
export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, "이름을 입력해주세요")
      .min(2, "이름은 최소 2자 이상이어야 합니다")
      .max(50, "이름은 50자를 초과할 수 없습니다")
      .regex(/^[가-힣a-zA-Z\s]+$/, "이름은 한글, 영문, 공백만 사용 가능합니다"),

    email: z
      .string()
      .min(1, "이메일을 입력해주세요")
      .email("올바른 이메일 형식이 아닙니다")
      .max(100, "이메일은 100자를 초과할 수 없습니다"),

    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요")
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .max(50, "비밀번호는 50자를 초과할 수 없습니다")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다",
      ),

    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요"),

    terms: z.boolean().refine((val) => val === true, "이용약관에 동의해주세요"),

    privacy: z
      .boolean()
      .refine((val) => val === true, "개인정보 처리방침에 동의해주세요"),

    marketing: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

// 비밀번호 재설정 요청 스키마
export const resetPasswordRequestSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
});

// 비밀번호 재설정 스키마
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "토큰이 필요합니다"),
    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요")
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .max(50, "비밀번호는 50자를 초과할 수 없습니다")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다",
      ),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

// 타입 추론
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ResetPasswordRequestInput = z.infer<
  typeof resetPasswordRequestSchema
>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
