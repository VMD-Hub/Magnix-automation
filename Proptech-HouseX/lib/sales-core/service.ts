import type {
  AppointmentStatus,
  BuyerMatchResponse,
  ConsentAction,
  ConsentSubjectType,
  OpportunityStage,
  Prisma,
  SalesActivityType,
  SalesJourney,
} from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { enqueueEvent } from "@/lib/events/outbox";
import {
  appointmentTransitionDates,
  assertAppointmentTransition,
  assertBuyerReadyForMatching,
  assertCommitEvidence,
  assertGenericActivityType,
  assertJourneyPConversionEnabled,
  assertMarketingDeliveryAllowed,
  assertMinimizedEventPayload,
  assertNoxhCaseAllowsCommit,
  assertOpportunityTransition,
  assertOutcomeFromCommitted,
  assertOutcomeReasonCode,
  assertPrimaryCommitEvidenceRecord,
  assertProposalFresh,
  assertProposalMatchesCommit,
  assignmentFactDecision,
  assignmentSla,
  calculateProfileCompleteness,
  PROPOSAL_TERMS_VERSION,
  resolveEffectiveConsent,
  scoreBuyerMatch,
  SalesCoreRuleError,
  type AssignmentFact,
  type CommitEvidence,
  type ProposalInventorySnapshot,
} from "./domain";
import { toPrismaJsonObject } from "./json";
import {
  assertProjectAcceptsBookings,
  assertUnitAcceptsBookings,
} from "@/lib/rules/sale-eligibility-gate";

type Tx = Prisma.TransactionClient;

export function isJourneyPG2Enabled(): boolean {
  return process.env.HOUSEX_CONVERSION_G2_JOURNEY_P === "true";
}

function decimalString(value: { toString(): string } | string | number): string {
  return String(value);
}

function proposalInventoryFromUnit(unit: {
  id: string;
  projectId: string;
  code: string;
  status: string;
  price: { toString(): string } | string;
  depositBookingId: string | null;
}): ProposalInventorySnapshot {
  return {
    projectId: unit.projectId,
    unitId: unit.id,
    unitCode: unit.code,
    unitStatus: unit.status,
    price: decimalString(unit.price),
    depositBookingId: unit.depositBookingId,
  };
}

function isUniqueConflict(error: unknown): boolean {
  return (
    error instanceof PrismaClientKnownRequestError && error.code === "P2002"
  );
}

function idempotencyConflict(): never {
  throw new SalesCoreRuleError(
    "IDEMPOTENCY_KEY_REUSED",
    "Idempotency key was already used with different input.",
  );
}

function sameDate(left: Date, right: Date): boolean {
  return left.getTime() === right.getTime();
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => `${JSON.stringify(key)}:${stableJson(nested)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "undefined";
}

function reconciledCommitEvidenceAudit(
  evidence: CommitEvidence,
  reconciledAt: Date,
) {
  return {
    ...evidence,
    authoritativeModel: "UnitBooking",
    reconciliationStatus: "RECONCILED",
    reconciledAt: reconciledAt.toISOString(),
  } as const;
}

async function assertOpportunityBelongsToLead(
  tx: Tx,
  opportunityId: string | null | undefined,
  leadId: string,
): Promise<void> {
  if (!opportunityId) return;
  const opportunity = await tx.opportunity.findUnique({
    where: { id: opportunityId },
    select: { leadId: true },
  });
  if (!opportunity || opportunity.leadId !== leadId) {
    throw new SalesCoreRuleError(
      "OPPORTUNITY_LEAD_MISMATCH",
      "Opportunity must belong to the requested lead.",
    );
  }
}

export type ConsentCommand = {
  subjectType: ConsentSubjectType;
  subjectId: string;
  leadId?: string | null;
  customerId?: string | null;
  purpose: string;
  channel: string;
  action: ConsentAction;
  proofType: string;
  proofRef?: string | null;
  proofMetadata?: Record<string, unknown>;
  policyVersion: string;
  actorId: string;
  source: string;
  occurredAt: Date;
  correlationId: string;
  idempotencyKey: string;
};

function assertConsentSubject(input: ConsentCommand) {
  const validLead =
    input.subjectType === "LEAD" &&
    input.leadId === input.subjectId &&
    !input.customerId;
  const validCustomer =
    input.subjectType === "CUSTOMER" &&
    input.customerId === input.subjectId &&
    !input.leadId;
  if (!validLead && !validCustomer) {
    throw new SalesCoreRuleError(
      "INVALID_CONSENT_SUBJECT",
      "Consent subject and typed relation must identify the same record.",
    );
  }
}

export async function recordConsent(input: ConsentCommand) {
  assertConsentSubject(input);
  const sameInput = (record: {
    subjectType: ConsentSubjectType;
    subjectId: string;
    leadId: string | null;
    customerId: string | null;
    purpose: string;
    channel: string;
    action: ConsentAction;
    proofType: string;
    proofRef: string | null;
    proofMetadata: unknown;
    policyVersion: string;
    actorId: string;
    source: string;
    occurredAt: Date;
    correlationId: string;
  }) =>
    record.subjectType === input.subjectType &&
    record.subjectId === input.subjectId &&
    record.leadId === (input.leadId ?? null) &&
    record.customerId === (input.customerId ?? null) &&
    record.purpose === input.purpose &&
    record.channel === input.channel &&
    record.action === input.action &&
    record.proofType === input.proofType &&
    record.proofRef === (input.proofRef ?? null) &&
    stableJson(record.proofMetadata) ===
      stableJson(input.proofMetadata ?? {}) &&
    record.policyVersion === input.policyVersion &&
    record.actorId === input.actorId &&
    record.source === input.source &&
    sameDate(record.occurredAt, input.occurredAt) &&
    record.correlationId === input.correlationId;

  try {
    return await prisma.$transaction(async (tx) => {
      const prior = await tx.consentRecord.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (prior) {
        if (!sameInput(prior)) idempotencyConflict();
        return { record: prior, created: false };
      }

      const record = await tx.consentRecord.create({
        data: {
          ...input,
          proofMetadata: toPrismaJsonObject(input.proofMetadata ?? {}),
        },
      });
    const common = {
      consentRecordId: record.id,
      subjectType: record.subjectType,
      subjectId: record.subjectId,
      purpose: record.purpose,
      channel: record.channel,
      occurredAt: record.occurredAt.toISOString(),
      correlationId: record.correlationId,
      schemaVersion: 1 as const,
    };
    const envelope = {
      aggregateType: "consent_record",
      aggregateId: record.id,
      correlationId: record.correlationId,
      occurredAt: record.occurredAt,
    };
    if (record.action === "WITHDRAWN") {
      assertMinimizedEventPayload(common);
      await enqueueEvent(
        tx,
        "consent.withdrawn",
        common,
        `consent.withdrawn:${record.id}`,
        envelope,
      );
    } else {
      const payload = { ...common, action: record.action };
      assertMinimizedEventPayload(payload);
      await enqueueEvent(
        tx,
        "consent.recorded",
        payload,
        `consent.recorded:${record.id}`,
        envelope,
      );
    }
      return { record, created: true };
    });
  } catch (error) {
    if (!isUniqueConflict(error)) throw error;
    const prior = await prisma.consentRecord.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (!prior || !sameInput(prior)) idempotencyConflict();
    return { record: prior, created: false };
  }
}

export async function getEffectiveConsent(input: {
  subjectType: ConsentSubjectType;
  subjectId: string;
  purpose: string;
  channel: string;
}) {
  const records = await prisma.consentRecord.findMany({
    where: {
      subjectType: input.subjectType,
      subjectId: input.subjectId,
      purpose: input.purpose,
      channel: input.channel,
    },
    select: {
      purpose: true,
      channel: true,
      action: true,
      occurredAt: true,
      createdAt: true,
    },
    orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
  });
  return resolveEffectiveConsent(records, input.purpose, input.channel);
}

export async function assignLead(input: {
  leadId: string;
  ownerId: string;
  assignedBy: string;
  assignedAt: Date;
  reason?: string | null;
  acceptanceSlaMinutes: number;
  firstResponseSlaMinutes: number;
  correlationId: string;
  idempotencyKey: string;
}) {
  const sla = assignmentSla(
    input.assignedAt,
    input.acceptanceSlaMinutes,
    input.firstResponseSlaMinutes,
  );
  const sameInput = (assignment: {
    leadId: string;
    ownerId: string;
    assignedBy: string;
    assignedAt: Date;
    reason: string | null;
    acceptanceSlaDueAt: Date | null;
    firstResponseSlaDueAt: Date | null;
    correlationId: string;
  }) =>
    assignment.leadId === input.leadId &&
    assignment.ownerId === input.ownerId &&
    assignment.assignedBy === input.assignedBy &&
    sameDate(assignment.assignedAt, input.assignedAt) &&
    assignment.reason === (input.reason ?? null) &&
    assignment.acceptanceSlaDueAt?.getTime() ===
      sla.acceptanceSlaDueAt.getTime() &&
    assignment.firstResponseSlaDueAt?.getTime() ===
      sla.firstResponseSlaDueAt.getTime() &&
    assignment.correlationId === input.correlationId;

  try {
    return await prisma.$transaction(async (tx) => {
      const prior = await tx.leadAssignment.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (prior) {
        if (!sameInput(prior)) idempotencyConflict();
        return { assignment: prior, created: false };
      }
    const active = await tx.leadAssignment.findFirst({
      where: { leadId: input.leadId, status: { in: ["ASSIGNED", "ACCEPTED"] } },
    });
    if (active?.ownerId === input.ownerId) {
      throw new SalesCoreRuleError(
        "ALREADY_ASSIGNED",
        "Lead is already assigned to this owner.",
      );
    }
    if (active) {
      await tx.leadAssignment.update({
        where: { id: active.id },
        data: {
          status: "REASSIGNED",
          closedAt: input.assignedAt,
        },
      });
    }

    const assignment = await tx.leadAssignment.create({
      data: {
        leadId: input.leadId,
        ownerId: input.ownerId,
        assignedBy: input.assignedBy,
        assignedAt: input.assignedAt,
        reason: input.reason,
        correlationId: input.correlationId,
        idempotencyKey: input.idempotencyKey,
        ...sla,
      },
    });
    await tx.lead.update({
      where: { id: input.leadId },
      data: { assignedBrokerId: input.ownerId },
    });
    await enqueueAssignmentEvent(
      tx,
      assignment,
      input.assignedAt,
      "assigned",
      input.idempotencyKey,
      input.correlationId,
    );
      return { assignment, created: true };
    });
  } catch (error) {
    if (!isUniqueConflict(error)) throw error;
    const prior = await prisma.leadAssignment.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (!prior) throw error;
    if (!sameInput(prior)) idempotencyConflict();
    return { assignment: prior, created: false };
  }
}

export async function recordAssignmentFact(input: {
  assignmentId: string;
  fact: AssignmentFact;
  actorId: string;
  occurredAt: Date;
  correlationId: string;
  idempotencyKey: string;
}) {
  const sameInput = (record: {
    assignmentId: string;
    fact: string;
    actorId: string;
    occurredAt: Date;
    correlationId: string;
  }) =>
    record.assignmentId === input.assignmentId &&
    record.fact === input.fact &&
    record.actorId === input.actorId &&
    sameDate(record.occurredAt, input.occurredAt) &&
    record.correlationId === input.correlationId;

  const recoverPrior = async () => {
    const prior = await prisma.leadAssignmentFact.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (!prior) return null;
    if (!sameInput(prior)) idempotencyConflict();
    const assignment = await prisma.leadAssignment.findUnique({
      where: { id: prior.assignmentId },
    });
    if (!assignment) {
      throw new SalesCoreRuleError("NOT_FOUND", "Assignment not found.");
    }
    return { assignment, changed: false as const };
  };

  try {
    return await prisma.$transaction(async (tx) => {
      const prior = await tx.leadAssignmentFact.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (prior) {
        if (!sameInput(prior)) idempotencyConflict();
        const assignment = await tx.leadAssignment.findUniqueOrThrow({
          where: { id: prior.assignmentId },
        });
        return { assignment, changed: false };
      }

      await tx.$queryRaw`
        SELECT "id" FROM "lead_assignments"
        WHERE "id" = ${input.assignmentId}
        FOR UPDATE
      `;
      const assignment = await tx.leadAssignment.findUnique({
        where: { id: input.assignmentId },
      });
      if (!assignment) {
        throw new SalesCoreRuleError("NOT_FOUND", "Assignment not found.");
      }
      const decision = assignmentFactDecision({
        status: assignment.status,
        ownerId: assignment.ownerId,
        actorId: input.actorId,
        fact: input.fact,
        occurredAt: input.occurredAt,
        correlationId: input.correlationId,
        idempotencyKey: input.idempotencyKey,
        recordedFacts: [
          {
            fact: "accept",
            idempotencyKey: assignment.acceptedIdempotencyKey,
            occurredAt: assignment.acceptedAt,
            correlationId: assignment.acceptedCorrelationId,
          },
          {
            fact: "first_attempt",
            idempotencyKey: assignment.firstAttemptIdempotencyKey,
            occurredAt: assignment.firstAttemptAt,
            correlationId: assignment.firstAttemptCorrelationId,
          },
          {
            fact: "first_connected",
            idempotencyKey: assignment.firstConnectedIdempotencyKey,
            occurredAt: assignment.firstConnectedAt,
            correlationId: assignment.firstConnectedCorrelationId,
          },
        ],
      });
      if (decision === "retry") {
        await tx.leadAssignmentFact.create({ data: input });
        return { assignment, changed: false };
      }

      const data =
        input.fact === "accept"
          ? {
              status: "ACCEPTED" as const,
              acceptedAt: input.occurredAt,
              acceptedIdempotencyKey: input.idempotencyKey,
              acceptedCorrelationId: input.correlationId,
            }
          : input.fact === "first_attempt"
            ? {
                firstAttemptAt: input.occurredAt,
                firstAttemptIdempotencyKey: input.idempotencyKey,
                firstAttemptCorrelationId: input.correlationId,
              }
            : {
                firstConnectedAt: input.occurredAt,
                firstConnectedIdempotencyKey: input.idempotencyKey,
                firstConnectedCorrelationId: input.correlationId,
              };
      await tx.leadAssignmentFact.create({ data: input });
      const updated = await tx.leadAssignment.update({
        where: { id: assignment.id },
        data,
      });
      await enqueueAssignmentEvent(
        tx,
        updated,
        input.occurredAt,
        input.fact,
        input.idempotencyKey,
        input.correlationId,
      );
      return { assignment: updated, changed: true };
    });
  } catch (error) {
    if (!isUniqueConflict(error)) throw error;
    const prior = await recoverPrior();
    if (prior) return prior;
    throw error;
  }
}

async function enqueueAssignmentEvent(
  tx: Tx,
  assignment: {
    id: string;
    leadId: string;
    ownerId: string;
    status: "ASSIGNED" | "ACCEPTED" | "RELEASED" | "REASSIGNED";
    correlationId: string;
  },
  occurredAt: Date,
  fact: "assigned" | AssignmentFact,
  factIdempotencyKey: string,
  factCorrelationId: string,
) {
  const payload = {
    assignmentId: assignment.id,
    leadId: assignment.leadId,
    ownerId: assignment.ownerId,
    status: assignment.status,
    occurredAt: occurredAt.toISOString(),
    correlationId: factCorrelationId,
    schemaVersion: 1 as const,
  };
  assertMinimizedEventPayload(payload);
  await enqueueEvent(
    tx,
    "lead.assignment_changed",
    payload,
    `lead.assignment_changed:${assignment.id}:${fact}:${factIdempotencyKey}`,
    {
      aggregateType: "lead_assignment",
      aggregateId: assignment.id,
      correlationId: factCorrelationId,
      occurredAt,
    },
  );
}

export type BuyerProfileCommand = {
  leadId: string;
  budgetMin?: string | null;
  budgetMax?: string | null;
  availableCash?: string | null;
  paymentPreference?: string | null;
  locations?: string[];
  propertyTypes?: string[];
  bedroomsMin?: number | null;
  purchasePurpose?: string | null;
  timeframe?: string | null;
  readiness?: string | null;
  mustHaves?: string[];
  expectedVersion?: number;
  updatedBy: string;
  correlationId: string;
  idempotencyKey: string;
};

export function buyerProfileIdempotencyHash(
  input: BuyerProfileCommand,
): string {
  return createHash("sha256")
    .update(
      stableJson({
        leadId: input.leadId,
        budgetMin: input.budgetMin ?? null,
        budgetMax: input.budgetMax ?? null,
        availableCash: input.availableCash ?? null,
        paymentPreference: input.paymentPreference ?? null,
        locations: input.locations ?? [],
        propertyTypes: input.propertyTypes ?? [],
        bedroomsMin: input.bedroomsMin ?? null,
        purchasePurpose: input.purchasePurpose ?? null,
        timeframe: input.timeframe ?? null,
        readiness: input.readiness ?? null,
        mustHaves: input.mustHaves ?? [],
        expectedVersion: input.expectedVersion ?? null,
        updatedBy: input.updatedBy,
        correlationId: input.correlationId,
      }),
    )
    .digest("hex");
}

export async function upsertBuyerProfile(input: BuyerProfileCommand) {
  const completeness = calculateProfileCompleteness(input);
  const inputHash = buyerProfileIdempotencyHash(input);
  const recoverPrior = async () => {
    const mutation = await prisma.buyerProfileMutation.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (!mutation) return null;
    if (mutation.inputHash !== inputHash) idempotencyConflict();
    const profile = await prisma.buyerProfile.findUnique({
      where: { id: mutation.buyerProfileId },
    });
    if (!profile) {
      throw new SalesCoreRuleError(
        "NOT_FOUND",
        "Buyer profile referenced by idempotency record was not found.",
      );
    }
    return { profile, changed: false as const };
  };

  try {
    return await prisma.$transaction(async (tx) => {
      const priorMutation = await tx.buyerProfileMutation.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (priorMutation) {
        if (priorMutation.inputHash !== inputHash) idempotencyConflict();
        const priorProfile = await tx.buyerProfile.findUnique({
          where: { id: priorMutation.buyerProfileId },
        });
        if (!priorProfile) {
          throw new SalesCoreRuleError(
            "NOT_FOUND",
            "Buyer profile referenced by idempotency record was not found.",
          );
        }
        return { profile: priorProfile, changed: false };
      }

      const current = await tx.buyerProfile.findUnique({
        where: { leadId: input.leadId },
      });
    if (
      current &&
      input.expectedVersion != null &&
      current.version !== input.expectedVersion
    ) {
      throw new SalesCoreRuleError(
        "STALE_PROFILE_VERSION",
        "Buyer profile has changed since it was read.",
      );
    }
    const data = {
      budgetMin: input.budgetMin,
      budgetMax: input.budgetMax,
      availableCash: input.availableCash,
      paymentPreference: input.paymentPreference,
      locations: input.locations ?? [],
      propertyTypes: input.propertyTypes ?? [],
      bedroomsMin: input.bedroomsMin,
      purchasePurpose: input.purchasePurpose,
      timeframe: input.timeframe,
      readiness: input.readiness,
      mustHaves: input.mustHaves ?? [],
      completeness,
      updatedBy: input.updatedBy,
      correlationId: input.correlationId,
      idempotencyKey: input.idempotencyKey,
    };
    let profile;
    if (current) {
      const updated = await tx.buyerProfile.updateMany({
        where: { id: current.id, version: current.version },
        data: { ...data, version: { increment: 1 } },
      });
      if (updated.count !== 1) {
        throw new SalesCoreRuleError(
          "STALE_PROFILE_VERSION",
          "Buyer profile has changed since it was read.",
        );
      }
      profile = await tx.buyerProfile.findUniqueOrThrow({
        where: { id: current.id },
      });
    } else {
      profile = await tx.buyerProfile.create({
        data: { leadId: input.leadId, ...data },
      });
    }
      await tx.buyerProfileMutation.create({
        data: {
          buyerProfileId: profile.id,
          leadId: input.leadId,
          idempotencyKey: input.idempotencyKey,
          inputHash,
          resultVersion: profile.version,
        },
      });
      // Deliberately no generic profile event: budget/cash are restricted financial
      // fields and no approved downstream purpose exists in G1.
      return { profile, changed: true };
    });
  } catch (error) {
    if (!isUniqueConflict(error)) throw error;
    const prior = await recoverPrior();
    if (prior) return prior;
    throw error;
  }
}

export async function createBuyerMatch(input: {
  leadId: string;
  buyerProfileId: string;
  opportunityId?: string | null;
  projectRef?: string | null;
  listingRef?: string | null;
  unitRef?: string | null;
  locationMatched: boolean;
  propertyTypeMatched: boolean;
  bedroomsMatched: boolean | null;
  mustHavesMatched: number;
  mustHavesTotal: number;
  inventorySnapshotAt: Date | null;
  inventoryAvailable: boolean | null;
  presentedAt?: Date | null;
  response: BuyerMatchResponse;
  rulesVersion: string;
  actorId: string;
  correlationId: string;
  idempotencyKey: string;
}) {
  const matchingInput = {
    locationMatched: input.locationMatched,
    propertyTypeMatched: input.propertyTypeMatched,
    bedroomsMatched: input.bedroomsMatched,
    mustHavesMatched: input.mustHavesMatched,
    mustHavesTotal: input.mustHavesTotal,
    inventorySnapshotAt: input.inventorySnapshotAt?.toISOString() ?? null,
    inventoryAvailable: input.inventoryAvailable,
  };
  const sameInput = (match: {
    leadId: string;
    buyerProfileId: string;
    opportunityId: string | null;
    projectRef: string | null;
    listingRef: string | null;
    unitRef: string | null;
    presentedAt: Date | null;
    response: BuyerMatchResponse;
    rulesVersion: string;
    actorId: string;
    correlationId: string;
    scoreBreakdown: unknown;
  }) =>
    match.leadId === input.leadId &&
    match.buyerProfileId === input.buyerProfileId &&
    match.opportunityId === (input.opportunityId ?? null) &&
    match.projectRef === (input.projectRef ?? null) &&
    match.listingRef === (input.listingRef ?? null) &&
    match.unitRef === (input.unitRef ?? null) &&
    (match.presentedAt?.getTime() ?? null) ===
      (input.presentedAt?.getTime() ?? null) &&
    match.response === input.response &&
    match.rulesVersion === input.rulesVersion &&
    match.actorId === input.actorId &&
    match.correlationId === input.correlationId &&
    stableJson(
      (match.scoreBreakdown as Record<string, unknown> | null)?.input,
    ) === stableJson(matchingInput);

  try {
    return await prisma.$transaction(async (tx) => {
    const prior = await tx.buyerMatch.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (prior) {
      if (!sameInput(prior)) idempotencyConflict();
      return { buyerMatch: prior, created: false };
    }

    const profile = await tx.buyerProfile.findUnique({
      where: { id: input.buyerProfileId },
      include: { lead: { select: { id: true, status: true } } },
    });
    if (!profile || profile.leadId !== input.leadId) {
      throw new SalesCoreRuleError(
        "PROFILE_LEAD_MISMATCH",
        "Buyer profile must belong to the requested lead.",
      );
    }
    assertBuyerReadyForMatching({
      leadStatus: profile.lead.status,
      profileCompleteness: profile.completeness,
      readiness: profile.readiness,
    });
    if (input.opportunityId) {
      const opportunity = await tx.opportunity.findUnique({
        where: { id: input.opportunityId },
        select: { leadId: true },
      });
      if (!opportunity || opportunity.leadId !== input.leadId) {
        throw new SalesCoreRuleError(
          "OPPORTUNITY_LEAD_MISMATCH",
          "Opportunity must belong to the requested lead.",
        );
      }
    }

    const scored = scoreBuyerMatch({
      profileCompleteness: profile.completeness,
      locationMatched: input.locationMatched,
      propertyTypeMatched: input.propertyTypeMatched,
      bedroomsMatched: input.bedroomsMatched,
      mustHavesMatched: input.mustHavesMatched,
      mustHavesTotal: input.mustHavesTotal,
      inventorySnapshotAt: input.inventorySnapshotAt,
      inventoryAvailable: input.inventoryAvailable,
    });
    const buyerMatch = await tx.buyerMatch.create({
      data: {
        leadId: input.leadId,
        buyerProfileId: input.buyerProfileId,
        opportunityId: input.opportunityId,
        projectRef: input.projectRef,
        listingRef: input.listingRef,
        unitRef: input.unitRef,
        score: scored.score,
        scoreBreakdown: toPrismaJsonObject({
          ...scored.scoreBreakdown,
          input: matchingInput,
        }),
        reasons: scored.reasons,
        blockers: scored.blockers,
        rulesVersion: input.rulesVersion,
        inventoryCheckedAt: scored.inventoryCheckedAt,
        presentedAt: input.presentedAt,
        response: input.response,
        actorId: input.actorId,
        correlationId: input.correlationId,
        idempotencyKey: input.idempotencyKey,
      },
    });
    const payload = {
      buyerMatchId: buyerMatch.id,
      leadId: buyerMatch.leadId,
      buyerProfileId: buyerMatch.buyerProfileId,
      opportunityId: buyerMatch.opportunityId,
      projectRef: buyerMatch.projectRef,
      listingRef: buyerMatch.listingRef,
      unitRef: buyerMatch.unitRef,
      score: buyerMatch.score,
      reasons: buyerMatch.reasons,
      blockers: buyerMatch.blockers,
      hasInventorySnapshot: buyerMatch.inventoryCheckedAt !== null,
      response: buyerMatch.response,
      correlationId: buyerMatch.correlationId,
      schemaVersion: 1 as const,
    };
    assertMinimizedEventPayload(payload);
    await enqueueEvent(
      tx,
      "buyer.match_recorded",
      payload,
      `buyer.match_recorded:${buyerMatch.id}`,
      {
        aggregateType: "buyer_match",
        aggregateId: buyerMatch.id,
        correlationId: buyerMatch.correlationId,
        occurredAt: buyerMatch.createdAt,
      },
    );
      return { buyerMatch, created: true };
    });
  } catch (error) {
    if (!isUniqueConflict(error)) throw error;
    const prior = await prisma.buyerMatch.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (!prior || !sameInput(prior)) idempotencyConflict();
    return { buyerMatch: prior, created: false };
  }
}

export async function createOpportunity(input: {
  leadId: string;
  journey: SalesJourney;
  projectRef?: string | null;
  listingRef?: string | null;
  unitRef?: string | null;
  actorId: string;
  correlationId: string;
  idempotencyKey: string;
}) {
  const sameInput = (opportunity: {
    leadId: string;
    journey: SalesJourney;
    projectRef: string | null;
    listingRef: string | null;
    unitRef: string | null;
    actorId: string;
    correlationId: string;
  }) =>
    opportunity.leadId === input.leadId &&
    opportunity.journey === input.journey &&
    opportunity.projectRef === (input.projectRef ?? null) &&
    opportunity.listingRef === (input.listingRef ?? null) &&
    opportunity.unitRef === (input.unitRef ?? null) &&
    opportunity.actorId === input.actorId &&
    opportunity.correlationId === input.correlationId;
  try {
    return await prisma.$transaction(async (tx) => {
    const prior = await tx.opportunity.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (prior) {
      if (!sameInput(prior)) idempotencyConflict();
      return { opportunity: prior, created: false };
    }
    const opportunity = await tx.opportunity.create({ data: input });
    const payload = {
      opportunityId: opportunity.id,
      leadId: opportunity.leadId,
      journey: opportunity.journey,
      stage: "OPEN" as const,
      correlationId: opportunity.correlationId,
      schemaVersion: 1 as const,
    };
    assertMinimizedEventPayload(payload);
    await enqueueEvent(
      tx,
      "opportunity.created",
      payload,
      `opportunity.created:${opportunity.id}`,
      {
        aggregateType: "opportunity",
        aggregateId: opportunity.id,
        correlationId: opportunity.correlationId,
        occurredAt: opportunity.createdAt,
      },
    );
      return { opportunity, created: true };
    });
  } catch (error) {
    if (!isUniqueConflict(error)) throw error;
    const prior = await prisma.opportunity.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (!prior || !sameInput(prior)) idempotencyConflict();
    return { opportunity: prior, created: false };
  }
}

export async function transitionOpportunity(input: {
  opportunityId: string;
  toStage: OpportunityStage;
  reason: string;
  actorId: string;
  occurredAt: Date;
  correlationId: string;
  idempotencyKey: string;
  commitEvidence?: CommitEvidence;
  proposalId?: string;
}) {
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`
      SELECT "id" FROM "opportunities"
      WHERE "id" = ${input.opportunityId}
      FOR UPDATE
    `;
    const priorActivity = await tx.salesActivity.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    const current = await tx.opportunity.findUnique({
      where: { id: input.opportunityId },
    });
    if (!current) throw new SalesCoreRuleError("NOT_FOUND", "Opportunity not found.");
    if (priorActivity) {
      const priorMeta =
        priorActivity.metadata &&
        typeof priorActivity.metadata === "object" &&
        !Array.isArray(priorActivity.metadata)
          ? (priorActivity.metadata as Record<string, unknown>)
          : {};
      const priorCommitEvidence = priorMeta.commitEvidence;
      const priorProposalId = priorMeta.proposalId;
      if (
        priorActivity.type !== "STATE_TRANSITION" ||
        priorActivity.opportunityId !== input.opportunityId ||
        priorActivity.toState !== input.toStage ||
        priorActivity.reason !== input.reason ||
        priorActivity.actorId !== input.actorId ||
        !sameDate(priorActivity.occurredAt, input.occurredAt) ||
        priorActivity.correlationId !== input.correlationId ||
        stableJson(priorCommitEvidence) !==
          stableJson(
            input.commitEvidence
              ? reconciledCommitEvidenceAudit(
                  input.commitEvidence,
                  input.occurredAt,
                )
              : undefined,
          ) ||
        String(priorProposalId ?? "") !== String(input.proposalId ?? "")
      ) {
        idempotencyConflict();
      }
      return { opportunity: current, changed: false };
    }

    assertOpportunityTransition(current.stage, input.toStage);
    assertCommitEvidence({
      journey: current.journey,
      from: current.stage,
      to: input.toStage,
      evidence: input.commitEvidence,
    });
    let commitEvidenceMetadata:
      | ReturnType<typeof reconciledCommitEvidenceAudit>
      | undefined;
    let proposalMetadata: { proposalId: string } | undefined;
    if (current.stage === "ACTIVE" && input.toStage === "COMMITTED") {
      const evidence = input.commitEvidence;
      if (!evidence) {
        throw new SalesCoreRuleError(
          "COMMIT_EVIDENCE_REQUIRED",
          "ACTIVE to COMMITTED requires commit evidence.",
        );
      }
      const g2Enabled = isJourneyPG2Enabled();
      if (!g2Enabled && input.proposalId) {
        throw new SalesCoreRuleError(
          "FEATURE_DISABLED",
          "Journey P conversion G2 is disabled.",
        );
      }
      if (g2Enabled && current.journey === "P" && !input.proposalId) {
        throw new SalesCoreRuleError(
          "PROPOSAL_REQUIRED",
          "ACTIVE to COMMITTED on Journey P requires a fresh proposal snapshot.",
        );
      }

      await tx.$queryRaw`
        SELECT "id" FROM "unit_bookings"
        WHERE "id" = ${evidence.referenceId}
        FOR SHARE
      `;
      const [lead, booking] = await Promise.all([
        tx.lead.findUnique({
          where: { id: current.leadId },
          select: {
            customerId: true,
            projectId: true,
            noxhCases: {
              where: { caseStatus: { not: "COMPLETED" } },
              orderBy: { createdAt: "desc" },
              take: 1,
              select: { caseStatus: true },
            },
          },
        }),
        tx.unitBooking.findUnique({
          where: { id: evidence.referenceId },
          select: {
            id: true,
            status: true,
            customerId: true,
            projectId: true,
            unitId: true,
            unit: {
              select: {
                id: true,
                projectId: true,
                code: true,
                status: true,
                price: true,
                depositBookingId: true,
              },
            },
          },
        }),
      ]);
      if (!lead || !booking) {
        throw new SalesCoreRuleError(
          "COMMIT_EVIDENCE_NOT_FOUND",
          "Authoritative commit evidence was not found.",
        );
      }
      assertPrimaryCommitEvidenceRecord({
        evidence,
        leadCustomerId: lead.customerId,
        leadProjectId: lead.projectId,
        opportunityProjectRef: current.projectRef,
        opportunityUnitRef: current.unitRef,
        record: {
          id: booking.id,
          status: booking.status,
          customerId: booking.customerId,
          projectId: booking.projectId,
          unitId: booking.unitId,
          unitDepositBookingId: booking.unit.depositBookingId,
        },
      });

      if (g2Enabled && current.journey === "P") {
        const proposalId = input.proposalId!;
        const snapshot = await tx.proposalSnapshot.findUnique({
          where: { id: proposalId },
        });
        if (
          !snapshot ||
          snapshot.opportunityId !== current.id ||
          snapshot.leadId !== current.leadId ||
          snapshot.journey !== "P"
        ) {
          throw new SalesCoreRuleError(
            "PROPOSAL_NOT_FOUND",
            "Proposal snapshot was not found for this opportunity.",
          );
        }
        const snapshotInventory: ProposalInventorySnapshot = {
          projectId: snapshot.projectRef,
          unitId: snapshot.unitRef,
          unitCode: snapshot.unitCode,
          unitStatus: snapshot.unitStatus,
          price: decimalString(snapshot.price),
          depositBookingId: snapshot.depositBookingIdAtSnapshot,
        };
        assertProposalFresh({
          snapshot: snapshotInventory,
          current: proposalInventoryFromUnit(booking.unit),
        });
        assertProposalMatchesCommit({
          snapshot: snapshotInventory,
          bookingProjectId: booking.projectId,
          bookingUnitId: booking.unitId,
        });
        assertNoxhCaseAllowsCommit(lead.noxhCases[0]?.caseStatus);
        proposalMetadata = { proposalId };
      }

      commitEvidenceMetadata = reconciledCommitEvidenceAudit(
        evidence,
        input.occurredAt,
      );
    }
    const activity = await tx.salesActivity.create({
      data: {
        leadId: current.leadId,
        opportunityId: current.id,
        type: "STATE_TRANSITION",
        fromState: current.stage,
        toState: input.toStage,
        reason: input.reason,
        actorId: input.actorId,
        occurredAt: input.occurredAt,
        correlationId: input.correlationId,
        idempotencyKey: input.idempotencyKey,
        metadata: {
          ...(commitEvidenceMetadata
            ? { commitEvidence: commitEvidenceMetadata }
            : {}),
          ...(proposalMetadata ?? {}),
        },
      },
    });
    const opportunity = await tx.opportunity.update({
      where: { id: current.id },
      data: { stage: input.toStage, reason: input.reason },
    });
    const payload = {
      opportunityId: opportunity.id,
      leadId: opportunity.leadId,
      journey: opportunity.journey,
      fromStage: current.stage,
      toStage: opportunity.stage,
      correlationId: input.correlationId,
      schemaVersion: 1 as const,
    };
    assertMinimizedEventPayload(payload);
    await enqueueEvent(
      tx,
      "opportunity.stage_changed",
      payload,
      `opportunity.stage_changed:${activity.id}`,
      {
        aggregateType: "opportunity",
        aggregateId: opportunity.id,
        correlationId: input.correlationId,
        occurredAt: input.occurredAt,
      },
    );
    return { opportunity, changed: true };
  });
}

export async function createProposalSnapshot(input: {
  opportunityId: string;
  unitRef: string;
  buyerMatchId?: string | null;
  actorId: string;
  correlationId: string;
  idempotencyKey: string;
  generatedAt?: Date;
}) {
  assertJourneyPConversionEnabled(isJourneyPG2Enabled());
  const generatedAt = input.generatedAt ?? new Date();
  const sameInput = (row: {
    opportunityId: string;
    leadId: string;
    journey: SalesJourney;
    projectRef: string;
    unitRef: string;
    buyerMatchId: string | null;
    actorId: string;
    correlationId: string;
  }) =>
    row.opportunityId === input.opportunityId &&
    row.unitRef === input.unitRef &&
    row.buyerMatchId === (input.buyerMatchId ?? null) &&
    row.actorId === input.actorId &&
    row.correlationId === input.correlationId;

  try {
    return await prisma.$transaction(async (tx) => {
      const prior = await tx.proposalSnapshot.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (prior) {
        if (!sameInput(prior)) idempotencyConflict();
        return { proposal: prior, created: false };
      }

      const opportunity = await tx.opportunity.findUnique({
        where: { id: input.opportunityId },
      });
      if (!opportunity) {
        throw new SalesCoreRuleError("NOT_FOUND", "Opportunity not found.");
      }
      if (opportunity.journey !== "P") {
        throw new SalesCoreRuleError(
          "PROPOSAL_JOURNEY_MISMATCH",
          "Proposal snapshots are only supported for Journey P.",
        );
      }

      await tx.$queryRaw`
        SELECT "id" FROM "project_units"
        WHERE "id" = ${input.unitRef}
        FOR SHARE
      `;
      const unit = await tx.projectUnit.findUnique({
        where: { id: input.unitRef },
        select: {
          id: true,
          projectId: true,
          code: true,
          status: true,
          price: true,
          depositBookingId: true,
          deletedAt: true,
          project: { select: { status: true, projectType: true } },
        },
      });
      if (!unit || unit.deletedAt) {
        throw new SalesCoreRuleError("NOT_FOUND", "Project unit not found.");
      }
      const projectGate = assertProjectAcceptsBookings({
        projectStatus: unit.project.status,
        projectType: unit.project.projectType,
      });
      if (!projectGate.ok) {
        throw new SalesCoreRuleError(projectGate.code, projectGate.message);
      }
      const unitGate = assertUnitAcceptsBookings(unit.status);
      if (!unitGate.ok) {
        throw new SalesCoreRuleError(unitGate.code, unitGate.message);
      }
      if (
        opportunity.projectRef &&
        opportunity.projectRef !== unit.projectId
      ) {
        throw new SalesCoreRuleError(
          "PROPOSAL_PROJECT_MISMATCH",
          "Unit project must match opportunity projectRef.",
        );
      }
      if (opportunity.unitRef && opportunity.unitRef !== unit.id) {
        throw new SalesCoreRuleError(
          "PROPOSAL_UNIT_MISMATCH",
          "Unit must match opportunity unitRef.",
        );
      }
      if (input.buyerMatchId) {
        const match = await tx.buyerMatch.findUnique({
          where: { id: input.buyerMatchId },
          select: { leadId: true, opportunityId: true },
        });
        if (
          !match ||
          match.leadId !== opportunity.leadId ||
          (match.opportunityId &&
            match.opportunityId !== opportunity.id)
        ) {
          throw new SalesCoreRuleError(
            "BUYER_MATCH_MISMATCH",
            "Buyer match must belong to the opportunity lead.",
          );
        }
      }

      const proposal = await tx.proposalSnapshot.create({
        data: {
          opportunityId: opportunity.id,
          leadId: opportunity.leadId,
          journey: "P",
          projectRef: unit.projectId,
          unitRef: unit.id,
          buyerMatchId: input.buyerMatchId ?? null,
          unitCode: unit.code,
          unitStatus: unit.status,
          price: unit.price,
          currency: "VND",
          depositBookingIdAtSnapshot: unit.depositBookingId,
          termsVersion: PROPOSAL_TERMS_VERSION,
          inventoryCheckedAt: generatedAt,
          generatedAt,
          actorId: input.actorId,
          correlationId: input.correlationId,
          idempotencyKey: input.idempotencyKey,
        },
      });
      return { proposal, created: true };
    });
  } catch (error) {
    if (!isUniqueConflict(error)) throw error;
    const prior = await prisma.proposalSnapshot.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (!prior || !sameInput(prior)) idempotencyConflict();
    return { proposal: prior, created: false };
  }
}

export async function listProposalSnapshots(opportunityId: string) {
  assertJourneyPConversionEnabled(isJourneyPG2Enabled());
  return prisma.proposalSnapshot.findMany({
    where: { opportunityId },
    orderBy: { createdAt: "desc" },
  });
}

export async function recordConversionOutcome(input: {
  opportunityId: string;
  result: "WON" | "LOST";
  reasonCode: string;
  reasonDetail?: string | null;
  referenceType: "UNIT_BOOKING" | "DEPOSIT";
  referenceId: string;
  value?: string | null;
  currency?: string | null;
  referralId?: string | null;
  brokerId?: string | null;
  actorId: string;
  occurredAt: Date;
  correlationId: string;
  idempotencyKey: string;
}) {
  assertJourneyPConversionEnabled(isJourneyPG2Enabled());
  assertOutcomeReasonCode(input.result, input.reasonCode);

  const sameInput = (row: {
    opportunityId: string;
    result: string;
    reasonCode: string;
    reasonDetail: string | null;
    referenceType: string;
    referenceId: string;
    value: { toString(): string } | null;
    currency: string | null;
    referralId: string | null;
    brokerId: string | null;
    actorId: string;
    occurredAt: Date;
    correlationId: string;
  }) =>
    row.opportunityId === input.opportunityId &&
    row.result === input.result &&
    row.reasonCode === input.reasonCode &&
    row.reasonDetail === (input.reasonDetail ?? null) &&
    row.referenceType === input.referenceType &&
    row.referenceId === input.referenceId &&
    (row.value == null ? null : decimalString(row.value)) ===
      (input.value ?? null) &&
    row.currency === (input.currency ?? null) &&
    row.referralId === (input.referralId ?? null) &&
    row.brokerId === (input.brokerId ?? null) &&
    row.actorId === input.actorId &&
    sameDate(row.occurredAt, input.occurredAt) &&
    row.correlationId === input.correlationId;

  try {
    return await prisma.$transaction(async (tx) => {
      const prior = await tx.conversionOutcome.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (prior) {
        if (!sameInput(prior)) idempotencyConflict();
        const opportunity = await tx.opportunity.findUniqueOrThrow({
          where: { id: prior.opportunityId },
        });
        return { outcome: prior, opportunity, created: false };
      }

      await tx.$queryRaw`
        SELECT "id" FROM "opportunities"
        WHERE "id" = ${input.opportunityId}
        FOR UPDATE
      `;
      const opportunity = await tx.opportunity.findUnique({
        where: { id: input.opportunityId },
      });
      if (!opportunity) {
        throw new SalesCoreRuleError("NOT_FOUND", "Opportunity not found.");
      }
      if (opportunity.journey !== "P") {
        throw new SalesCoreRuleError(
          "OUTCOME_JOURNEY_MISMATCH",
          "Conversion outcomes in this slice are Journey P only.",
        );
      }
      assertOutcomeFromCommitted(opportunity.stage, input.result);

      const existingOutcome = await tx.conversionOutcome.findUnique({
        where: { opportunityId: opportunity.id },
      });
      if (existingOutcome) {
        throw new SalesCoreRuleError(
          "OUTCOME_ALREADY_RECORDED",
          "Opportunity already has a terminal conversion outcome.",
        );
      }

      await tx.$queryRaw`
        SELECT "id" FROM "unit_bookings"
        WHERE "id" = ${input.referenceId}
        FOR SHARE
      `;
      const [lead, booking] = await Promise.all([
        tx.lead.findUnique({
          where: { id: opportunity.leadId },
          select: { customerId: true, projectId: true },
        }),
        tx.unitBooking.findUnique({
          where: { id: input.referenceId },
          select: {
            id: true,
            status: true,
            customerId: true,
            projectId: true,
            unitId: true,
            referralId: true,
            brokerId: true,
            unit: {
              select: {
                price: true,
                depositBookingId: true,
              },
            },
          },
        }),
      ]);
      if (!lead || !booking) {
        throw new SalesCoreRuleError(
          "OUTCOME_REFERENCE_NOT_FOUND",
          "Commercial reference was not found.",
        );
      }
      assertPrimaryCommitEvidenceRecord({
        evidence: {
          referenceType: input.referenceType,
          referenceId: input.referenceId,
        },
        leadCustomerId: lead.customerId,
        leadProjectId: lead.projectId,
        opportunityProjectRef: opportunity.projectRef,
        opportunityUnitRef: opportunity.unitRef,
        record: {
          id: booking.id,
          status: booking.status,
          customerId: booking.customerId,
          projectId: booking.projectId,
          unitId: booking.unitId,
          unitDepositBookingId: booking.unit.depositBookingId,
        },
      });

      const resolvedValue =
        input.value ??
        (input.result === "WON" ? decimalString(booking.unit.price) : null);
      const resolvedCurrency =
        input.currency ?? (resolvedValue != null ? "VND" : null);
      if (
        resolvedValue != null &&
        decimalString(booking.unit.price) !== resolvedValue
      ) {
        throw new SalesCoreRuleError(
          "OUTCOME_VALUE_MISMATCH",
          "Outcome value must reconcile to unit price.",
        );
      }

      const activity = await tx.salesActivity.create({
        data: {
          leadId: opportunity.leadId,
          opportunityId: opportunity.id,
          type: "STATE_TRANSITION",
          fromState: opportunity.stage,
          toState: input.result,
          reason: input.reasonCode,
          actorId: input.actorId,
          occurredAt: input.occurredAt,
          correlationId: input.correlationId,
          idempotencyKey: `${input.idempotencyKey}:stage`,
          metadata: {
            outcomeReference: {
              referenceType: input.referenceType,
              referenceId: input.referenceId,
            },
          },
        },
      });
      const updated = await tx.opportunity.update({
        where: { id: opportunity.id },
        data: { stage: input.result, reason: input.reasonCode },
      });
      const outcome = await tx.conversionOutcome.create({
        data: {
          opportunityId: opportunity.id,
          leadId: opportunity.leadId,
          journey: "P",
          result: input.result,
          reasonCode: input.reasonCode,
          reasonDetail: input.reasonDetail ?? null,
          referenceType: input.referenceType,
          referenceId: input.referenceId,
          value: resolvedValue,
          currency: resolvedCurrency,
          referralId: input.referralId ?? booking.referralId,
          brokerId: input.brokerId ?? booking.brokerId,
          actorId: input.actorId,
          correlationId: input.correlationId,
          idempotencyKey: input.idempotencyKey,
          occurredAt: input.occurredAt,
        },
      });

      const stagePayload = {
        opportunityId: updated.id,
        leadId: updated.leadId,
        journey: updated.journey,
        fromStage: opportunity.stage,
        toStage: updated.stage,
        correlationId: input.correlationId,
        schemaVersion: 1 as const,
      };
      assertMinimizedEventPayload(stagePayload);
      await enqueueEvent(
        tx,
        "opportunity.stage_changed",
        stagePayload,
        `opportunity.stage_changed:${activity.id}`,
        {
          aggregateType: "opportunity",
          aggregateId: updated.id,
          correlationId: input.correlationId,
          occurredAt: input.occurredAt,
        },
      );

      const outcomePayload = {
        outcomeId: outcome.id,
        opportunityId: outcome.opportunityId,
        leadId: outcome.leadId,
        journey: outcome.journey,
        reasonCode: outcome.reasonCode,
        referenceType: outcome.referenceType,
        referenceId: outcome.referenceId,
        hasValue: outcome.value != null,
        correlationId: outcome.correlationId,
        schemaVersion: 1 as const,
      };
      assertMinimizedEventPayload(outcomePayload);
      const eventType =
        input.result === "WON" ? "conversion.won" : "conversion.lost";
      await enqueueEvent(
        tx,
        eventType,
        outcomePayload,
        `${eventType}:${outcome.id}`,
        {
          aggregateType: "conversion_outcome",
          aggregateId: outcome.id,
          correlationId: input.correlationId,
          occurredAt: input.occurredAt,
        },
      );

      return { outcome, opportunity: updated, created: true };
    });
  } catch (error) {
    if (!isUniqueConflict(error)) throw error;
    const prior = await prisma.conversionOutcome.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (!prior || !sameInput(prior)) idempotencyConflict();
    const opportunity = await prisma.opportunity.findUniqueOrThrow({
      where: { id: prior.opportunityId },
    });
    return { outcome: prior, opportunity, created: false };
  }
}

export async function getConversionFunnel(input?: { journey?: SalesJourney }) {
  assertJourneyPConversionEnabled(isJourneyPG2Enabled());
  const journey = input?.journey ?? "P";
  const [stages, outcomes] = await Promise.all([
    prisma.opportunity.groupBy({
      by: ["stage"],
      where: { journey },
      _count: { _all: true },
    }),
    prisma.conversionOutcome.groupBy({
      by: ["result"],
      where: { journey },
      _count: { _all: true },
    }),
  ]);
  return {
    journey,
    stages: Object.fromEntries(
      stages.map((row) => [row.stage, row._count._all]),
    ),
    outcomes: Object.fromEntries(
      outcomes.map((row) => [row.result, row._count._all]),
    ),
  };
}

export async function listOpportunities(input: {
  journey?: SalesJourney;
  stage?: OpportunityStage;
  limit?: number;
}) {
  assertJourneyPConversionEnabled(isJourneyPG2Enabled());
  const limit = Math.min(Math.max(input.limit ?? 50, 1), 100);
  const items = await prisma.opportunity.findMany({
    where: {
      ...(input.journey ? { journey: input.journey } : {}),
      ...(input.stage ? { stage: input.stage } : {}),
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      leadId: true,
      journey: true,
      stage: true,
      projectRef: true,
      listingRef: true,
      unitRef: true,
      reason: true,
      updatedAt: true,
      createdAt: true,
    },
  });
  return { items, limit };
}

export async function getOpportunitySummary(opportunityId: string) {
  assertJourneyPConversionEnabled(isJourneyPG2Enabled());
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    select: {
      id: true,
      leadId: true,
      journey: true,
      stage: true,
      projectRef: true,
      listingRef: true,
      unitRef: true,
      reason: true,
      updatedAt: true,
      createdAt: true,
    },
  });
  if (!opportunity) {
    throw new SalesCoreRuleError("NOT_FOUND", "Opportunity not found.");
  }
  const [proposals, outcome] = await Promise.all([
    prisma.proposalSnapshot.findMany({
      where: { opportunityId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        projectRef: true,
        unitRef: true,
        unitCode: true,
        unitStatus: true,
        price: true,
        currency: true,
        termsVersion: true,
        generatedAt: true,
        createdAt: true,
      },
    }),
    prisma.conversionOutcome.findUnique({
      where: { opportunityId },
      select: {
        id: true,
        result: true,
        reasonCode: true,
        referenceType: true,
        referenceId: true,
        value: true,
        currency: true,
        occurredAt: true,
      },
    }),
  ]);
  return {
    opportunity,
    proposals: proposals.map((row) => ({
      ...row,
      price: String(row.price),
    })),
    outcome: outcome
      ? {
          id: outcome.id,
          result: outcome.result,
          reasonCode: outcome.reasonCode,
          referenceType: outcome.referenceType,
          referenceId: outcome.referenceId,
          hasValue: outcome.value != null,
          currency: outcome.currency,
          occurredAt: outcome.occurredAt,
        }
      : null,
  };
}

export async function listSalesActivitiesForLead(leadId: string, take = 40) {
  return prisma.salesActivity.findMany({
    where: { leadId },
    orderBy: { occurredAt: "desc" },
    take,
    select: {
      id: true,
      type: true,
      channel: true,
      note: true,
      reason: true,
      actorId: true,
      occurredAt: true,
      dueAt: true,
      createdAt: true,
    },
  });
}

export async function appendSalesActivity(input: {
  leadId: string;
  opportunityId?: string | null;
  type: SalesActivityType;
  channel?: string | null;
  note?: string | null;
  reason?: string | null;
  actorId: string;
  occurredAt: Date;
  dueAt?: Date | null;
  correlationId: string;
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
}) {
  assertGenericActivityType(input.type);
  const sameInput = (activity: {
    leadId: string;
    opportunityId: string | null;
    type: SalesActivityType;
    channel: string | null;
    note: string | null;
    reason: string | null;
    actorId: string;
    occurredAt: Date;
    dueAt: Date | null;
    correlationId: string;
    metadata: unknown;
  }) =>
    activity.leadId === input.leadId &&
    activity.opportunityId === (input.opportunityId ?? null) &&
    activity.type === input.type &&
    activity.channel === (input.channel ?? null) &&
    activity.note === (input.note ?? null) &&
    activity.reason === (input.reason ?? null) &&
    activity.actorId === input.actorId &&
    sameDate(activity.occurredAt, input.occurredAt) &&
    (activity.dueAt?.getTime() ?? null) === (input.dueAt?.getTime() ?? null) &&
    activity.correlationId === input.correlationId &&
    stableJson(activity.metadata) === stableJson(input.metadata ?? {});
  try {
    return await prisma.$transaction(async (tx) => {
    const prior = await tx.salesActivity.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (prior) {
      if (!sameInput(prior)) idempotencyConflict();
      return { activity: prior, created: false };
    }
    await assertOpportunityBelongsToLead(
      tx,
      input.opportunityId,
      input.leadId,
    );
    const activity = await tx.salesActivity.create({
      data: {
        ...input,
        metadata: toPrismaJsonObject(input.metadata ?? {}),
      },
    });
    const payload = {
      activityId: activity.id,
      leadId: activity.leadId,
      opportunityId: activity.opportunityId,
      type: activity.type,
      channel: activity.channel,
      occurredAt: activity.occurredAt.toISOString(),
      correlationId: activity.correlationId,
      schemaVersion: 1 as const,
    };
    assertMinimizedEventPayload(payload);
    await enqueueEvent(
      tx,
      "sales.activity_recorded",
      payload,
      `sales.activity_recorded:${activity.id}`,
      {
        aggregateType: "sales_activity",
        aggregateId: activity.id,
        correlationId: activity.correlationId,
        occurredAt: activity.occurredAt,
      },
    );
      return { activity, created: true };
    });
  } catch (error) {
    if (!isUniqueConflict(error)) throw error;
    const prior = await prisma.salesActivity.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (!prior || !sameInput(prior)) idempotencyConflict();
    return { activity: prior, created: false };
  }
}

export async function createAppointment(input: {
  leadId: string;
  opportunityId?: string | null;
  channel: string;
  scheduledAt: Date;
  durationMin?: number | null;
  nextAction?: string | null;
  actorId: string;
  correlationId: string;
  idempotencyKey: string;
}) {
  const sameInput = (appointment: {
    leadId: string;
    opportunityId: string | null;
    channel: string;
    scheduledAt: Date;
    durationMin: number | null;
    nextAction: string | null;
    actorId: string;
    correlationId: string;
  }) =>
    appointment.leadId === input.leadId &&
    appointment.opportunityId === (input.opportunityId ?? null) &&
    appointment.channel === input.channel &&
    sameDate(appointment.scheduledAt, input.scheduledAt) &&
    appointment.durationMin === (input.durationMin ?? null) &&
    appointment.nextAction === (input.nextAction ?? null) &&
    appointment.actorId === input.actorId &&
    appointment.correlationId === input.correlationId;
  try {
    return await prisma.$transaction(async (tx) => {
    const prior = await tx.appointment.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (prior) {
      if (!sameInput(prior)) idempotencyConflict();
      return { appointment: prior, created: false };
    }
    await assertOpportunityBelongsToLead(
      tx,
      input.opportunityId,
      input.leadId,
    );
    const appointment = await tx.appointment.create({ data: input });
    await enqueueAppointmentEvent(
      tx,
      appointment,
      appointment.createdAt,
      `created:${input.idempotencyKey}`,
    );
      return { appointment, created: true };
    });
  } catch (error) {
    if (!isUniqueConflict(error)) throw error;
    const prior = await prisma.appointment.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (!prior || !sameInput(prior)) idempotencyConflict();
    return { appointment: prior, created: false };
  }
}

export async function transitionAppointment(input: {
  appointmentId: string;
  toStatus: AppointmentStatus;
  scheduledAt?: Date;
  nextAction?: string | null;
  actorId: string;
  occurredAt: Date;
  correlationId: string;
  idempotencyKey: string;
}) {
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`
      SELECT "id" FROM "appointments"
      WHERE "id" = ${input.appointmentId}
      FOR UPDATE
    `;
    const prior = await tx.salesActivity.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    const current = await tx.appointment.findUnique({
      where: { id: input.appointmentId },
    });
    if (!current) throw new SalesCoreRuleError("NOT_FOUND", "Appointment not found.");
    if (prior) {
      const appointmentId =
        prior.metadata &&
        typeof prior.metadata === "object" &&
        !Array.isArray(prior.metadata)
          ? (prior.metadata as Record<string, unknown>).appointmentId
          : null;
      const transitionInput =
        prior.metadata &&
        typeof prior.metadata === "object" &&
        !Array.isArray(prior.metadata)
          ? (prior.metadata as Record<string, unknown>).transitionInput
          : null;
      if (
        prior.type !== "APPOINTMENT_UPDATED" ||
        appointmentId !== input.appointmentId ||
        prior.toState !== input.toStatus ||
        prior.actorId !== input.actorId ||
        !sameDate(prior.occurredAt, input.occurredAt) ||
        prior.correlationId !== input.correlationId ||
        stableJson(transitionInput) !==
          stableJson({
            scheduledAt: input.scheduledAt?.toISOString() ?? null,
            nextAction: input.nextAction ?? null,
          })
      ) {
        idempotencyConflict();
      }
      return { appointment: current, changed: false };
    }
    assertAppointmentTransition(current.status, input.toStatus);
    if (input.toStatus === "RESCHEDULED" && !input.scheduledAt) {
      throw new SalesCoreRuleError(
        "SCHEDULE_REQUIRED",
        "Rescheduling requires a new scheduled time.",
      );
    }
    const appointment = await tx.appointment.update({
      where: { id: current.id },
      data: {
        status: input.toStatus,
        scheduledAt: input.scheduledAt,
        nextAction: input.nextAction,
        actorId: input.actorId,
        correlationId: input.correlationId,
        ...appointmentTransitionDates(input.toStatus, input.occurredAt),
      },
    });
    await tx.salesActivity.create({
      data: {
        leadId: current.leadId,
        opportunityId: current.opportunityId,
        type: "APPOINTMENT_UPDATED",
        fromState: current.status,
        toState: input.toStatus,
        actorId: input.actorId,
        occurredAt: input.occurredAt,
        correlationId: input.correlationId,
        idempotencyKey: input.idempotencyKey,
        metadata: {
          appointmentId: current.id,
          transitionInput: {
            scheduledAt: input.scheduledAt?.toISOString() ?? null,
            nextAction: input.nextAction ?? null,
          },
        },
      },
    });
    await enqueueAppointmentEvent(
      tx,
      appointment,
      input.occurredAt,
      `transition:${input.idempotencyKey}`,
    );
    return { appointment, changed: true };
  });
}

async function enqueueAppointmentEvent(
  tx: Tx,
  appointment: {
    id: string;
    leadId: string;
    opportunityId: string | null;
    status: string;
    channel: string;
    scheduledAt: Date;
    correlationId: string;
  },
  occurredAt: Date,
  factKey: string,
) {
  const payload = {
    appointmentId: appointment.id,
    leadId: appointment.leadId,
    opportunityId: appointment.opportunityId,
    status: appointment.status,
    channel: appointment.channel,
    scheduledAt: appointment.scheduledAt.toISOString(),
    correlationId: appointment.correlationId,
    schemaVersion: 1 as const,
  };
  assertMinimizedEventPayload(payload);
  await enqueueEvent(
    tx,
    "appointment.updated",
    payload,
    `appointment.updated:${appointment.id}:${factKey}`,
    {
      aggregateType: "appointment",
      aggregateId: appointment.id,
      correlationId: appointment.correlationId,
      occurredAt,
    },
  );
}

export async function checkNurtureEligibility(input: {
  leadId: string;
  purpose: string;
  channel: string;
  correlationId?: string;
}) {
  const lead = await prisma.lead.findUnique({
    where: { id: input.leadId },
    select: { id: true, status: true },
  });
  if (!lead) throw new SalesCoreRuleError("NOT_FOUND", "Lead not found.");

  const cancelled = await prisma.nurtureEnrollment.findFirst({
    where: {
      leadId: input.leadId,
      purpose: input.purpose,
      channel: input.channel,
      status: "CANCELLED",
    },
    orderBy: { updatedAt: "desc" },
  });
  if (cancelled) {
    return {
      eligible: false,
      granted: false,
      action: null as string | null,
      suppressionReason: "ENROLLMENT_CANCELLED",
      nextTouch: null as string | null,
      enrollment: null,
      lastDispatch: null,
    };
  }

  const consent = await getEffectiveConsent({
    subjectType: "LEAD",
    subjectId: input.leadId,
    purpose: input.purpose,
    channel: input.channel,
  });
  let eligible = consent.granted;
  let suppressionReason: string | null = consent.granted
    ? null
    : "CONSENT_NOT_GRANTED";
  if (eligible && lead.status === "WON") {
    eligible = false;
    suppressionReason = "LEAD_ALREADY_WON";
  }

  const activeEnrollment = await prisma.nurtureEnrollment.findFirst({
    where: {
      leadId: input.leadId,
      purpose: input.purpose,
      channel: input.channel,
      status: { in: ["ENROLLED", "ELIGIBLE"] },
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      status: true,
      scriptId: true,
      updatedAt: true,
      dispatches: {
        orderBy: { occurredAt: "desc" },
        take: 1,
        select: { status: true, occurredAt: true },
      },
    },
  });
  const lastDispatch = activeEnrollment?.dispatches[0] ?? null;
  const nextTouch = activeEnrollment
    ? lastDispatch
      ? `dispatch:${lastDispatch.status}`
      : activeEnrollment.scriptId
        ? `script:${activeEnrollment.scriptId}`
        : "enrolled_awaiting_dispatch"
    : eligible
      ? "ready_to_enroll"
      : null;

  if (input.correlationId) {
    const payload = {
      leadId: input.leadId,
      purpose: input.purpose,
      channel: input.channel,
      eligible,
      suppressionReason,
      correlationId: input.correlationId,
      schemaVersion: 1 as const,
    };
    assertMinimizedEventPayload(payload);
    await prisma.$transaction(async (tx) => {
      await enqueueEvent(
        tx,
        "nurture.eligibility_checked",
        payload,
        `nurture.eligibility_checked:${input.leadId}:${input.purpose}:${input.channel}:${input.correlationId}`,
        {
          aggregateType: "lead",
          aggregateId: input.leadId,
          correlationId: input.correlationId!,
        },
      );
    });
  }

  return {
    eligible,
    granted: consent.granted,
    action: consent.action,
    suppressionReason,
    nextTouch,
    enrollment: activeEnrollment
      ? {
          id: activeEnrollment.id,
          status: activeEnrollment.status,
          scriptId: activeEnrollment.scriptId,
          updatedAt: activeEnrollment.updatedAt.toISOString(),
        }
      : null,
    lastDispatch: lastDispatch
      ? {
          status: lastDispatch.status,
          occurredAt: lastDispatch.occurredAt.toISOString(),
        }
      : null,
  };
}

export async function enrollNurture(input: {
  leadId: string;
  purpose: string;
  channel: string;
  scriptId?: string | null;
  cohortKey?: string | null;
  opportunityId?: string | null;
  actorId: string;
  correlationId: string;
  idempotencyKey: string;
  action?: "enroll" | "cancel";
}) {
  const action = input.action ?? "enroll";
  if (action === "cancel") {
    return prisma.$transaction(async (tx) => {
      const prior = await tx.nurtureEnrollment.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (prior) {
        if (
          prior.leadId !== input.leadId ||
          prior.purpose !== input.purpose ||
          prior.channel !== input.channel ||
          prior.status !== "CANCELLED"
        ) {
          idempotencyConflict();
        }
        return { enrollment: prior, created: false };
      }
      const active = await tx.nurtureEnrollment.findMany({
        where: {
          leadId: input.leadId,
          purpose: input.purpose,
          channel: input.channel,
          status: { in: ["ENROLLED", "ELIGIBLE"] },
        },
      });
      if (active.length > 0) {
        await tx.nurtureEnrollment.updateMany({
          where: { id: { in: active.map((row) => row.id) } },
          data: { status: "CANCELLED" },
        });
        const closed = await tx.nurtureEnrollment.findUniqueOrThrow({
          where: { id: active[0]!.id },
        });
        // Stamp cancel idempotency on the closed row via a dedicated cancel audit
        // when the closed row already has a different idempotency key.
        if (closed.idempotencyKey === input.idempotencyKey) {
          return { enrollment: closed, created: false };
        }
        const enrollment = await tx.nurtureEnrollment.create({
          data: {
            leadId: input.leadId,
            opportunityId: input.opportunityId ?? null,
            purpose: input.purpose,
            channel: input.channel,
            status: "CANCELLED",
            scriptId: input.scriptId ?? closed.scriptId,
            cohortKey: input.cohortKey ?? closed.cohortKey,
            actorId: input.actorId,
            correlationId: input.correlationId,
            idempotencyKey: input.idempotencyKey,
          },
        });
        return { enrollment, created: true };
      }
      const enrollment = await tx.nurtureEnrollment.create({
        data: {
          leadId: input.leadId,
          opportunityId: input.opportunityId ?? null,
          purpose: input.purpose,
          channel: input.channel,
          status: "CANCELLED",
          scriptId: input.scriptId ?? null,
          cohortKey: input.cohortKey ?? null,
          actorId: input.actorId,
          correlationId: input.correlationId,
          idempotencyKey: input.idempotencyKey,
        },
      });
      return { enrollment, created: true };
    });
  }

  const eligibility = await checkNurtureEligibility({
    leadId: input.leadId,
    purpose: input.purpose,
    channel: input.channel,
  });
  if (!eligibility.eligible) {
    throw new SalesCoreRuleError(
      "NURTURE_NOT_ELIGIBLE",
      eligibility.suppressionReason ?? "Nurture enrollment blocked.",
    );
  }
  assertMarketingDeliveryAllowed({
    granted: eligibility.granted,
    action: (eligibility.action as never) ?? null,
    occurredAt: null,
  });

  try {
    return await prisma.$transaction(async (tx) => {
      const prior = await tx.nurtureEnrollment.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (prior) {
        if (
          prior.leadId !== input.leadId ||
          prior.purpose !== input.purpose ||
          prior.channel !== input.channel ||
          prior.status !== "ENROLLED"
        ) {
          idempotencyConflict();
        }
        return { enrollment: prior, created: false };
      }
      const enrollment = await tx.nurtureEnrollment.create({
        data: {
          leadId: input.leadId,
          opportunityId: input.opportunityId ?? null,
          purpose: input.purpose,
          channel: input.channel,
          status: "ENROLLED",
          scriptId: input.scriptId ?? null,
          cohortKey: input.cohortKey ?? null,
          actorId: input.actorId,
          correlationId: input.correlationId,
          idempotencyKey: input.idempotencyKey,
        },
      });
      return { enrollment, created: true };
    });
  } catch (error) {
    if (!isUniqueConflict(error)) throw error;
    const prior = await prisma.nurtureEnrollment.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (!prior) idempotencyConflict();
    return { enrollment: prior, created: false };
  }
}

export async function recordNurtureDispatchResult(input: {
  enrollmentId: string;
  status: "SENT" | "FAILED" | "SKIPPED";
  actorId: string;
  occurredAt: Date;
  correlationId: string;
  idempotencyKey: string;
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      const prior = await tx.nurtureDispatch.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (prior) {
        if (
          prior.enrollmentId !== input.enrollmentId ||
          prior.status !== input.status
        ) {
          idempotencyConflict();
        }
        return { dispatch: prior, created: false };
      }
      const enrollment = await tx.nurtureEnrollment.findUnique({
        where: { id: input.enrollmentId },
      });
      if (!enrollment) {
        throw new SalesCoreRuleError("NOT_FOUND", "Enrollment not found.");
      }
      if (
        enrollment.status === "CANCELLED" ||
        enrollment.status === "SUPPRESSED"
      ) {
        throw new SalesCoreRuleError(
          "NURTURE_ENROLLMENT_CLOSED",
          "Cannot record dispatch on closed enrollment.",
        );
      }
      const dispatch = await tx.nurtureDispatch.create({
        data: {
          enrollmentId: enrollment.id,
          status: input.status,
          actorId: input.actorId,
          occurredAt: input.occurredAt,
          correlationId: input.correlationId,
          idempotencyKey: input.idempotencyKey,
        },
      });
      const payload = {
        enrollmentId: enrollment.id,
        dispatchId: dispatch.id,
        leadId: enrollment.leadId,
        status: dispatch.status,
        correlationId: input.correlationId,
        schemaVersion: 1 as const,
      };
      assertMinimizedEventPayload(payload);
      await enqueueEvent(
        tx,
        "nurture.dispatch_recorded",
        payload,
        `nurture.dispatch_recorded:${dispatch.id}`,
        {
          aggregateType: "nurture_enrollment",
          aggregateId: enrollment.id,
          correlationId: input.correlationId,
          occurredAt: input.occurredAt,
        },
      );
      return { dispatch, created: true };
    });
  } catch (error) {
    if (!isUniqueConflict(error)) throw error;
    const prior = await prisma.nurtureDispatch.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (!prior) idempotencyConflict();
    return { dispatch: prior, created: false };
  }
}
