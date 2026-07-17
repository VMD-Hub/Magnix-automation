-- ADR-015 local G2 SC-2 slice. Additive only; not evidence of deployment.

CREATE TYPE "BuyerMatchResponse" AS ENUM (
  'NOT_PRESENTED',
  'PRESENTED',
  'INTERESTED',
  'DECLINED',
  'NEEDS_REVIEW'
);

CREATE TABLE "buyer_matches" (
  "id" TEXT NOT NULL,
  "lead_id" TEXT NOT NULL,
  "buyer_profile_id" TEXT NOT NULL,
  "opportunity_id" TEXT,
  "project_ref" TEXT,
  "listing_ref" TEXT,
  "unit_ref" TEXT,
  "score" INTEGER NOT NULL,
  "score_breakdown" JSONB NOT NULL,
  "reasons" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "blockers" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "rules_version" TEXT NOT NULL,
  "inventory_checked_at" TIMESTAMP(3),
  "presented_at" TIMESTAMP(3),
  "response" "BuyerMatchResponse" NOT NULL DEFAULT 'NOT_PRESENTED',
  "actor_id" TEXT NOT NULL,
  "correlation_id" TEXT NOT NULL,
  "idempotency_key" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "buyer_matches_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "buyer_matches_score_check" CHECK ("score" BETWEEN 0 AND 100),
  CONSTRAINT "buyer_matches_inventory_evidence_check" CHECK (
    "inventory_checked_at" IS NOT NULL
    OR 'INVENTORY_FRESHNESS_UNKNOWN' = ANY("blockers")
  ),
  CONSTRAINT "buyer_matches_presentation_check" CHECK (
    ("response" = 'NOT_PRESENTED' AND "presented_at" IS NULL)
    OR
    ("response" <> 'NOT_PRESENTED' AND "presented_at" IS NOT NULL)
  )
);

CREATE UNIQUE INDEX "buyer_matches_idempotency_key_key"
  ON "buyer_matches"("idempotency_key");
CREATE INDEX "buyer_matches_lead_id_created_at_idx"
  ON "buyer_matches"("lead_id", "created_at" DESC);
CREATE INDEX "buyer_matches_buyer_profile_id_created_at_idx"
  ON "buyer_matches"("buyer_profile_id", "created_at" DESC);
CREATE INDEX "buyer_matches_opportunity_id_idx"
  ON "buyer_matches"("opportunity_id");

ALTER TABLE "buyer_matches"
  ADD CONSTRAINT "buyer_matches_lead_id_fkey"
  FOREIGN KEY ("lead_id") REFERENCES "leads"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "buyer_matches"
  ADD CONSTRAINT "buyer_matches_buyer_profile_id_fkey"
  FOREIGN KEY ("buyer_profile_id") REFERENCES "buyer_profiles"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "buyer_matches"
  ADD CONSTRAINT "buyer_matches_opportunity_id_fkey"
  FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
