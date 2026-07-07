-- Lucky wheel / khuyến mãi Phase 1

CREATE TYPE "PromotionCampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ENDED');
CREATE TYPE "PromotionPrizeTier" AS ENUM ('SPECIAL', 'FIRST', 'SECOND', 'THIRD', 'CONSOLATION', 'EMPTY');
CREATE TYPE "PromotionPrizeType" AS ENUM ('PHYSICAL', 'SERVICE', 'VOUCHER', 'EMPTY');
CREATE TYPE "PromotionFulfillmentStatus" AS ENUM ('PENDING_CONTRACT', 'CONTRACT_SIGNED', 'DELIVERED', 'EXPIRED', 'VOID');

CREATE TABLE "promotion_campaigns" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "terms_markdown" TEXT,
    "status" "PromotionCampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "max_spins_per_account" INTEGER NOT NULL DEFAULT 6,
    "max_spins_per_day" INTEGER NOT NULL DEFAULT 3,
    "spin_duration_ms" INTEGER NOT NULL DEFAULT 8000,
    "wheel_layout" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotion_campaigns_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "promotion_campaigns_slug_key" ON "promotion_campaigns"("slug");
CREATE INDEX "promotion_campaigns_status_start_at_end_at_idx" ON "promotion_campaigns"("status", "start_at", "end_at");

CREATE TABLE "promotion_prizes" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "tier" "PromotionPrizeTier" NOT NULL,
    "prize_type" "PromotionPrizeType" NOT NULL,
    "label" TEXT NOT NULL,
    "short_label" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "weight_percent" DOUBLE PRECISION NOT NULL,
    "total_qty" INTEGER NOT NULL,
    "remaining_qty" INTEGER NOT NULL,
    "active_from" TIMESTAMP(3),
    "active_until" TIMESTAMP(3),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotion_prizes_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "promotion_prizes_campaign_id_idx" ON "promotion_prizes"("campaign_id");

CREATE TABLE "promotion_participants" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "user_account_id" TEXT NOT NULL,
    "noxh_eligible_at" TIMESTAMP(3),
    "share_bonus_granted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotion_participants_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "promotion_participants_campaign_id_customer_id_key" ON "promotion_participants"("campaign_id", "customer_id");
CREATE INDEX "promotion_participants_user_account_id_idx" ON "promotion_participants"("user_account_id");

CREATE TABLE "promotion_spins" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "participant_id" TEXT NOT NULL,
    "prize_id" TEXT,
    "segment_index" INTEGER NOT NULL,
    "is_preview" BOOLEAN NOT NULL DEFAULT false,
    "ip_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotion_spins_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "promotion_spins_campaign_id_customer_id_created_at_idx" ON "promotion_spins"("campaign_id", "customer_id", "created_at");
CREATE INDEX "promotion_spins_created_at_idx" ON "promotion_spins"("created_at");

CREATE TABLE "promotion_wins" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "participant_id" TEXT NOT NULL,
    "prize_id" TEXT NOT NULL,
    "spin_id" TEXT NOT NULL,
    "redemption_code" TEXT NOT NULL,
    "fulfillment_status" "PromotionFulfillmentStatus" NOT NULL DEFAULT 'PENDING_CONTRACT',
    "display_name" TEXT NOT NULL,
    "fulfilled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotion_wins_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "promotion_wins_participant_id_key" ON "promotion_wins"("participant_id");
CREATE UNIQUE INDEX "promotion_wins_spin_id_key" ON "promotion_wins"("spin_id");
CREATE UNIQUE INDEX "promotion_wins_redemption_code_key" ON "promotion_wins"("redemption_code");
CREATE UNIQUE INDEX "promotion_wins_campaign_id_customer_id_key" ON "promotion_wins"("campaign_id", "customer_id");
CREATE INDEX "promotion_wins_campaign_id_created_at_idx" ON "promotion_wins"("campaign_id", "created_at");

ALTER TABLE "promotion_prizes" ADD CONSTRAINT "promotion_prizes_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "promotion_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "promotion_participants" ADD CONSTRAINT "promotion_participants_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "promotion_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "promotion_participants" ADD CONSTRAINT "promotion_participants_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "promotion_spins" ADD CONSTRAINT "promotion_spins_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "promotion_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "promotion_spins" ADD CONSTRAINT "promotion_spins_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "promotion_spins" ADD CONSTRAINT "promotion_spins_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "promotion_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "promotion_spins" ADD CONSTRAINT "promotion_spins_prize_id_fkey" FOREIGN KEY ("prize_id") REFERENCES "promotion_prizes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "promotion_wins" ADD CONSTRAINT "promotion_wins_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "promotion_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "promotion_wins" ADD CONSTRAINT "promotion_wins_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "promotion_wins" ADD CONSTRAINT "promotion_wins_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "promotion_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "promotion_wins" ADD CONSTRAINT "promotion_wins_prize_id_fkey" FOREIGN KEY ("prize_id") REFERENCES "promotion_prizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "promotion_wins" ADD CONSTRAINT "promotion_wins_spin_id_fkey" FOREIGN KEY ("spin_id") REFERENCES "promotion_spins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
