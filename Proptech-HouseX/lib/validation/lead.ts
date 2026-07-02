import { z } from "zod";

export const leadStatusEnum = z.enum([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "WON",
  "LOST",
]);

// Khách submit form liên hệ. referralId KHÔNG nhận từ client — chỉ suy ra từ
// cookie attribution (rule #3). assignedBrokerId cũng do hệ thống gán.
export const leadCreateSchema = z
  .object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email().optional(),
    message: z.string().optional(),
    customerId: z.string().uuid().optional(),
    listingId: z.string().uuid().optional(),
    projectId: z.string().uuid().optional(),
    source: z.string().optional(),
  })
  .refine((d) => !!d.listingId || !!d.projectId, {
    message: "Lead cần gắn với ít nhất listingId hoặc projectId.",
  });

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;

const commissionOverrideSchema = z.object({
  amount: z.number().nonnegative().optional(),
  rate: z.number().min(0).max(1).optional(),
  dealValue: z.number().nonnegative().optional(),
  brokerId: z.string().uuid().optional(),
});

export const leadStatusPatchSchema = z.object({
  status: leadStatusEnum,
  // Chỉ dùng khi chuyển sang WON để tạo Commission (rule #4).
  commission: commissionOverrideSchema.optional(),
});

export type CommissionOverride = z.infer<typeof commissionOverrideSchema>;
