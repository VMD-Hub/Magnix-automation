/**
 * Seed 6 NOXH Đồng Tháp / Tiền Giang cũ.
 * Usage: npm run db:seed:noxh-dong-thap
 */
import { PrismaClient } from "@prisma/client";
import { seedNoxhDongThapProjects } from "../lib/preview/seed-noxh-dong-thap";
import { allNoxhDongThapSlugs } from "../lib/preview/noxh-dong-thap-projects";

const prisma = new PrismaClient();

async function main() {
  await seedNoxhDongThapProjects(prisma);
  const slugs = allNoxhDongThapSlugs();
  console.log(`NOXH Đồng Tháp: upsert ${slugs.length} dự án vào Postgres.`);
  console.log("Hub: https://timnhaxahoi.com/du-an/nha-o-xa-hoi/dong-thap");
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
