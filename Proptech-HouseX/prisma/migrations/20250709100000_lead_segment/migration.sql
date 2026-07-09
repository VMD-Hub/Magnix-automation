-- Lead segment for two-lanes Mini App (NOXH / CCTM)

CREATE TYPE "LeadSegment" AS ENUM ('NOXH', 'CCTM');

ALTER TABLE "leads" ADD COLUMN "segment" "LeadSegment";

CREATE INDEX "leads_segment_idx" ON "leads"("segment");
