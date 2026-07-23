/**
 * Seed 5 NOXH Đà Nẵng (skeleton + Đại Địa Bảo enriched).
 * Usage: npm run db:seed:noxh-danang
 */
import { PrismaClient } from "@prisma/client";
import { seedNoxhDanangProjects } from "../lib/preview/seed-noxh-danang";
import { allNoxhDanangSlugs } from "../lib/preview/noxh-danang-projects";

const prisma = new PrismaClient();

async function main() {
  await seedNoxhDanangProjects(prisma);
  const slugs = allNoxhDanangSlugs();
  console.log(`NOXH Đà Nẵng: upsert ${slugs.length} dự án vào Postgres.`);
  console.log("Hub: https://timnhaxahoi.com/du-an/nha-o-xa-hoi/da-nang");
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
