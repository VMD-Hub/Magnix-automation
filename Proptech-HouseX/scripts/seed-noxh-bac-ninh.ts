/**
 * Seed 8 NOXH Bắc Ninh (Bắc Giang cũ).
 * Usage: npm run db:seed:noxh-bac-ninh
 */
import { PrismaClient } from "@prisma/client";
import { seedNoxhBacNinhProjects } from "../lib/preview/seed-noxh-bac-ninh";
import { allNoxhBacNinhSlugs } from "../lib/preview/noxh-bac-ninh-projects";

const prisma = new PrismaClient();

async function main() {
  await seedNoxhBacNinhProjects(prisma);
  const slugs = allNoxhBacNinhSlugs();
  console.log(`NOXH Bắc Ninh: upsert ${slugs.length} dự án vào Postgres.`);
  console.log("Hub: https://timnhaxahoi.com/du-an/nha-o-xa-hoi/bac-ninh");
  for (const slug of slugs) {
    console.log(`  ✔ https://timnhaxahoi.com/du-an/${slug}`);
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
