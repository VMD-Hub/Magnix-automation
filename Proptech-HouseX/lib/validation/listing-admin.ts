import { z } from "zod";
import { LISTING_REMOVAL_REASONS } from "@/lib/email/listing-removal-reasons";

const reasonCodes = Object.keys(LISTING_REMOVAL_REASONS) as [
  keyof typeof LISTING_REMOVAL_REASONS,
  ...(keyof typeof LISTING_REMOVAL_REASONS)[],
];

export const listingReviewSchema = z.object({
  action: z.enum(["approve", "reject"]),
  rejectReason: z.string().optional(),
  reasonCode: z.enum(reasonCodes).optional(),
});

export const listingAdminListQuerySchema = z.object({
  status: z
    .enum(["PENDING_REVIEW", "ACTIVE", "REJECTED", "ALL"])
    .optional()
    .default("PENDING_REVIEW"),
});

export type ListingReviewInput = z.infer<typeof listingReviewSchema>;
