-- ADR-015 G1 local foundation. Additive only; this file is not evidence that the
-- migration has been applied to staging or production.

CREATE TYPE "ConsentSubjectType" AS ENUM ('LEAD', 'CUSTOMER');
CREATE TYPE "ConsentAction" AS ENUM ('GRANTED', 'DENIED', 'WITHDRAWN', 'EXPIRED', 'SUPERSEDED');
CREATE TYPE "AssignmentStatus" AS ENUM ('ASSIGNED', 'ACCEPTED', 'RELEASED', 'REASSIGNED');
CREATE TYPE "SalesJourney" AS ENUM ('A', 'S', 'P');
CREATE TYPE "OpportunityStage" AS ENUM ('OPEN', 'DISCOVERY', 'ACTIVE', 'COMMITTED', 'WON', 'LOST', 'CANCELLED');
CREATE TYPE "SalesActivityType" AS ENUM ('CONTACT_ATTEMPT', 'CONNECTED', 'NOTE', 'TASK', 'STATE_TRANSITION', 'APPOINTMENT_CREATED', 'APPOINTMENT_UPDATED');
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

ALTER TABLE "outbox_events"
  ADD COLUMN "aggregate_type" TEXT,
  ADD COLUMN "aggregate_id" TEXT,
  ADD COLUMN "correlation_id" TEXT,
  ADD COLUMN "schema_version" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX "outbox_events_aggregate_type_aggregate_id_idx"
  ON "outbox_events"("aggregate_type", "aggregate_id");

CREATE TABLE "consent_records" (
  "id" TEXT NOT NULL,
  "subject_type" "ConsentSubjectType" NOT NULL,
  "subject_id" TEXT NOT NULL,
  "lead_id" TEXT,
  "customer_id" TEXT,
  "purpose" TEXT NOT NULL,
  "channel" TEXT NOT NULL,
  "action" "ConsentAction" NOT NULL,
  "proof_type" TEXT NOT NULL,
  "proof_ref" TEXT,
  "proof_metadata" JSONB NOT NULL DEFAULT '{}',
  "policy_version" TEXT NOT NULL,
  "actor_id" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "occurred_at" TIMESTAMP(3) NOT NULL,
  "correlation_id" TEXT NOT NULL,
  "idempotency_key" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "consent_records_subject_link_check" CHECK (
    ("subject_type" = 'LEAD' AND "lead_id" = "subject_id" AND "customer_id" IS NULL)
    OR
    ("subject_type" = 'CUSTOMER' AND "customer_id" = "subject_id" AND "lead_id" IS NULL)
  )
);

CREATE TABLE "lead_assignments" (
  "id" TEXT NOT NULL,
  "lead_id" TEXT NOT NULL,
  "owner_id" TEXT NOT NULL,
  "status" "AssignmentStatus" NOT NULL DEFAULT 'ASSIGNED',
  "reason" TEXT,
  "assigned_by" TEXT NOT NULL,
  "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "accepted_at" TIMESTAMP(3),
  "first_attempt_at" TIMESTAMP(3),
  "first_connected_at" TIMESTAMP(3),
  "acceptance_sla_due_at" TIMESTAMP(3),
  "first_response_sla_due_at" TIMESTAMP(3),
  "closed_at" TIMESTAMP(3),
  "correlation_id" TEXT NOT NULL,
  "idempotency_key" TEXT NOT NULL,
  "accepted_idempotency_key" TEXT,
  "first_attempt_idempotency_key" TEXT,
  "first_connected_idempotency_key" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "lead_assignments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "buyer_profiles" (
  "id" TEXT NOT NULL,
  "lead_id" TEXT NOT NULL,
  "budget_min" DECIMAL(18,2),
  "budget_max" DECIMAL(18,2),
  "available_cash" DECIMAL(18,2),
  "payment_preference" TEXT,
  "locations" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "property_types" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "bedrooms_min" INTEGER,
  "purchase_purpose" TEXT,
  "timeframe" TEXT,
  "readiness" TEXT,
  "must_haves" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "completeness" INTEGER NOT NULL DEFAULT 0,
  "version" INTEGER NOT NULL DEFAULT 1,
  "updated_by" TEXT NOT NULL,
  "correlation_id" TEXT NOT NULL,
  "idempotency_key" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "buyer_profiles_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "buyer_profiles_budget_check" CHECK (
    "budget_min" IS NULL OR "budget_max" IS NULL OR "budget_min" <= "budget_max"
  ),
  CONSTRAINT "buyer_profiles_completeness_check" CHECK ("completeness" BETWEEN 0 AND 100)
);

CREATE TABLE "opportunities" (
  "id" TEXT NOT NULL,
  "lead_id" TEXT NOT NULL,
  "journey" "SalesJourney" NOT NULL,
  "stage" "OpportunityStage" NOT NULL DEFAULT 'OPEN',
  "project_ref" TEXT,
  "listing_ref" TEXT,
  "unit_ref" TEXT,
  "reason" TEXT,
  "actor_id" TEXT NOT NULL,
  "correlation_id" TEXT NOT NULL,
  "idempotency_key" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "buyer_profile_mutations" (
  "id" TEXT NOT NULL,
  "buyer_profile_id" TEXT NOT NULL,
  "lead_id" TEXT NOT NULL,
  "idempotency_key" TEXT NOT NULL,
  "input_hash" TEXT NOT NULL,
  "result_version" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "buyer_profile_mutations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "sales_activities" (
  "id" TEXT NOT NULL,
  "lead_id" TEXT NOT NULL,
  "opportunity_id" TEXT,
  "type" "SalesActivityType" NOT NULL,
  "channel" TEXT,
  "note" TEXT,
  "from_state" TEXT,
  "to_state" TEXT,
  "reason" TEXT,
  "actor_id" TEXT NOT NULL,
  "occurred_at" TIMESTAMP(3) NOT NULL,
  "due_at" TIMESTAMP(3),
  "correlation_id" TEXT NOT NULL,
  "idempotency_key" TEXT NOT NULL,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sales_activities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "appointments" (
  "id" TEXT NOT NULL,
  "lead_id" TEXT NOT NULL,
  "opportunity_id" TEXT,
  "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
  "channel" TEXT NOT NULL,
  "scheduled_at" TIMESTAMP(3) NOT NULL,
  "duration_min" INTEGER,
  "attended_at" TIMESTAMP(3),
  "no_show_at" TIMESTAMP(3),
  "cancelled_at" TIMESTAMP(3),
  "next_action" TEXT,
  "actor_id" TEXT NOT NULL,
  "correlation_id" TEXT NOT NULL,
  "idempotency_key" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "appointments_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "appointments_duration_check" CHECK ("duration_min" IS NULL OR "duration_min" BETWEEN 5 AND 1440)
);

CREATE UNIQUE INDEX "consent_records_idempotency_key_key" ON "consent_records"("idempotency_key");
CREATE INDEX "consent_records_subject_type_subject_id_purpose_channel_occurred_idx" ON "consent_records"("subject_type", "subject_id", "purpose", "channel", "occurred_at" DESC);
CREATE INDEX "consent_records_lead_id_idx" ON "consent_records"("lead_id");
CREATE INDEX "consent_records_customer_id_idx" ON "consent_records"("customer_id");

CREATE UNIQUE INDEX "lead_assignments_idempotency_key_key" ON "lead_assignments"("idempotency_key");
CREATE UNIQUE INDEX "lead_assignments_accepted_idempotency_key_key" ON "lead_assignments"("accepted_idempotency_key");
CREATE UNIQUE INDEX "lead_assignments_first_attempt_idempotency_key_key" ON "lead_assignments"("first_attempt_idempotency_key");
CREATE UNIQUE INDEX "lead_assignments_first_connected_idempotency_key_key" ON "lead_assignments"("first_connected_idempotency_key");
CREATE UNIQUE INDEX "lead_assignments_one_active_per_lead_key" ON "lead_assignments"("lead_id") WHERE "status" IN ('ASSIGNED', 'ACCEPTED');
CREATE INDEX "lead_assignments_lead_id_status_idx" ON "lead_assignments"("lead_id", "status");
CREATE INDEX "lead_assignments_owner_id_status_idx" ON "lead_assignments"("owner_id", "status");
CREATE INDEX "lead_assignments_acceptance_sla_due_at_idx" ON "lead_assignments"("acceptance_sla_due_at");
CREATE INDEX "lead_assignments_first_response_sla_due_at_idx" ON "lead_assignments"("first_response_sla_due_at");

CREATE UNIQUE INDEX "buyer_profiles_lead_id_key" ON "buyer_profiles"("lead_id");
CREATE UNIQUE INDEX "buyer_profiles_idempotency_key_key" ON "buyer_profiles"("idempotency_key");
CREATE UNIQUE INDEX "buyer_profile_mutations_idempotency_key_key" ON "buyer_profile_mutations"("idempotency_key");
CREATE INDEX "buyer_profile_mutations_buyer_profile_id_idx" ON "buyer_profile_mutations"("buyer_profile_id");
CREATE INDEX "buyer_profile_mutations_lead_id_created_at_idx" ON "buyer_profile_mutations"("lead_id", "created_at");

CREATE UNIQUE INDEX "opportunities_idempotency_key_key" ON "opportunities"("idempotency_key");
CREATE INDEX "opportunities_lead_id_stage_idx" ON "opportunities"("lead_id", "stage");
CREATE INDEX "opportunities_journey_stage_idx" ON "opportunities"("journey", "stage");

CREATE UNIQUE INDEX "sales_activities_idempotency_key_key" ON "sales_activities"("idempotency_key");
CREATE INDEX "sales_activities_lead_id_occurred_at_idx" ON "sales_activities"("lead_id", "occurred_at" DESC);
CREATE INDEX "sales_activities_opportunity_id_occurred_at_idx" ON "sales_activities"("opportunity_id", "occurred_at" DESC);

CREATE UNIQUE INDEX "appointments_idempotency_key_key" ON "appointments"("idempotency_key");
CREATE INDEX "appointments_lead_id_scheduled_at_idx" ON "appointments"("lead_id", "scheduled_at");
CREATE INDEX "appointments_status_scheduled_at_idx" ON "appointments"("status", "scheduled_at");

-- Consent is an append-only ledger. Subject rows cannot be deleted while
-- authoritative consent facts still reference them; SET NULL would also
-- violate consent_records_subject_link_check.
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "lead_assignments" ADD CONSTRAINT "lead_assignments_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "lead_assignments" ADD CONSTRAINT "lead_assignments_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "brokers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "buyer_profiles" ADD CONSTRAINT "buyer_profiles_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "buyer_profile_mutations" ADD CONSTRAINT "buyer_profile_mutations_buyer_profile_id_fkey" FOREIGN KEY ("buyer_profile_id") REFERENCES "buyer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "buyer_profile_mutations" ADD CONSTRAINT "buyer_profile_mutations_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sales_activities" ADD CONSTRAINT "sales_activities_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sales_activities" ADD CONSTRAINT "sales_activities_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
