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
  assertMinimizedEventPayload,
  assertOpportunityTransition,
  assertPrimaryCommitEvidenceRecord,
  assignmentFactDecision,
  assignmentSla,
  calculateProfileCompleteness,
  resolveEffectiveConsent,
  scoreBuyerMatch,
  SalesCoreRuleError,
  type AssignmentFact,
  type CommitEvidence,
} from "./domain";
import { toPrismaJsonObject } from "./json";

type Tx = Prisma.TransactionClient;

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
      const priorCommitEvidence =
        priorActivity.metadata &&
        typeof priorActivity.metadata === "object" &&
        !Array.isArray(priorActivity.metadata)
          ? (priorActivity.metadata as Record<string, unknown>).commitEvidence
          : undefined;
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
          )
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
    if (current.stage === "ACTIVE" && input.toStage === "COMMITTED") {
      const evidence = input.commitEvidence;
      if (!evidence) {
        throw new SalesCoreRuleError(
          "COMMIT_EVIDENCE_REQUIRED",
          "ACTIVE to COMMITTED requires commit evidence.",
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
          select: { customerId: true, projectId: true },
        }),
        tx.unitBooking.findUnique({
          where: { id: evidence.referenceId },
          select: {
            id: true,
            status: true,
            customerId: true,
            projectId: true,
            unitId: true,
            unit: { select: { depositBookingId: true } },
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
        metadata: commitEvidenceMetadata
          ? { commitEvidence: commitEvidenceMetadata }
          : {},
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
