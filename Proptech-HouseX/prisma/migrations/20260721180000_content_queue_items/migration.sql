-- Magnix content factory queue on House X (Super L3 + mandatory NOXH CTA tool).

CREATE TYPE "ContentQueueStatus" AS ENUM (
  'INTAKE',
  'PENDING_L3',
  'APPROVED',
  'REJECTED',
  'PUBLISHED'
);

CREATE TYPE "ContentQueueChannel" AS ENUM (
  'WEBSITE',
  'FB_PAGE',
  'SHORT_VIDEO',
  'ZALO_OA'
);

CREATE TABLE "content_queue_items" (
  "id" TEXT NOT NULL,
  "normalized_key" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "pain_point" TEXT,
  "body_preview" TEXT,
  "segment" TEXT,
  "score" INTEGER,
  "status" "ContentQueueStatus" NOT NULL DEFAULT 'INTAKE',
  "publish_channel" "ContentQueueChannel",
  "cta_tool_id" TEXT,
  "cta_label" TEXT,
  "cta_href" TEXT,
  "source_url" TEXT,
  "sheet_key" TEXT,
  "article_id" TEXT,
  "l3_checklist" JSONB,
  "ops_notes" TEXT,
  "reviewed_at" TIMESTAMP(3),
  "reviewed_by" TEXT,
  "reject_reason" TEXT,
  "published_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "content_queue_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "content_queue_items_normalized_key_key" ON "content_queue_items"("normalized_key");
CREATE INDEX "content_queue_items_status_created_at_idx" ON "content_queue_items"("status", "created_at");
CREATE INDEX "content_queue_items_cta_tool_id_idx" ON "content_queue_items"("cta_tool_id");
CREATE INDEX "content_queue_items_sheet_key_idx" ON "content_queue_items"("sheet_key");

ALTER TABLE "content_queue_items"
  ADD CONSTRAINT "content_queue_items_article_id_fkey"
  FOREIGN KEY ("article_id") REFERENCES "articles"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
