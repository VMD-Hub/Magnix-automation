-- CreateEnum
CREATE TYPE "SalesRegion" AS ENUM ('SOUTH', 'CENTRAL', 'NORTH');

-- CreateEnum
CREATE TYPE "LeadLane" AS ENUM ('ACTIVE_SALE', 'PIPELINE_CDT');

-- AlterTable
ALTER TABLE "projects" ADD COLUMN "sales_region" "SalesRegion",
ADD COLUMN "lead_lane" "LeadLane";

-- CreateIndex
CREATE INDEX "projects_sales_region_idx" ON "projects"("sales_region");
