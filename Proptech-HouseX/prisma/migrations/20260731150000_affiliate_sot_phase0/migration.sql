-- Affiliate SoT Phase 0: dealTier, exclusive 60/30/+15, care activities, e-contract, HH %×HĐMB

CREATE TYPE "AffiliateDealTier" AS ENUM ('CONNECTOR', 'CONSULTANT', 'DEVELOPER_PARTNER', 'MASTER_BROKER');
CREATE TYPE "ExclusiveStatus" AS ENUM ('EXCLUSIVE', 'RELEASED_SILENT', 'RELEASED_EXPIRED', 'EXTEND_REQUESTED', 'EXTENDED');
CREATE TYPE "PartnerContractStatus" AS ENUM ('NONE', 'PENDING', 'SIGNED');
CREATE TYPE "CareActivityType" AS ENUM ('CALL', 'CHAT', 'MEET', 'SITE_VISIT', 'DOCUMENT', 'OTHER');
CREATE TYPE "CareActivityStatus" AS ENUM ('ACCEPTED', 'REJECTED');
CREATE TYPE "CommissionModel" AS ENUM ('FLAT', 'PERCENT_HDMB');

ALTER TABLE "brokers"
  ADD COLUMN IF NOT EXISTS "partner_contract_status" "PartnerContractStatus" NOT NULL DEFAULT 'NONE',
  ADD COLUMN IF NOT EXISTS "partner_contract_signed_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "partner_contract_version" TEXT,
  ADD COLUMN IF NOT EXISTS "partner_contract_snapshot" TEXT,
  ADD COLUMN IF NOT EXISTS "partner_contract_sig_hash" TEXT,
  ADD COLUMN IF NOT EXISTS "partner_contract_otp_proof" TEXT;

ALTER TABLE "noxh_cases"
  ADD COLUMN IF NOT EXISTS "deal_tier" "AffiliateDealTier",
  ADD COLUMN IF NOT EXISTS "exclusive_status" "ExclusiveStatus",
  ADD COLUMN IF NOT EXISTS "exclusive_started_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "last_valid_care_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "extend_requested_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "hdmb_base_amount" DECIMAL(18,2),
  ADD COLUMN IF NOT EXISTS "hdmb_recorded_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "hdmb_recorded_by" TEXT,
  ADD COLUMN IF NOT EXISTS "commission_model" "CommissionModel" NOT NULL DEFAULT 'PERCENT_HDMB',
  ADD COLUMN IF NOT EXISTS "site_visit_bonus_verified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "site_visit_bonus_verified_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "site_visit_bonus_verified_by" TEXT;

CREATE INDEX IF NOT EXISTS "noxh_cases_exclusive_status_last_valid_care_at_idx"
  ON "noxh_cases"("exclusive_status", "last_valid_care_at");

ALTER TABLE "commissions"
  ADD COLUMN IF NOT EXISTS "deal_tier" "AffiliateDealTier",
  ADD COLUMN IF NOT EXISTS "hdmb_base_amount" DECIMAL(18,2),
  ADD COLUMN IF NOT EXISTS "site_visit_bonus_amount" DECIMAL(18,2),
  ADD COLUMN IF NOT EXISTS "commission_model" "CommissionModel";

CREATE TABLE IF NOT EXISTS "care_activities" (
  "id" TEXT NOT NULL,
  "case_id" TEXT NOT NULL,
  "broker_id" TEXT NOT NULL,
  "activity_type" "CareActivityType" NOT NULL,
  "occurred_at" TIMESTAMP(3) NOT NULL,
  "note" TEXT NOT NULL,
  "image_urls" TEXT[],
  "status" "CareActivityStatus" NOT NULL DEFAULT 'ACCEPTED',
  "rejected_reason" TEXT,
  "rejected_by" TEXT,
  "rejected_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "care_activities_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "care_activities_case_id_status_occurred_at_idx"
  ON "care_activities"("case_id", "status", "occurred_at");
CREATE INDEX IF NOT EXISTS "care_activities_broker_id_idx"
  ON "care_activities"("broker_id");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'care_activities_case_id_fkey'
  ) THEN
    ALTER TABLE "care_activities"
      ADD CONSTRAINT "care_activities_case_id_fkey"
      FOREIGN KEY ("case_id") REFERENCES "noxh_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Backfill: ACTIVE cases with lock → EXCLUSIVE clock from claimed_at
UPDATE "noxh_cases"
SET
  "exclusive_status" = 'EXCLUSIVE',
  "exclusive_started_at" = COALESCE("exclusive_started_at", "claimed_at"),
  "last_valid_care_at" = COALESCE("last_valid_care_at", "claimed_at")
WHERE "case_status" = 'ACTIVE'
  AND "broker_id" IS NOT NULL
  AND "exclusive_status" IS NULL;
