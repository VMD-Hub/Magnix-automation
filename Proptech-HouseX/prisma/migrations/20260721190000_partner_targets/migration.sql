-- P3: simple B2B partner target list (Super outreach — not full CRM).

CREATE TYPE "PartnerTargetKind" AS ENUM (
  'UNION',
  'HR',
  'KCN',
  'ENTERPRISE',
  'OTHER'
);

CREATE TYPE "PartnerTargetStatus" AS ENUM (
  'TARGET',
  'CONTACTED',
  'MEETING',
  'PARTNER',
  'PAUSED',
  'DROP'
);

CREATE TABLE "partner_targets" (
  "id" TEXT NOT NULL,
  "org_name" TEXT NOT NULL,
  "kind" "PartnerTargetKind" NOT NULL DEFAULT 'OTHER',
  "area_hint" TEXT,
  "contact_name" TEXT,
  "contact_channel" TEXT,
  "status" "PartnerTargetStatus" NOT NULL DEFAULT 'TARGET',
  "next_action" TEXT,
  "next_action_at" TIMESTAMP(3),
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "partner_targets_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "partner_targets_status_next_action_at_idx" ON "partner_targets"("status", "next_action_at");
CREATE INDEX "partner_targets_kind_idx" ON "partner_targets"("kind");
