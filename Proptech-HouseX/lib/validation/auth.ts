import { z } from "zod";

export const accountRoleEnum = z.enum(["CUSTOMER", "BROKER"]);

export const authRegisterSchema = z.object({
  role: accountRoleEnum,
  name: z.string().trim().min(2, "Họ tên tối thiểu 2 ký tự."),
  phone: z.string().trim().min(8, "Số điện thoại không hợp lệ."),
  email: z.string().trim().email("Email không hợp lệ."),
  password: z
    .string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự.")
    .max(128, "Mật khẩu quá dài."),
  marketingOptIn: z.boolean().optional().default(true),
});

export const authLoginSchema = z.object({
  phone: z.string().trim().min(8, "Số điện thoại không hợp lệ."),
  password: z.string().min(1, "Vui lòng nhập mật khẩu."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ."),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(16, "Token không hợp lệ."),
  password: z
    .string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự.")
    .max(128, "Mật khẩu quá dài."),
});

export const ctvApplicationSchema = z.object({
  idNumber: z.string().trim().min(9, "Số CMND/CCCD không hợp lệ.").max(12),
  experience: z.string().trim().min(10, "Mô tả kinh nghiệm tối thiểu 10 ký tự."),
  region: z.string().trim().min(2, "Vui lòng nhập khu vực hoạt động."),
  motivation: z.string().trim().min(10, "Vui lòng nêu lý do đăng ký CTV."),
});

export const ctvReviewSchema = z.object({
  action: z.enum(["approve", "reject"]),
  rejectReason: z.string().optional(),
});

export type AuthRegisterInput = z.infer<typeof authRegisterSchema>;
export type AuthLoginInput = z.infer<typeof authLoginSchema>;
export type CtvApplicationInput = z.infer<typeof ctvApplicationSchema>;
