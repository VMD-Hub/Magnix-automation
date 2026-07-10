-- CRM-R4: Ops nurture meta + board index
ALTER TABLE "leads" ADD COLUMN "ops_meta" JSONB NOT NULL DEFAULT '{}';

CREATE INDEX "leads_assigned_broker_id_status_idx" ON "leads"("assigned_broker_id", "status");
