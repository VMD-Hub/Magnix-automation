import { z } from "zod";

export const projectUnitStatusEnum = z.enum([
  "AVAILABLE",
  "HELD",
  "BOOKED",
  "DEPOSITED",
  "SOLD",
  "HANDED_OVER",
  "LIQUIDATED",
]);

export const projectUnitListQuerySchema = z.object({
  status: projectUnitStatusEnum.optional(),
  block: z.string().min(1).optional(),
  unitTypeId: z.string().uuid().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  minFloor: z.coerce.number().int().optional(),
  maxFloor: z.coerce.number().int().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(200).default(50),
});

export type ProjectUnitListQuery = z.infer<typeof projectUnitListQuerySchema>;

/** Bộ lọc SSR trên trang `/du-an/[slug]` (query string). */
export const projectInventoryPageFilterSchema = z.object({
  status: projectUnitStatusEnum.optional(),
  block: z.string().min(1).optional(),
});

export type ProjectInventoryPageFilters = z.infer<
  typeof projectInventoryPageFilterSchema
>;

export function parseProjectInventoryPageFilters(
  searchParams: Record<string, string | string[] | undefined>,
): ProjectInventoryPageFilters {
  return projectInventoryPageFilterSchema.parse({
    status:
      typeof searchParams.status === "string" ? searchParams.status : undefined,
    block:
      typeof searchParams.block === "string" ? searchParams.block : undefined,
  });
}
