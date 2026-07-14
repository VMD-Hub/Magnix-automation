import { z } from "zod";

export const zaloAuthSchema = z
  .object({
    accessToken: z.string().min(8).max(4096).optional(),
    /** Chỉ dùng khi ZALO_AUTH_DEV_BYPASS=true (Simulator). */
    zaloUserId: z.string().min(3).max(64).optional(),
    phone: z.string().min(9).max(20).optional(),
    phoneToken: z.string().min(8).max(4096).optional(),
    name: z.string().min(1).max(120).optional(),
    preferredRole: z.enum(["CUSTOMER", "BROKER"]).optional(),
  })
  .refine((d) => Boolean(d.phone?.trim() || d.phoneToken?.trim()), {
    message: "Cần phone hoặc phoneToken",
    path: ["phone"],
  });

export type ZaloAuthInput = z.infer<typeof zaloAuthSchema>;
