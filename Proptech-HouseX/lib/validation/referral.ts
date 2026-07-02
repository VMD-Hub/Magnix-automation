import { z } from "zod";

export const referralTypeEnum = z.enum(["CTV_PROJECT", "SHARE_LISTING"]);

export const referralCreateSchema = z
  .object({
    // brokerId từ body hoặc header x-broker-id.
    brokerId: z.string().uuid().optional(),
    type: referralTypeEnum,
    projectId: z.string().uuid().optional(),
    listingId: z.string().uuid().optional(),
    expiresAt: z.coerce.date().optional(),
  })
  .refine((d) => (d.type === "CTV_PROJECT" ? !!d.projectId : true), {
    message: "type=CTV_PROJECT bắt buộc có projectId.",
    path: ["projectId"],
  })
  .refine((d) => (d.type === "SHARE_LISTING" ? !!d.listingId : true), {
    message: "type=SHARE_LISTING bắt buộc có listingId.",
    path: ["listingId"],
  });

export type ReferralCreateInput = z.infer<typeof referralCreateSchema>;
