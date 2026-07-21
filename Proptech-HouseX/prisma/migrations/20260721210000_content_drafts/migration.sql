-- P4.2: Magnix content_drafts on House X Admin.

CREATE TYPE "ContentDraftStatus" AS ENUM (
  'DRAFT',
  'PENDING_L3',
  'APPROVED',
  'REJECTED',
  'PUBLISHED'
);

CREATE TABLE "content_drafts" (
  "id" TEXT NOT NULL,
  "normalized_key" TEXT NOT NULL,
  "sheet_key" TEXT,
  "source_normalized_key" TEXT,
  "title" TEXT NOT NULL,
  "hook_line" TEXT,
  "artifact_markdown" TEXT,
  "cta_opt_in" TEXT,
  "disclaimer" TEXT,
  "export_hint" TEXT,
  "segment" TEXT,
  "qa_tier" TEXT,
  "source" TEXT,
  "status" "ContentDraftStatus" NOT NULL DEFAULT 'DRAFT',
  "sheet_status" TEXT,
  "publish_channel" "ContentQueueChannel",
  "cta_tool_id" TEXT,
  "cta_label" TEXT,
  "cta_href" TEXT,
  "l3_checklist" JSONB,
  "article_id" TEXT,
  "ops_notes" TEXT,
  "reviewed_at" TIMESTAMP(3),
  "reviewed_by" TEXT,
  "reject_reason" TEXT,
  "published_at" TIMESTAMP(3),
  "scheduled_at" TIMESTAMP(3),
  "sheet_synced_at" TIMESTAMP(3),
  "sheet_created_at" TEXT,
  "meta" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "content_drafts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "content_drafts_normalized_key_key" ON "content_drafts"("normalized_key");
CREATE UNIQUE INDEX "content_drafts_sheet_key_key" ON "content_drafts"("sheet_key");
CREATE INDEX "content_drafts_status_created_at_idx" ON "content_drafts"("status", "created_at");
CREATE INDEX "content_drafts_cta_tool_id_idx" ON "content_drafts"("cta_tool_id");
CREATE INDEX "content_drafts_scheduled_at_idx" ON "content_drafts"("scheduled_at");
CREATE INDEX "content_drafts_source_normalized_key_idx" ON "content_drafts"("source_normalized_key");

ALTER TABLE "content_drafts"
  ADD CONSTRAINT "content_drafts_article_id_fkey"
  FOREIGN KEY ("article_id") REFERENCES "articles"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
