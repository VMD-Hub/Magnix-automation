-- P4 slice 1: schedule + sheet sync metadata on content_queue_items.

ALTER TABLE "content_queue_items" ADD COLUMN IF NOT EXISTS "scheduled_at" TIMESTAMP(3);
ALTER TABLE "content_queue_items" ADD COLUMN IF NOT EXISTS "sheet_synced_at" TIMESTAMP(3);
ALTER TABLE "content_queue_items" ADD COLUMN IF NOT EXISTS "platform" TEXT;
ALTER TABLE "content_queue_items" ADD COLUMN IF NOT EXISTS "sheet_status" TEXT;

CREATE INDEX IF NOT EXISTS "content_queue_items_scheduled_at_idx" ON "content_queue_items"("scheduled_at");
