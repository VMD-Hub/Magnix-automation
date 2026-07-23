/**
 * Seed 7 NOXH Khánh Hòa / Ninh Thuận cũ.
 * Usage: npm run db:seed:noxh-khanh-hoa
 */
import { PrismaClient } from "@prisma/client";
import { seedNoxhKhanhHoaProjects } from "../lib/preview/seed-noxh-khanh-hoa";
import { allNoxhKhanhHoaSlugs } from "../lib/preview/noxh-khanh-hoa-projects";

const prisma = new PrismaClient();

async function main() {
  await seedNoxhKhanhHoaProjects(prisma);
  const slugs = allNoxhKhanhHoaSlugs();
  console.log(`NOXH Khánh Hòa: upsert ${slugs.length} dự án vào Postgres.`);
  console.log("Hub: https://timnhaxahoi.com/du-an/nha-o-xa-hoi/khanh-hoa");
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
