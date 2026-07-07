/**
 * Seed vòng quay khuyến mãi — chạy trên VPS sau db:deploy.
 * Usage: npm run db:seed:promotion
 */
import { PrismaClient } from "@prisma/client";
import { seedPromotionCampaign } from "../lib/seed/promotion-campaign";
import { DEFAULT_PROMOTION_SLUG } from "../lib/promotion/constants";

const prisma = new PrismaClient();

async function main() {
  await seedPromotionCampaign(prisma);
  console.log(`Khuyến mãi: https://timnhaxahoi.com/khuyen-mai (slug: ${DEFAULT_PROMOTION_SLUG})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
