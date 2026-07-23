/**
 * Seed 8 NOXH An Giang / Kiên Giang cũ.
 * Usage: npm run db:seed:noxh-an-giang
 */
import { PrismaClient } from "@prisma/client";
import { seedNoxhAnGiangProjects } from "../lib/preview/seed-noxh-an-giang";
import { allNoxhAnGiangSlugs } from "../lib/preview/noxh-an-giang-projects";

const prisma = new PrismaClient();

async function main() {
  await seedNoxhAnGiangProjects(prisma);
  const slugs = allNoxhAnGiangSlugs();
  console.log(`NOXH An Giang: upsert ${slugs.length} dự án vào Postgres.`);
  console.log("Hub: https://timnhaxahoi.com/du-an/nha-o-xa-hoi/an-giang");
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
