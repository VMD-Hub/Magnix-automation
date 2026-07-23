/**
 * Seed 6 NOXH Lâm Đồng (Đắk Nông + Bình Thuận cũ).
 * Usage: npm run db:seed:noxh-lam-dong
 */
import { PrismaClient } from "@prisma/client";
import { seedNoxhLamDongProjects } from "../lib/preview/seed-noxh-lam-dong";
import { allNoxhLamDongSlugs } from "../lib/preview/noxh-lam-dong-projects";

const prisma = new PrismaClient();

async function main() {
  await seedNoxhLamDongProjects(prisma);
  const slugs = allNoxhLamDongSlugs();
  console.log(`NOXH Lâm Đồng: upsert ${slugs.length} dự án vào Postgres.`);
  console.log("Hub: https://timnhaxahoi.com/du-an/nha-o-xa-hoi/lam-dong");
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
