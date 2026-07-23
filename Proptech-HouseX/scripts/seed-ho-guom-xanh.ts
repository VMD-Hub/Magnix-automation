/**
 * Seed NOXH Hồ Gươm Xanh (Thuận An) — chạy trên VPS sau git pull + build.
 * Usage: npm run db:seed:hgx
 */
import { PrismaClient } from "@prisma/client";
import { seedHoGuomXanhNoxh } from "../lib/preview/seed-ho-guom-xanh";
import { HGX_PROJECT_SLUG } from "../lib/preview/ho-guom-xanh-mock";

const prisma = new PrismaClient();

async function main() {
  await seedHoGuomXanhNoxh(prisma);
  console.log(`NOXH Hồ Gươm Xanh: upsert vào Postgres.`);
  console.log(`  ✔ https://timnhaxahoi.com/du-an/${HGX_PROJECT_SLUG}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
