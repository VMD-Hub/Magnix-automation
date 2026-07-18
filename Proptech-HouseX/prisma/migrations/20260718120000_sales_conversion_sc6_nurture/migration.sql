-- ADR-015 SC-6: consent-safe nurture enrollment + dispatch audit.

CREATE TYPE "NurtureEnrollmentStatus" AS ENUM ('ELIGIBLE', 'ENROLLED', 'SUPPRESSED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "NurtureDispatchStatus" AS ENUM ('SENT', 'FAILED', 'SKIPPED');

CREATE TABLE "nurture_enrollments" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "opportunity_id" TEXT,
    "purpose" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "status" "NurtureEnrollmentStatus" NOT NULL DEFAULT 'ENROLLED',
    "script_id" TEXT,
    "cohort_key" TEXT,
    "actor_id" TEXT NOT NULL,
    "correlation_id" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "nurture_enrollments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "nurture_enrollments_idempotency_key_key" ON "nurture_enrollments"("idempotency_key");
CREATE INDEX "nurture_enrollments_lead_id_purpose_channel_idx" ON "nurture_enrollments"("lead_id", "purpose", "channel");
CREATE INDEX "nurture_enrollments_status_updated_at_idx" ON "nurture_enrollments"("status", "updated_at");

ALTER TABLE "nurture_enrollments"
  ADD CONSTRAINT "nurture_enrollments_lead_id_fkey"
  FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "nurture_dispatches" (
    "id" TEXT NOT NULL,
    "enrollment_id" TEXT NOT NULL,
    "status" "NurtureDispatchStatus" NOT NULL,
    "actor_id" TEXT NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "correlation_id" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "nurture_dispatches_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "nurture_dispatches_idempotency_key_key" ON "nurture_dispatches"("idempotency_key");
CREATE INDEX "nurture_dispatches_enrollment_id_occurred_at_idx" ON "nurture_dispatches"("enrollment_id", "occurred_at" DESC);

ALTER TABLE "nurture_dispatches"
  ADD CONSTRAINT "nurture_dispatches_enrollment_id_fkey"
  FOREIGN KEY ("enrollment_id") REFERENCES "nurture_enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
