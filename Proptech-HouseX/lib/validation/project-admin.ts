import { z } from "zod";
import {
  projectLandingSchema,
  projectOverviewSchema,
} from "@/lib/content/project-landing";
import {
  projectCreateSchema,
  projectStatusEnum,
  projectTypeEnum,
} from "@/lib/validation/project";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const salesRegionEnum = z.enum(["SOUTH", "CENTRAL", "NORTH"]);
export const leadLaneEnum = z.enum(["ACTIVE_SALE", "PIPELINE_CDT"]);

export const projectAdminSaveSchema = z.object({
  developerId: z.string().uuid(),
  slug: z
    .string()
    .min(1)
    .max(160)
    .regex(slugRegex, "slug phải dạng kebab-case."),
  name: z.string().min(1),
  projectType: projectTypeEnum,
  status: projectStatusEnum,
  province: z.string().min(1),
  district: z.string().min(1),
  ward: z.string().optional(),
  address: z.string().optional(),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
  totalArea: z.number().positive().optional().nullable(),
  density: z.number().nonnegative().optional().nullable(),
  /** Ops — null/omit = tự suy từ province registry khi có. */
  salesRegion: salesRegionEnum.optional().nullable(),
  leadLane: leadLaneEnum.optional().nullable(),
  description: z.string().optional(),
  handoverDate: z.coerce.date().optional().nullable(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  totalUnits: z.number().int().positive().optional().nullable(),
  blocks: z.number().int().positive().optional().nullable(),
  landing: projectLandingSchema,
});

export type ProjectAdminSaveInput = z.infer<typeof projectAdminSaveSchema>;

export const projectCloneSchema = z.object({
  newSlug: z
    .string()
    .min(1)
    .max(160)
    .regex(slugRegex, "slug phải dạng kebab-case."),
  newName: z.string().min(1).optional(),
});

export { projectCreateSchema, projectOverviewSchema };
