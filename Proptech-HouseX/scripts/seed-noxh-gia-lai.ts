/**
 * Seed 7 NOXH Gia Lai (Bình Định cũ).
 * Usage: npm run db:seed:noxh-gia-lai
 */
import { PrismaClient } from "@prisma/client";
import { seedNoxhGiaLaiProjects } from "../lib/preview/seed-noxh-gia-lai";
import { allNoxhGiaLaiSlugs } from "../lib/preview/noxh-gia-lai-projects";

const prisma = new PrismaClient();

async function main() {
  await seedNoxhGiaLaiProjects(prisma);
  const slugs = allNoxhGiaLaiSlugs();
  console.log(`NOXH Gia Lai: upsert ${slugs.length} dự án vào Postgres.`);
  console.log("Hub: https://timnhaxahoi.com/du-an/nha-o-xa-hoi/gia-lai");
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
