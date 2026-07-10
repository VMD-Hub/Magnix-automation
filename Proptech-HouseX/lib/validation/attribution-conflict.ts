import { z } from "zod";

export const attributionConflictListQuerySchema = z.object({
  status: z.enum(["OPEN", "ALL"]).optional().default("OPEN"),
});

export const attributionConflictResolveSchema = z.object({
  resolution: z.enum([
    "KEEP_PLATFORM",
    "RELEASE_TO_CTV",
    "SPLIT_LANE",
    "DISMISS_BOTH",
  ]),
  note: z.string().max(2000).optional(),
});
