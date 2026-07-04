import { z } from "zod";

export const affiliateContactSchema = z.object({
  name: z.string().trim().min(2, "Họ tên tối thiểu 2 ký tự."),
  phone: z.string().trim().min(8, "Số điện thoại không hợp lệ."),
  email: z.string().trim().email("Email không hợp lệ.").optional().or(z.literal("")),
  vertical: z.enum(["tai-chinh", "dinh-gia", "noi-that", "ho-tro", "khac"]),
  need: z.string().trim().optional(),
  message: z.string().trim().max(2000).optional(),
});

export type AffiliateContactInput = z.infer<typeof affiliateContactSchema>;
