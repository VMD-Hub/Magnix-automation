-- ADR-015 final review hardening. Additive nullable columns preserve deployment
-- ordering and bind each assignment fact retry to its original correlation.

ALTER TABLE "lead_assignments"
  ADD COLUMN "accepted_correlation_id" TEXT,
  ADD COLUMN "first_attempt_correlation_id" TEXT,
  ADD COLUMN "first_connected_correlation_id" TEXT;

-- The three legacy columns had separate unique indexes, so the same key could
-- exist under different fact types. Abort explicitly instead of silently
-- choosing one binding.
DO $$
BEGIN
  IF EXISTS (
    SELECT "legacy_key"
    FROM (
      SELECT "accepted_idempotency_key" AS "legacy_key"
      FROM "lead_assignments"
      WHERE "accepted_idempotency_key" IS NOT NULL
      UNION ALL
      SELECT "first_attempt_idempotency_key"
      FROM "lead_assignments"
      WHERE "first_attempt_idempotency_key" IS NOT NULL
      UNION ALL
      SELECT "first_connected_idempotency_key"
      FROM "lead_assignments"
      WHERE "first_connected_idempotency_key" IS NOT NULL
    ) AS "legacy_keys"
    GROUP BY "legacy_key"
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION
      'duplicate legacy assignment fact idempotency keys require manual resolution';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM "lead_assignments"
    WHERE
      ("accepted_idempotency_key" IS NOT NULL AND "accepted_at" IS NULL)
      OR
      ("first_attempt_idempotency_key" IS NOT NULL AND "first_attempt_at" IS NULL)
      OR
      ("first_connected_idempotency_key" IS NOT NULL AND "first_connected_at" IS NULL)
  ) THEN
    RAISE EXCEPTION
      'legacy assignment fact idempotency key is missing occurrence time';
  END IF;
END
$$;

UPDATE "lead_assignments"
SET
  "accepted_correlation_id" = CASE
    WHEN "accepted_idempotency_key" IS NOT NULL THEN "correlation_id"
    ELSE NULL
  END,
  "first_attempt_correlation_id" = CASE
    WHEN "first_attempt_idempotency_key" IS NOT NULL THEN "correlation_id"
    ELSE NULL
  END,
  "first_connected_correlation_id" = CASE
    WHEN "first_connected_idempotency_key" IS NOT NULL THEN "correlation_id"
    ELSE NULL
  END;

CREATE TABLE "lead_assignment_facts" (
  "id" TEXT NOT NULL,
  "assignment_id" TEXT NOT NULL,
  "fact" TEXT NOT NULL,
  "actor_id" TEXT NOT NULL,
  "occurred_at" TIMESTAMP(3) NOT NULL,
  "correlation_id" TEXT NOT NULL,
  "idempotency_key" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "lead_assignment_facts_pkey" PRIMARY KEY ("id")
);

INSERT INTO "lead_assignment_facts" (
  "id",
  "assignment_id",
  "fact",
  "actor_id",
  "occurred_at",
  "correlation_id",
  "idempotency_key"
)
SELECT
  'legacy:accept:' || "id",
  "id",
  'accept',
  "owner_id",
  "accepted_at",
  "accepted_correlation_id",
  "accepted_idempotency_key"
FROM "lead_assignments"
WHERE "accepted_idempotency_key" IS NOT NULL
UNION ALL
SELECT
  'legacy:first_attempt:' || "id",
  "id",
  'first_attempt',
  "owner_id",
  "first_attempt_at",
  "first_attempt_correlation_id",
  "first_attempt_idempotency_key"
FROM "lead_assignments"
WHERE "first_attempt_idempotency_key" IS NOT NULL
UNION ALL
SELECT
  'legacy:first_connected:' || "id",
  "id",
  'first_connected',
  "owner_id",
  "first_connected_at",
  "first_connected_correlation_id",
  "first_connected_idempotency_key"
FROM "lead_assignments"
WHERE "first_connected_idempotency_key" IS NOT NULL;

CREATE UNIQUE INDEX "lead_assignment_facts_idempotency_key_key"
  ON "lead_assignment_facts"("idempotency_key");
CREATE INDEX "lead_assignment_facts_assignment_id_occurred_at_idx"
  ON "lead_assignment_facts"("assignment_id", "occurred_at");

ALTER TABLE "lead_assignment_facts"
  ADD CONSTRAINT "lead_assignment_facts_assignment_id_fkey"
  FOREIGN KEY ("assignment_id") REFERENCES "lead_assignments"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
