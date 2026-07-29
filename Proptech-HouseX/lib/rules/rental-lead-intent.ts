import { z } from "zod";
import type { RentalLeadIntent } from "@prisma/client";

/** JSON / form — snake lowercase. */
export const rentalLeadIntentInputSchema = z.enum([
  "landlord",
  "tenant",
  "tax_help",
  "need_pm",
]);

export type RentalLeadIntentInput = z.infer<typeof rentalLeadIntentInputSchema>;

const INPUT_TO_PRISMA: Record<RentalLeadIntentInput, RentalLeadIntent> = {
  landlord: "LANDLORD",
  tenant: "TENANT",
  tax_help: "TAX_HELP",
  need_pm: "NEED_PM",
};

const PRISMA_TO_INPUT: Record<RentalLeadIntent, RentalLeadIntentInput> = {
  LANDLORD: "landlord",
  TENANT: "tenant",
  TAX_HELP: "tax_help",
  NEED_PM: "need_pm",
};

export const RENTAL_LEAD_INTENT_LABEL: Record<RentalLeadIntent, string> = {
  LANDLORD: "Chủ nhà — tìm khách",
  TENANT: "Khách thuê",
  TAX_HELP: "Thuế / kế toán cho thuê",
  NEED_PM: "Quan tâm QL sau (waitlist)",
};

export function toPrismaRentalLeadIntent(
  input: RentalLeadIntentInput,
): RentalLeadIntent {
  return INPUT_TO_PRISMA[input];
}

export function fromPrismaRentalLeadIntent(
  intent: RentalLeadIntent | null | undefined,
): RentalLeadIntentInput | null {
  if (!intent) return null;
  return PRISMA_TO_INPUT[intent] ?? null;
}

/** Lead hub thuê không bắt buộc listing/project. */
export function rentalIntentAllowsOrphanLead(
  intent: RentalLeadIntentInput | undefined,
): boolean {
  return (
    intent === "landlord" || intent === "tax_help" || intent === "need_pm"
  );
}
