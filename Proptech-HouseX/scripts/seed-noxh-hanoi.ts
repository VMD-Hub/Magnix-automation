/**
 * Seed 17 skeleton NOXH Hà Nội — chạy trên VPS sau db:deploy.
 * Usage: npm run db:seed:noxh-hanoi
 */
import { PrismaClient } from "@prisma/client";
import { seedNoxhHanoiProjects } from "../lib/preview/seed-noxh-hanoi";
import { allNoxhHanoiSlugs } from "../lib/preview/noxh-hanoi-projects";

const prisma = new PrismaClient();

async function main() {
  await seedNoxhHanoiProjects(prisma);
  const slugs = allNoxhHanoiSlugs();
  console.log(`NOXH Hà Nội: upsert ${slugs.length} dự án (skeleton) vào Postgres.`);
  console.log("Hub: https://timnhaxahoi.com/du-an/nha-o-xa-hoi/ha-noi");
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
