import { z } from "zod";

const passwordField = z
  .string()
  .min(6, "Mật khẩu tối thiểu 6 ký tự.")
  .max(128, "Mật khẩu quá dài.");

export const passwordRequestOtpSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ."),
  purpose: z.enum(["SET_PASSWORD", "RESET_PASSWORD"]),
});

export const passwordSetSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ."),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Mã OTP gồm 6 chữ số."),
  password: passwordField,
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại."),
  newPassword: passwordField,
});

export const passwordResetWithOtpSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ."),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Mã OTP gồm 6 chữ số."),
  password: passwordField,
});
