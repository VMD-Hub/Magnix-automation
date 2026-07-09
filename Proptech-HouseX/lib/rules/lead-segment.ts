import type { LeadSegment, ProjectType } from "@prisma/client";
import { z } from "zod";

/** JSON từ Mini App / form — lowercase. */
export const leadSegmentInputSchema = z.enum(["noxh", "cctm"]);

export type LeadSegmentInput = z.infer<typeof leadSegmentInputSchema>;

export function toPrismaLeadSegment(input: LeadSegmentInput): LeadSegment {
  return input === "noxh" ? "NOXH" : "CCTM";
}

export function fromPrismaLeadSegment(
  segment: LeadSegment | null | undefined,
): LeadSegmentInput | null {
  if (!segment) return null;
  return segment === "NOXH" ? "noxh" : "cctm";
}

export function projectTypeToLeadSegment(
  projectType: ProjectType,
): LeadSegmentInput {
  return projectType === "NHA_O_XA_HOI" ? "noxh" : "cctm";
}
