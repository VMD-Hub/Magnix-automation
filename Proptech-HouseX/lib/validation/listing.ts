import { z } from "zod";

export const transactionTypeEnum = z.enum(["SALE", "RENT"]);
export const listingTierEnum = z.enum(["FREE", "VIP", "PREMIUM"]);
export const listingStatusEnum = z.enum([
  "DRAFT",
  "PENDING_REVIEW",
  "ACTIVE",
  "EXPIRED",
  "SOLD",
  "REJECTED",
]);
export const brokerTypeEnum = z.enum(["FREE", "CTV", "AGENCY", "INTERNAL"]);

const mediaCreateSchema = z.object({
  url: z.string().url(),
  type: z.string().min(1).default("image"),
  position: z.number().int().nonnegative().default(0),
});

export const listingCreateSchema = z.object({
  // brokerId có thể đến từ body hoặc header x-broker-id (xác định "ai đang đăng").
  brokerId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  unitTypeId: z.string().uuid().optional(),
  transactionType: transactionTypeEnum,
  propertyType: z.string().min(1),
  price: z.number().nonnegative(),
  area: z.number().positive().optional(),
  address: z.string().optional(),
  province: z.string().min(1),
  district: z.string().min(1),
  ward: z.string().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  description: z.string().optional(),
  status: listingStatusEnum.optional(),
  tier: listingTierEnum.optional(),
  expireAt: z.coerce.date().optional(),
  media: z.array(mediaCreateSchema).optional(),
});

export type ListingCreateInput = z.infer<typeof listingCreateSchema>;

export const listingPatchSchema = z
  .object({
    projectId: z.string().uuid().nullable().optional(),
    unitTypeId: z.string().uuid().nullable().optional(),
    transactionType: transactionTypeEnum.optional(),
    propertyType: z.string().min(1).optional(),
    price: z.number().nonnegative().optional(),
    area: z.number().positive().nullable().optional(),
    address: z.string().nullable().optional(),
    province: z.string().min(1).optional(),
    district: z.string().min(1).optional(),
    ward: z.string().nullable().optional(),
    lat: z.number().min(-90).max(90).nullable().optional(),
    lng: z.number().min(-180).max(180).nullable().optional(),
    description: z.string().nullable().optional(),
    status: listingStatusEnum.optional(),
    tier: listingTierEnum.optional(),
    expireAt: z.coerce.date().nullable().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Payload trống — không có gì để cập nhật.",
  });

export const listingListQuerySchema = z.object({
  province: z.string().optional(),
  district: z.string().optional(),
  propertyType: z.string().optional(),
  transactionType: transactionTypeEnum.optional(),
  projectId: z.string().uuid().optional(),
  status: listingStatusEnum.optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const brokerCreateSchema = z.object({
  userAccountId: z.string().uuid(),
  fullName: z.string().min(1),
  phone: z.string().min(1),
  licenseNo: z.string().optional(),
  licenseVerified: z.boolean().optional(),
  brokerType: brokerTypeEnum.optional(),
  tier: listingTierEnum.optional(),
});
