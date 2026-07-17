-- Track A: authoritative, typed acquisition-touch -> platform-lead link.
-- Existing valid JSON links are adopted once; malformed/orphaned values stay
-- available in meta for manual review but are not promoted into the FK.

ALTER TABLE "inbound_uid_leads"
  ADD COLUMN "platform_lead_id" TEXT;

WITH candidates AS (
  SELECT
    inbound."id",
    inbound."meta" ->> 'platform_lead_id' AS "lead_id",
    ROW_NUMBER() OVER (
      PARTITION BY inbound."meta" ->> 'platform_lead_id'
      ORDER BY inbound."updated_at" DESC, inbound."id"
    ) AS "link_rank"
  FROM "inbound_uid_leads" inbound
  INNER JOIN "leads" lead
    ON lead."id" = inbound."meta" ->> 'platform_lead_id'
  WHERE jsonb_typeof(inbound."meta") = 'object'
)
UPDATE "inbound_uid_leads" inbound
SET "platform_lead_id" = candidates."lead_id"
FROM candidates
WHERE inbound."id" = candidates."id"
  AND candidates."link_rank" = 1;

CREATE UNIQUE INDEX "inbound_uid_leads_platform_lead_id_key"
  ON "inbound_uid_leads"("platform_lead_id");

ALTER TABLE "inbound_uid_leads"
  ADD CONSTRAINT "inbound_uid_leads_platform_lead_id_fkey"
  FOREIGN KEY ("platform_lead_id") REFERENCES "leads"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
