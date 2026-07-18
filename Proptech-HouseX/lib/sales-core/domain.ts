export type ConsentAction =
  | "GRANTED"
  | "DENIED"
  | "WITHDRAWN"
  | "EXPIRED"
  | "SUPERSEDED";

export type ConsentFact = {
  purpose: string;
  channel: string;
  action: ConsentAction;
  occurredAt: Date;
  createdAt?: Date;
};

export type EffectiveConsent = {
  granted: boolean;
  action: ConsentAction | null;
  occurredAt: Date | null;
};

/**
 * Consent is isolated by purpose/channel. The most recent authoritative action
 * wins; a deny/withdraw/expiry/supersede therefore blocks every earlier grant.
 * Acquisition provenance is intentionally not accepted as input.
 */
export function resolveEffectiveConsent(
  records: readonly ConsentFact[],
  purpose: string,
  channel: string,
): EffectiveConsent {
  const latest = records
    .filter(
      (record) =>
        record.purpose === purpose && record.channel === channel,
    )
    .sort(
      (a, b) =>
        b.occurredAt.getTime() - a.occurredAt.getTime() ||
        (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
    )[0];

  return {
    granted: latest?.action === "GRANTED",
    action: latest?.action ?? null,
    occurredAt: latest?.occurredAt ?? null,
  };
}

export type BuyerProfileInput = {
  budgetMin?: unknown;
  budgetMax?: unknown;
  availableCash?: unknown;
  paymentPreference?: string | null;
  locations?: readonly string[];
  propertyTypes?: readonly string[];
  bedroomsMin?: number | null;
  purchasePurpose?: string | null;
  timeframe?: string | null;
  readiness?: string | null;
  mustHaves?: readonly string[];
};

const PROFILE_GROUPS: Array<(profile: BuyerProfileInput) => boolean> = [
  (p) => p.budgetMin != null || p.budgetMax != null,
  (p) => p.availableCash != null,
  (p) => Boolean(p.paymentPreference?.trim()),
  (p) => Boolean(p.locations?.length),
  (p) => Boolean(p.propertyTypes?.length),
  (p) => p.bedroomsMin != null,
  (p) => Boolean(p.purchasePurpose?.trim()),
  (p) => Boolean(p.timeframe?.trim()),
  (p) => Boolean(p.readiness?.trim()),
  (p) => Boolean(p.mustHaves?.length),
];

export function calculateProfileCompleteness(
  profile: BuyerProfileInput,
): number {
  const completed = PROFILE_GROUPS.filter((check) => check(profile)).length;
  return Math.round((completed / PROFILE_GROUPS.length) * 100);
}

export function assertBuyerReadyForMatching(input: {
  leadStatus: string;
  profileCompleteness: number;
  readiness: string | null;
}): void {
  if (input.leadStatus !== "QUALIFIED") {
    throw new SalesCoreRuleError(
      "LEAD_NOT_QUALIFIED",
      "Buyer matching requires a QUALIFIED lead.",
    );
  }
  if (input.profileCompleteness < 70 || !input.readiness?.trim()) {
    throw new SalesCoreRuleError(
      "PROFILE_NOT_READY",
      "Buyer matching requires at least 70% profile completeness and readiness.",
    );
  }
}

export type BuyerMatchScoreInput = {
  profileCompleteness: number;
  locationMatched: boolean;
  propertyTypeMatched: boolean;
  bedroomsMatched: boolean | null;
  mustHavesMatched: number;
  mustHavesTotal: number;
  inventorySnapshotAt: Date | null;
  inventoryAvailable: boolean | null;
};

export function scoreBuyerMatch(input: BuyerMatchScoreInput) {
  if (
    input.inventorySnapshotAt === null &&
    input.inventoryAvailable !== null
  ) {
    throw new SalesCoreRuleError(
      "INVENTORY_SNAPSHOT_REQUIRED",
      "Inventory availability cannot be claimed without a snapshot timestamp.",
    );
  }
  const profile = Math.round(
    Math.max(0, Math.min(100, input.profileCompleteness)) * 0.4,
  );
  const location = input.locationMatched ? 15 : 0;
  const propertyType = input.propertyTypeMatched ? 15 : 0;
  const bedrooms = input.bedroomsMatched === true ? 10 : 0;
  const mustHaves =
    input.mustHavesTotal > 0
      ? Math.round(
          20 *
            Math.max(
              0,
              Math.min(1, input.mustHavesMatched / input.mustHavesTotal),
            ),
        )
      : 0;
  const reasons = [
    ...(input.locationMatched ? ["LOCATION_MATCH"] : []),
    ...(input.propertyTypeMatched ? ["PROPERTY_TYPE_MATCH"] : []),
    ...(input.bedroomsMatched === true ? ["BEDROOMS_MATCH"] : []),
    ...(mustHaves > 0 ? ["MUST_HAVES_PARTIAL_OR_FULL_MATCH"] : []),
  ];
  const blockers = [
    ...(input.profileCompleteness < 70 ? ["PROFILE_INCOMPLETE"] : []),
    ...(!input.locationMatched ? ["LOCATION_MISMATCH"] : []),
    ...(!input.propertyTypeMatched ? ["PROPERTY_TYPE_MISMATCH"] : []),
    ...(input.bedroomsMatched === false ? ["BEDROOMS_MISMATCH"] : []),
    ...(input.inventorySnapshotAt === null
      ? ["INVENTORY_FRESHNESS_UNKNOWN"]
      : []),
    ...(input.inventoryAvailable === false ? ["INVENTORY_UNAVAILABLE"] : []),
  ];
  return {
    score: profile + location + propertyType + bedrooms + mustHaves,
    scoreBreakdown: {
      profile,
      location,
      propertyType,
      bedrooms,
      mustHaves,
    },
    reasons,
    blockers,
    inventoryCheckedAt: input.inventorySnapshotAt,
  };
}

export function assertMarketingDeliveryAllowed(
  consent: EffectiveConsent,
): void {
  if (!consent.granted) {
    throw new SalesCoreRuleError(
      "MARKETING_CONSENT_REQUIRED",
      "Marketing delivery requires effective purpose/channel consent.",
    );
  }
}

export type OpportunityStage =
  | "OPEN"
  | "DISCOVERY"
  | "ACTIVE"
  | "COMMITTED"
  | "WON"
  | "LOST"
  | "CANCELLED";

export type CommitEvidenceReferenceType =
  | "UNIT_BOOKING"
  | "DEPOSIT";

export type CommitEvidence = {
  referenceType: CommitEvidenceReferenceType;
  referenceId: string;
};

export const PROPOSAL_TERMS_VERSION = "p-proposal-v1";

export type ProposalInventorySnapshot = {
  projectId: string;
  unitId: string;
  unitCode: string;
  unitStatus: string;
  price: string;
  depositBookingId: string | null;
};

export function assertJourneyPConversionEnabled(enabled: boolean): void {
  if (!enabled) {
    throw new SalesCoreRuleError(
      "FEATURE_DISABLED",
      "Journey P conversion G2 is disabled.",
    );
  }
}

export function assertProposalFresh(input: {
  snapshot: ProposalInventorySnapshot;
  current: ProposalInventorySnapshot;
}): void {
  const fields: Array<keyof ProposalInventorySnapshot> = [
    "projectId",
    "unitId",
    "unitCode",
    "unitStatus",
    "price",
    "depositBookingId",
  ];
  for (const field of fields) {
    if (String(input.snapshot[field] ?? "") !== String(input.current[field] ?? "")) {
      throw new SalesCoreRuleError(
        "PROPOSAL_STALE",
        "Proposal inventory snapshot is stale; refresh before commit.",
      );
    }
  }
}

export function assertProposalMatchesCommit(input: {
  snapshot: ProposalInventorySnapshot;
  bookingProjectId: string;
  bookingUnitId: string;
}): void {
  if (
    input.snapshot.projectId !== input.bookingProjectId ||
    input.snapshot.unitId !== input.bookingUnitId
  ) {
    throw new SalesCoreRuleError(
      "PROPOSAL_COMMIT_MISMATCH",
      "Proposal subject must match commit booking project/unit.",
    );
  }
}

export function assertNoxhCaseAllowsCommit(
  caseStatus: string | null | undefined,
): void {
  if (!caseStatus) return;
  if (
    caseStatus === "DECLINED" ||
    caseStatus === "UNREACHABLE" ||
    caseStatus === "RELEASED"
  ) {
    throw new SalesCoreRuleError(
      "NOXH_CASE_BLOCKS_COMMIT",
      "NOXH case status blocks commitment.",
    );
  }
}

const WON_REASON_CODES = new Set([
  "DEPOSIT_CONFIRMED",
  "CONTRACT_SIGNED",
  "HANDOVER_COMPLETE",
]);
const LOST_REASON_CODES = new Set([
  "BUYER_WITHDREW",
  "INVENTORY_UNAVAILABLE",
  "FINANCE_REJECTED",
  "ELIGIBILITY_FAILED",
  "COMPETITOR_WON",
  "NO_RESPONSE",
  "OTHER",
]);

export function assertOutcomeReasonCode(
  result: "WON" | "LOST",
  reasonCode: string,
): void {
  const allowed = result === "WON" ? WON_REASON_CODES : LOST_REASON_CODES;
  if (!allowed.has(reasonCode)) {
    throw new SalesCoreRuleError(
      "INVALID_OUTCOME_REASON",
      `Reason code is not valid for ${result}.`,
    );
  }
}

const JOURNEY_COMMIT_EVIDENCE: Record<
  "A" | "S" | "P",
  readonly CommitEvidenceReferenceType[]
> = {
  A: [],
  S: [],
  P: ["UNIT_BOOKING", "DEPOSIT"],
};

/**
 * A/S do not yet have authoritative subscription/agreement/deal objects. They
 * fail closed until a real model can be reconciled transactionally.
 */
export function assertCommitEvidence(input: {
  journey: "A" | "S" | "P";
  from: OpportunityStage;
  to: OpportunityStage;
  evidence?: CommitEvidence;
}): void {
  if (input.from !== "ACTIVE" || input.to !== "COMMITTED") {
    if (input.evidence) {
      throw new SalesCoreRuleError(
        "COMMIT_EVIDENCE_NOT_APPLICABLE",
        "Commit evidence is only accepted for ACTIVE to COMMITTED.",
      );
    }
    return;
  }
  if (input.journey !== "P") {
    throw new SalesCoreRuleError(
      "COMMIT_RECONCILIATION_NOT_SUPPORTED",
      `COMMITTED is not supported for journey ${input.journey} until an authoritative record exists.`,
    );
  }
  if (!input.evidence) {
    throw new SalesCoreRuleError(
      "COMMIT_EVIDENCE_REQUIRED",
      "ACTIVE to COMMITTED requires journey-specific commit evidence.",
    );
  }
  if (
    !JOURNEY_COMMIT_EVIDENCE[input.journey].includes(
      input.evidence.referenceType,
    )
  ) {
    throw new SalesCoreRuleError(
      "COMMIT_EVIDENCE_JOURNEY_MISMATCH",
      `Commit evidence type is not valid for journey ${input.journey}.`,
    );
  }
}

export type PrimaryCommitEvidenceRecord = {
  id: string;
  status: string;
  customerId: string | null;
  projectId: string;
  unitId: string;
  unitDepositBookingId: string | null;
};

export function assertPrimaryCommitEvidenceRecord(input: {
  evidence: CommitEvidence;
  leadCustomerId: string | null;
  leadProjectId: string | null;
  opportunityProjectRef: string | null;
  opportunityUnitRef: string | null;
  record: PrimaryCommitEvidenceRecord;
}): void {
  if (input.record.id !== input.evidence.referenceId) {
    throw new SalesCoreRuleError(
      "COMMIT_EVIDENCE_NOT_FOUND",
      "Commit evidence record was not found.",
    );
  }
  const validStatus =
    input.evidence.referenceType === "UNIT_BOOKING"
      ? input.record.status === "CONFIRMED"
      : input.evidence.referenceType === "DEPOSIT"
        ? input.record.status === "CONVERTED_TO_DEPOSIT" &&
          input.record.unitDepositBookingId === input.record.id
        : false;
  if (!validStatus) {
    throw new SalesCoreRuleError(
      "COMMIT_EVIDENCE_NOT_AUTHORITATIVE",
      "Referenced booking does not prove the requested commitment.",
    );
  }
  if (
    !input.leadCustomerId ||
    input.record.customerId !== input.leadCustomerId
  ) {
    throw new SalesCoreRuleError(
      "COMMIT_EVIDENCE_SUBJECT_MISMATCH",
      "Commit evidence must belong to the opportunity lead customer.",
    );
  }
  if (
    (input.leadProjectId &&
      input.record.projectId !== input.leadProjectId) ||
    (input.opportunityProjectRef &&
      input.record.projectId !== input.opportunityProjectRef)
  ) {
    throw new SalesCoreRuleError(
      "COMMIT_EVIDENCE_PROJECT_MISMATCH",
      "Commit evidence must belong to every linked opportunity project.",
    );
  }
  if (!input.leadProjectId && !input.opportunityProjectRef) {
    throw new SalesCoreRuleError(
      "COMMIT_EVIDENCE_PROJECT_REQUIRED",
      "A project link is required to reconcile primary commitment.",
    );
  }
  if (
    input.opportunityUnitRef &&
    input.record.unitId !== input.opportunityUnitRef
  ) {
    throw new SalesCoreRuleError(
      "COMMIT_EVIDENCE_UNIT_MISMATCH",
      "Commit evidence must belong to the linked opportunity unit.",
    );
  }
}

const OPPORTUNITY_TRANSITIONS: Record<
  OpportunityStage,
  readonly OpportunityStage[]
> = {
  OPEN: ["DISCOVERY", "LOST", "CANCELLED"],
  DISCOVERY: ["ACTIVE", "LOST", "CANCELLED"],
  ACTIVE: ["COMMITTED", "LOST", "CANCELLED"],
  COMMITTED: ["WON", "LOST"],
  WON: [],
  LOST: [],
  CANCELLED: [],
};

export function assertOpportunityTransition(
  from: OpportunityStage,
  to: OpportunityStage,
): void {
  if (!OPPORTUNITY_TRANSITIONS[from].includes(to)) {
    throw new SalesCoreRuleError(
      "INVALID_OPPORTUNITY_TRANSITION",
      `Cannot transition opportunity from ${from} to ${to}.`,
    );
  }
}

export function assertOutcomeFromCommitted(
  stage: OpportunityStage,
  result: "WON" | "LOST",
): void {
  if (stage !== "COMMITTED") {
    throw new SalesCoreRuleError(
      "OUTCOME_REQUIRES_COMMITTED",
      "Conversion outcome requires a COMMITTED opportunity.",
    );
  }
  assertOpportunityTransition(stage, result);
}

export type AppointmentStatus =
  | "SCHEDULED"
  | "RESCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

const APPOINTMENT_TRANSITIONS: Record<
  AppointmentStatus,
  readonly AppointmentStatus[]
> = {
  SCHEDULED: ["RESCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"],
  RESCHEDULED: ["RESCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

export function assertAppointmentTransition(
  from: AppointmentStatus,
  to: AppointmentStatus,
): void {
  if (!APPOINTMENT_TRANSITIONS[from].includes(to)) {
    throw new SalesCoreRuleError(
      "INVALID_APPOINTMENT_TRANSITION",
      `Cannot transition appointment from ${from} to ${to}.`,
    );
  }
}

export function appointmentTransitionDates(
  to: AppointmentStatus,
  occurredAt: Date,
) {
  return {
    attendedAt: to === "COMPLETED" ? occurredAt : undefined,
    noShowAt: to === "NO_SHOW" ? occurredAt : undefined,
    cancelledAt: to === "CANCELLED" ? occurredAt : undefined,
  };
}

export function assignmentSla(
  assignedAt: Date,
  acceptanceMinutes: number,
  firstResponseMinutes: number,
) {
  if (acceptanceMinutes <= 0 || firstResponseMinutes <= 0) {
    throw new SalesCoreRuleError(
      "INVALID_SLA",
      "SLA durations must be positive.",
    );
  }
  return {
    acceptanceSlaDueAt: new Date(
      assignedAt.getTime() + acceptanceMinutes * 60_000,
    ),
    firstResponseSlaDueAt: new Date(
      assignedAt.getTime() + firstResponseMinutes * 60_000,
    ),
  };
}

export type AssignmentFact = "accept" | "first_attempt" | "first_connected";

export type RecordedAssignmentFact = {
  fact: AssignmentFact;
  idempotencyKey: string | null;
  occurredAt: Date | null;
  correlationId: string | null;
};

export function assignmentFactDecision(input: {
  status: "ASSIGNED" | "ACCEPTED" | "RELEASED" | "REASSIGNED";
  ownerId: string;
  actorId: string;
  fact: AssignmentFact;
  occurredAt: Date;
  correlationId: string;
  idempotencyKey: string;
  recordedFacts: readonly RecordedAssignmentFact[];
}): "record" | "retry" {
  if (input.ownerId !== input.actorId) {
    throw new SalesCoreRuleError(
      "OWNER_REQUIRED",
      "Only the assigned owner can record this fact.",
    );
  }
  const priorForKey = input.recordedFacts.find(
    (recorded) => recorded.idempotencyKey === input.idempotencyKey,
  );
  if (priorForKey) {
    if (
      priorForKey.fact === input.fact &&
      priorForKey.occurredAt?.getTime() === input.occurredAt.getTime() &&
      priorForKey.correlationId === input.correlationId
    ) {
      return "retry";
    }
    throw new SalesCoreRuleError(
      "IDEMPOTENCY_KEY_REUSED",
      "Idempotency key was already used for a different assignment fact.",
    );
  }
  if (
    input.recordedFacts.some(
      (recorded) =>
        recorded.fact === input.fact && recorded.idempotencyKey !== null,
    )
  ) {
    throw new SalesCoreRuleError(
      "FACT_ALREADY_RECORDED",
      "Assignment fact is append-safe and has already been recorded.",
    );
  }
  if (input.status === "RELEASED" || input.status === "REASSIGNED") {
    throw new SalesCoreRuleError(
      "ASSIGNMENT_CLOSED",
      "Closed assignments cannot receive new facts.",
    );
  }
  return "record";
}

const RESERVED_ACTIVITY_TYPES = new Set([
  "STATE_TRANSITION",
  "APPOINTMENT_CREATED",
  "APPOINTMENT_UPDATED",
]);

export function assertGenericActivityType(type: string): void {
  if (RESERVED_ACTIVITY_TYPES.has(type)) {
    throw new SalesCoreRuleError(
      "RESERVED_ACTIVITY_TYPE",
      "Reserved system activity types may only be created by domain services.",
    );
  }
}

const FORBIDDEN_EVENT_KEYS = new Set([
  "phone",
  "email",
  "uid",
  "normalizedPhone",
  "availableCash",
  "budgetMin",
  "budgetMax",
  "proofRef",
  "proofMetadata",
  "note",
  "reasonDetail",
]);

export function assertMinimizedEventPayload(
  payload: Record<string, unknown>,
): void {
  const visit = (value: unknown): void => {
    if (!value || typeof value !== "object") return;
    for (const [key, nested] of Object.entries(value)) {
      if (FORBIDDEN_EVENT_KEYS.has(key)) {
        throw new SalesCoreRuleError(
          "PII_IN_EVENT_PAYLOAD",
          `Forbidden event field: ${key}`,
        );
      }
      visit(nested);
    }
  };
  visit(payload);
}

export class SalesCoreRuleError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}
