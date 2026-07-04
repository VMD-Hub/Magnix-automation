-- Admin duyệt tin: PENDING_REVIEW + trường audit từ chối

ALTER TYPE "ListingStatus" ADD VALUE IF NOT EXISTS 'PENDING_REVIEW';

ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "reject_reason" TEXT;
ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "submitted_at" TIMESTAMP(3);
ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "reviewed_at" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "listings_status_submitted_at_idx" ON "listings"("status", "submitted_at");
