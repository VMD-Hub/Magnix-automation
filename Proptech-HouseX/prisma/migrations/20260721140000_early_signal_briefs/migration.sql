-- ADR-016 Early Signal Review — queue L3 trước publish/nurture tin sớm.
CREATE TYPE "EarlySignalStatus" AS ENUM ('CAPTURED', 'PACKAGED', 'PENDING_L3', 'APPROVED', 'REJECTED', 'PUBLISHED');
CREATE TYPE "EarlySignalTier" AS ENUM ('T1_PRESS', 'T2_SXD', 'T3_DOSSIER', 'T4_SOR');
CREATE TYPE "EarlySignalRoleHint" AS ENUM ('SPONSOR', 'JV_SUBSIDIARY', 'CONTRACTOR', 'CHANNEL');
CREATE TYPE "EarlySignalResolveStatus" AS ENUM ('LINKED', 'UNLINKED', 'CONTRACTOR_ONLY', 'CHANNEL_PENDING_SPONSOR');

CREATE TABLE "early_signal_briefs" (
    "id" TEXT NOT NULL,
    "status" "EarlySignalStatus" NOT NULL DEFAULT 'CAPTURED',
    "tier" "EarlySignalTier" NOT NULL DEFAULT 'T1_PRESS',
    "press_url" TEXT,
    "sxd_url" TEXT,
    "group_slug" TEXT,
    "channel_slug" TEXT,
    "role_hint" "EarlySignalRoleHint",
    "resolve_status" "EarlySignalResolveStatus",
    "province_hint" TEXT,
    "project_id" TEXT,
    "article_id" TEXT,
    "ops_notes" TEXT,
    "reader_title" TEXT,
    "reader_body" TEXT,
    "reader_disclaimer" TEXT,
    "cta_label" TEXT,
    "nurture_on_approve" BOOLEAN NOT NULL DEFAULT false,
    "packaged_at" TIMESTAMP(3),
    "submitted_at" TIMESTAMP(3),
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by" TEXT,
    "reject_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "early_signal_briefs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "early_signal_briefs_status_created_at_idx" ON "early_signal_briefs"("status", "created_at");
CREATE INDEX "early_signal_briefs_tier_idx" ON "early_signal_briefs"("tier");
CREATE INDEX "early_signal_briefs_project_id_idx" ON "early_signal_briefs"("project_id");

ALTER TABLE "early_signal_briefs" ADD CONSTRAINT "early_signal_briefs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "early_signal_briefs" ADD CONSTRAINT "early_signal_briefs_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
