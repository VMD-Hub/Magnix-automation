-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('THUONG_MAI', 'NHA_O_XA_HOI');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('SAP_MO_BAN', 'DANG_BAN', 'DA_BAN_GIAO', 'TAM_DUNG');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('SALE', 'RENT');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'ACTIVE', 'EXPIRED', 'SOLD', 'REJECTED');

-- CreateEnum
CREATE TYPE "ListingTier" AS ENUM ('FREE', 'VIP', 'PREMIUM');

-- CreateEnum
CREATE TYPE "BrokerType" AS ENUM ('FREE', 'CTV', 'AGENCY');

-- CreateEnum
CREATE TYPE "ListingSource" AS ENUM ('DEVELOPER_F1', 'CONSIGNMENT', 'BANK_NPL', 'EXTERNAL_AD');

-- CreateEnum
CREATE TYPE "VerificationTier" AS ENUM ('T0', 'T1', 'T2', 'T3');

-- CreateEnum
CREATE TYPE "MonetizationTrack" AS ENUM ('ADVERTISING', 'MANAGED');

-- CreateEnum
CREATE TYPE "ProjectUnitStatus" AS ENUM ('AVAILABLE', 'HELD', 'BOOKED', 'DEPOSITED', 'SOLD', 'HANDED_OVER', 'LIQUIDATED');

-- CreateEnum
CREATE TYPE "UnitBookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'EXPIRED', 'CANCELLED', 'CONVERTED_TO_DEPOSIT');

-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('CUSTOMER', 'BROKER');

-- CreateEnum
CREATE TYPE "CtvApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "ReferralType" AS ENUM ('CTV_PROJECT', 'SHARE_LISTING');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('PENDING', 'APPROVED', 'PAID', 'REJECTED');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AuthTokenType" AS ENUM ('EMAIL_VERIFY', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "OutboxStatus" AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'DEAD');

-- CreateTable
CREATE TABLE "developers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tax_code" TEXT NOT NULL,
    "logo_url" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "developers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "developer_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "project_type" "ProjectType" NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'SAP_MO_BAN',
    "province" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "ward" TEXT,
    "address" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "total_area" DOUBLE PRECISION,
    "density" DOUBLE PRECISION,
    "overview_data" JSONB,
    "description" TEXT,
    "handover_date" TIMESTAMP(3),
    "seo_title" TEXT,
    "seo_description" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_unit_types" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "area_min" DOUBLE PRECISION,
    "area_max" DOUBLE PRECISION,
    "bedrooms" INTEGER,
    "price_from" DECIMAL(18,2),
    "floor_plan_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_unit_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_units" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "unit_type_id" TEXT,
    "code" TEXT NOT NULL,
    "block" TEXT,
    "floor" INTEGER,
    "direction" TEXT,
    "view" TEXT,
    "area" DOUBLE PRECISION,
    "bedrooms" INTEGER,
    "price" DECIMAL(18,2) NOT NULL,
    "status" "ProjectUnitStatus" NOT NULL DEFAULT 'AVAILABLE',
    "deposit_booking_id" TEXT,
    "deposit_locked_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_bookings" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "customer_id" TEXT,
    "broker_id" TEXT,
    "referral_id" TEXT,
    "customer_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "normalized_phone" TEXT NOT NULL,
    "email" TEXT,
    "message" TEXT,
    "status" "UnitBookingStatus" NOT NULL DEFAULT 'PENDING',
    "expires_at" TIMESTAMP(3),
    "converted_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "cancel_reason" TEXT,
    "converted_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unit_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_legal_docs" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "doc_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "issued_date" TIMESTAMP(3),
    "file_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_legal_docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_tags" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "body" TEXT NOT NULL,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "cover_image_url" TEXT,
    "author_name" TEXT,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_tag_links" (
    "article_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "article_tag_links_pkey" PRIMARY KEY ("article_id","tag_id")
);

-- CreateTable
CREATE TABLE "article_projects" (
    "article_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "article_projects_pkey" PRIMARY KEY ("article_id","project_id")
);

-- CreateTable
CREATE TABLE "brokers" (
    "id" TEXT NOT NULL,
    "user_account_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "license_no" TEXT,
    "license_verified" BOOLEAN NOT NULL DEFAULT false,
    "broker_type" "BrokerType" NOT NULL DEFAULT 'FREE',
    "ctv_code" TEXT,
    "tier" "ListingTier" NOT NULL DEFAULT 'FREE',
    "rating" DOUBLE PRECISION DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brokers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "broker_id" TEXT NOT NULL,
    "project_id" TEXT,
    "unit_type_id" TEXT,
    "transaction_type" "TransactionType" NOT NULL,
    "property_type" TEXT NOT NULL,
    "price" DECIMAL(18,2) NOT NULL,
    "area" DOUBLE PRECISION,
    "address" TEXT,
    "province" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "ward" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "description" TEXT,
    "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT',
    "tier" "ListingTier" NOT NULL DEFAULT 'FREE',
    "source" "ListingSource" NOT NULL DEFAULT 'EXTERNAL_AD',
    "verification_tier" "VerificationTier" NOT NULL DEFAULT 'T0',
    "track" "MonetizationTrack" NOT NULL DEFAULT 'ADVERTISING',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "expire_at" TIMESTAMP(3),
    "photo_count" INTEGER NOT NULL DEFAULT 0,
    "has_video" BOOLEAN NOT NULL DEFAULT false,
    "quality_score" INTEGER NOT NULL DEFAULT 0,
    "rank_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rank_updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_media" (
    "id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'image',
    "position" INTEGER NOT NULL DEFAULT 0,
    "provider" TEXT,
    "playback_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'READY',
    "reject_reason" TEXT,
    "duration_sec" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "phash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listing_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_accounts" (
    "id" TEXT NOT NULL,
    "role" "AccountRole" NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "normalized_phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified_at" TIMESTAMP(3),
    "marketing_opt_in" BOOLEAN NOT NULL DEFAULT true,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "user_account_id" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "normalized_phone" TEXT NOT NULL,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_auth_tokens" (
    "id" TEXT NOT NULL,
    "user_account_id" TEXT NOT NULL,
    "type" "AuthTokenType" NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_auth_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ctv_applications" (
    "id" TEXT NOT NULL,
    "broker_id" TEXT NOT NULL,
    "id_number" TEXT,
    "experience" TEXT,
    "region" TEXT,
    "motivation" TEXT,
    "status" "CtvApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "reject_reason" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ctv_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT,
    "listing_id" TEXT,
    "project_id" TEXT,
    "referral_id" TEXT,
    "assigned_broker_id" TEXT,
    "source" TEXT NOT NULL DEFAULT 'organic',
    "message" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" TEXT NOT NULL,
    "broker_id" TEXT NOT NULL,
    "project_id" TEXT,
    "listing_id" TEXT,
    "code" TEXT NOT NULL,
    "type" "ReferralType" NOT NULL,
    "click_count" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commissions" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "referral_id" TEXT,
    "broker_id" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "rate" DOUBLE PRECISION,
    "status" "CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canonical_properties" (
    "id" TEXT NOT NULL,
    "cluster_key" TEXT NOT NULL,
    "project_id" TEXT,
    "unit_type_id" TEXT,
    "property_type" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "offer_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "canonical_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_fingerprints" (
    "id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    "content_hash" TEXT NOT NULL,
    "dupe_key" TEXT NOT NULL,
    "image_phash" TEXT[],
    "canonical_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listing_fingerprints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribution_locks" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "broker_id" TEXT NOT NULL,
    "referral_id" TEXT,
    "source" TEXT NOT NULL DEFAULT 'referral',
    "locked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attribution_locks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_history" (
    "id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "from_status" TEXT,
    "to_status" TEXT NOT NULL,
    "reason" TEXT,
    "actor" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "dedupe_key" TEXT,
    "status" "OutboxStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 8,
    "available_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locked_at" TIMESTAMP(3),
    "last_error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribution_events" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "from_broker" TEXT,
    "to_broker" TEXT,
    "referral_id" TEXT,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attribution_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "developers_tax_code_key" ON "developers"("tax_code");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_province_district_idx" ON "projects"("province", "district");

-- CreateIndex
CREATE INDEX "projects_deleted_at_idx" ON "projects"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "project_units_deposit_booking_id_key" ON "project_units"("deposit_booking_id");

-- CreateIndex
CREATE INDEX "project_units_project_id_status_idx" ON "project_units"("project_id", "status");

-- CreateIndex
CREATE INDEX "project_units_deleted_at_idx" ON "project_units"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "project_units_project_id_code_key" ON "project_units"("project_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "unit_bookings_code_key" ON "unit_bookings"("code");

-- CreateIndex
CREATE INDEX "unit_bookings_unit_id_status_idx" ON "unit_bookings"("unit_id", "status");

-- CreateIndex
CREATE INDEX "unit_bookings_project_id_status_idx" ON "unit_bookings"("project_id", "status");

-- CreateIndex
CREATE INDEX "unit_bookings_normalized_phone_idx" ON "unit_bookings"("normalized_phone");

-- CreateIndex
CREATE UNIQUE INDEX "article_tags_slug_key" ON "article_tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_status_published_at_idx" ON "articles"("status", "published_at");

-- CreateIndex
CREATE INDEX "article_projects_project_id_idx" ON "article_projects"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "brokers_user_account_id_key" ON "brokers"("user_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "brokers_ctv_code_key" ON "brokers"("ctv_code");

-- CreateIndex
CREATE UNIQUE INDEX "listings_code_key" ON "listings"("code");

-- CreateIndex
CREATE INDEX "listings_province_district_property_type_transaction_type_idx" ON "listings"("province", "district", "property_type", "transaction_type");

-- CreateIndex
CREATE INDEX "listings_status_rank_score_idx" ON "listings"("status", "rank_score");

-- CreateIndex
CREATE INDEX "listings_track_status_idx" ON "listings"("track", "status");

-- CreateIndex
CREATE INDEX "listings_deleted_at_idx" ON "listings"("deleted_at");

-- CreateIndex
CREATE INDEX "listing_media_listing_id_status_idx" ON "listing_media"("listing_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "user_accounts_normalized_phone_key" ON "user_accounts"("normalized_phone");

-- CreateIndex
CREATE UNIQUE INDEX "user_accounts_email_key" ON "user_accounts"("email");

-- CreateIndex
CREATE INDEX "user_accounts_role_idx" ON "user_accounts"("role");

-- CreateIndex
CREATE UNIQUE INDEX "customers_user_account_id_key" ON "customers"("user_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_normalized_phone_key" ON "customers"("normalized_phone");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_tokens_token_hash_key" ON "user_auth_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "user_auth_tokens_user_account_id_type_idx" ON "user_auth_tokens"("user_account_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "ctv_applications_broker_id_key" ON "ctv_applications"("broker_id");

-- CreateIndex
CREATE INDEX "ctv_applications_status_idx" ON "ctv_applications"("status");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE UNIQUE INDEX "referrals_code_key" ON "referrals"("code");

-- CreateIndex
CREATE UNIQUE INDEX "commissions_lead_id_key" ON "commissions"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "canonical_properties_cluster_key_key" ON "canonical_properties"("cluster_key");

-- CreateIndex
CREATE UNIQUE INDEX "listing_fingerprints_listing_id_key" ON "listing_fingerprints"("listing_id");

-- CreateIndex
CREATE INDEX "listing_fingerprints_dupe_key_idx" ON "listing_fingerprints"("dupe_key");

-- CreateIndex
CREATE INDEX "listing_fingerprints_canonical_id_idx" ON "listing_fingerprints"("canonical_id");

-- CreateIndex
CREATE UNIQUE INDEX "attribution_locks_customer_id_key" ON "attribution_locks"("customer_id");

-- CreateIndex
CREATE INDEX "attribution_locks_broker_id_idx" ON "attribution_locks"("broker_id");

-- CreateIndex
CREATE INDEX "attribution_locks_expires_at_idx" ON "attribution_locks"("expires_at");

-- CreateIndex
CREATE INDEX "status_history_entity_entity_id_idx" ON "status_history"("entity", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "outbox_events_dedupe_key_key" ON "outbox_events"("dedupe_key");

-- CreateIndex
CREATE INDEX "outbox_events_status_available_at_idx" ON "outbox_events"("status", "available_at");

-- CreateIndex
CREATE INDEX "attribution_events_customer_id_idx" ON "attribution_events"("customer_id");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_developer_id_fkey" FOREIGN KEY ("developer_id") REFERENCES "developers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_unit_types" ADD CONSTRAINT "project_unit_types_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_units" ADD CONSTRAINT "project_units_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_units" ADD CONSTRAINT "project_units_unit_type_id_fkey" FOREIGN KEY ("unit_type_id") REFERENCES "project_unit_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_units" ADD CONSTRAINT "project_units_deposit_booking_id_fkey" FOREIGN KEY ("deposit_booking_id") REFERENCES "unit_bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_bookings" ADD CONSTRAINT "unit_bookings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_bookings" ADD CONSTRAINT "unit_bookings_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "project_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_bookings" ADD CONSTRAINT "unit_bookings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_bookings" ADD CONSTRAINT "unit_bookings_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "brokers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_bookings" ADD CONSTRAINT "unit_bookings_referral_id_fkey" FOREIGN KEY ("referral_id") REFERENCES "referrals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_legal_docs" ADD CONSTRAINT "project_legal_docs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_tag_links" ADD CONSTRAINT "article_tag_links_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_tag_links" ADD CONSTRAINT "article_tag_links_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "article_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_projects" ADD CONSTRAINT "article_projects_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_projects" ADD CONSTRAINT "article_projects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brokers" ADD CONSTRAINT "brokers_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "brokers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_unit_type_id_fkey" FOREIGN KEY ("unit_type_id") REFERENCES "project_unit_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_media" ADD CONSTRAINT "listing_media_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_auth_tokens" ADD CONSTRAINT "user_auth_tokens_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctv_applications" ADD CONSTRAINT "ctv_applications_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "brokers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_referral_id_fkey" FOREIGN KEY ("referral_id") REFERENCES "referrals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_broker_id_fkey" FOREIGN KEY ("assigned_broker_id") REFERENCES "brokers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "brokers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_referral_id_fkey" FOREIGN KEY ("referral_id") REFERENCES "referrals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "brokers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_fingerprints" ADD CONSTRAINT "listing_fingerprints_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing_fingerprints" ADD CONSTRAINT "listing_fingerprints_canonical_id_fkey" FOREIGN KEY ("canonical_id") REFERENCES "canonical_properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribution_locks" ADD CONSTRAINT "attribution_locks_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribution_locks" ADD CONSTRAINT "attribution_locks_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "brokers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
