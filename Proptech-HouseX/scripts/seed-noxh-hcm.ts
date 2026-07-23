/**
 * Seed 26 NOXH TP.HCM mega-city (HCM + Bình Dương + BR-VT cũ).
 * Usage: npm run db:seed:noxh-hcm
 */
import { PrismaClient } from "@prisma/client";
import { seedNoxhHcmProjects } from "../lib/preview/seed-noxh-hcm";
import { allNoxhHcmSlugs } from "../lib/preview/noxh-hcm-projects";

const prisma = new PrismaClient();

async function main() {
  await seedNoxhHcmProjects(prisma);
  const slugs = allNoxhHcmSlugs();
  console.log(`NOXH TP.HCM mega-city: upsert ${slugs.length} dự án vào Postgres.`);
  console.log("Hub: https://timnhaxahoi.com/du-an/nha-o-xa-hoi/tp-ho-chi-minh");
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
