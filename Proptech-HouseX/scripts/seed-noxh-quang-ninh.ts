/**
 * Seed 7 NOXH Quảng Ninh (standalone hub).
 * Usage: npm run db:seed:noxh-quang-ninh
 */
import { PrismaClient } from "@prisma/client";
import { seedNoxhQuangNinhProjects } from "../lib/preview/seed-noxh-quang-ninh";
import { allNoxhQuangNinhSlugs } from "../lib/preview/noxh-quang-ninh-projects";

const prisma = new PrismaClient();

async function main() {
  await seedNoxhQuangNinhProjects(prisma);
  const slugs = allNoxhQuangNinhSlugs();
  console.log(`NOXH Quảng Ninh: upsert ${slugs.length} dự án vào Postgres.`);
  console.log("Hub: https://timnhaxahoi.com/du-an/nha-o-xa-hoi/quang-ninh");
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
