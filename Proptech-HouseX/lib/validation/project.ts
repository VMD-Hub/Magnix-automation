import { z } from "zod";

export const projectTypeEnum = z.enum(["THUONG_MAI", "NHA_O_XA_HOI"]);
export const projectStatusEnum = z.enum([
  "SAP_MO_BAN",
  "DANG_BAN",
  "DA_BAN_GIAO",
  "TAM_DUNG",
]);

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const unitTypeCreateSchema = z.object({
  name: z.string().min(1),
  areaMin: z.number().positive().optional(),
  areaMax: z.number().positive().optional(),
  bedrooms: z.number().int().nonnegative().optional(),
  priceFrom: z.number().nonnegative().optional(),
  floorPlanUrl: z.string().url().optional(),
});

const legalDocCreateSchema = z.object({
  docType: z.string().min(1),
  status: z.string().min(1),
  issuedDate: z.coerce.date().optional(),
  fileUrl: z.string().url().optional(),
});

export const projectCreateSchema = z.object({
  developerId: z.string().uuid(),
  slug: z
    .string()
    .min(1)
    .max(160)
    .regex(slugRegex, "slug phải ở dạng kebab-case (a-z, 0-9, dấu gạch ngang)."),
  name: z.string().min(1),
  projectType: projectTypeEnum,
  status: projectStatusEnum.optional(),
  province: z.string().min(1),
  district: z.string().min(1),
  ward: z.string().optional(),
  address: z.string().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  totalArea: z.number().positive().optional(),
  density: z.number().nonnegative().optional(),
  overviewData: z.record(z.string(), z.unknown()).optional(),
  description: z.string().optional(),
  handoverDate: z.coerce.date().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  unitTypes: z.array(unitTypeCreateSchema).optional(),
  legalDocs: z.array(legalDocCreateSchema).optional(),
});

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;

export const projectStatusPatchSchema = z.object({
  status: projectStatusEnum,
});

export const projectListQuerySchema = z.object({
  province: z.string().optional(),
  district: z.string().optional(),
  projectType: projectTypeEnum.optional(),
  status: projectStatusEnum.optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
