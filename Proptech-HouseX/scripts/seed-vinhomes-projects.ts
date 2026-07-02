/**
 * Seed riêng 3 landing Vinhomes — chạy trên VPS prod sau deploy code mới.
 * Usage: npm run db:seed:vinhomes
 */
import { PrismaClient } from "@prisma/client";
import { seedVinhomesProjects } from "../lib/seed/vinhomes-projects";

const prisma = new PrismaClient();

async function main() {
  const slugs = await seedVinhomesProjects(prisma);
  console.log(`Vinhomes: upsert ${slugs.length} dự án vào Postgres.`);
  for (const slug of slugs) {
    console.log(`  ✔ https://timnhaxahoi.com/du-an/${slug}`);
  }
  console.log("\nPreview (noindex) vẫn tại /preview/du-an/* — dùng duyệt layout trước khi seed.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
