/**
 * Seed Monrei Saigon + Noble Crystal Riverside — chạy trên VPS prod sau deploy.
 * Usage: npm run db:seed:commercial
 */
import { PrismaClient } from "@prisma/client";
import { seedCommercialLandings } from "../lib/seed/commercial-landings";

const prisma = new PrismaClient();

async function main() {
  const slugs = await seedCommercialLandings(prisma);
  console.log(`Commercial landings: upsert ${slugs.length} dự án vào Postgres.`);
  for (const slug of slugs) {
    console.log(`  ✔ https://timnhaxahoi.com/du-an/${slug}`);
  }
  console.log("\nPreview (noindex): /preview/du-an/monrei-saigon-thuan-giao");
  console.log("Preview (noindex): /preview/du-an/noble-crystal-riverside-quan-7");
  console.log("Preview (noindex): /preview/du-an/gladia-heights-khang-dien-thu-duc");
  console.log("Preview (noindex): /preview/du-an/victoria-village-thanh-my-loi");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
