import { z } from "zod";

const stableId = z.string().trim().min(1).max(128);
const shortText = z.string().trim().min(1).max(160);
const optionalShortText = z.string().trim().max(160).nullish();
const occurredAt = z.coerce.date();
const stableReference = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(
    /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/,
    "Reference must be a stable identifier.",
  );

const commitEvidenceSchema = z
  .object({
    referenceType: z.enum(["UNIT_BOOKING", "DEPOSIT"]),
    referenceId: stableReference,
  })
  .strict();

export const consentCommandSchema = z
  .object({
    subjectType: z.enum(["LEAD", "CUSTOMER"]),
    subjectId: stableId,
    leadId: stableId.nullish(),
    customerId: stableId.nullish(),
    purpose: shortText,
    channel: shortText,
    action: z.enum([
      "GRANTED",
      "DENIED",
      "WITHDRAWN",
      "EXPIRED",
      "SUPERSEDED",
    ]),
    proofType: shortText,
    proofRef: z.string().trim().max(512).nullish(),
    proofMetadata: z.record(z.string(), z.unknown()).default({}),
    policyVersion: shortText,
    actorId: stableId,
    source: shortText,
    occurredAt,
    correlationId: stableId,
  })
  .strict();

export const assignmentCommandSchema = z.discriminatedUnion("action", [
  z
    .object({
      action: z.literal("assign"),
      leadId: stableId,
      ownerId: stableId,
      assignedBy: stableId,
      assignedAt: occurredAt,
      reason: optionalShortText,
      acceptanceSlaMinutes: z.number().int().min(1).max(10_080),
      firstResponseSlaMinutes: z.number().int().min(1).max(10_080),
      correlationId: stableId,
    })
    .strict(),
  z
    .object({
      action: z.enum(["accept", "first_attempt", "first_connected"]),
      assignmentId: stableId,
      actorId: stableId,
      occurredAt,
      correlationId: stableId,
    })
    .strict(),
]);

const nullableMoney = z
  .union([z.string().regex(/^\d+(\.\d{1,2})?$/), z.null()])
  .optional();

export const buyerProfileCommandSchema = z
  .object({
    leadId: stableId,
    budgetMin: nullableMoney,
    budgetMax: nullableMoney,
    availableCash: nullableMoney,
    paymentPreference: optionalShortText,
    locations: z.array(shortText).max(20).default([]),
    propertyTypes: z.array(shortText).max(20).default([]),
    bedroomsMin: z.number().int().min(0).max(20).nullish(),
    purchasePurpose: optionalShortText,
    timeframe: optionalShortText,
    readiness: optionalShortText,
    mustHaves: z.array(shortText).max(30).default([]),
    expectedVersion: z.number().int().positive().optional(),
    updatedBy: stableId,
    correlationId: stableId,
  })
  .strict()
  .refine(
    (input) =>
      input.budgetMin == null ||
      input.budgetMax == null ||
      Number(input.budgetMin) <= Number(input.budgetMax),
    { message: "budgetMin must not exceed budgetMax", path: ["budgetMin"] },
  );

export const buyerMatchCommandSchema = z
  .object({
    leadId: stableId,
    buyerProfileId: stableId,
    opportunityId: stableId.nullish(),
    projectRef: stableId.nullish(),
    listingRef: stableId.nullish(),
    unitRef: stableId.nullish(),
    locationMatched: z.boolean(),
    propertyTypeMatched: z.boolean(),
    bedroomsMatched: z.boolean().nullable(),
    mustHavesMatched: z.number().int().min(0).max(100),
    mustHavesTotal: z.number().int().min(0).max(100),
    inventorySnapshotAt: z.coerce.date().nullable(),
    inventoryAvailable: z.boolean().nullable(),
    presentedAt: z.coerce.date().nullish(),
    response: z
      .enum([
        "NOT_PRESENTED",
        "PRESENTED",
        "INTERESTED",
        "DECLINED",
        "NEEDS_REVIEW",
      ])
      .default("NOT_PRESENTED"),
    rulesVersion: shortText,
    actorId: stableId,
    correlationId: stableId,
  })
  .strict()
  .superRefine((input, context) => {
    if (
      input.inventorySnapshotAt === null &&
      input.inventoryAvailable !== null
    ) {
      context.addIssue({
        code: "custom",
        path: ["inventoryAvailable"],
        message: "Inventory availability requires a snapshot timestamp.",
      });
    }
    if (input.mustHavesMatched > input.mustHavesTotal) {
      context.addIssue({
        code: "custom",
        path: ["mustHavesMatched"],
        message: "Matched must-haves cannot exceed total must-haves.",
      });
    }
    const presented = input.response !== "NOT_PRESENTED";
    if (presented !== Boolean(input.presentedAt)) {
      context.addIssue({
        code: "custom",
        path: ["presentedAt"],
        message: "Presentation timestamp must match response state.",
      });
    }
  });

export const opportunityCommandSchema = z.discriminatedUnion("action", [
  z
    .object({
      action: z.literal("create"),
      leadId: stableId,
      journey: z.enum(["A", "S", "P"]),
      projectRef: stableId.nullish(),
      listingRef: stableId.nullish(),
      unitRef: stableId.nullish(),
      actorId: stableId,
      correlationId: stableId,
    })
    .strict(),
  z
    .object({
      action: z.literal("transition"),
      opportunityId: stableId,
      toStage: z.enum([
        "OPEN",
        "DISCOVERY",
        "ACTIVE",
        "COMMITTED",
        "WON",
        "LOST",
        "CANCELLED",
      ]),
      reason: shortText,
      actorId: stableId,
      occurredAt,
      correlationId: stableId,
      commitEvidence: commitEvidenceSchema.optional(),
    })
    .strict(),
]);

export const activityCommandSchema = z
  .object({
    leadId: stableId,
    opportunityId: stableId.nullish(),
    type: z.enum([
      "CONTACT_ATTEMPT",
      "CONNECTED",
      "NOTE",
      "TASK",
    ]),
    channel: optionalShortText,
    note: z.string().trim().max(4_000).nullish(),
    reason: optionalShortText,
    actorId: stableId,
    occurredAt,
    dueAt: z.coerce.date().nullish(),
    correlationId: stableId,
    metadata: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();

export const appointmentCommandSchema = z.discriminatedUnion("action", [
  z
    .object({
      action: z.literal("create"),
      leadId: stableId,
      opportunityId: stableId.nullish(),
      channel: shortText,
      scheduledAt: occurredAt,
      durationMin: z.number().int().min(5).max(1_440).nullish(),
      nextAction: optionalShortText,
      actorId: stableId,
      correlationId: stableId,
    })
    .strict(),
  z
    .object({
      action: z.literal("transition"),
      appointmentId: stableId,
      toStatus: z.enum([
        "SCHEDULED",
        "RESCHEDULED",
        "COMPLETED",
        "CANCELLED",
        "NO_SHOW",
      ]),
      scheduledAt: z.coerce.date().optional(),
      nextAction: optionalShortText,
      actorId: stableId,
      occurredAt,
      correlationId: stableId,
    })
    .strict(),
]);
