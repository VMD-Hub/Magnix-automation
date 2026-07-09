/**
 * Seed 3 dự án ưu tiên Mini App Home — an toàn chạy trên VPS prod.
 *
 * Usage: npm run db:seed:priority
 */
import { PrismaClient } from "@prisma/client";
import { DTA_HAPPY_HOME_SLUG } from "../lib/content/dta-happy-home-landing";
import { SOLENA_GREEN_TOWN_SLUG } from "../lib/content/solena-green-town-slug";
import { seedDtaHappyHome } from "../lib/seed/dta-happy-home";
import { seedSolenaGreenTown } from "../lib/seed/solena-green-town";
import {
  seedThuThiemGreenHouse,
  THU_THIEM_GREEN_HOUSE_SLUG,
} from "../lib/seed/thu-thiem-green-house";

const prisma = new PrismaClient();

const PRIORITY_SLUGS = [
  DTA_HAPPY_HOME_SLUG,
  SOLENA_GREEN_TOWN_SLUG,
  THU_THIEM_GREEN_HOUSE_SLUG,
] as const;

async function main() {
  await seedDtaHappyHome(prisma);
  await seedSolenaGreenTown(prisma);
  await seedThuThiemGreenHouse(prisma);

  console.log("✔ Priority Mini App projects upserted:");
  for (const slug of PRIORITY_SLUGS) {
    console.log(`  https://timnhaxahoi.com/du-an/${slug}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
