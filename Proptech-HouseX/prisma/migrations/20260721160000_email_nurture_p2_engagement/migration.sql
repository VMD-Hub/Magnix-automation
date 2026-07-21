-- ADR-017 P2 — email engagement + dispatch provider metadata.
ALTER TABLE "nurture_dispatches" ADD COLUMN "provider_message_id" TEXT;
ALTER TABLE "nurture_dispatches" ADD COLUMN "metadata" JSONB NOT NULL DEFAULT '{}';

CREATE INDEX "nurture_dispatches_provider_message_id_idx" ON "nurture_dispatches"("provider_message_id");

CREATE TABLE "email_engagement_events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "lead_id" TEXT,
    "enrollment_id" TEXT,
    "dispatch_id" TEXT,
    "provider_message_id" TEXT,
    "campaign_key" TEXT,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_engagement_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "email_engagement_events_idempotency_key_key" ON "email_engagement_events"("idempotency_key");
CREATE INDEX "email_engagement_events_type_occurred_at_idx" ON "email_engagement_events"("type", "occurred_at" DESC);
CREATE INDEX "email_engagement_events_lead_id_occurred_at_idx" ON "email_engagement_events"("lead_id", "occurred_at" DESC);
CREATE INDEX "email_engagement_events_provider_message_id_idx" ON "email_engagement_events"("provider_message_id");
CREATE INDEX "email_engagement_events_campaign_key_type_idx" ON "email_engagement_events"("campaign_key", "type");

ALTER TABLE "email_engagement_events" ADD CONSTRAINT "email_engagement_events_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "email_engagement_events" ADD CONSTRAINT "email_engagement_events_dispatch_id_fkey" FOREIGN KEY ("dispatch_id") REFERENCES "nurture_dispatches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
