-- Phase 0/1: NOXH case pipeline + Magnix inbound ingest (ADR-013)

-- CommissionStatus: ACCRUED, PAYABLE
ALTER TYPE "CommissionStatus" ADD VALUE IF NOT EXISTS 'ACCRUED';
ALTER TYPE "CommissionStatus" ADD VALUE IF NOT EXISTS 'PAYABLE';

ALTER TABLE "commissions"
  ADD COLUMN IF NOT EXISTS "signed_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "accrued_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "payable_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "expected_pay_date" DATE;

CREATE INDEX IF NOT EXISTS "commissions_status_expected_pay_date_idx"
  ON "commissions"("status", "expected_pay_date");

-- NOXH case enums
CREATE TYPE "NoxhMilestone" AS ENUM (
  'M1_RECEIVED',
  'M2_DOCUMENTS',
  'M3_SUBMITTED',
  'M4_APPROVED',
  'M5_SIGNED'
);

CREATE TYPE "NoxhCaseStatus" AS ENUM (
  'ACTIVE',
  'UNREACHABLE',
  'DECLINED',
  'COMPLETED',
  'RELEASED'
);

CREATE TYPE "NoxhDocType" AS ENUM (
  'DOC_ID',
  'DOC_MARRIAGE',
  'DOC_RESIDENCE',
  'DOC_OBJECT',
  'DOC_HOUSING',
  'DOC_INCOME',
  'DOC_APPLICATION',
  'DOC_DEPOSIT_PROOF',
  'DOC_CIC',
  'DOC_BANK_INCOME',
  'DOC_LOAN_APP'
);

CREATE TYPE "NoxhDocStatus" AS ENUM (
  'NOT_REQUIRED',
  'MISSING',
  'RECEIVED',
  'REVIEWING',
  'PASSED',
  'REJECTED',
  'EXPIRED'
);

CREATE TYPE "CtvAssistType" AS ENUM ('NUDGE', 'ESCORT', 'NOTE');

CREATE TABLE "noxh_cases" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "customer_name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "normalized_phone" TEXT NOT NULL,
  "broker_id" TEXT,
  "lead_id" TEXT,
  "project_id" TEXT,
  "unit_booking_id" TEXT,
  "object_group" TEXT NOT NULL DEFAULT 'WORKER',
  "intend_to_borrow" BOOLEAN NOT NULL DEFAULT false,
  "milestone" "NoxhMilestone" NOT NULL DEFAULT 'M1_RECEIVED',
  "milestone_sub" TEXT,
  "case_status" "NoxhCaseStatus" NOT NULL DEFAULT 'ACTIVE',
  "ops_note" TEXT,
  "attribution_locked_at" TIMESTAMP(3),
  "lock_expires_at" TIMESTAMP(3),
  "claimed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "first_contacted_at" TIMESTAMP(3),
  "completed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "noxh_cases_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "noxh_cases_code_key" ON "noxh_cases"("code");
CREATE UNIQUE INDEX "noxh_cases_lead_id_key" ON "noxh_cases"("lead_id");
CREATE UNIQUE INDEX "noxh_cases_unit_booking_id_key" ON "noxh_cases"("unit_booking_id");
CREATE INDEX "noxh_cases_broker_id_case_status_idx" ON "noxh_cases"("broker_id", "case_status");
CREATE INDEX "noxh_cases_normalized_phone_case_status_idx" ON "noxh_cases"("normalized_phone", "case_status");
CREATE INDEX "noxh_cases_milestone_idx" ON "noxh_cases"("milestone");
CREATE INDEX "noxh_cases_lock_expires_at_idx" ON "noxh_cases"("lock_expires_at");

CREATE TABLE "case_documents" (
  "id" TEXT NOT NULL,
  "case_id" TEXT NOT NULL,
  "doc_type" "NoxhDocType" NOT NULL,
  "status" "NoxhDocStatus" NOT NULL DEFAULT 'MISSING',
  "received_at" TIMESTAMP(3),
  "reviewed_at" TIMESTAMP(3),
  "passed_at" TIMESTAMP(3),
  "reject_reason" TEXT,
  "ctv_action_hint" TEXT,
  "expires_at" TIMESTAMP(3),
  "updated_by" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "case_documents_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "case_documents_case_id_doc_type_key" ON "case_documents"("case_id", "doc_type");
CREATE INDEX "case_documents_case_id_status_idx" ON "case_documents"("case_id", "status");

CREATE TABLE "case_assist_logs" (
  "id" TEXT NOT NULL,
  "case_id" TEXT NOT NULL,
  "broker_id" TEXT NOT NULL,
  "assist_type" "CtvAssistType" NOT NULL,
  "message" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "case_assist_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "case_assist_logs_case_id_idx" ON "case_assist_logs"("case_id");
CREATE INDEX "case_assist_logs_broker_id_idx" ON "case_assist_logs"("broker_id");

CREATE TABLE "case_milestone_events" (
  "id" TEXT NOT NULL,
  "case_id" TEXT NOT NULL,
  "from_milestone" "NoxhMilestone",
  "to_milestone" "NoxhMilestone" NOT NULL,
  "milestone_sub" TEXT,
  "ops_note" TEXT,
  "actor" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "case_milestone_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "case_milestone_events_case_id_idx" ON "case_milestone_events"("case_id");

CREATE TABLE "inbound_uid_leads" (
  "id" TEXT NOT NULL,
  "uid" TEXT NOT NULL,
  "uid_source" TEXT NOT NULL,
  "normalized_key" TEXT NOT NULL,
  "captured_at" TIMESTAMP(3) NOT NULL,
  "text" TEXT,
  "segment" TEXT NOT NULL DEFAULT 'unclassified',
  "score" INTEGER NOT NULL DEFAULT 0,
  "interest_key" TEXT,
  "tags" JSONB NOT NULL DEFAULT '[]',
  "meta" JSONB NOT NULL DEFAULT '{}',
  "classify_method" TEXT NOT NULL DEFAULT 'regex',
  "consent_basis" TEXT,
  "status" TEXT NOT NULL DEFAULT 'classified',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "inbound_uid_leads_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "inbound_uid_leads_normalized_key_key" ON "inbound_uid_leads"("normalized_key");
CREATE INDEX "inbound_uid_leads_uid_source_captured_at_idx" ON "inbound_uid_leads"("uid_source", "captured_at");
CREATE INDEX "inbound_uid_leads_segment_score_idx" ON "inbound_uid_leads"("segment", "score");

CREATE TABLE "broker_notifications" (
  "id" TEXT NOT NULL,
  "broker_id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "case_id" TEXT,
  "read_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "broker_notifications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "broker_notifications_broker_id_read_at_idx" ON "broker_notifications"("broker_id", "read_at");
CREATE INDEX "broker_notifications_broker_id_created_at_idx" ON "broker_notifications"("broker_id", "created_at");

-- Foreign keys
ALTER TABLE "noxh_cases" ADD CONSTRAINT "noxh_cases_broker_id_fkey"
  FOREIGN KEY ("broker_id") REFERENCES "brokers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "noxh_cases" ADD CONSTRAINT "noxh_cases_lead_id_fkey"
  FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "noxh_cases" ADD CONSTRAINT "noxh_cases_project_id_fkey"
  FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "noxh_cases" ADD CONSTRAINT "noxh_cases_unit_booking_id_fkey"
  FOREIGN KEY ("unit_booking_id") REFERENCES "unit_bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "case_documents" ADD CONSTRAINT "case_documents_case_id_fkey"
  FOREIGN KEY ("case_id") REFERENCES "noxh_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "case_assist_logs" ADD CONSTRAINT "case_assist_logs_case_id_fkey"
  FOREIGN KEY ("case_id") REFERENCES "noxh_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "case_assist_logs" ADD CONSTRAINT "case_assist_logs_broker_id_fkey"
  FOREIGN KEY ("broker_id") REFERENCES "brokers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "case_milestone_events" ADD CONSTRAINT "case_milestone_events_case_id_fkey"
  FOREIGN KEY ("case_id") REFERENCES "noxh_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "broker_notifications" ADD CONSTRAINT "broker_notifications_broker_id_fkey"
  FOREIGN KEY ("broker_id") REFERENCES "brokers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
