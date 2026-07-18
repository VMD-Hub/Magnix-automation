-- ADR-015 SC-4/SC-5 Journey P: immutable proposal snapshots + conversion outcomes.

CREATE TYPE "ConversionResult" AS ENUM ('WON', 'LOST');
CREATE TYPE "OutcomeReferenceType" AS ENUM ('UNIT_BOOKING', 'DEPOSIT');

CREATE TABLE "proposal_snapshots" (
    "id" TEXT NOT NULL,
    "opportunity_id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "journey" "SalesJourney" NOT NULL,
    "project_ref" TEXT NOT NULL,
    "unit_ref" TEXT NOT NULL,
    "buyer_match_id" TEXT,
    "unit_code" TEXT NOT NULL,
    "unit_status" TEXT NOT NULL,
    "price" DECIMAL(18,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "deposit_booking_id_at_snapshot" TEXT,
    "terms_version" TEXT NOT NULL,
    "inventory_checked_at" TIMESTAMP(3) NOT NULL,
    "generated_at" TIMESTAMP(3) NOT NULL,
    "actor_id" TEXT NOT NULL,
    "correlation_id" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "proposal_snapshots_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "proposal_snapshots_idempotency_key_key" ON "proposal_snapshots"("idempotency_key");
CREATE INDEX "proposal_snapshots_opportunity_id_created_at_idx" ON "proposal_snapshots"("opportunity_id", "created_at" DESC);
CREATE INDEX "proposal_snapshots_lead_id_created_at_idx" ON "proposal_snapshots"("lead_id", "created_at" DESC);

ALTER TABLE "proposal_snapshots"
  ADD CONSTRAINT "proposal_snapshots_opportunity_id_fkey"
  FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "proposal_snapshots"
  ADD CONSTRAINT "proposal_snapshots_lead_id_fkey"
  FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "proposal_snapshots"
  ADD CONSTRAINT "proposal_snapshots_buyer_match_id_fkey"
  FOREIGN KEY ("buyer_match_id") REFERENCES "buyer_matches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "conversion_outcomes" (
    "id" TEXT NOT NULL,
    "opportunity_id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "journey" "SalesJourney" NOT NULL,
    "result" "ConversionResult" NOT NULL,
    "reason_code" TEXT NOT NULL,
    "reason_detail" TEXT,
    "reference_type" "OutcomeReferenceType" NOT NULL,
    "reference_id" TEXT NOT NULL,
    "value" DECIMAL(18,2),
    "currency" TEXT,
    "referral_id" TEXT,
    "broker_id" TEXT,
    "actor_id" TEXT NOT NULL,
    "correlation_id" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "conversion_outcomes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "conversion_outcomes_opportunity_id_key" ON "conversion_outcomes"("opportunity_id");
CREATE UNIQUE INDEX "conversion_outcomes_idempotency_key_key" ON "conversion_outcomes"("idempotency_key");
CREATE INDEX "conversion_outcomes_lead_id_occurred_at_idx" ON "conversion_outcomes"("lead_id", "occurred_at" DESC);
CREATE INDEX "conversion_outcomes_journey_result_idx" ON "conversion_outcomes"("journey", "result");

ALTER TABLE "conversion_outcomes"
  ADD CONSTRAINT "conversion_outcomes_opportunity_id_fkey"
  FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "conversion_outcomes"
  ADD CONSTRAINT "conversion_outcomes_lead_id_fkey"
  FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
