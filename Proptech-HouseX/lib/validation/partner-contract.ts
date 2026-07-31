import { z } from "zod";

export const partnerContractSignSchema = z.object({
  otp: z.string().trim().regex(/^\d{6}$/, "OTP 6 số"),
  accepted: z.literal(true),
  signatureDataUrl: z
    .string()
    .trim()
    .max(400_000)
    .optional()
    .nullable()
    .refine(
      (v) => !v || v.startsWith("data:image/"),
      "Chữ ký phải là data URL ảnh",
    ),
});
