/**
 * Seed 5 NOXH Đắk Lắk (Phú Yên cũ).
 * Usage: npm run db:seed:noxh-dak-lak
 */
import { PrismaClient } from "@prisma/client";
import { seedNoxhDakLakProjects } from "../lib/preview/seed-noxh-dak-lak";
import { allNoxhDakLakSlugs } from "../lib/preview/noxh-dak-lak-projects";

const prisma = new PrismaClient();

async function main() {
  await seedNoxhDakLakProjects(prisma);
  const slugs = allNoxhDakLakSlugs();
  console.log(`NOXH Đắk Lắk: upsert ${slugs.length} dự án vào Postgres.`);
  console.log("Hub: https://timnhaxahoi.com/du-an/nha-o-xa-hoi/dak-lak");
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
