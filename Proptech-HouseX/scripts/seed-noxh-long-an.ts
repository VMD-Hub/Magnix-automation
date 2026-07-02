/**
 * Seed 6 dự án NOXH Long An — chạy trên VPS sau db:deploy.
 * Usage: npm run db:seed:noxh
 */
import { PrismaClient } from "@prisma/client";
import { seedNoxhLongAnProjects } from "../lib/preview/seed-noxh-long-an";
import { allNoxhLongAnSlugs } from "../lib/preview/noxh-long-an-projects";

const prisma = new PrismaClient();

async function main() {
  await seedNoxhLongAnProjects(prisma);
  const slugs = allNoxhLongAnSlugs();
  console.log(`NOXH Long An: upsert ${slugs.length} dự án vào Postgres.`);
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
