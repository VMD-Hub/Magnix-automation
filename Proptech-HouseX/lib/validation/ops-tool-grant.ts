import { z } from "zod";

export const opsToolGrantCreateSchema = z
  .object({
    phone: z.string().trim().min(8).max(30).optional(),
    zaloUserId: z.string().trim().min(3).max(80).optional(),
    /** Email công việc — bắt buộc để gửi lời mời đặt mật khẩu. */
    inviteEmail: z.string().trim().email("Email công việc không hợp lệ."),
    note: z.string().max(500).nullable().optional(),
    tool: z.literal("TELESALES_CRM").optional(),
  })
  .refine((v) => Boolean(v.phone?.trim() || v.zaloUserId?.trim()), {
    message: "Cần SĐT hoặc Zalo user id.",
  });

export const opsToolGrantListQuerySchema = z.object({
  status: z.enum(["ACTIVE", "REVOKED", "ALL"]).optional(),
  tool: z.literal("TELESALES_CRM").optional(),
});

export const opsToolGrantResendSchema = z.object({
  inviteEmail: z.string().trim().email().optional(),
});
