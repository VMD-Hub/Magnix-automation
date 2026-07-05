/**
 * Reseed CHỈ dự án DTA Happy Home vào Postgres — an toàn chạy trên VPS prod.
 *
 * Dùng khi landing production "quay về bản cũ" / ảnh mất sau khi DB bị khôi phục
 * hoặc chưa reseed sau deploy. Chỉ upsert developer + project DTA (không đụng dữ liệu khác).
 * Nhánh `update` luôn ghi đè landing/ảnh mới nhất từ code.
 *
 * Usage: npm run db:reseed:dta
 */
import { PrismaClient } from "@prisma/client";
import { seedDtaHappyHome } from "../lib/seed/dta-happy-home";
import { DTA_HAPPY_HOME_SLUG } from "../lib/content/dta-happy-home-landing";
import { parseProjectOverview } from "../lib/content/project-landing";

const prisma = new PrismaClient();

async function main() {
  const { project } = await seedDtaHappyHome(prisma);
  const landing = parseProjectOverview(project.overviewData).landing;

  console.log(`✔ Reseed DTA Happy Home vào Postgres (slug: ${DTA_HAPPY_HOME_SLUG}).`);
  console.log(`  Hero: ${landing?.heroImage?.url ?? "(none)"}`);
  console.log(`  Highlights: ${landing?.highlights.length ?? 0} · Gallery: ${landing?.gallery.length ?? 0}`);
  console.log(`  Public: /du-an/${DTA_HAPPY_HOME_SLUG}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
