-- CRM-R2: Attribution conflict queue (Ops vs CTV)

CREATE TYPE "AttributionConflictKind" AS ENUM ('CTV_CLAIM_BLOCKED', 'OPS_LEAD_CTV_LOCK');

CREATE TYPE "AttributionConflictStatus" AS ENUM ('OPEN', 'RESOLVED', 'DISMISSED');

CREATE TYPE "AttributionConflictResolution" AS ENUM (
  'KEEP_PLATFORM',
  'RELEASE_TO_CTV',
  'SPLIT_LANE',
  'DISMISS_BOTH'
);

CREATE TABLE "attribution_conflicts" (
  "id" TEXT NOT NULL,
  "normalized_phone" TEXT NOT NULL,
  "kind" "AttributionConflictKind" NOT NULL,
  "status" "AttributionConflictStatus" NOT NULL DEFAULT 'OPEN',
  "reject_reason" TEXT,
  "customer_id" TEXT,
  "platform_lead_id" TEXT,
  "noxh_case_id" TEXT,
  "broker_id" TEXT,
  "resolution" "AttributionConflictResolution",
  "resolution_note" TEXT,
  "resolved_by" TEXT,
  "resolved_at" TIMESTAMP(3),
  "meta" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "attribution_conflicts_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "attribution_conflicts"
  ADD CONSTRAINT "attribution_conflicts_customer_id_fkey"
  FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "attribution_conflicts"
  ADD CONSTRAINT "attribution_conflicts_platform_lead_id_fkey"
  FOREIGN KEY ("platform_lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "attribution_conflicts"
  ADD CONSTRAINT "attribution_conflicts_noxh_case_id_fkey"
  FOREIGN KEY ("noxh_case_id") REFERENCES "noxh_cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "attribution_conflicts"
  ADD CONSTRAINT "attribution_conflicts_broker_id_fkey"
  FOREIGN KEY ("broker_id") REFERENCES "brokers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "attribution_conflicts_status_created_at_idx"
  ON "attribution_conflicts"("status", "created_at" DESC);

CREATE INDEX "attribution_conflicts_normalized_phone_status_idx"
  ON "attribution_conflicts"("normalized_phone", "status");
